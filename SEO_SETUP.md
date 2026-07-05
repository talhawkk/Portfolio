# SEO Deployment Checklist — talhawkk.me

> All code-level SEO is implemented. These are the **manual post-deploy steps** you must do on the server and external platforms to complete the setup.

---

## 1. Run the Management Commands (Server)

After deploying the `main` branch:

```bash
cd /var/www/portfolio
python manage.py migrate              # Apply SEO field migrations + content refresh
python manage.py generate_og_image    # Create OG image + favicon set
python manage.py collectstatic        # Collect new static assets (icons, OG image)
sudo systemctl restart gunicorn       # Restart app
```

---

## 2. Nginx — www → non-www Redirect (Server)

Add this block to your nginx config (before the main `server` block for `talhawkk.me`):

```nginx
# Redirect www to non-www (canonical)
server {
    listen 80;
    listen 443 ssl;
    server_name www.talhawkk.me;
    return 301 https://talhawkk.me$request_uri;
}
```

Then reload: `sudo nginx -t && sudo systemctl reload nginx`

---

## 3. Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. **Add property:** `https://talhawkk.me` (choose "Domain" or "URL prefix")
3. **Verify** — easiest: add a DNS TXT record (it'll give you the exact value)
   - Or use the HTML meta tag method: add `google-site-verification` meta tag in SiteConfiguration and the template will pick it up
4. **Submit sitemap:** once verified, go to Sitemaps → add `https://talhawkk.me/sitemap.xml`
5. **Request indexing** for key URLs: home, about, projects, blog

---

## 4. Bing Webmaster Tools

1. Go to [bing.com/webmasters](https://www.bing.com/webmasters)
2. Add `https://talhawkk.me`
3. Verify via DNS or meta tag
4. Submit sitemap: `https://talhawkk.me/sitemap.xml`

---

## 5. HTTPS Confirmation

- Ensure SSL certificate is active and `https://talhawkk.me` loads without warnings
- The HSTS header is now enabled in production — this tells browsers to always use HTTPS
- If HTTPS is NOT yet set up, set `SECURE_SSL_REDIRECT=False` and comment out HSTS in `.env`:
  ```
  SECURE_SSL_REDIRECT=False
  SECURE_HSTS_SECONDS=0
  SECURE_HSTS_PRELOAD=False
  ```

---

## 6. Test Everything

- **Rich Results Test:** [search.google.com/test/rich-results](https://search.google.com/test/rich-results) — paste `https://talhawkk.me` to validate Person + WebSite JSON-LD
- **PageSpeed Insights:** [pagespeed.web.dev](https://pagespeed.web.dev) — check Core Web Vitals
- **Open Graph checker:** [opengraph.xyz](https://opengraph.xyz) — paste URLs to verify social share previews
- **robots.txt:** visit `https://talhawkk.me/robots.txt` — should show sitemap link
- **sitemap.xml:** visit `https://talhawkk.me/sitemap.xml` — should list all pages + projects + blog posts
- **Manifest:** visit `https://talhawkk.me/manifest.json` — should return JSON with site name/icons

---

## 7. Social Profile Backlinks (Off-Page SEO)

These help Google establish the entity "Talha Abbas" = `talhawkk.me`:

- **GitHub** (`github.com/talhawkk`): add `https://talhawkk.me` to your bio/website field
- **LinkedIn** (`linkedin.com/in/talhawkk`): add portfolio URL to your profile
- **X/Twitter** (`x.com/talhaabbasali5`): add link in your profile
- Any other profiles (Stack Overflow, dev.to, etc.) — link back to `talhawkk.me`

---

## 8. Google Knowledge Panel (Manual Trigger)

If a Knowledge Panel doesn't appear after a few weeks:
1. Go to [knowledge-panel.google.com](https://knowledge-panel.google.com)
2. Claim / suggest changes to your panel
3. Make sure the Person schema on your site matches your profiles exactly

---

## 9. Ongoing Maintenance

- **Add OG images** per project/blog post via Django Admin (SEO & Social section)
- **Upload a profile photo** to SiteConfiguration — this becomes the Person schema `image` + OG fallback
- **Keep sitemap fresh** — new projects/posts automatically appear in `sitemap.xml`
- **Monitor Search Console** weekly for indexing issues, crawl errors, and performance data

---

## What Was Implemented (Code Summary)

| Area | What was added |
|------|----------------|
| **Settings** | `SITE_URL`, `SITE_NAME` constants; `django.contrib.sitemaps`, `django.contrib.redirects`; HSTS activated |
| **Sitemap** | `sitemap.xml` with static pages + projects + blog posts |
| **robots.txt** | Blocks `/admin/` and `/api/`, points to sitemap |
| **Manifest** | PWA manifest with teal theme color |
| **Meta tags** | Full OG, Twitter Cards, canonical URLs, theme-color, robots directives |
| **JSON-LD** | Person, WebSite, BreadcrumbList, Article schemas |
| **Models** | `og_image`, `meta_description`, `location`, `twitter_handle`, `canonical_domain` |
| **Content** | "Talha Abbas Ali" introduced in bio and meta description |
| **HTML** | Heading hierarchy fixed (H1→H2), `<address>` on contact, lazy loading |
| **Assets** | Branded OG image + full favicon/icon set (Pillow generator) |
| **Admin** | SEO & Social fieldset on all relevant models |
