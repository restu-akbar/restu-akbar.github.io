import {
  TABLES, ValidationError, validate, listRows, getRow, insertRow, updateRow, deleteRow,
  loadSettings, putSettings,
} from "../../shared/content.js";
import { verifyAccess } from "./access.js";

const MAX_UPLOAD = 10 * 1024 * 1024;
const UPLOAD_TYPES = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "application/pdf": "pdf" };

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

async function readJson(request) {
  if (!(request.headers.get("content-type") || "").includes("application/json")) {
    throw new ValidationError("Content-Type must be application/json");
  }
  try {
    return await request.json();
  } catch {
    throw new ValidationError("Invalid JSON");
  }
}

async function upload(request, env, url) {
  const type = (request.headers.get("content-type") || "").split(";")[0];
  const ext = UPLOAD_TYPES[type];
  if (!ext) throw new ValidationError("Only png, jpeg, webp and pdf uploads are allowed");

  const body = await request.arrayBuffer();
  if (!body.byteLength || body.byteLength > MAX_UPLOAD) throw new ValidationError("File must be between 1 byte and 10 MB");

  const base = (url.searchParams.get("name") || "file").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-").slice(0, 60) || "file";
  const key = `uploads/${Date.now()}-${base}.${ext}`;
  await env.MEDIA.put(key, body, { httpMetadata: { contentType: type } });
  // Served publicly by the site Worker at /media/<key>.
  return json({ key, path: `/media/${key}` }, 201);
}

async function route(request, env, user) {
  const url = new URL(request.url);
  const segments = url.pathname.replace(/^\/api\/admin\/?/, "").split("/").filter(Boolean);
  const [resource, rawId] = segments;
  const method = request.method;

  if (resource === "config" && method === "GET") return json({ siteUrl: env.SITE_URL || "", user: user.email });

  if (resource === "upload" && method === "POST") return upload(request, env, url);

  if (resource === "settings") {
    if (method === "GET") return json(await loadSettings(env.DB));
    if (method === "PUT") {
      await putSettings(env.DB, await readJson(request));
      return json(await loadSettings(env.DB));
    }
  }

  if (resource in TABLES) {
    const id = rawId === undefined ? null : Number(rawId);
    if (rawId !== undefined && !Number.isInteger(id)) throw new ValidationError("Invalid id");

    if (method === "GET" && id === null) return json(await listRows(env.DB, resource, { includeDrafts: true }));
    if (method === "GET") {
      const row = await getRow(env.DB, resource, id);
      return row ? json(row) : json({ error: "Not found" }, 404);
    }
    if (method === "POST" && id === null) {
      const newId = await insertRow(env.DB, resource, validate(resource, await readJson(request)));
      return json(await getRow(env.DB, resource, newId), 201);
    }
    if (method === "PUT" && id !== null) {
      const changed = await updateRow(env.DB, resource, id, validate(resource, await readJson(request), { partial: true }));
      if (!changed && !(await getRow(env.DB, resource, id))) return json({ error: "Not found" }, 404);
      return json(await getRow(env.DB, resource, id));
    }
    if (method === "DELETE" && id !== null) {
      return (await deleteRow(env.DB, resource, id)) ? json({ ok: true }) : json({ error: "Not found" }, 404);
    }
  }
  return json({ error: "Not found" }, 404);
}

export default {
  async fetch(request, env) {
    const user = await verifyAccess(request, env);
    if (!user) return json({ error: "Unauthorized" }, 401);

    const url = new URL(request.url);
    // CSRF guard: browser-initiated writes must come from this same origin.
    if (!["GET", "HEAD"].includes(request.method)) {
      const origin = request.headers.get("origin");
      if (origin && new URL(origin).host !== url.host) return json({ error: "Forbidden" }, 403);
    }

    if (!url.pathname.startsWith("/api/admin")) {
      return json({ service: "restu-akbar admin", user: user.email, api: "/api/admin/{config|projects|experience|skills|settings|upload}" });
    }
    try {
      return await route(request, env, user);
    } catch (err) {
      if (err instanceof ValidationError) return json({ error: err.message }, 400);
      console.error(err);
      return json({ error: "Internal error" }, 500);
    }
  },
};
