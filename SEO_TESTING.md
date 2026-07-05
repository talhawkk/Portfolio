# SEO Testing Guide for talhawkk.me

## 🧪 Phase 1: Local Testing (Django)

### 1.1 Check Meta Tags & JSON-LD
```bash
cd D:/Work/Portfolio
python manage.py runserver
```

Open browser and test these URLs:

**Homepage (https://127.0.0.1:8000/)**
```bash
# View Page Source
# Press Ctrl+U and search for:
- <title>Talha Abbas | Software Engineer</title>
- <meta name="description">
- <meta name="keywords">
- <meta property="og:title">
- <meta property="og:description">
- <meta property="og:image">
- <meta property="og:url">
- <link rel="canonical">
- <script type="application/ld+json">"@type": "Person"
- <script type="application/ld+json">"@type": "WebSite"
- <script type="application/ld+json">"@type": "BreadcrumbList"
```

**About Page (https://127.0.0.1:8000/about/)**
```bash
# Check for:
- H1="Talha Abbas"
- alternateName: "Talha Abbas Ali", "talhawkk"
- WebSite schema reference
```

**Project Page (https://127.0.0.1:8000/projects/{slug}/)**
```bash
# Check for:
- Article schema with mainEntityOfPage
- BreadcrumbList schema
- meta description and OG image
```

### 1.2 Verify Sitemap
```bash
curl http://127.0.0.1:8000/sitemap.xml
# Should return XML sitemap with static, projects, blog sections
```

### 1.3 Verify Robots.txt
```bash
curl http://127.0.0.1:8000/robots.txt
# Should point to sitemap.xml
```

### 1.4 Verify Manifest
```bash
curl http://127.0.0.1:8000/manifest.json
# Should return JSON with site name, theme-color
```

---

## 🌐 Phase 2: Online SEO Tools

### 2.1 Google Rich Results Test
**URL:** https://search.google.com/test/rich-results
- Test: `https://127.0.0.1:8000/` and `https://127.0.0.1:8000/about/`
- Expected: ✓ Person entity, ✓ WebSite schema, ✓ BreadcrumbList

### 2.2 Google PageSpeed Insights
**URL:** https://pagespeed.web.dev/
- Test: `https://127.0.0.1:8000/`
- Target scores: Lighthouse >= 90

### 2.3 Schema.org Validator
**URL:** https://validator.schema.org/
- Test: View Page Source and paste the JSON-LD script

### 2.4 Meta Tag Tester
**URL:** https://www.metatags.io/
- Test: `https://127.0.0.1:8000/`
- Verify all meta tags are correct

---

## 🔍 Phase 3: Google Search Console

### 3.1 Setup GSC
1. Go to https://search.google.com/search-console
2. Add property: `https://talhawkk.me`
3. Verify ownership (DNS TXT record or HTML tag)

### 3.2 Submit Sitemap
1. Go to **Sitemaps** section
2. Submit: `https://talhawkk.me/sitemap.xml`

### 3.3 Request Indexing
- Test URL inspection for key pages:
  - `https://talhawkk.me/`
  - `https://talhawkk.me/about/`
  - `https://talhawkk.me/projects/`
  - Your project URLs

---

## 📱 Phase 4: Mobile Testing

### 4.1 Mobile Friendly Test
**URL:** https://search.google.com/test/mobile-friendly
- Test: `https://127.0.0.1:8000/`

### 4.2 Lighthouse CI
```bash
npx lighthouse https://127.0.0.1:8000 --view
```

---

## ✅ SEO Checklist

### Meta Tags
- [ ] Title tag present and descriptive
- [ ] Meta description (150-160 chars)
- [ ] Meta keywords (optional but present)
- [ ] Open Graph title and description
- [ ] Open Graph image (1200×630)
- [ ] Open Graph URL matches canonical
- [ ] Twitter Card tags
- [ ] Canonical URL set
- [ ] Theme-color meta tag

### Structured Data (JSON-LD)
- [ ] Person schema with full name
- [ ] Person schema alternateName: "Talha Abbas Ali", "talhawkk"
- [ ] WebSite schema with potentialAction
- [ ] BreadcrumbList on detail pages
- [ ] Article schema on project/blog pages
- [ ] Schema URLs are valid

### Technical SEO
- [ ] Sitemap.xml accessible
- [ ] Robots.txt points to sitemap
- [ ] SSL certificate present (https://)
- [ ] HSTS headers enabled
- [ ] DNS prefetch configured
- [ ] Clean URLs (no ?page=1, /blog/post/ vs /blog/1/)
- [ ] Proper HTTP status codes (200, 301, 404)

### Content
- [ ] H1 contains main keyword
- [ ] Heading hierarchy (H1→H2→H3)
- [ ] Alt tags on all images
- [ ] Descriptive URLs
- [ ] Unique meta descriptions per page
- [ ] Name variants in text content

### Performance
- [ ] Page load time < 3 seconds
- [ ] Lighthouse Performance score >= 90
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

### Accessibility
- [ ] Semantic HTML tags
- [ ] Contrast ratios WCAG AA
- [ ] ARIA labels where needed
- [ ] Focus states visible
- [ ] Alt text on all images

---

## 🎯 Name Ranking Targets

### Keywords to Monitor:
1. "Talha Abbas"
2. "talhawkk"
3. "Talha Abbas Ali"

### Tools to Use:
1. **Google**: Search each keyword
2. **Ahrefs**: Keyword tracking (if you have account)
3. **Serpstat**: Monitor ranking positions
4. **Ubersuggest**: Competitor analysis

---

## 📊 Expected Results (30-90 days)

### Week 1-2:
- ✅ Indexing: All pages indexed in GSC
- ✅ Sitemap accepted
- ✅ No crawl errors

### Month 1-2:
- 📈 Keywords "Talha Abbas" and "talhawkk" appearing in top 50
- 📈 JSON-LD validated by Google
- 📈 Improved rich results in Google

### Month 3:
- 🏆 Keywords in top 10-20
- 🏆 Featured snippets appearing
- 🏆 Knowledge graph populated

### Month 6:
- 🥇 Target: Rank #1 for all three keywords
- 🥇 AI Overview populated for name searches
- 🥇 Multiple organic backlinks

---

## 🚨 Common Issues & Fixes

### Issue: Pages not indexing
**Fix:**
```bash
# Submit sitemap in GSC
# Request indexing for key URLs
# Check robots.txt allows crawling
```

### Issue: JSON-LD validation errors
**Fix:**
- Validate at https://validator.schema.org
- Ensure no syntax errors
- Check URL formatting

### Issue: Schema not appearing in search
**Fix:**
- Wait 7-14 days after indexing
- Verify structured data in GSC
- Ensure proper page indexing

---

## 📝 Quick Test Commands

```bash
# Test homepage
curl -I https://127.0.0.1:8000/

# Test sitemap
curl https://127.0.0.1:8000/sitemap.xml

# Test robots
curl https://127.0.0.1:8000/robots.txt

# Test manifest
curl https://127.0.0.1:8000/manifest.json

# Check response headers
curl -I https://127.0.0.1:8000/
```

---

## 🎉 Success Criteria

When you see these, your SEO is working:

1. ✅ Google Rich Results Test shows ✓ for Person, WebSite, Breadcrumb
2. ✅ All pages indexed in Search Console
3. ✅ Sitemap submitted and accepted
4. ✅ Keywords "Talha Abbas", "talhawkk", "Talha Abbas Ali" appear in results
5. ✅ Knowledge graph snippet appears in Google
6. ✅ AI Overview includes your name on search
7. ✅ Rich snippet in search results (e.g., review stars, author photo)
