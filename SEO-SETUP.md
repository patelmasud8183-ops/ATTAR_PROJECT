# MM ATTAR SEO setup

1. Replace `https://YOUR-DOMAIN.example` in `sitemap.xml` and `robots.txt` with the deployed HTTPS domain.
2. Deploy `index.html`, `app.js`, `style.css`, `sitemap.xml`, and `robots.txt` at the site root.
3. In Google Search Console, add the domain property and complete DNS verification.
4. Submit `https://your-domain.example/sitemap.xml` under Sitemaps.
5. Use URL Inspection to request indexing for the home page, category pages, and important brand/product URLs.

The app updates titles, descriptions, canonical metadata, and Product JSON-LD as users open category, brand, and product views. Firebase security rules still control private account, order, and admin data; SEO metadata must never expose customer information.
