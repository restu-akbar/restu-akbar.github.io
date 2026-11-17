// Admin UI: vanilla ES module, no build step. All user data is inserted with
// textContent / attributes (never innerHTML), so stored content cannot inject markup.

const view = document.getElementById("view");
const navEl = document.getElementById("nav");

// ---------- helpers ----------
function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (k === "value") el.value = v;
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return el;
}

async function api(path, { json, body, method = "GET", headers = {} } = {}) {
  const init = { method, headers: { ...headers } };
  if (json !== undefined) {
    init.headers["content-type"] = "application/json";
    init.body = JSON.stringify(json);
  } else if (body !== undefined) {
    init.body = body;
  }
  const res = await fetch(`/api/admin${path}`, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `${res.status} ${res.statusText}`);
  return data;
}

let toastTimer;
function toast(msg, isError = false) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = "show" + (isError ? " error" : "");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.className = ""), isError ? 5000 : 3200);
}

const clone = (v) => JSON.parse(JSON.stringify(v));
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
let siteUrl = "";
const imgSrc = (ref) => (!ref ? "" : /^(https?:)?\/\//.test(ref) ? ref : siteUrl + ref);

function confirmDialog({ title, message, confirm = "Confirm", danger = false }) {
  return new Promise((resolve) => {
    const done = (v) => { overlay.remove(); document.removeEventListener("keydown", onKey); resolve(v); };
    const onKey = (e) => { if (e.key === "Escape") done(false); };
    const cancel = h("button", { type: "button", class: "btn ghost", onclick: () => done(false) }, "Cancel");
    const ok = h("button", { type: "button", class: `btn ${danger ? "danger-solid" : ""}`, onclick: () => done(true) }, confirm);
    const overlay = h("div", { class: "overlay", role: "dialog", "aria-modal": "true", "aria-label": title, onclick: (e) => { if (e.target === overlay) done(false); } },
      h("div", { class: "dialog" }, h("h3", {}, title), h("p", {}, message), h("div", { class: "dialog__actions" }, cancel, ok)));
    document.body.append(overlay);
    document.addEventListener("keydown", onKey);
    cancel.focus();
  });
}

// ---------- app state ----------
const app = { nav: "overview", dirty: false, save: null };

window.addEventListener("beforeunload", (e) => { if (app.dirty) { e.preventDefault(); e.returnValue = ""; } });
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
    e.preventDefault();
    if (app.save) app.save();
  }
});

async function guard() {
  if (!app.dirty) return true;
  const ok = await confirmDialog({
    title: "Discard unsaved changes?",
    message: "You have changes that haven't been saved. If you leave now they will be lost.",
    confirm: "Discard changes",
    danger: true,
  });
  if (ok) app.dirty = false;
  return ok;
}

// ---------- field renderers ----------
// A field is { k, label?, t?, help?, required?, placeholder?, rows?, item?, fields? }.
// Each renderer edits `obj[f.k]` in place and calls touch() when the value changes.
const labelOf = (f) => f.label || f.k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

function fieldWrap(f, ...kids) {
  return h("div", { class: "field", "data-field": f.k },
    h("label", {}, labelOf(f), f.required ? h("span", { class: "req", title: "Required" }, " *") : null),
    f.help ? h("p", { class: "help" }, f.help) : null,
    ...kids,
    h("p", { class: "error", hidden: true }));
}

function move(arr, i, d) {
  const j = i + d;
  if (j < 0 || j >= arr.length) return false;
  [arr[i], arr[j]] = [arr[j], arr[i]];
  return true;
}

function renderField(f, obj, touch, ctx = {}) {
  switch (f.t || "text") {
    case "text":
      return fieldWrap(f, h("input", { type: "text", value: obj[f.k] ?? "", placeholder: f.placeholder, oninput: (e) => { obj[f.k] = e.target.value; touch(); } }));
    case "textarea":
      return fieldWrap(f, h("textarea", { value: obj[f.k] ?? "", rows: f.rows || 4, placeholder: f.placeholder, oninput: (e) => { obj[f.k] = e.target.value; touch(); } }));
    case "paras": {
      const ta = h("textarea", { rows: f.rows || 8, oninput: (e) => { obj[f.k] = e.target.value.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean); touch(); } });
      ta.value = (obj[f.k] || []).join("\n\n");
      return fieldWrap(f, ta);
    }
    case "status": return renderSwitch(f, obj, touch);
    case "tags": return renderTags(f, obj, touch, ctx);
    case "list": return renderList(f, obj, touch);
    case "pdf": return renderPdf(f, obj, touch);
    case "image": return renderCover(f, obj, touch, ctx);
    case "gallery": return renderGallery(f, obj, touch, ctx);
    case "group": {
      obj[f.k] = obj[f.k] || {};
      const box = h("div", { class: "subgroup" }, f.label ? h("h4", {}, f.label) : null);
      f.fields.forEach((sub) => box.append(renderField(sub, obj[f.k], touch, ctx)));
      return box;
    }
    case "repeat": return renderRepeat(f, obj, touch, ctx);
    default: return h("div");
  }
}

function renderSwitch(f, obj, touch) {
  const text = h("span", { class: "switch__text" });
  const input = h("input", { type: "checkbox", id: `sw-${f.k}`, onchange: (e) => { obj[f.k] = e.target.checked ? "published" : "draft"; paint(); touch(); } });
  const paint = () => {
    input.checked = obj[f.k] === "published";
    text.replaceChildren(h("strong", {}, input.checked ? "Visible on the site" : "Draft"), h("small", {}, input.checked ? "Visitors can see this." : "Only you can see this. Not shown on the site yet."));
  };
  paint();
  return h("div", { class: "field", "data-field": f.k }, h("label", { class: "switch", for: `sw-${f.k}` }, input, h("span", { class: "switch__track" }), text));
}

function renderTags(f, obj, touch, ctx) {
  obj[f.k] = obj[f.k] || [];
  const listId = f.suggest ? `dl-${f.k}` : null;
  const input = h("input", { type: "text", list: listId, placeholder: f.placeholder || "Type and press Enter", "aria-label": labelOf(f) });
  const box = h("div", { class: "tags" });
  const draw = () => {
    box.replaceChildren(...obj[f.k].map((t, i) => h("span", { class: "tag" }, t,
      h("button", { type: "button", "aria-label": `Remove ${t}`, onclick: (e) => { e.stopPropagation(); obj[f.k].splice(i, 1); touch(); draw(); } }, "×"))), input);
  };
  const commit = (raw) => {
    const parts = raw.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
    let added = false;
    parts.forEach((p) => { if (!obj[f.k].includes(p)) { obj[f.k].push(p); added = true; } });
    input.value = "";
    if (added) touch();
    draw();
  };
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commit(input.value); input.focus(); }
    else if (e.key === "Backspace" && !input.value && obj[f.k].length) { obj[f.k].pop(); touch(); draw(); input.focus(); }
  });
  input.addEventListener("input", () => { if (/[,\n]/.test(input.value)) commit(input.value); });
  input.addEventListener("blur", () => { if (input.value.trim()) commit(input.value); });
  box.addEventListener("click", () => input.focus());
  draw();
  const wrap = fieldWrap(f, box);
  if (listId) {
    const dl = h("datalist", { id: listId }, ...(ctx.suggestions?.[f.k] || []).map((s) => h("option", { value: s })));
    wrap.append(dl);
  }
  return wrap;
}

function renderList(f, obj, touch) {
  obj[f.k] = obj[f.k] || [];
  const box = h("div", { class: "points" });
  const draw = () => {
    box.replaceChildren(...obj[f.k].map((text, i) => h("div", { class: "point" },
      h("textarea", { rows: f.rows || 2, value: text, "aria-label": `${labelOf(f)} ${i + 1}`, oninput: (e) => { obj[f.k][i] = e.target.value; touch(); } }),
      h("div", { class: "point__btns" },
        h("button", { type: "button", class: "icon", title: "Move up", "aria-label": "Move up", onclick: () => { if (move(obj[f.k], i, -1)) { touch(); draw(); } } }, "↑"),
        h("button", { type: "button", class: "icon", title: "Move down", "aria-label": "Move down", onclick: () => { if (move(obj[f.k], i, 1)) { touch(); draw(); } } }, "↓"),
        h("button", { type: "button", class: "icon danger", title: "Remove", "aria-label": "Remove", onclick: () => { obj[f.k].splice(i, 1); touch(); draw(); } }, "✕")))),
      h("button", { type: "button", class: "btn ghost small", onclick: () => { obj[f.k].push(""); touch(); draw(); box.querySelector(".point:last-of-type textarea")?.focus(); } }, `+ ${f.addLabel || "Add a point"}`));
  };
  draw();
  return fieldWrap(f, box);
}

function renderRepeat(f, obj, touch, ctx) {
  obj[f.k] = obj[f.k] || [];
  const list = h("div", { class: "repeat" });
  const draw = () => {
    list.replaceChildren(...obj[f.k].map((item, i) => {
      const card = h("div", { class: "item" },
        h("div", { class: "item__bar" }, h("strong", {}, `${f.itemLabel || "Item"} ${i + 1}`),
          h("span", {},
            h("button", { type: "button", class: "icon", title: "Move up", "aria-label": "Move up", onclick: () => { if (move(obj[f.k], i, -1)) { touch(); draw(); } } }, "↑"),
            h("button", { type: "button", class: "icon", title: "Move down", "aria-label": "Move down", onclick: () => { if (move(obj[f.k], i, 1)) { touch(); draw(); } } }, "↓"),
            h("button", { type: "button", class: "icon danger", title: "Remove", "aria-label": "Remove", onclick: () => { obj[f.k].splice(i, 1); touch(); draw(); } }, "✕"))));
      f.item.forEach((sub) => card.append(renderField(sub, item, touch, ctx)));
      return card;
    }), h("button", { type: "button", class: "btn ghost small", onclick: () => { obj[f.k].push(Object.fromEntries(f.item.map((s) => [s.k, ""]))); touch(); draw(); } }, `+ Add ${(f.itemLabel || "item").toLowerCase()}`));
  };
  draw();
  const box = h("div", { class: "subgroup" }, h("h4", {}, labelOf(f)), f.help ? h("p", { class: "help" }, f.help) : null, list);
  return box;
}

// ---------- images ----------
const MAX_UPLOAD = 10 * 1024 * 1024;
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

async function uploadFile(file, kinds = IMAGE_TYPES, kindLabel = "a PNG, JPG or WebP image") {
  if (!kinds.includes(file.type)) throw new Error(`"${file.name}" is not ${kindLabel}.`);
  if (file.size > MAX_UPLOAD) throw new Error(`"${file.name}" is larger than 10 MB.`);
  const res = await api(`/upload?name=${encodeURIComponent(file.name)}`, { method: "POST", body: file, headers: { "content-type": file.type } });
  return res.path;
}

function dropzone({ multiple, text, onFiles, accept = IMAGE_TYPES, noun = "image", hint = "PNG, JPG or WebP · up to 10 MB" }) {
  const input = h("input", { type: "file", accept: accept.join(","), multiple, hidden: true });
  const label = h("span", { class: "dropzone__text" }, text);
  const zone = h("div", { class: "dropzone", tabindex: "0", role: "button", "aria-label": text });
  zone.append(h("strong", {}, "＋"), label, h("small", {}, hint), input);
  const run = async (files) => {
    files = [...files].filter((f) => accept.includes(f.type));
    if (!files.length) { toast(`Please choose ${noun === "PDF" ? "a PDF file" : "image files"}.`, true); return; }
    zone.classList.add("busy");
    label.textContent = `Uploading ${plural(files.length, noun, noun + "s")}…`;
    try { await onFiles(files); } catch (err) { toast(err.message, true); }
    zone.classList.remove("busy");
    label.textContent = text;
  };
  zone.addEventListener("click", () => { if (!zone.classList.contains("busy")) input.click(); });
  zone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } });
  input.addEventListener("change", () => { const files = [...input.files]; input.value = ""; run(files); });
  zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("over"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("over"));
  zone.addEventListener("drop", (e) => { e.preventDefault(); zone.classList.remove("over"); run(e.dataTransfer.files); });
  return zone;
}

function renderCover(f, obj, touch, ctx) {
  const box = h("div", { class: "cover" });
  const draw = () => {
    box.replaceChildren();
    if (obj[f.k]) {
      box.append(h("img", { src: imgSrc(obj[f.k]), alt: "Cover preview" }),
        h("div", { class: "cover__btns" },
          h("button", { type: "button", class: "btn ghost small", onclick: () => { obj[f.k] = ""; touch(); draw(); ctx.bus.dispatchEvent(new Event("cover")); } }, f.removeText || "Remove cover")));
    } else {
      box.append(dropzone({ multiple: false, text: f.dropText || "Drop a cover image here, or click to choose", onFiles: async ([file]) => { obj[f.k] = await uploadFile(file); touch(); draw(); ctx.bus.dispatchEvent(new Event("cover")); } }));
    }
  };
  draw();
  ctx.bus.addEventListener("cover", draw);
  return fieldWrap(f, box);
}

function renderPdf(f, obj, touch) {
  const box = h("div", { class: "pdf" });
  const nameOf = (ref) => decodeURIComponent(ref.split("/").pop() || "").replace(/^\d{10,}-/, "");
  const draw = () => {
    box.replaceChildren();
    if (obj[f.k]) {
      box.append(h("div", { class: "pdf__file" },
        h("span", { class: "pdf__badge" }, "PDF"),
        h("a", { href: imgSrc(obj[f.k]), target: "_blank", rel: "noreferrer", title: "Open in a new tab" }, nameOf(obj[f.k])),
        h("button", { type: "button", class: "btn ghost small", onclick: () => { obj[f.k] = ""; touch(); draw(); } }, "Remove")));
    }
    box.append(dropzone({
      multiple: false, accept: ["application/pdf"], noun: "PDF", hint: "PDF · up to 10 MB",
      text: obj[f.k] ? "Drop a new PDF here to replace it, or click to choose" : "Drop a PDF here, or click to choose",
      onFiles: async ([file]) => { obj[f.k] = await uploadFile(file, ["application/pdf"], "a PDF file"); touch(); draw(); },
    }));
  };
  draw();
  return fieldWrap(f, box);
}

function renderGallery(f, obj, touch, ctx) {
  obj[f.k] = obj[f.k] || [];
  const grid = h("div", { class: "gallery" });
  const draw = () => {
    grid.replaceChildren(...obj[f.k].map((ref, i) => h("figure", { class: "shot" },
      h("img", { src: imgSrc(ref), alt: `Screenshot ${i + 1}`, loading: "lazy" }),
      obj.cover === ref ? h("span", { class: "shot__badge" }, "Cover") : null,
      h("figcaption", {},
        h("button", { type: "button", class: "icon", title: "Move earlier", "aria-label": "Move earlier", onclick: () => { if (move(obj[f.k], i, -1)) { touch(); draw(); } } }, "←"),
        h("button", { type: "button", class: "icon", title: "Move later", "aria-label": "Move later", onclick: () => { if (move(obj[f.k], i, 1)) { touch(); draw(); } } }, "→"),
        obj.cover === ref ? null : h("button", { type: "button", class: "icon text", title: "Use as cover image", onclick: () => { obj.cover = ref; touch(); toast("Cover updated. Remember to save."); ctx.bus.dispatchEvent(new Event("cover")); } }, "Cover"),
        h("button", { type: "button", class: "icon danger", title: "Remove", "aria-label": "Remove image", onclick: () => { obj[f.k].splice(i, 1); touch(); draw(); } }, "✕")))),
      dropzone({ multiple: true, text: "Drop images here, or click to choose", onFiles: async (files) => {
        for (const file of files) obj[f.k].push(await uploadFile(file));
        if (!obj.cover && obj[f.k].length) obj.cover = obj[f.k][0];
        touch(); draw();
        ctx.bus.dispatchEvent(new Event("cover"));
      } }));
  };
  draw();
  ctx.bus.addEventListener("cover", draw);
  return fieldWrap(f, grid);
}

// ---------- definitions ----------
const COLLECTIONS = {
  projects: {
    label: "Projects", singular: "project",
    intro: "Everything shown in the Work section of your site.",
    name: (r) => r.title, sub: (r) => (r.category || []).join(" · "),
    thumb: (r) => r.cover,
    blank: { title: "", category: [], description: "", contributions: [], tech: [], url: "", repositoryUrl: "", cover: "", gallery: [], status: "draft" },
    required: ["title"],
    sections: [
      { title: "Basics", fields: [
        { k: "title", required: true, placeholder: "e.g. Billing dashboard for a water utility" },
        { k: "status", t: "status" },
        { k: "category", t: "tags", label: "Categories", help: "Used for the filter buttons on the site, like Laravel or Kotlin.", suggest: true, placeholder: "Add a category, press Enter" },
      ] },
      { title: "Description", fields: [
        { k: "description", t: "textarea", rows: 6, help: "A short story: what problem it solved and for whom." },
        { k: "contributions", t: "list", label: "What you did", help: "One point per line item.", addLabel: "Add a point" },
      ] },
      { title: "Links & technology", fields: [
        { k: "tech", t: "tags", label: "Tech stack", placeholder: "Add a technology, press Enter" },
        { k: "url", label: "Live site URL", placeholder: "https://" },
        { k: "repositoryUrl", label: "Code repository URL", placeholder: "https://github.com/…" },
      ] },
      { title: "Images", fields: [
        { k: "cover", t: "image", label: "Cover image", help: "The thumbnail shown on the project card." },
        { k: "gallery", t: "gallery", label: "Screenshots", help: "Shown in the project's gallery, in this order." },
      ] },
    ],
  },
  experience: {
    label: "Experience", singular: "role",
    intro: "Your work history timeline.",
    name: (r) => r.title, sub: (r) => [r.company, r.yearsActive].filter(Boolean).join(" · "),
    blank: { title: "", company: "", yearsActive: "", link: "", information: [], status: "draft" },
    required: ["title"],
    sections: [
      { title: "Role", fields: [
        { k: "title", label: "Job title", required: true },
        { k: "company" },
        { k: "yearsActive", label: "Period", placeholder: "e.g. February 2026 - Present" },
        { k: "link", label: "Company website", placeholder: "https://" },
        { k: "status", t: "status" },
      ] },
      { title: "Highlights", fields: [
        { k: "information", t: "list", label: "What you did here", help: "Newest roles appear first on the site.", addLabel: "Add a highlight", rows: 3 },
      ] },
    ],
  },
  skills: {
    label: "Skills", singular: "skill group",
    intro: "Groups of technologies shown under “What I work with”.",
    name: (r) => r.title, sub: (r) => plural((r.items || []).length, "skill", "skills"),
    blank: { title: "", items: [] },
    required: ["title"],
    sections: [
      { title: "Group", fields: [
        { k: "title", label: "Group name", required: true, placeholder: "e.g. Infrastructure" },
        { k: "items", t: "tags", label: "Skills", placeholder: "Add a skill, press Enter" },
      ] },
    ],
  },
};

const PAIR = [{ k: "title" }, { k: "text", t: "textarea", rows: 2 }];
const SETTINGS_PAGES = {
  home: {
    label: "Home page", keys: ["name", "role", "hero", "photo"],
    intro: "The first thing visitors see.",
    sections: [
      { title: "Profile photo", fields: [
        { k: "photo", t: "image", label: "Photo", help: "The large photo next to your headline. A square image works best.", dropText: "Drop a photo here, or click to choose", removeText: "Remove photo" },
      ] },
      { title: "Identity", fields: [
        { k: "name", help: "Shown in the top bar and the footer." },
        { k: "role", label: "Role label", help: "Small line under your name in the top bar." },
      ] },
      { title: "Intro", fields: [{ k: "hero", t: "group", fields: [
        { k: "status", label: "Availability badge", help: "The small pill above the headline, e.g. “Available for new work”." },
        { k: "headline", t: "textarea", rows: 2, help: "The big sentence at the top of the home page." },
        { k: "lead", label: "Intro paragraph", t: "textarea", rows: 4 },
        { k: "capabilities", t: "repeat", label: "What you take on", itemLabel: "Card", help: "The row of short cards under the headline.", item: PAIR },
      ] }] },
    ],
  },
  approach: {
    label: "How I work", keys: ["approach"],
    intro: "The numbered steps explaining how you work with clients.",
    sections: [{ title: "Section", fields: [{ k: "approach", t: "group", fields: [
      { k: "title", label: "Section title" },
      { k: "intro", label: "Intro text", t: "textarea", rows: 3 },
      { k: "steps", t: "repeat", label: "Steps", itemLabel: "Step", item: PAIR },
    ] }] }],
  },
  about: {
    label: "About", keys: ["about", "cv"],
    intro: "A short personal introduction and your resume files.",
    sections: [
      { title: "About text", fields: [{ k: "about", t: "group", fields: [
        { k: "paragraphs", t: "paras", label: "Paragraphs", help: "Separate paragraphs with a blank line.", rows: 10 },
      ] }] },
      { title: "Resume (CV)", fields: [{ k: "cv", t: "group", fields: [
        { k: "en", t: "pdf", label: "English version", help: "Shown as “English” in the resume card. Leave empty to hide it." },
        { k: "id", t: "pdf", label: "Indonesian version", help: "Shown as “Bahasa Indonesia”. Leave empty to hide it." },
      ] }] },
    ],
  },
  links: {
    label: "Contact & links", keys: ["email", "socials"],
    intro: "How people reach you.",
    sections: [{ title: "Contact", fields: [
      { k: "email", label: "Email address" },
      { k: "socials", t: "repeat", label: "Social links", itemLabel: "Link", item: [{ k: "label", placeholder: "e.g. github" }, { k: "url", placeholder: "https://" }] },
    ] }],
  },
};

// ---------- form engine (shared by collections and settings pages) ----------
function prepare(value) {
  if (Array.isArray(value)) {
    const cleaned = value
      .map(prepare)
      .filter((v) => (typeof v === "string" ? v.trim() !== "" : v && typeof v === "object" ? Object.values(v).some((x) => (Array.isArray(x) ? x.length : String(x ?? "").trim())) : true));
    return cleaned.map((v) => (typeof v === "string" ? v.trim() : v));
  }
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, prepare(v)]));
  return value;
}

function showFieldError(form, key, message) {
  const wrap = form.querySelector(`[data-field="${key}"]`);
  if (!wrap) return false;
  const err = wrap.querySelector(".error");
  if (err) { err.textContent = message; err.hidden = false; }
  wrap.classList.add("has-error");
  wrap.scrollIntoView?.({ block: "center", behavior: "smooth" });
  wrap.querySelector("input, textarea")?.focus();
  return true;
}

function buildForm({ heading, subtitle, sections, initial, isNew, required = [], suggestions, saveLabel = "Save changes", onSave, onDiscard, onDelete, deleteInfo, onBack, backLabel = "← Back" }) {
  const draft = clone(initial);
  let original = JSON.stringify(draft);
  const form = h("form", { class: "editor", novalidate: true, onsubmit: (e) => { e.preventDefault(); save(); } });

  const status = h("span", { class: "savebar__status" });
  const saveBtn = h("button", { type: "submit", class: "btn" }, saveLabel);
  const discardBtn = h("button", { type: "button", class: "btn ghost", onclick: () => onDiscard() }, "Discard changes");
  const bar = h("div", { class: "savebar" }, status, h("span", { class: "savebar__btns" }, discardBtn, saveBtn));

  const refresh = (saving = false) => {
    app.dirty = JSON.stringify(draft) !== original;
    status.className = "savebar__status" + (app.dirty ? " is-dirty" : "");
    status.textContent = saving ? "Saving…" : app.dirty ? "You have unsaved changes" : isNew ? "Fill in the details, then create" : "All changes saved";
    saveBtn.disabled = saving || !app.dirty;
    discardBtn.hidden = !app.dirty;
    form.classList.toggle("is-dirty", app.dirty);
  };
  const touch = () => {
    form.querySelectorAll(".has-error").forEach((w) => { w.classList.remove("has-error"); const e = w.querySelector(".error"); if (e) e.hidden = true; });
    refresh();
  };

  form.append(h("header", { class: "editor__head" },
    onBack ? h("button", { type: "button", class: "back", onclick: onBack }, backLabel) : null,
    h("h2", {}, heading), subtitle ? h("p", { class: "muted" }, subtitle) : null));

  const ctx = { suggestions, bus: new EventTarget() };
  sections.forEach((s) => {
    const card = h("section", { class: "card" }, h("h3", {}, s.title));
    s.fields.forEach((f) => card.append(renderField(f, draft, touch, ctx)));
    form.append(card);
  });

  if (onDelete) {
    form.append(h("section", { class: "card danger-zone" }, h("h3", {}, "Delete"),
      h("p", { class: "help" }, deleteInfo || "This cannot be undone."),
      h("button", { type: "button", class: "btn danger-outline", onclick: onDelete }, "Delete…")));
  }
  form.append(bar);

  async function save() {
    const body = prepare(draft);
    delete body.id;
    for (const key of required) {
      if (!String(body[key] ?? "").trim()) { showFieldError(form, key, "This field is required."); toast("Please fill in the required field.", true); return; }
    }
    refresh(true);
    try {
      const saved = await onSave(body);
      Object.keys(draft).forEach((k) => delete draft[k]);
      Object.assign(draft, clone(body), saved && saved.id ? { id: saved.id } : {});
      original = JSON.stringify(draft);
      app.dirty = false;
      refresh();
      toast(isNew ? "Created ✓" : "Saved ✓ It will be live on your site within a minute.");
    } catch (err) {
      refresh();
      toast(err.message, true);
    }
  }

  app.save = () => { if (!saveBtn.disabled) save(); };
  refresh();
  return form;
}

// ---------- views ----------
function setLoading() {
  view.replaceChildren(h("div", { class: "loading" }, "Loading…"));
}

async function showOverview() {
  setLoading();
  const [projects, experience, skills] = await Promise.all([api("/projects"), api("/experience"), api("/skills")]);
  const live = projects.filter((p) => p.status === "published").length;
  const drafts = projects.filter((p) => p.status !== "published");
  const go = async (id, after) => { if (await guard()) { await navigate(id); after?.(); } };

  const card = (title, big, small, btnText, id) => h("div", { class: "stat" }, h("span", { class: "stat__label" }, title), h("strong", {}, big), h("small", {}, small),
    h("button", { type: "button", class: "btn ghost small", onclick: () => go(id) }, btnText));

  view.replaceChildren(h("div", { class: "page" },
    h("header", { class: "page__head" }, h("h1", {}, "Welcome back"), h("p", { class: "muted" }, "Edit your site content here. Changes go live about a minute after you save.")),
    h("div", { class: "stats" },
      card("Projects", String(live), drafts.length ? `live · ${plural(drafts.length, "draft", "drafts")}` : "live", "Manage projects", "projects"),
      card("Experience", String(experience.length), experience.length === 1 ? "role" : "roles", "Manage experience", "experience"),
      card("Skills", String(skills.length), skills.length === 1 ? "group" : "groups", "Manage skills", "skills")),
    h("section", { class: "card" }, h("h3", {}, "Quick actions"),
      h("div", { class: "quick" },
        h("button", { type: "button", class: "btn", onclick: () => go("projects", () => document.querySelector("[data-new]")?.click()) }, "+ Add a project"),
        h("button", { type: "button", class: "btn ghost", onclick: () => go("home") }, "Edit the home page headline"),
        h("a", { class: "btn ghost", href: siteUrl || "/", target: "_blank", rel: "noreferrer" }, "View live site ↗"))),
    drafts.length ? h("section", { class: "card" }, h("h3", {}, "Unpublished drafts"),
      h("p", { class: "help" }, "These are saved but not visible on your site yet."),
      h("ul", { class: "plain" }, ...drafts.map((p) => h("li", {}, h("button", { type: "button", class: "linklike", onclick: () => go("projects", () => document.querySelector(`[data-id="${p.id}"]`)?.click()) }, p.title || "(untitled)"))))) : null));
}

async function showCollection(name) {
  const cfg = COLLECTIONS[name];
  setLoading();
  let rows = await api(`/${name}`);
  let q = "";
  let filter = "all";
  let selected = null;
  const suggestions = { category: [...new Set(rows.flatMap((r) => r.category || []))].sort() };

  const split = h("div", { class: "split" });
  const listCol = h("div", { class: "listcol" });
  const editorCol = h("div", { class: "editorcol" });
  split.append(listCol, editorCol);

  const hasStatus = rows.some((r) => "status" in r);
  const visible = () => rows.filter((r) => (!q || (cfg.name(r) || "").toLowerCase().includes(q.toLowerCase())) && (filter === "all" || (filter === "live" ? r.status === "published" : r.status !== "published")));

  const drawList = () => {
    const items = visible();
    const search = h("input", { type: "search", class: "search", placeholder: `Search ${cfg.label.toLowerCase()}…`, value: q, "aria-label": "Search", oninput: (e) => { q = e.target.value; drawRows(); } });
    const filters = hasStatus ? h("div", { class: "chips" }, ...[["all", "All"], ["live", "Live"], ["draft", "Drafts"]].map(([k, t]) =>
      h("button", { type: "button", class: "chip" + (filter === k ? " on" : ""), onclick: () => { filter = k; drawList(); } }, t))) : null;
    const rowsEl = h("div", { class: "rows", role: "list" });
    const drawRows = () => {
      const rs = visible();
      rowsEl.className = "rows" + (cfg.thumb ? " rows--cards" : "");
      rowsEl.replaceChildren(...(rs.length ? rs.map((r) => h("button", { type: "button", role: "listitem", class: "row" + (cfg.thumb ? " row--card" : ""), "data-id": r.id, onclick: () => select(r) },
        cfg.thumb ? (cfg.thumb(r) ? h("img", { class: "row__thumb", src: imgSrc(cfg.thumb(r)), alt: "", loading: "lazy" }) : h("span", { class: "row__thumb empty" }, "No cover")) : null,
        h("span", { class: "row__text" }, h("strong", {}, cfg.name(r) || "(untitled)"), h("small", {}, cfg.sub(r) || " ")),
        "status" in r ? h("span", { class: "pill " + (r.status === "published" ? "live" : "draft") }, r.status === "published" ? "Live" : "Draft") : h("span", { class: "row__go", "aria-hidden": "true" }, "›")))
        : [h("div", { class: "empty" }, rows.length ? "Nothing matches your search." : `No ${cfg.label.toLowerCase()} yet. Create the first one.`)]));
    };
    drawRows();
    listCol.replaceChildren(
      h("div", { class: "listhead" }, h("div", {}, h("h1", {}, cfg.label), h("p", { class: "muted" }, cfg.intro)),
        h("button", { type: "button", class: "btn", "data-new": "", onclick: () => select(null) }, `+ New ${cfg.singular}`)),
      rows.length > 5 || filters ? h("div", { class: "listtools" }, rows.length > 5 ? search : null, filters) : null, rowsEl);
  };

  
  const open = (row) => {
    const isNew = !row;
    selected = row ? row.id : "new";
    split.classList.add("is-editing");
    drawList();
    const form = buildForm({
      heading: isNew ? `New ${cfg.singular}` : cfg.name(row) || `Edit ${cfg.singular}`,
      subtitle: isNew ? "Fill in the details. Nothing is public until you switch it to visible." : null,
      sections: cfg.sections, initial: isNew ? cfg.blank : row, isNew, required: cfg.required, suggestions,
      saveLabel: isNew ? `Create ${cfg.singular}` : "Save changes",
      onBack: () => back(),
      backLabel: `← ${cfg.label}`,
      onDiscard: () => open(row),
      onSave: async (body) => {
        const saved = isNew ? await api(`/${name}`, { method: "POST", json: body }) : await api(`/${name}/${row.id}`, { method: "PUT", json: body });
        rows = await api(`/${name}`);
        selected = saved.id;
        drawList();
        if (isNew) setTimeout(() => open(rows.find((r) => r.id === saved.id)), 0);
        return saved;
      },
      onDelete: isNew ? null : async () => {
        const ok = await confirmDialog({ title: `Delete this ${cfg.singular}?`, message: `“${cfg.name(row) || "Untitled"}” will be permanently removed. This cannot be undone.`, confirm: "Delete", danger: true });
        if (!ok) return;
        try { await api(`/${name}/${row.id}`, { method: "DELETE" }); } catch (err) { toast(err.message, true); return; }
        app.dirty = false; app.save = null;
        rows = await api(`/${name}`);
        selected = null;
        split.classList.remove("is-editing");
        drawList();
        toast("Deleted");
      },
    });
    editorCol.replaceChildren(form);
    if (isNew) form.querySelector("input[type=text]")?.focus();
  };

  async function select(row) {
    if ((row ? row.id : "new") === selected) return;
    if (!(await guard())) return;
    open(row);
  }
  async function back() {
    if (!(await guard())) return;
    selected = null; app.save = null;
    split.classList.remove("is-editing");
    drawList();
  }

  view.replaceChildren(split);
  drawList();
}

async function showSettingsPage(id) {
  const page = SETTINGS_PAGES[id];
  setLoading();
  const all = await api("/settings");
  const initial = Object.fromEntries(page.keys.map((k) => [k, clone(all[k] ?? (k === "socials" ? [] : {}))]));
  const form = buildForm({
    heading: page.label, subtitle: page.intro, sections: page.sections, initial,
    onDiscard: () => showSettingsPage(id),
    onSave: async (body) => { await api("/settings", { method: "PUT", json: body }); return {}; },
  });
  view.replaceChildren(h("div", { class: "page narrow" }, form));
}

// ---------- navigation ----------
const NAV = [
  { id: "overview", label: "Overview" },
  { group: "Content" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { group: "Page texts" },
  ...Object.entries(SETTINGS_PAGES).map(([id, p]) => ({ id, label: p.label })),
];

function drawNav() {
  navEl.replaceChildren(...NAV.map((n) => n.group
    ? h("span", { class: "nav__sep", role: "separator", "aria-label": n.group })
    : h("button", { type: "button", class: "nav__item", "aria-current": String(n.id === app.nav), onclick: async () => { if (n.id !== app.nav && (await guard())) navigate(n.id); } }, n.label)));
}

async function navigate(id) {
  app.nav = id; app.dirty = false; app.save = null;
  drawNav();
  try {
    if (id === "overview") await showOverview();
    else if (COLLECTIONS[id]) await showCollection(id);
    else await showSettingsPage(id);
  } catch (err) {
    view.replaceChildren(h("div", { class: "page" }, h("div", { class: "card" }, h("h3", {}, "Could not load this page"), h("p", {}, err.message),
      h("button", { type: "button", class: "btn ghost small", onclick: () => navigate(id) }, "Try again"))));
  }
  window.scrollTo?.(0, 0);
}

// ---------- boot ----------
(async () => {
  try {
    const cfg = await api("/config");
    siteUrl = (cfg.siteUrl || "").replace(/\/$/, "");
    document.getElementById("user").textContent = cfg.user || "";
    document.getElementById("viewsite").href = siteUrl || "/";
  } catch (err) {
    toast(err.message, true);
  }
  navigate("overview");
})();
