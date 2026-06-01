// Generates branded 1200x630 social-share (OG) cards for the home page and
// every app/service page, so links shared on social render a proper
// landscape card instead of a cropped square icon.
//
// Requires ImageMagick 7 (`magick`) and the source Gmarket Sans TTFs.
// Run: node scripts/generate-og-cards.js

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const os = require('os');

const apps = require('../assets/data/apps.js');
const rootDir = path.join(__dirname, '..');
const outDir = path.join(rootDir, 'assets/images/og');
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ogcard-'));

const FONT_DIR = '/Users/choechanhyeog/Library/Mobile Documents/com~apple~CloudDocs/Desktop/데스크탑 - Mac/myapp/DoneLog/DoneLog/DayWon/Fonts';
const FONT_BOLD = path.join(FONT_DIR, 'GmarketSansTTFBold.ttf');
const FONT_MED = path.join(FONT_DIR, 'GmarketSansTTFMedium.ttf');

const BG = '#08090c';
const SURFACE = '#0f1116';
const ACCENT = '#d4ff3f';
const TEXT = '#f4f5f6';
const MUTED = '#9499a3';
const W = 1200, H = 630;

if (!fs.existsSync(FONT_BOLD)) {
    console.error('Source font not found:', FONT_BOLD);
    process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const magick = (args) => execFileSync('magick', args, { stdio: ['pipe', 'pipe', 'pipe'] });

// Build the faint blueprint grid as a draw string (vertical + horizontal lines).
const gridDraw = () => {
    let d = 'stroke rgba(255,255,255,0.05) stroke-width 1 fill none ';
    for (let x = 0; x <= W; x += 60) d += `line ${x},0 ${x},${H} `;
    for (let y = 0; y <= H; y += 60) d += `line 0,${y} ${W},${y} `;
    return d.trim();
};

// Round an icon to a 240px tile with brand-radius corners.
const roundedIcon = (iconRel, size, radius, outPath) => {
    const src = path.join(rootDir, iconRel);
    magick([
        '(', src, '-background', SURFACE, '-flatten', '-resize', `${size}x${size}^`,
        '-gravity', 'center', '-extent', `${size}x${size}`, ')',
        '(', '-size', `${size}x${size}`, 'xc:none',
        '-draw', `roundrectangle 0,0 ${size - 1},${size - 1} ${radius},${radius}`, ')',
        '-alpha', 'set', '-compose', 'DstIn', '-composite', outPath,
    ]);
    return outPath;
};

// Wrapped caption block of a given pixel width.
const caption = (text, font, size, color, boxW, outPath) => {
    magick([
        '-background', 'none', '-fill', color, '-font', font,
        '-pointsize', String(size), '-size', `${boxW}x`,
        '-gravity', 'NorthWest', `caption:${text}`, outPath,
    ]);
    return outPath;
};

const baseCanvas = (outPath) => {
    magick([
        '-size', `${W}x${H}`, `xc:${BG}`,
        '-fill', 'none', '-draw', gridDraw(),
        '-fill', 'none', '-stroke', 'rgba(212,255,63,0.22)', '-strokewidth', '1.5',
        '-draw', `roundrectangle 28,28 ${W - 29},${H - 29} 18,18`,
        // top accent tick
        '-stroke', ACCENT, '-strokewidth', '4', '-draw', 'line 90,92 150,92',
        outPath,
    ]);
    return outPath;
};

const buildAppCard = (app) => {
    const base = path.join(tmpDir, `${app.slug}-base.png`);
    baseCanvas(base);

    const icon = roundedIcon(app.icon, 240, 40, path.join(tmpDir, `${app.slug}-icon.png`));
    const tag = caption(app.tagline, FONT_MED, 30, MUTED, 700, path.join(tmpDir, `${app.slug}-tag.png`));

    const badge = app.platform === 'Web' ? 'WEB SERVICE'
        : app.status === 'soon' ? 'COMING SOON' : 'iOS APP';

    const out = path.join(outDir, `${app.slug}.jpg`);
    magick([
        base,
        // label
        '-font', FONT_BOLD, '-pointsize', '24', '-fill', ACCENT, '-kerning', '6',
        '-annotate', '+90+150', 'TEAMHYEOK',
        // icon
        icon, '-geometry', '+90+260', '-compose', 'over', '-composite',
        // app name
        '-font', FONT_BOLD, '-pointsize', '76', '-fill', TEXT, '-kerning', '0',
        '-annotate', '+372+340', app.name,
        // tagline (pre-wrapped caption)
        tag, '-geometry', '+372+372', '-compose', 'over', '-composite',
        // category + badge row (bottom-left)
        '-font', FONT_MED, '-pointsize', '26', '-fill', MUTED,
        '-annotate', '+90+560', `${badge}  ·  ${app.groupLabel}`,
        // domain (bottom-right)
        '-font', FONT_BOLD, '-pointsize', '26', '-fill', ACCENT, '-gravity', 'SouthEast',
        '-annotate', '+70+58', 'teamhyeok.com',
        '-gravity', 'NorthWest',
        '-quality', '84', out,
    ]);
    return out;
};

const buildHomeCard = () => {
    const base = path.join(tmpDir, 'home-base.png');
    baseCanvas(base);

    const headline = caption('아이디어를\n25일 만에\n제품으로.', FONT_BOLD, 86, TEXT, 760, path.join(tmpDir, 'home-head.png'));

    // bottom strip of product icons
    const stripApps = apps.filter(a => a.icon && a.icon.endsWith('.jpg')).slice(0, 7);
    const stripIcons = stripApps.map((a, i) =>
        roundedIcon(a.icon, 92, 18, path.join(tmpDir, `home-strip-${i}.png`)));

    const args = [
        base,
        '-font', FONT_BOLD, '-pointsize', '26', '-fill', ACCENT, '-kerning', '6',
        '-annotate', '+90+150', 'TEAMHYEOK  ·  BUILD FAST. SHIP HARD.',
        headline, '-geometry', '+86+205', '-compose', 'over', '-composite',
    ];
    let x = 92;
    stripIcons.forEach((ic) => {
        args.push(ic, '-geometry', `+${x}+478`, '-compose', 'over', '-composite');
        x += 108;
    });
    args.push(
        '-font', FONT_BOLD, '-pointsize', '26', '-fill', ACCENT, '-gravity', 'SouthEast',
        '-annotate', '+70+58', 'teamhyeok.com',
        '-gravity', 'NorthWest',
        '-quality', '86', path.join(outDir, 'home.jpg'),
    );
    magick(args);
    return path.join(outDir, 'home.jpg');
};

const buildMagazineCard = () => {
    const base = path.join(tmpDir, 'magazine-base.png');
    baseCanvas(base);
    const headline = caption('팀혁\n매거진', FONT_BOLD, 96, TEXT, 700, path.join(tmpDir, 'mag-head.png'));
    magick([
        base,
        '-font', FONT_BOLD, '-pointsize', '26', '-fill', ACCENT, '-kerning', '6',
        '-annotate', '+90+150', 'TEAMHYEOK  ·  INSPIRATION MAGAZINE',
        headline, '-geometry', '+86+225', '-compose', 'over', '-composite',
        '-font', FONT_MED, '-pointsize', '32', '-fill', MUTED,
        '-annotate', '+92+560', '제품을 만들며 배운 것들의 솔직한 기록.',
        '-font', FONT_BOLD, '-pointsize', '26', '-fill', ACCENT, '-gravity', 'SouthEast',
        '-annotate', '+70+58', 'teamhyeok.com',
        '-gravity', 'NorthWest',
        '-quality', '86', path.join(outDir, 'magazine.jpg'),
    ]);
    return path.join(outDir, 'magazine.jpg');
};

const target = process.argv[2];
let made = [];
if (target && target !== 'all') {
    if (target === 'home') made.push(buildHomeCard());
    else if (target === 'magazine') made.push(buildMagazineCard());
    else {
        const app = apps.find(a => a.slug === target);
        if (!app) { console.error('no app', target); process.exit(1); }
        made.push(buildAppCard(app));
    }
} else {
    made.push(buildHomeCard());
    made.push(buildMagazineCard());
    apps.forEach(a => made.push(buildAppCard(a)));
}

fs.rmSync(tmpDir, { recursive: true, force: true });
made.forEach(m => console.log('wrote', path.relative(rootDir, m)));
