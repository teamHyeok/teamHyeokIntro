const fs = require('fs');
const path = require('path');

const baseUrl = 'https://blackwhitemap.com';
const routes = [
  '/',
  '/magazine/',
  '/services/',
  '/services/nyangnyang-tuner/',
  '/services/jiujitsu/',
  '/services/self-affirm/',
];

const today = new Date().toISOString().split('T')[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Note: Hash-based routing (e.g. #/path) offers limited SEO value. Prefer path-based routing with a 404.html fallback on GitHub Pages. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
`;

const rootDir = path.join(__dirname, '..');
fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemap.trim() + '\n');
fs.writeFileSync(path.join(rootDir, 'robots.txt'), robots);

console.log('Generated sitemap.xml and robots.txt');
