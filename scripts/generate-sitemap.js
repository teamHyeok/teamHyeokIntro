const fs = require('fs');
const path = require('path');
const apps = require('../assets/data/apps.js');

const baseUrl = 'https://teamhyeok.com';

const staticRoutes = ['/', '/magazine/', '/services/'];
const appRoutes = apps.map((app) => `/${app.page}`);
const routes = [...new Set([...staticRoutes, ...appRoutes])];

const today = new Date().toISOString().split('T')[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
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

console.log(`Generated sitemap.xml (${routes.length} routes) and robots.txt`);
