# Cloudflare CMS

A Pages project (public site) and a Worker (admin) share one D1 database and one R2 bucket. No custom domain is needed.

| Worker | Name | URL | Access |
|---|---|---|---|
| `pages` (Cloudflare Pages) | `restu-akbar` | `restu-akbar.pages.dev` | public, read-only |
| `admin-worker` | `restu-akbar-admin` | `restu-akbar-admin.<account>.workers.dev` | Cloudflare Access (you only) |

- `GET /api/content` (site, `pages/functions/api/content.js`) returns the same shape as `src/content/index.js`.
- `GET /media/*` (site, `pages/functions/media/[[path]].js`) serves R2 objects.
- `/` (admin) is the admin UI (static page in `admin-worker/public/`, no build step): tabs for Projects, Experience, Skills and Site copy, image upload, draft/publish, delete.
- `/api/admin/*` (admin) is CRUD for `projects`, `experience`, `skills`, plus `settings` and `upload`.

## One-time setup

Run from this folder (`cloudflare/`).

```sh
npm install
npx wrangler login

# 1. Create storage
npx wrangler d1 create restu-akbar-cms        # copy the database_id it prints
npx wrangler r2 bucket create restu-akbar-media
```

Put the `database_id` in `pages/wrangler.jsonc` and `admin-worker/wrangler.jsonc`.

```sh
# 2. Schema + seed (generated from src/content/*.json)
npm run seed:build
npm run db:migrate:remote
npm run db:seed:remote
bash seed/out/upload-media.sh            # uploads the 42 project images to R2

# 3. Create the Pages project once, build the React app, then deploy the public site
(cd pages && npx wrangler pages project create restu-akbar --production-branch main)
(cd .. && yarn build)
npm run deploy:site
```

### Protect the admin Worker

1. Deploy once: `npm run deploy:admin` (it answers 401 until Access is set up).
2. Cloudflare dashboard -> Workers & Pages -> `restu-akbar-admin` -> **Access** tab -> *Protect this Worker behind Access* -> *All traffic*, choose a policy that allows only your email, then *Apply Access*. (Zero Trust must be enabled on the account first.)
3. Zero Trust -> Access -> Applications -> that application: add an **Allow** policy for your own email only. Copy its **Application Audience (AUD) tag**.
4. Put your site URL in `SITE_URL` (used for image previews in the UI), the AUD in `POLICY_AUD` and your team domain (`<team>.cloudflareaccess.com`) in `TEAM_DOMAIN` in `admin-worker/wrangler.jsonc`, then `npm run deploy:admin` again.

The Worker verifies the Access JWT itself and fails closed if either value is missing, so a wrong Access policy cannot expose writes.

## Automatic deploys (GitHub Actions)

`.github/workflows/deploy.yml` runs on every push to `main` (and builds/checks on pull requests):

1. `npm ci`, then `npm run build` (warnings fail the build because `CI=true`).
2. Checks: `node --check` on the admin UI, seed script runs, and `wrangler deploy --dry-run` for the admin Worker.
3. **Push to `main` only:** deploys the public site to Cloudflare Pages, deploys the admin Worker, then a smoke test
   (site 200, `/api/content` has projects, admin answers 302/401/403 without login).

Add two repository secrets once (GitHub -> Settings -> Secrets and variables -> Actions):

| Secret | Value |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | your account id (dashboard -> Workers & Pages -> right sidebar) |
| `CLOUDFLARE_API_TOKEN` | token with **Account: Cloudflare Pages: Edit** and **Account: Workers Scripts: Edit** (and Account Settings: Read), limited to your account |

The workflow never touches the database or R2 content: seeding and migrations stay manual, so edits made in the admin are never overwritten by a deploy.
You can also trigger it by hand from the Actions tab (*Run workflow*).

## Local development

```sh
npm run seed:build
npm run db:migrate:local && npm run db:seed:local
npm run dev:site     # http://localhost:8787 (needs `yarn build` first; runs Pages Functions)
npm run dev:admin    # http://localhost:8788 admin UI (auth bypass, ENVIRONMENT=dev, local only)
```

## Notes

- Edits appear on the public site within about a minute (edge cache on `/api/content`).
- Re-running `db:seed:*` **overwrites** all content with `src/content/*.json`. Only use it for the first load.
- D1 point-in-time recovery (Time Travel) is on by default; export with `wrangler d1 export` before risky changes.
- The React app reads `/api/content` and falls back to the bundled JSON (`src/content/*.json`) if the API is missing or fails.
- Not done yet: cutover from the homelab / GitHub Pages.
