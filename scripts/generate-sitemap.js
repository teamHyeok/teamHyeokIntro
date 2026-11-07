const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const apps = require('../assets/data/apps.js');

const baseUrl = 'https://teamhyeok.com';
const rootDir = path.join(__dirname, '..');

const staticRoutes = ['/', '/magazine/'];
const appRoutes = apps
  .filter((app) => !app.external && !/^https?:\/\//.test(app.page))
  .map((app) => `/${app.page}`);
const routes = [...new Set([...staticRoutes, ...appRoutes])];

// Korea time: toISOString() alone is UTC and gives yesterday's date before 09:00 KST.
const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];

// lastmod = the day the page's source last changed: the date of the last commit
// that touched it, or today when it is new or edited but not committed yet.
const routeSources = (route) =>
  route === '/' ? ['index.html']
    : route === '/magazine/' ? ['magazine/', 'assets/data/magazine.json']
    : [route.slice(1)];
const git = (args) =>
  execFileSync('git', args, {
    cwd: rootDir,
    env: { ...process.env, TZ: 'Asia/Seoul' },
    stdio: ['ignore', 'pipe', 'ignore'],
  })
    .toString()
    .trim();
const lastmod = (route) => {
  const files = routeSources(route);
  try {
    if (git(['status', '--porcelain', '--', ...files])) return today;
    return git(['log', '-1', '--format=%cd', '--date=format-local:%Y-%m-%d', '--', ...files]) || today;
  } catch (e) {
    return today; // no git here (e.g. a plain copy of the site)
  }
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <lastmod>${lastmod(route)}</lastmod>\n  </url>`
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /admin/
Sitemap: ${baseUrl}/sitemap.xml
`;

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemap.trim() + '\n');
fs.writeFileSync(path.join(rootDir, 'robots.txt'), robots);

console.log(`Generated sitemap.xml (${routes.length} routes) and robots.txt`);
