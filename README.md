# BD Garments Career — WordPress Theme Deploy Guide

Target domain: **https://www.bdgarmentscareer.com**

This package contains everything you need to install the BD Garments Career
theme on your WordPress hosting and get the homepage (hero, stats, partner
slider, job board, categories, testimonials), the header search bar, and the
**Gov Jobs** portal link working on your live domain.

---

## What's in this folder

```
wordpress-theme/
├── bd-garments-career.zip       ← upload this to WordPress (the theme)
├── wp-rewrite-siteurl.php       ← helps point WordPress at the live domain
└── README.md                     ← this guide
```

---

## Part 1 — Prerequisites (before you deploy)

Make sure your WordPress hosting is ready:

- [ ] A WordPress site already installed on your hosting (the main domain
      `bdgarmentscareer.com`).
- [ ] The theme needs **PHP 7.4 or newer** (PHP 8.x recommended).
- [ ] The **Jobs** custom post type is registered by the theme itself, so no
      plugin is required. Theme must be **active** for the front-page to
      render.

If you are moving an existing local site to this domain, remember that
WordPress stores its full URL in the database. A helper script is included
in Step 3 to fix that.

---

## Part 2 — Install the theme

### Option 1: Upload from the admin (easiest)

1. Log in to WordPress admin: `https://www.bdgarmentscareer.com/wp-admin`
2. Go to **Appearance → Themes → Add New → Upload Theme**
3. Choose `bd-garments-career.zip`
4. Click **Install Now**, then **Activate**.

### Option 2: Manual upload (FTP / cPanel File Manager)

1. Unzip `bd-garments-career.zip` locally.
2. Upload the resulting `bd-garments-career/` folder to
   `/wp-content/themes/` on your server (via FTP or cPanel File Manager).
3. Go to **Appearance → Themes** and click **Activate** on
   "BD Garments Career".

---

## Part 3 — Make the site load on the live domain (IMPORTANT)

WordPress stores its site URL (`home` + `siteurl`) in the database. If these
still point at your old/local URL (e.g. `http://localhost:8080/wordpress`),
the site will redirect or fail to open.

### Quickest fix — Settings → General

**Settings → General → WordPress Address (URL) / Site Address (URL)** and set
both to:

```
https://www.bdgarmentscareer.com
```

Save. Then go to **Settings → Permalinks → Save Changes** once.

### Safer full fix — automated helper script

If there are older URLs baked into menus/widgets/customizer options (or you
moved from a local install), run the included PHP helper on the server via
SSH or a terminal:

```bash
cd /path/to/wordpress
php /path/to/wp-rewrite-siteurl.php www.bdgarmentscareer.com
```

> Upload `wp-rewrite-siteurl.php` (in this folder) next to your WordPress
> install, then run it from the WordPress root so it can load wp-config.php.
> It updates `home`/`siteurl`, and rewrites every option value that still
> contains the old origin. It only touches the database options, never your
> theme files.

---

## Part 4 — First-time setup (10 minutes)

1. **Homepage**
   - **Settings → Reading → Your homepage displays → A static page**.
   - Set the front page to a page named **Home** (the theme auto-creates it,
     or create one and assign it under Settings → Reading).

2. **Menus**
   - **Appearance → Menus → Create "Primary Menu"** with: Home, Jobs, About,
     Contact.
   - Assign it to the **Primary Menu** location.
   - The **Gov Jobs** link is added automatically to the header by the theme —
     it opens `https://bdgarmentscareer.com/govt.jobs` in a new tab.

3. **Add jobs**
   - **Jobs → Add New** — title, description, then fill the *Job Details*
     box (salary, deadline, experience, type).
   - Under **Jobs → Job Categories** add: Sewing Operator, Knit, Sweater,
     Textile, Quality, Merchandising…
   - Under **Jobs → Locations** add: Dhaka, Gazipur, Savar, Chattogram…

4. **Customize content**
   - **Appearance → Customize → Homepage Sections** — edit every headline,
     paragraph, stats, partners, testimonials.
   - Upload your **logo** under Site Identity.

---

## Part 5 — Portal URLs (already pre-configured)

The theme ships with your real domain pre-pointed:

| Purpose              | Constant in functions.php        | Default value                              |
|----------------------|----------------------------------|--------------------------------------------|
| Gov jobs portal link | `BDGC_GOV_PORTAL_URL`            | `https://bdgarmentscareer.com/govt.jobs`    |
| Apply API backend    | `BDGC_SERVICE_URL`               | `https://api.bdgarmentscareer.com`          |

To override on the server (e.g. if the subdomains change), add to
`wp-config.php`:

```php
define('BDGC_GOV_PORTAL_URL', 'https://bdgarmentscareer.com/govt.jobs');
define('BDGC_SERVICE_URL', 'https://api.bdgarmentscareer.com');
```

If you are **only** deploying the WordPress theme right now (no API/portal
yet), leave these as-is — the "Gov Jobs" navigation link still opens the
intended portal URL.

---

## Part 6 — Go live checklist

- [ ] 1. Theme installed + activated
- [ ] 2. `home` / `siteurl` = `https://www.bdgarmentscareer.com`
- [ ] 3. Reading settings → static front page = Home
- [ ] 4. Primary menu created and assigned
- [ ] 5. A few jobs/categories/locations added
- [ ] 6. Permalinks flushed (Settings → Permalinks → Save)
- [ ] 7. Site opens at https://www.bdgarmentscareer.com
- [ ] 8. Gov Jobs header link opens the gov portal

---

## Next steps (when you want the full "real project")

The theme is only the WordPress layer. The full product also includes a
Next.js job portal, a FastAPI + PostgreSQL backend (jobs, sign-up/sign-in,
user profile, application tracking, CV upload) and a separate government-jobs
website. Those deploy to app hosting (Vercel / Render / Railway / VPS) and
cross-link back to this theme via the constants above. Ask me for the
deployment setup for those next.