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

const renderPage = (app) => {
    const url = `${baseUrl}/${app.page}`;
    const iconRel = `../../${app.icon}`;
    const iconAbs = `${baseUrl}/${app.icon}`;
    const isSoon = app.status === 'soon';
    const title = `${app.name} — 팀혁 TeamHyeok`;
    const desc = app.description;

    const features = app.features
        .map((f) => `                        <li>${esc(f)}</li>`)
        .join('\n');

    const shots = Array.isArray(app.shots) && app.shots.length
        ? `
            <section class="detail__shots" data-animate>
                <span class="section__eyebrow">Screenshots</span>
                <div class="shot-gallery${app.shotsLandscape ? ' shot-gallery--wide' : ''}">
${app.shots
    .map(
        (s, i) =>
            `                    <figure class="shot"><img src="../../${s}" alt="${esc(app.name)} 스크린샷 ${i + 1}"${dimAttr(s)} loading="lazy"></figure>`
    )
    .join('\n')}
                </div>
            </section>`
        : '';

    const jsonld = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: app.name,
        operatingSystem: 'iOS',
        applicationCategory: app.category,
        description: desc,
        url,
        image: iconAbs,
        author: {
            '@type': 'Organization',
            name: '팀혁 TeamHyeok',
            url: baseUrl
        }
    };
    if (!isSoon) {
        jsonld.downloadUrl = storeUrl(app);
        jsonld.offers = { '@type': 'Offer', price: '0', priceCurrency: 'KRW' };
    }

    const action = isSoon
        ? '<span class="cta-button cta-button--disabled">준비중 · 곧 출시</span>'
        : `<a class="cta-button" href="${storeUrl(app)}" target="_blank" rel="noopener">App Store에서 다운로드 →</a>`;

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
    <meta property="og:image" content="${iconAbs}">
    <meta property="og:site_name" content="팀혁 TeamHyeok">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(app.name)} · 팀혁">
    <meta name="twitter:description" content="${esc(app.tagline)}">
    <meta name="twitter:image" content="${iconAbs}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap">
    <link rel="stylesheet" href="../../assets/css/main.css">
    <script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
    </script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2370970936034063"
        crossorigin="anonymous"></script>
</head>
<body>
    <div class="aurora aurora--one"></div>
    <div class="aurora aurora--two"></div>

    <header class="top-bar">
        <div class="container top-bar__inner">
            <a href="../../index.html" class="brand" aria-label="팀혁 홈">TEAMHYEOK</a>
            <nav class="nav" aria-label="Primary">
                <a href="../../index.html#apps">Works</a>
                <a href="../../index.html#about">About</a>
            </nav>
        </div>
    </header>

    <main class="detail">
        <div class="container">
            <a class="detail__back" href="../../index.html#apps">← 모든 제품 보기</a>

            <section class="detail__hero" data-animate>
                <span class="detail__icon">
                    <img src="${iconRel}" alt="${esc(app.name)} 아이콘"${dimAttr(app.icon)}>
                </span>
                <div class="detail__heading">
                    <div class="detail__badges">
                        <span class="detail__platform">${app.platform}</span>
                        <span class="detail__group">${esc(app.groupLabel)}</span>
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
                    <span class="section__eyebrow">About</span>
                    <p>${esc(desc)}</p>
                </div>
                <div class="detail__features">
                    <span class="section__eyebrow">Features</span>
                    <ul class="feature-list">
${features}
                    </ul>
                </div>
            </section>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container site-footer__inner">
            <p>대표 최찬혁 · &copy; <span id="currentYear"></span> 팀혁(TeamHyeok). All rights reserved.</p>
            <a class="footer-link" href="../../index.html">팀혁 홈으로</a>
        </div>
    </footer>

    <script src="../../assets/js/main.js"></script>
</body>
</html>
`;
};

const targets = apps.filter((app) => app.detail);
targets.forEach((app) => {
    const dir = path.join(rootDir, app.page);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderPage(app));
    console.log(`generated ${app.page}index.html`);
});

console.log(`Generated ${targets.length} app detail pages.`);
