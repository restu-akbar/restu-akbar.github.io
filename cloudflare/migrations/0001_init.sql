CREATE TABLE IF NOT EXISTS projects (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT NOT NULL,
  category      TEXT NOT NULL DEFAULT '[]',
  description   TEXT NOT NULL DEFAULT '',
  contributions TEXT NOT NULL DEFAULT '[]',
  tech          TEXT NOT NULL DEFAULT '[]',
  url           TEXT NOT NULL DEFAULT '',
  repository_url TEXT NOT NULL DEFAULT '',
  cover         TEXT NOT NULL DEFAULT '',
  gallery       TEXT NOT NULL DEFAULT '[]',
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS experience (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT NOT NULL,
  company       TEXT NOT NULL DEFAULT '',
  years_active  TEXT NOT NULL DEFAULT '',
  link          TEXT NOT NULL DEFAULT '',
  information   TEXT NOT NULL DEFAULT '[]',
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS skills (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT NOT NULL,
  items         TEXT NOT NULL DEFAULT '[]',
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Free-form site copy (hero, about, approach, socials) stored as JSON per key.
CREATE TABLE IF NOT EXISTS settings (
  key           TEXT PRIMARY KEY,
  value         TEXT NOT NULL,
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
