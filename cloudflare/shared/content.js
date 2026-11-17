// Data layer shared by the public site Worker (read) and the admin Worker (write).

const JSON_FIELDS = "json";
const TEXT_FIELDS = "text";

// field -> kind. Column name is the snake_case of the field name.
export const TABLES = {
  projects: {
    fields: {
      title: TEXT_FIELDS, category: JSON_FIELDS, description: TEXT_FIELDS,
      contributions: JSON_FIELDS, tech: JSON_FIELDS, url: TEXT_FIELDS,
      repositoryUrl: TEXT_FIELDS, cover: TEXT_FIELDS, gallery: JSON_FIELDS,
      status: TEXT_FIELDS,
    },
    required: ["title"],
    order: "id DESC",
  },
  experience: {
    fields: {
      title: TEXT_FIELDS, company: TEXT_FIELDS, yearsActive: TEXT_FIELDS,
      link: TEXT_FIELDS, information: JSON_FIELDS, status: TEXT_FIELDS,
    },
    required: ["title"],
    order: "id DESC",
  },
  skills: {
    fields: { title: TEXT_FIELDS, items: JSON_FIELDS },
    required: ["title"],
    order: "id ASC",
  },
};

const snake = (k) => k.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase());

export function rowToApi(table, row) {
  const out = { id: row.id };
  for (const [field, kind] of Object.entries(TABLES[table].fields)) {
    const raw = row[snake(field)];
    out[field] = kind === JSON_FIELDS ? JSON.parse(raw || "[]") : raw ?? "";
  }
  return out;
}

export async function listRows(db, table, { includeDrafts = false } = {}) {
  const cfg = TABLES[table];
  const where = !includeDrafts && "status" in cfg.fields ? "WHERE status = 'published'" : "";
  const { results } = await db.prepare(`SELECT * FROM ${table} ${where} ORDER BY ${cfg.order}`).all();
  return results.map((r) => rowToApi(table, r));
}

export async function loadSettings(db) {
  const { results } = await db.prepare("SELECT key, value FROM settings").all();
  return Object.fromEntries(results.map((r) => [r.key, JSON.parse(r.value)]));
}

// Same shape as src/content/index.js exports, so the React app can swap sources.
export async function loadContent(db) {
  const [projects, experience, skills, settings] = await Promise.all([
    listRows(db, "projects"),
    listRows(db, "experience"),
    listRows(db, "skills"),
    loadSettings(db),
  ]);
  return { settings, skills, experience, projects };
}

export class ValidationError extends Error {}

// Validates a request body against the table's field list and returns clean values.
export function validate(table, body, { partial = false } = {}) {
  const cfg = TABLES[table];
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ValidationError("Body must be a JSON object");
  }
  const clean = {};
  for (const [field, kind] of Object.entries(cfg.fields)) {
    if (!(field in body)) {
      if (!partial && cfg.required.includes(field)) throw new ValidationError(`${field} is required`);
      continue;
    }
    const v = body[field];
    if (kind === JSON_FIELDS) {
      if (!Array.isArray(v) || v.some((x) => typeof x !== "string" || x.length > 4000) || v.length > 100) {
        throw new ValidationError(`${field} must be an array of strings`);
      }
      clean[field] = v;
    } else {
      if (typeof v !== "string" || v.length > 20000) throw new ValidationError(`${field} must be a string`);
      if (field === "status" && !["draft", "published"].includes(v)) {
        throw new ValidationError("status must be draft or published");
      }
      clean[field] = v;
    }
    if (cfg.required.includes(field) && !clean[field].length) throw new ValidationError(`${field} is required`);
  }
  return clean;
}

const encode = (table, field, value) =>
  TABLES[table].fields[field] === JSON_FIELDS ? JSON.stringify(value) : value;

export async function insertRow(db, table, clean) {
  const fields = Object.keys(clean);
  const sql = `INSERT INTO ${table} (${fields.map(snake).join(", ")}) VALUES (${fields.map(() => "?").join(", ")})`;
  const res = await db.prepare(sql).bind(...fields.map((f) => encode(table, f, clean[f]))).run();
  return res.meta.last_row_id;
}

export async function updateRow(db, table, id, clean) {
  const fields = Object.keys(clean);
  if (!fields.length) return 0;
  const sql = `UPDATE ${table} SET ${fields.map((f) => `${snake(f)} = ?`).join(", ")}, updated_at = datetime('now') WHERE id = ?`;
  const res = await db.prepare(sql).bind(...fields.map((f) => encode(table, f, clean[f])), id).run();
  return res.meta.changes;
}

export async function deleteRow(db, table, id) {
  const res = await db.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
  return res.meta.changes;
}

export async function getRow(db, table, id) {
  const row = await db.prepare(`SELECT * FROM ${table} WHERE id = ?`).bind(id).first();
  return row ? rowToApi(table, row) : null;
}

export async function putSettings(db, obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) throw new ValidationError("Body must be a JSON object");
  const stmts = Object.entries(obj).map(([key, value]) => {
    if (!/^[a-z][a-zA-Z0-9]{0,40}$/.test(key)) throw new ValidationError(`Invalid settings key: ${key}`);
    const json = JSON.stringify(value);
    if (json.length > 50000) throw new ValidationError(`${key} is too large`);
    return db
      .prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')")
      .bind(key, json);
  });
  if (stmts.length) await db.batch(stmts);
}
