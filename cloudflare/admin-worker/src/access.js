// Verifies the Cloudflare Access JWT (Cf-Access-Jwt-Assertion) against the team's JWKS.
const b64urlToBytes = (s) => {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};
const parse = (s) => JSON.parse(new TextDecoder().decode(b64urlToBytes(s)));

export async function verifyAccess(request, env) {
  if (env.ENVIRONMENT === "dev") return { email: "dev@localhost" };
  if (!env.TEAM_DOMAIN || !env.POLICY_AUD || env.TEAM_DOMAIN.startsWith("REPLACE")) return null;

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const header = parse(parts[0]);
    const claims = parse(parts[1]);
    if (header.alg !== "RS256") return null;

    const jwks = await (
      await fetch(`https://${env.TEAM_DOMAIN}/cdn-cgi/access/certs`, { cf: { cacheTtl: 3600, cacheEverything: true } })
    ).json();
    const jwk = jwks.keys.find((k) => k.kid === header.kid);
    if (!jwk) return null;

    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5", key, b64urlToBytes(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
    );
    const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    const valid =
      ok &&
      aud.includes(env.POLICY_AUD) &&
      claims.iss === `https://${env.TEAM_DOMAIN}` &&
      claims.exp > Date.now() / 1000;
    return valid ? { email: claims.email } : null;
  } catch {
    return null;
  }
}
