# Production Deployment — bdgarmentscareer.com

This guide takes the full stack live on **Vercel** (Next.js frontends) and
**Render** (FastAPI backends + PostgreSQL), wiring them to the real domains:

| Purpose                        | Host            | URL                              | Port / Role            |
|--------------------------------|-----------------|----------------------------------|------------------------|
| Main job portal frontend       | Vercel          | `https://bdgarmentscareer.com`   | Next.js app             |
| Main portal API + database     | Render          | `https://bdgc-main-api.onrender.com`  | FastAPI + Postgres     |
| Government jobs portal frontend| Vercel          | `https://bdgarmentscareer.com/govt.jobs` | Next.js app      |
| Government jobs API + database | Render          | `https://bdgc-gov-api.onrender.com`   | FastAPI + Postgres     |
| WordPress theme                | existing host   | `https://www.bdgarmentscareer.com`    | already live           |

> **Routing note:** The government portal is served from the **path**
> `/govt.jobs` on the main domain (not a separate subdomain). Deploy the gov
> Next.js app to Vercel, then on your main hosting (or a reverse proxy / CDN)
> route `/govt.jobs/*` to the gov Vercel URL — or serve the gov portal at
> that path. Hosts like Vercel + a front proxy, nginx, or Cloudflare follow
> this easily.

---

## 1. Deploy the backends to Render

### Main portal API

1. Push/create a repo containing `real-project/main-portal/backend`.
2. In the Render dashboard: **New → Web Service → Connect repo**.
3. Render auto-detects the Python service (via `Procfile` / `render.yaml`).
   If using Blueprint, **New → Blueprint** and point at `backend/render.yaml` —
   it creates the web service AND the `bdgc-main-db` PostgreSQL automatically.
4. Set these **Environment Variables**:

   | Key                     | Value                                                        |
   |-------------------------|--------------------------------------------------------------|
   | `DATABASE_URL`          | `postgresql://…` (from the Render Postgres, or Blueprint auto) |
   | `SECRET_KEY`            | `openssl rand -hex 32`                                       |
   | `ALGORITHM`             | `HS256`                                                      |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440`                                                |
   | `UPLOAD_DIR`            | `/tmp/uploads`                                               |

   > `render.yaml` already sets all of these for you when you use Blueprint.

5. Deploy. The service listens on `wsgi` (`uvicorn`) as configured in
   `Procfile`. Confirm `/health` returns `{"status":"ok"}`.

Once live, note the public URL (usually `https://bdgc-main-api.onrender.com`).

### Government jobs API

Repeat the same flow for `real-project/gov-jobs-portal/backend`
(`render.yaml` creates `bdgc-gov-db`). Only `DATABASE_URL` is required.

---

## 2. Deploy the frontends to Vercel

### Main portal

1. Push/create a repo containing `real-project/main-portal/frontend`.
2. On Vercel: **Add New → Project → Import** the repo. `vercel.json` sets the
   framework to Next.js and the build command.
3. Under **Project → Settings → Environment Variables (Production)** set:

   | Key                          | Value                                     |
   |------------------------------|-------------------------------------------|
   | `API_ORIGIN`                 | your Render URL, e.g. `https://bdgc-main-api.onrender.com` |
   | `NEXT_PUBLIC_GOV_PORTAL_URL` | `https://bdgarmentscareer.com/govt.jobs`  |
   | `NEXT_PUBLIC_API_BASE`       | `/api`                                    |

   > `API_ORIGIN` is read at **build time** (used by `next.config.mjs`
   > rewrites), so set it before deploying.

4. Deploy. It will be served at a `*.vercel.app` URL first.

### Government jobs portal

Same flow for `real-project/gov-jobs-portal/frontend` with:

| Key                          | Value                                     |
|------------------------------|-------------------------------------------|
| `API_ORIGIN`                 | `https://bdgc-gov-api.onrender.com`       |
| `NEXT_PUBLIC_MAIN_PORTAL_URL`| `https://www.bdgarmentscareer.com`        |
| `NEXT_PUBLIC_API_BASE`       | `/api`                                    |

---

## 3. Point the domains

### Main domain → main portal

In Vercel: **Project → Settings → Domains → Add** `www.bdgarmentscareer.com`
and `bdgarmentscareer.com`. Vercel gives you a `CNAME` record to add at your
DNS provider. Set the main (non-www) root as a redirect to `www` for SEO.

> The WordPress theme at `https://www.bdgarmentscareer.com` is already live.
> If you want the Next.js portal to be the site, add a `CNAME`/`A` record in
> front of it, or run the portal on a subpath and keep WordPress for the blog.

### Gov portal route → `/govt.jobs` on the main domain

The government portal is served from **`https://bdgarmentscareer.com/govt.jobs`**
(a path on the main domain), not a separate subdomain. Route that path to
the gov Vercel app using your main host's reverse-proxy / CDN rules:

- **nginx (main web server):**
  ```nginx
  location ^~ /govt.jobs/ {
      proxy_pass https://<yourGov>.vercel.app/;
      proxy_set_header Host bdgarmentscareer.com;
  }
  ```
- **Cloudflare / Vercel:** add a redirect rule from `/govt.jobs` to the gov
  Vercel URL, or front both apps with the same domain and path-based routing.

Vercel provisions TLS for the path automatically when connected to the main
domain.

---

## 4. Wire the WordPress theme

Add to the live site's `wp-config.php` (or rely on the built-in defaults):

```php
define('BDGC_GOV_PORTAL_URL', 'https://bdgarmentscareer.com/govt.jobs'); // gov portal
define('BDGC_SERVICE_URL', 'https://bdgc-main-api.onrender.com');  // main API
```

The theme's "Gov Jobs" header link now opens the real standalone portal, and
any apply forms on the WordPress site can call the live API.

---

## 5. Verify

- [ ] `GET https://bdgc-main-api.onrender.com/health` → `{"status":"ok"}`
- [ ] `GET https://bdgc-gov-api.onrender.com/health` → `{"status":"ok"}`
- [ ] `https://bdgarmentscareer.com/govt.jobs` shows the gov portal (distinct header)
- [ ] `https://bdgarmentscareer.com` serves the main portal
- [ ] "Gov Jobs" link on the WordPress site opens bdgarmentscareer.com/govt.jobs
- [ ] Signup/login → profile → upload CV → apply → track application works
- [ ] `npx vercel env pull` locally matches your production env

---

## Notes & caveats

- **Ephemeral storage:** CV uploads write to `/tmp/uploads` on Render, which
  is wiped on redeploy. For a production-worthy setup, attach a persistent
  Render disk or use object storage (S3) and adjust the CV endpoint.
- **Env at build time:** Next.js reads `API_ORIGIN` during `npm run build`.
  Change the backend URL later → change the env var and redeploy the frontend.
- **CORS:** both backends already whitelist `https://www.bdgarmentscareer.com`,
  `https://bdgarmentscareer.com`, and the gov portal is served at the path
  `/govt.jobs` on that same origin.