// Generates seed SQL and an R2 upload script from src/content/*.json.
// Run: node cloudflare/seed/build-seed.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (f) => JSON.parse(readFileSync(join(root, "src/content", f), "utf8"));
const q = (v) => `'${String(v).replace(/'/g, "''")}'`;
const j = (v) => q(JSON.stringify(v));
const media = (ref) => (ref ? `/media/${ref}` : "");

const projects = read("projects.json");
const experience = read("experience.json");
const skills = read("skills.json");
const settings = read("settings.json");

// Files referenced by settings (profile photo, CV PDFs) are uploaded to R2 and stored as /media URLs.
const safe = (name) => name.replace(/[^a-zA-Z0-9._-]+/g, "-");
const settingFiles = []; // { ref, key }
const dbSettings = { ...settings };
if (settings.photo) {
  settingFiles.push({ ref: settings.photo, key: settings.photo });
  dbSettings.photo = media(settings.photo);
}
if (settings.cv) {
  dbSettings.cv = Object.fromEntries(
    Object.entries(settings.cv).map(([lang, ref]) => {
      if (!ref) return [lang, ""];
      const key = `cv/${safe(ref)}`;
      settingFiles.push({ ref, key });
      return [lang, media(key)];
    })
  );
}

const sql = [];
sql.push("DELETE FROM projects; DELETE FROM experience; DELETE FROM skills; DELETE FROM settings;");

for (const p of projects) {
  sql.push(
    `INSERT INTO projects (id, title, category, description, contributions, tech, url, repository_url, cover, gallery, status) VALUES (${p.id}, ${q(p.title)}, ${j(p.category)}, ${q(p.description)}, ${j(p.contributions)}, ${j(p.tech)}, ${q(p.url)}, ${q(p.repositoryUrl)}, ${q(media(p.cover))}, ${j(p.gallery.map(media))}, ${q(p.status)});`
  );
}
for (const e of experience) {
  sql.push(
    `INSERT INTO experience (id, title, company, years_active, link, information, status) VALUES (${e.id}, ${q(e.title)}, ${q(e.company)}, ${q(e.yearsActive)}, ${q(e.link)}, ${j(e.information)}, ${q(e.status)});`
  );
}
for (const s of skills) {
  sql.push(`INSERT INTO skills (id, title, items) VALUES (${s.id}, ${q(s.title)}, ${j(s.items)});`);
}
for (const [key, value] of Object.entries(dbSettings)) {
  sql.push(`INSERT INTO settings (key, value) VALUES (${q(key)}, ${j(value)});`);
}

const keys = new Set(projects.flatMap((p) => [p.cover, ...p.gallery]).filter(Boolean));
const upload = [
  "#!/usr/bin/env bash",
  "# Uploads bundled project images to the R2 bucket. Run from the cloudflare/ folder.",
  "set -euo pipefail",
  'BUCKET="${1:-restu-akbar-media}"',
  ...[...keys].map((k) => `npx wrangler r2 object put "$BUCKET/${k}" --file "../src/assets/${k}" --remote`),
  ...settingFiles.map(
    ({ ref, key }) =>
      `npx wrangler r2 object put "$BUCKET/${key}" --file "../src/assets/${ref}"${ref.endsWith(".pdf") ? " --content-type application/pdf" : ""} --remote`
  ),
];

const out = join(root, "cloudflare/seed/out");
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "seed.sql"), sql.join("\n") + "\n");
writeFileSync(join(out, "upload-media.sh"), upload.join("\n") + "\n", { mode: 0o755 });
console.log(`seed.sql: ${projects.length} projects, ${experience.length} experience, ${skills.length} skills, ${Object.keys(settings).length} settings`);
console.log(`upload-media.sh: ${keys.size} images + ${settingFiles.length} setting files`);
