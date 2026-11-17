import { loadContent } from "../../../shared/content.js";

// GET /api/content: all published content as JSON, edge-cached for about a minute.
export async function onRequestGet({ request, env, waitUntil }) {
  const cache = caches.default;
  const cacheKey = new Request(new URL(request.url).origin + "/api/content");
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  try {
    const res = new Response(JSON.stringify(await loadContent(env.DB)), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300",
      },
    });
    waitUntil(cache.put(cacheKey, res.clone()));
    return res;
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
