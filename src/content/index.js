// Single entry point for site content.
//
// Today the JSON files in this folder are the source. They are shaped like the
// rows the Cloudflare D1 API will return, so swapping the source later only
// means replacing the imports below with a fetch of GET /api/content.
//
// Images are referenced by path ("srikandi/srikandi.png"). resolveImage()
// maps that to a bundled asset now, and passes full URLs (R2) through as-is.
import projects from "./projects.json";
import experience from "./experience.json";
import skills from "./skills.json";
import settings from "./settings.json";

const assetContext = require.context("../assets", true, /\.(png|jpe?g|webp)$/);
const fileContext = require.context("../assets", false, /\.pdf$/);

const isUrl = (ref) => /^(https?:)?\/\//.test(ref) || ref.startsWith("/");

// Same idea for documents (CV PDFs): a bundled file name, or a full/relative URL.
export const resolveFile = (ref) => {
  if (!ref) return "";
  if (isUrl(ref)) return ref;
  try {
    return fileContext(`./${ref}`);
  } catch {
    return "";
  }
};

export const resolveImage = (ref) => {
  if (!ref) return "";
  if (/^(https?:)?\/\//.test(ref) || ref.startsWith("/")) return ref;
  try {
    return assetContext(`./${ref}`);
  } catch {
    return "";
  }
};

const published = (rows) => rows.filter((r) => r.status !== "draft");

// Turns raw rows (bundled JSON or the /api/content response) into what components use.
const mergeSettings = (live) => {
  const merged = { ...settings, ...live, cv: { ...settings.cv, ...live.cv } };
  merged.cv = Object.fromEntries(Object.entries(merged.cv).map(([k, v]) => [k, resolveFile(v)]));
  merged.photo = resolveImage(merged.photo);
  return merged;
};

export const normalize = ({ settings: liveSettings, skills, experience, projects }) => ({
  // Keys missing from live data (e.g. cv before it was first saved) fall back to the bundled ones.
  settings: mergeSettings(liveSettings),
  skills,
  experience: published(experience),
  projects: published(projects).map(({ cover, gallery = [], ...p }) => ({
    ...p,
    image: resolveImage(cover),
    gallery: gallery.map(resolveImage),
  })),
});

// Content shipped inside the bundle. Always available, used first and as fallback.
export const bundled = normalize({ settings, skills, experience, projects });

const isValid = (d) =>
  d &&
  d.settings?.hero &&
  Array.isArray(d.projects) &&
  Array.isArray(d.experience) &&
  Array.isArray(d.skills);

// Live content from the Cloudflare Worker. Returns null on any problem so the
// caller keeps the bundled content (e.g. on GitHub Pages or `yarn start`).
export async function fetchContent(url = process.env.REACT_APP_CONTENT_URL || "/api/content") {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(url, { signal: ctrl.signal, headers: { accept: "application/json" } });
    clearTimeout(timer);
    if (!res.ok || !(res.headers.get("content-type") || "").includes("json")) return null;
    const data = await res.json();
    return isValid(data) ? normalize(data) : null;
  } catch {
    return null;
  }
}

export const content = bundled;
export default content;
