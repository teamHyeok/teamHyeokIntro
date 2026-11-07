// Generates, from assets/data/apps.js:
//  1. /services/<slug>/index.html for every app with `detail: true`
//     (title/meta/canonical/OG + JSON-LD app and BreadcrumbList).
//  2. The plain-HTML product list inside index.html (between the
//     static-app-list markers), so crawlers that don't run JavaScript can
//     follow a link to every product. main.js draws the same cards over it.
//  3. The home page counts (출시한 제품 · App Store 앱 · 웹 서비스, the
//     data-stat spans in index.html).
// Run: node scripts/generate-app-pages.js
const fs = require('fs');
const path = require('path');
const apps = require('../assets/data/apps.js');

const baseUrl = 'https://teamhyeok.com';
const rootDir = path.join(__dirname, '..');

const esc = (s) =>
    String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

const storeUrl = (app) => `https://apps.apple.com/kr/app/id${app.appStoreId}`;
// Public Google Play listing (`androidUrl` is the older name for the same link).
const playStoreUrl = (app) => app.playUrl || app.androidUrl || '';
// 'Web · iOS' -> ['Web', 'iOS']
const platformList = (app) =>
    String(app.platform || 'iOS')
        .split('·')
        .map((p) => p.trim())
        .filter(Boolean);
const developers = (app) => (app.developer && app.developer.length ? app.developer : ['최찬혁']);
const won = (n) => `₩${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
// JSON-LD body: escape "<" so a string can never close the <script> early.
const ldJson = (obj) => JSON.stringify(obj, null, 2).replace(/</g, '\\u003c');

// Read intrinsic pixel dimensions from PNG/JPEG/WebP headers (no deps) so
// generated <img> get width/height attributes and don't cause layout shift.
const imageSize = (rel) => {
    try {
        const buf = fs.readFileSync(path.join(rootDir, rel));
        if (buf.length > 24 && buf.toString('ascii', 1, 4) === 'PNG') {
            return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
        }
        if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
            const fmt = buf.toString('ascii', 12, 16);
            if (fmt === 'VP8 ') {
                return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
            }
            if (fmt === 'VP8L') {
                const bits = buf.readUInt32LE(21);
                return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
            }
            if (fmt === 'VP8X') {
                const w = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
                const h = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
                return { w, h };
            }
        }
        if (buf[0] === 0xff && buf[1] === 0xd8) {
            let off = 2;
            while (off < buf.length - 8) {
                if (buf[off] !== 0xff) { off++; continue; }
                const marker = buf[off + 1];
                if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
                    return { h: buf.readUInt16BE(off + 5), w: buf.readUInt16BE(off + 7) };
                }
                off += 2 + buf.readUInt16BE(off + 2);
            }
        }
    } catch (e) {
        /* missing/unsupported file → omit dimensions */
    }
    return null;
};

const dimAttr = (rel) => {
    const d = imageSize(rel);
    return d ? ` width="${d.w}" height="${d.h}"` : '';
};

// eyebrow label + a plain Korean section heading; `pad` = indentation of <header>
const sectionHead = (eyebrow, heading, pad) => `<header class="detail__head">
${pad}    <span class="section__eyebrow">${eyebrow}</span>
${pad}    <h2 class="detail__h2">${esc(heading)}</h2>
${pad}</header>`;

const renderPage = (app) => {
    const url = `${baseUrl}/${app.page}`;
    const iconRel = `../../${app.icon}`;
    const iconAbs = `${baseUrl}/${app.icon}`;
    const ogAbs = `${baseUrl}/assets/images/og/${app.slug}.jpg`;
    const isSoon = app.status === 'soon';
    const title = app.seoTitle || `${app.name} — 팀혁 TeamHyeok`;
    const desc = app.metaDescription || app.description;
    const about = Array.isArray(app.longDescription) && app.longDescription.length
        ? app.longDescription
        : [app.description];
    const platforms = platformList(app);
    const shotList = Array.isArray(app.shots) ? app.shots : [];
    const shotAlt = (i) => (app.shotAlts && app.shotAlts[i]) || `${app.name} 스크린샷 ${i + 1}`;
    const featureList = Array.isArray(app.features) ? app.features : [];
    const play = playStoreUrl(app);

    const galleryMod = app.shotsLandscape ? ' shot-gallery--wide' : shotList.length > 2 ? ' shot-gallery--row' : '';
    const shots = shotList.length
        ? `
            <section class="detail__shots" data-animate>
                ${sectionHead('Screenshots', `${app.name} 화면 미리 보기`, ' '.repeat(16))}
                <div class="shot-gallery${galleryMod}">
${shotList
    .map(
        (s, i) =>
            `                    <figure class="shot"><img src="../../${s}" alt="${esc(shotAlt(i))}"${dimAttr(s)} loading="lazy" decoding="async"></figure>`
    )
    .join('\n')}
                </div>
            </section>`
        : '';

    const features = featureList.length
        ? `
                <div class="detail__features">
                    ${sectionHead('Features', '주요 기능', ' '.repeat(20))}
                    <ul class="feature-list">
${featureList.map((f) => `                        <li>${esc(f)}</li>`).join('\n')}
                    </ul>
                </div>`
        : '';

    const badges = [
        ...platforms.map(
            (p) => `<span class="detail__platform detail__platform--${esc(p.toLowerCase())}">${esc(p)}</span>`
        ),
        `<span class="detail__group">${esc(app.groupLabel)}</span>`,
        `<span class="detail__dev"><span aria-hidden="true">// </span>개발 ${esc(developers(app).join(' · '))}</span>`
    ].join('\n                        ');

    // Buttons: the main way to use the product comes first (the site for
    // web-first products, the store otherwise).
    const buttons = [];
    if (!isSoon) {
        const webFirst = platforms[0] === 'Web';
        const site = app.website ? { href: app.website, label: `${app.websiteLabel || '사이트 방문'} →` } : null;
        if (site && webFirst) buttons.push(site);
        if (app.appStoreId) {
            buttons.push({
                href: storeUrl(app),
                label: app.price ? `App Store에서 구입 · ${won(app.price)} →` : 'App Store에서 다운로드 →'
            });
        }
        if (play) buttons.push({ href: play, label: 'Google Play에서 다운로드 →' });
        if (site && !webFirst) buttons.push(site);
    }
    const action = isSoon
        ? '<span class="cta-button cta-button--disabled">준비중 · 곧 출시</span>'
        : buttons
              .map(
                  (b, i) =>
                      `<a class="${i ? 'ghost-button' : 'cta-button'}" href="${esc(b.href)}" target="_blank" rel="noopener">${esc(b.label)}</a>`
              )
              .join('\n                        ');

    // same @id as the Organization in index.html, so both pages describe one team
    const org = { '@type': 'Organization', '@id': `${baseUrl}/#organization`, name: '팀혁 TeamHyeok', url: `${baseUrl}/` };
    const hasWeb = platforms.includes('Web');
    const jsonld = {
        '@context': 'https://schema.org',
        '@type': !hasWeb ? 'MobileApplication' : platforms.length > 1 ? 'SoftwareApplication' : 'WebApplication',
        name: app.name,
        operatingSystem: platforms.join(', '),
        applicationCategory: app.category,
        description: app.description,
        url,
        image: iconAbs,
        author: org,
        publisher: org
    };
    if (shotList.length) jsonld.screenshot = shotList.map((s) => `${baseUrl}/${s}`);
    const sameAs = [];
    if (!isSoon) {
        if (app.appStoreId) {
            jsonld.downloadUrl = storeUrl(app);
            sameAs.push(storeUrl(app));
        }
        if (play) sameAs.push(play);
        jsonld.offers = { '@type': 'Offer', price: String(app.price || 0), priceCurrency: 'KRW' };
    }
    if (app.website) sameAs.push(app.website);
    if (sameAs.length) jsonld.sameAs = sameAs;

    const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: '팀혁', item: `${baseUrl}/` },
            { '@type': 'ListItem', position: 2, name: '서비스', item: `${baseUrl}/#apps` },
            { '@type': 'ListItem', position: 3, name: app.name, item: url }
        ]
    };

    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#08090c">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}">
    <meta name="keywords" content="${esc(app.keywords)}">
    <link rel="canonical" href="${url}">
    <meta name="robots" content="index, follow">
    <link rel="icon" type="image/svg+xml" href="../../favicon.svg">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <meta property="og:type" content="website">
    <meta property="og:title" content="${esc(app.name)} · 팀혁">
    <meta property="og:description" content="${esc(app.tagline)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${ogAbs}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="팀혁 TeamHyeok">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(app.name)} · 팀혁">
    <meta name="twitter:description" content="${esc(app.tagline)}">
    <meta name="twitter:image" content="${ogAbs}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" as="font" type="font/woff2" href="../../assets/fonts/GmarketSansBold.woff2" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap">
    <link rel="stylesheet" href="../../assets/css/main.css">
    <script type="application/ld+json">
${ldJson(jsonld)}
    </script>
    <script type="application/ld+json">
${ldJson(breadcrumb)}
    </script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2370970936034063"
        crossorigin="anonymous"></script>
</head>
<body>
    <div class="aurora aurora--one"></div>
    <div class="aurora aurora--two"></div>

    <header class="top-bar">
        <div class="container top-bar__inner">
            <a href="../../" class="brand" aria-label="팀혁 홈">TEAMHYEOK</a>
            <nav class="nav" aria-label="Primary">
                <a href="../../#apps">Works</a>
                <a href="../../#about">About</a>
            </nav>
        </div>
    </header>

    <main class="detail">
        <div class="container">
            <nav class="detail__crumbs" aria-label="현재 위치">
                <ol>
                    <li><a href="../../">팀혁</a></li>
                    <li><a href="../../#apps">서비스</a></li>
                    <li aria-current="page">${esc(app.name)}</li>
                </ol>
            </nav>

            <section class="detail__hero" data-animate>
                <span class="detail__icon">
                    <img src="${iconRel}" alt="${esc(app.name)} 아이콘"${dimAttr(app.icon)}>
                </span>
                <div class="detail__heading">
                    <div class="detail__badges">
                        ${badges}
                    </div>
                    <h1 class="detail__title">${esc(app.name)}</h1>
                    <p class="detail__tagline">${esc(app.tagline)}</p>
                    <div class="detail__actions">
                        ${action}
                    </div>
                </div>
            </section>
${shots}
            <section class="detail__body" data-animate>
                <div class="detail__about">
                    ${sectionHead('About', `${app.name} 소개`, ' '.repeat(20))}
${about.map((p) => `                    <p>${esc(p)}</p>`).join('\n')}
                </div>${features}
            </section>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container site-footer__inner">
            <p>대장 최찬혁 · &copy; <span id="currentYear"></span> 팀혁(TeamHyeok). All rights reserved.</p>
            <a class="footer-link" href="../../">팀혁 홈으로</a>
        </div>
    </footer>

    <script src="../../assets/js/main.js"></script>
    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "55b749929b84457693b15d46b55032e4"}'></script><!-- End Cloudflare Web Analytics -->
</body>
</html>
`;
};

// ---- home page: the same cards main.js draws, as plain HTML ----
const LIST_START = '<!-- static-app-list:start';
const LIST_END = '<!-- static-app-list:end -->';

const homeCard = (app, index) => {
    const isSoon = app.status === 'soon';
    const external = app.external || /^https?:\/\//.test(app.page);
    const pills = platformList(app).map(
        (p) => `<span class="app-card__platform app-card__platform--${p === 'iOS' ? 'ios' : 'web'}">${esc(p)}</span>`
    );
    if (app.android) pills.push('<span class="app-card__platform app-card__platform--android">Android</span>');
    const cta = isSoon ? '준비중 · 미리보기 →' : app.platform === 'Web' ? '사이트 방문 →' : '자세히 보기 →';
    const ind = '                    ';
    return [
        `<a class="app-card${isSoon ? ' app-card--soon' : ''}" href="${esc(app.page)}" data-group="${esc(app.group)}"${external ? ' target="_blank" rel="noopener"' : ''}>`,
        '    <div class="app-card__top">',
        `        <span class="app-card__icon"><img src="${esc(app.icon)}" alt="${esc(app.name)} 아이콘"${dimAttr(app.icon)} loading="lazy"></span>`,
        '        <div class="app-card__tags">',
        `            <span class="app-card__index">// ${String(index + 1).padStart(2, '0')}</span>`,
        ...pills.map((p) => `            ${p}`),
        `            <span class="app-card__group">${esc(app.groupLabel)}</span>`,
        '        </div>',
        '    </div>',
        `    <h3 class="app-card__title">${esc(app.name)}</h3>`,
        `    <p class="app-card__description">${esc(app.tagline)}</p>`,
        `    <span class="app-card__dev">${esc(developers(app).join(' · '))}</span>`,
        `    <span class="app-card__cta">${cta}</span>`,
        '</a>'
    ]
        .map((line) => ind + line)
        .join('\n');
};

// ---- home page: the "숫자로 보는 팀혁" counts, from the same list ----
// index.html marks each count with data-stat. The number goes into the text as
// well as data-count, so readers and crawlers without JavaScript see it
// (main.js resets it to 0 and counts up when it scrolls into view).
const homeStats = () => {
    const released = apps.filter((app) => app.status !== 'soon');
    return {
        released: released.length,
        appstore: released.filter((app) => app.appStoreId).length,
        web: released.filter((app) => platformList(app).includes('Web')).length
    };
};

const writeHome = () => {
    const file = path.join(rootDir, 'index.html');
    let html = fs.readFileSync(file, 'utf8');
    const start = html.indexOf(LIST_START);
    const startEnd = start < 0 ? -1 : html.indexOf('-->', start) + 3;
    const end = html.indexOf(LIST_END);
    if (start < 0 || end < startEnd) {
        console.warn('index.html: static-app-list markers not found, home list not updated');
    } else {
        const endLine = html.lastIndexOf('\n', end) + 1; // keep the end marker's indentation
        html = `${html.slice(0, startEnd)}\n${apps.map(homeCard).join('\n')}\n${html.slice(endLine)}`;
        console.log(`updated index.html static product list (${apps.length} products)`);
    }

    const stats = homeStats();
    const written = new Set();
    html = html.replace(/<span data-stat="([a-z]+)" data-count="\d+">\d*<\/span>/g, (match, key) => {
        if (!(key in stats)) return match;
        written.add(key);
        return `<span data-stat="${key}" data-count="${stats[key]}">${stats[key]}</span>`;
    });
    const missing = Object.keys(stats).filter((key) => !written.has(key));
    if (missing.length) console.warn(`index.html: no data-stat count for ${missing.join(', ')}, not updated`);
    else console.log(`updated index.html counts (${Object.entries(stats).map(([k, v]) => `${k} ${v}`).join(', ')})`);

    fs.writeFileSync(file, html);
};

const targets = apps.filter((app) => app.detail);
targets.forEach((app) => {
    const dir = path.join(rootDir, app.page);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderPage(app));
    console.log(`generated ${app.page}index.html`);
});

console.log(`Generated ${targets.length} app detail pages.`);
writeHome();
