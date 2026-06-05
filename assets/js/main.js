document.documentElement.classList.add('has-js');

const loadingScreen = document.querySelector('.loading-screen');
const revealOverlay = document.querySelector('.reveal-overlay');
const pageFrame = document.querySelector('.page-frame');
let animateObserver;

const removeLoadingScreen = () => {
    if (loadingScreen && loadingScreen.parentElement) {
        loadingScreen.parentElement.removeChild(loadingScreen);
    }
};

if (loadingScreen) {
    loadingScreen.addEventListener(
        'transitionend',
        event => {
            if (event.propertyName === 'opacity') {
                removeLoadingScreen();
            }
        },
        { once: true }
    );
}

const REVEAL_DELAY = 900;
const LOADER_FALLBACK_DELAY = REVEAL_DELAY + 2000;

if (revealOverlay) {
    revealOverlay.addEventListener(
        'animationend',
        event => {
            if (event.animationName === 'reveal-flash') {
                document.body.classList.remove('is-revealing');
                window.setTimeout(() => {
                    if (revealOverlay.parentElement) {
                        revealOverlay.parentElement.removeChild(revealOverlay);
                    }
                }, 360);
            }
        },
        { once: true }
    );
}

window.addEventListener('load', () => {
    window.setTimeout(() => {
        document.body.classList.add('is-loaded', 'is-revealing');
        document.body.classList.remove('is-loading');
    }, REVEAL_DELAY);

    if (loadingScreen) {
        window.setTimeout(removeLoadingScreen, LOADER_FALLBACK_DELAY);
    }

    window.setTimeout(() => {
        document.body.classList.remove('is-revealing');
        if (revealOverlay && revealOverlay.parentElement) {
            revealOverlay.parentElement.removeChild(revealOverlay);
        }
    }, LOADER_FALLBACK_DELAY);
});

const observeAnimateElement = element => {
    if (animateObserver && element) {
        animateObserver.observe(element);
    }
};

const initAnimateObserver = () => {
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (!animatedElements.length || typeof IntersectionObserver === 'undefined') {
        document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('is-visible'));
        return;
    }

    animateObserver = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    animatedElements.forEach(el => observeAnimateElement(el));
};

const apps = (typeof TEAMHYEOK_APPS !== 'undefined')
    ? TEAMHYEOK_APPS
    : (typeof window !== 'undefined' && window.TEAMHYEOK_APPS) || [];

const FILTERS = [
    { key: 'all', label: '전체' },
    { key: 'life', label: '라이프스타일' },
    { key: 'learn', label: '학습' },
    { key: 'health', label: '건강' },
    { key: 'tool', label: '도구' },
    { key: 'web', label: '웹' }
];

// Editor's picks: hand-chosen products with editorial labels + a short, curiosity-
// driven hook (shown on the mobile screenshot card; desktop keeps the full tagline).
const FEATURED = [
    { slug: 'yusulga', label: '가장 최근 제품', hook: '주짓수·레슬링·유도 그래플러의 아지트' },
    { slug: 'sojung-filter', label: '가장 인기 있는', hook: '탭 한 번에 입혀지는 필름 감성' },
    { slug: 'study-timer', label: '가장 추천하는', hook: '자리 비우면 타이머가 멈춰요' },
    { slug: 'self-affirm', label: '가장 아끼는', hook: '내가 정한 확언이 알림으로 도착해요' }
];

const createAppCard = (app, index) => {
    const isSoon = app.status === 'soon';
    const indexLabel = String(index + 1).padStart(2, '0');
    const card = document.createElement('a');
    card.className = 'app-card';
    card.dataset.group = app.group;
    card.setAttribute('data-animate', '');
    card.href = app.page;

    if (app.external) {
        card.target = '_blank';
        card.rel = 'noopener';
    }

    if (isSoon) {
        card.classList.add('app-card--soon');
    }

    const ctaLabel = isSoon
        ? '준비중 · 미리보기 →'
        : app.platform === 'Web'
            ? '사이트 방문 →'
            : '자세히 보기 →';

    card.innerHTML = `
        <div class="app-card__top">
            <span class="app-card__icon">
                <img src="${app.icon}" alt="${app.name} 아이콘" loading="lazy">
            </span>
            <div class="app-card__tags">
                <span class="app-card__index">// ${indexLabel}</span>
                <span class="app-card__platform app-card__platform--${app.platform === 'iOS' ? 'ios' : 'web'}">${app.platform}</span>
                <span class="app-card__group">${app.groupLabel}</span>
            </div>
        </div>
        <h3 class="app-card__title">${app.name}</h3>
        <p class="app-card__description">${app.tagline}</p>
        <span class="app-card__cta">${ctaLabel}</span>
    `;

    observeAnimateElement(card);
    return card;
};

const renderFilters = (container, onSelect) => {
    FILTERS.forEach((filter, index) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'filter-chip';
        chip.textContent = filter.label;
        chip.dataset.filter = filter.key;
        if (index === 0) chip.classList.add('is-active');
        chip.addEventListener('click', () => onSelect(filter.key, chip));
        container.appendChild(chip);
    });
};

const initWorks = () => {
    const appList = document.getElementById('appList');
    const filterBar = document.getElementById('appFilters');
    if (!appList) return;

    appList.innerHTML = '';
    apps.forEach((app, index) => appList.appendChild(createAppCard(app, index)));

    if (filterBar) {
        renderFilters(filterBar, (key, chip) => {
            filterBar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('is-active'));
            chip.classList.add('is-active');
            appList.querySelectorAll('.app-card').forEach(card => {
                const match = key === 'all' || card.dataset.group === key;
                card.classList.toggle('is-hidden', !match);
            });
        });
    }
};

const createFeatureCard = ({ slug, label, hook }) => {
    const app = apps.find(a => a.slug === slug);
    if (!app) return null;
    const card = document.createElement('a');
    card.className = 'feature-card';
    card.setAttribute('data-animate', '');
    card.href = app.page;
    if (app.external || /^https?:/.test(app.page)) {
        card.target = '_blank';
        card.rel = 'noopener';
    }
    const ctaLabel = app.platform === 'Web' ? '사이트 방문 →' : '자세히 보기 →';
    // a real app screenshot makes people curious enough to tap; the web service
    // (no screenshot) gets a branded icon panel instead
    const shot = app.shots && app.shots[0];
    const shotMarkup = shot
        ? `<span class="feature-card__shot"><img src="${shot}" alt="${app.name} 앱 화면" loading="lazy"></span>`
        : `<span class="feature-card__shot feature-card__shot--brand"><img src="${app.icon}" alt="" loading="lazy"></span>`;
    card.innerHTML = `
        ${shotMarkup}
        <span class="feature-card__label">${label}</span>
        <span class="feature-card__body">
            <span class="feature-card__icon">
                <img src="${app.icon}" alt="${app.name} 아이콘" loading="lazy">
            </span>
            <h3 class="feature-card__name">${app.name}</h3>
            <p class="feature-card__tagline">${app.tagline}</p>
            <p class="feature-card__hook">${hook || app.tagline}</p>
            <span class="feature-card__cta">${ctaLabel}</span>
        </span>
    `;
    observeAnimateElement(card);
    return card;
};

const initFeatured = () => {
    const list = document.getElementById('featuredList');
    if (!list) return;
    list.innerHTML = '';
    FEATURED.forEach(item => {
        const card = createFeatureCard(item);
        if (card) list.appendChild(card);
    });
};

const initHeroCanvas = () => {
    const cluster = document.querySelector('.hero-cluster');
    const canvas = cluster && cluster.querySelector('.hero-cluster__canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ACCENT = '212, 255, 63';
    const TAU = Math.PI * 2;

    // ----- load icons; logo becomes the static core, the rest stream -----
    const sources = Array.from(document.querySelectorAll('.hero-cluster__sources li'));
    const icons = [];
    sources.forEach(li => {
        const img = new Image();
        img.src = li.dataset.icon;
        const rec = { img, ready: false };
        img.addEventListener('load', () => { rec.ready = true; });
        icons.push(rec);
    });

    // ----- perspective tunnel model -----
    const ZNEAR = 0.16;
    const ZFAR = 3.8;          // deeper tunnel — the destination light reads far away
    const ICON_WORLD = 0.135;  // icon edge length in world units (smaller debris drifting by)
    const COUNT = 5;
    const CORE_SCALE = 0.6;    // shrink the reactor cluster so it sits far down the tunnel

    let iconCursor = 0;
    const makeFlyer = (z) => ({
        ang: Math.random() * Math.PI * 2,
        rad: 0.05 + Math.random() * 0.46,   // lateral world radius from tunnel axis
        z: z != null ? z : ZNEAR + Math.random() * (ZFAR - ZNEAR),
        idx: iconCursor++ % Math.max(1, icons.length),   // round-robin so every product appears
        vrad: 0,            // outward velocity after glancing off the camera
        spin: 0, vspin: 0,  // card tumble imparted by the impact
        hit: 0,             // impact flash timer (1 -> 0)
        deflected: false,   // has it already ricocheted?
    });
    let flyers = Array.from({ length: COUNT }, () => makeFlyer());

    const RING_COUNT = 6;
    let rings = Array.from({ length: RING_COUNT }, (_, i) => ({
        z: ZNEAR + (i / RING_COUNT) * (ZFAR - ZNEAR),
    }));

    // ----- warp star-streaks (faint at cruise, erupt during thrust surges) -----
    const STREAKS = 34;
    const makeStreak = (r) => ({
        ang: Math.random() * Math.PI * 2,
        r: r != null ? r : 0.08 + Math.random() * 1.05,   // fraction of half-extent from axis
        seed: 0.4 + Math.random() * 0.6,
    });
    let streaks = Array.from({ length: STREAKS }, () => makeStreak());

    // ----- sizing -----
    let w = 0, h = 0, dpr = 1, base = 0, focal = 0, focalBase = 0;
    const resize = () => {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = rect.width;
        h = rect.height;
        base = Math.min(w, h);
        focalBase = w * 0.62;
        focal = focalBase;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // ----- pointer (steers the vanishing point) -----
    const pointer = { x: 0.5, y: 0.5, active: false };
    cluster.addEventListener('pointermove', e => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = (e.clientX - rect.left) / rect.width;
        pointer.y = (e.clientY - rect.top) / rect.height;
        pointer.active = true;
    });
    cluster.addEventListener('pointerleave', () => { pointer.active = false; });

    let vpx = 0, vpy = 0, vpInit = false;
    let last = 0, startTs = 0;

    const roundRect = (x, y, size, radius) => {
        const r = Math.min(radius, size / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + size, y, x + size, y + size, r);
        ctx.arcTo(x + size, y + size, x, y + size, r);
        ctx.arcTo(x, y + size, x, y, r);
        ctx.arcTo(x, y, x + size, y, r);
        ctx.closePath();
    };

    // open reticle arc (camera-viewfinder style) with rounded caps
    const reticle = (radius, start, sweep, alpha, width) => {
        ctx.beginPath();
        ctx.arc(vpx, vpy, radius, start, start + sweep);
        ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();
    };

    const drawFlyer = (f, warp) => {
        const sc = focal / f.z;
        const sx = vpx + Math.cos(f.ang) * f.rad * sc;
        const sy = vpy + Math.sin(f.ang) * f.rad * sc;
        const size = ICON_WORLD * sc;
        let alpha = Math.min(1, (ZFAR - f.z) / (ZFAR * 0.5));
        alpha *= Math.min(1, (f.z - ZNEAR) / 0.14);   // fade out as it streaks past the camera
        if (size < 1.2 || alpha <= 0.01) return;

        const half = size / 2;
        const radius = size * 0.24;
        const rec = icons[f.idx % icons.length];

        // hyperspace streak (additive): short when cruising, long during warp-in
        const zTrail = f.z + 0.02 + 0.14 * (warp - 1);
        const scT = focal / zTrail;
        const tx = vpx + Math.cos(f.ang) * f.rad * scT;
        const ty = vpy + Math.sin(f.ang) * f.rad * scT;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = `rgba(${ACCENT}, ${alpha * 0.18})`;
        ctx.lineWidth = Math.max(1, size * 0.05);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(sx, sy);
        ctx.stroke();

        // energy halo charged by the core
        const gl = ctx.createRadialGradient(sx, sy, 0, sx, sy, size * 0.95);
        gl.addColorStop(0, `rgba(${ACCENT}, ${0.14 * alpha})`);
        gl.addColorStop(1, `rgba(${ACCENT}, 0)`);
        ctx.fillStyle = gl;
        ctx.beginPath();
        ctx.arc(sx, sy, size * 0.95, 0, TAU);
        ctx.fill();
        ctx.restore();

        // depth-of-field: far icons soften into bokeh, the nearest stays tack-sharp
        const depth = (f.z - ZNEAR) / (ZFAR - ZNEAR);   // 0 near .. 1 far
        const blurPx = depth * depth * (size * 0.06 + 3);
        const dof = blurPx > 0.4 && typeof ctx.filter !== 'undefined';
        if (dof) ctx.filter = `blur(${blurPx.toFixed(2)}px)`;

        // glossy card (tumbles when knocked off course)
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(sx, sy);
        if (f.spin) ctx.rotate(f.spin);
        ctx.shadowColor = 'rgba(0,0,0,0.55)';
        ctx.shadowBlur = size * 0.28;
        ctx.shadowOffsetY = size * 0.1;
        roundRect(-half, -half, size, radius);
        ctx.fillStyle = '#0f1116';
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        if (rec && rec.ready) {
            ctx.save();
            roundRect(-half, -half, size, radius);
            ctx.clip();
            ctx.drawImage(rec.img, -half, -half, size, size);
            const sheen = ctx.createLinearGradient(0, -half, 0, half);
            sheen.addColorStop(0, 'rgba(255,255,255,0.22)');
            sheen.addColorStop(0.45, 'rgba(255,255,255,0)');
            ctx.fillStyle = sheen;
            ctx.fillRect(-half, -half, size, size);
            ctx.restore();
        }
        // atmospheric perspective — distant icons wash into the cool haze, clearing as they near
        if (depth > 0.15) {
            ctx.save();
            roundRect(-half, -half, size, radius);
            ctx.clip();
            ctx.globalAlpha = alpha * Math.min(0.5, depth * 0.55);
            ctx.fillStyle = 'rgb(92, 140, 190)';
            ctx.fillRect(-half, -half, size, size);
            ctx.restore();
        }
        // directional lighting — warm key light from the destination core, cool rim from the paradise beyond
        const lit = Math.min(1, (1.2 - f.z) / 1.0);
        if (lit > 0.02) {
            const lAng = Math.atan2(vpy - sy, vpx - sx) - (f.spin || 0);
            const lx = Math.cos(lAng), ly = Math.sin(lAng);
            ctx.save();
            roundRect(-half, -half, size, radius);
            ctx.clip();
            ctx.globalCompositeOperation = 'lighter';
            const warm = ctx.createLinearGradient(lx * half, ly * half, -lx * half, -ly * half);
            warm.addColorStop(0, `rgba(${ACCENT}, ${0.5 * lit})`);
            warm.addColorStop(0.45, `rgba(${ACCENT}, 0)`);
            warm.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = warm;
            ctx.fillRect(-half, -half, size, size);
            const cool = ctx.createLinearGradient(-lx * half, -ly * half, lx * half, ly * half);
            cool.addColorStop(0, `rgba(150, 215, 255, ${0.34 * lit})`);
            cool.addColorStop(0.4, 'rgba(150, 215, 255, 0)');
            cool.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = cool;
            ctx.fillRect(-half, -half, size, size);
            ctx.restore();
        }
        roundRect(-half, -half, size, radius);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255,255,255,0.24)';
        ctx.stroke();
        ctx.restore();

        // lime rim accent (additive), follows the tumble
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = alpha;
        ctx.translate(sx, sy);
        if (f.spin) ctx.rotate(f.spin);
        roundRect(-half, -half, size, radius);
        ctx.lineWidth = Math.max(1, size * 0.02);
        ctx.strokeStyle = `rgba(${ACCENT}, 0.35)`;
        ctx.stroke();
        ctx.restore();

        if (dof) ctx.filter = 'none';

        // impact flash — a bright burst at the instant it glances off the camera
        if (f.hit > 0.01) {
            const fl = f.hit * f.hit;
            const fr = size * (0.7 + 1.3 * (1 - f.hit));
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const fg = ctx.createRadialGradient(sx, sy, 0, sx, sy, fr);
            fg.addColorStop(0, `rgba(245, 255, 220, ${0.6 * fl})`);
            fg.addColorStop(0.4, `rgba(${ACCENT}, ${0.32 * fl})`);
            fg.addColorStop(1, `rgba(${ACCENT}, 0)`);
            ctx.fillStyle = fg;
            ctx.beginPath();
            ctx.arc(sx, sy, fr, 0, TAU);
            ctx.fill();
            ctx.restore();
        }
    };

    const draw = (now) => {
        if (!last) last = now;
        if (!startTs) startTs = now;
        let dt = (now - last) / 1000;
        last = now;
        if (dt > 0.05) dt = 0.05;        // clamp big gaps (throttled/hidden tab)
        if (reduceMotion) dt = 0;
        const elapsed = (now - startTs) / 1000;

        // warp-in: speed eases from a fast burst down to cruise
        const warp = reduceMotion ? 1 : 1 + 2.6 * Math.exp(-elapsed / 0.6);
        // thrust drive: balls-to-the-wall, full throttle, no breathers — just keep ripping.
        // matches the team attitude: this kind of ride never lets off the gas.
        const flutter = 0.5 + 0.5 * Math.sin(elapsed * 1.5);   // light flutter keeps full throttle alive
        // scroll-driven warp boost: interactions.js raises window.__warpBoost on
        // fast scroll; we read it, then decay it here so the tunnel lunges when
        // the visitor scrolls and eases back to cruise when they stop.
        const scrollBoost = reduceMotion ? 0 : Math.min(1.4, window.__warpBoost || 0);
        window.__warpBoost = reduceMotion ? 0 : scrollBoost * Math.exp(-dt / 0.35);
        const surge = reduceMotion ? 0 : Math.min(1.25, 0.86 + 0.14 * flutter + scrollBoost * 0.4);
        const speed = 0.72 * warp * (1 + 1.7 * surge) * (1 + scrollBoost * 0.9);
        focal = focalBase * (1 - 0.13 * surge);   // FOV widens on thrust — the tunnel lunges forward

        ctx.clearRect(0, 0, w, h);
        if (!w || !h) { if (!reduceMotion) rafId = requestAnimationFrame(draw); return; }

        const cx = w / 2, cy = h / 2;

        // slow "heading" — the ship commits to a direction, holds it, then eases the other way
        const turn = reduceMotion ? 0 : Math.sin(elapsed * 0.13) * 0.85 + Math.sin(elapsed * 0.057 + 2.0) * 0.4;
        // occasional accentuated bank — eases into a moderate roll and back, never a full flip
        const BANK_PERIOD = 11, BANK_DUR = 3.4;
        let bank = 0;
        if (!reduceMotion) {
            const tt = elapsed % BANK_PERIOD;
            if (tt < BANK_DUR) {
                const env = Math.sin((tt / BANK_DUR) * Math.PI);   // 0 -> 1 -> 0, smooth there-and-back
                const dir = (Math.floor(elapsed / BANK_PERIOD) % 2) ? 1 : -1;
                bank = dir * env * 0.30;
            }
        }
        // bank into turns; clamp so the roll stays moderate and within the fixed overscan
        let roll = reduceMotion ? 0 : turn * 0.16 + Math.sin(elapsed * 0.19 + 0.5) * 0.04 + bank;
        roll = Math.max(-0.36, Math.min(0.36, roll));
        // constant zoom sized to the max roll — banking no longer pulses the zoom
        const overscan = reduceMotion ? 1 : 1.30;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(overscan, overscan);
        ctx.rotate(roll);
        ctx.translate(-cx, -cy);

        // pointer steers; otherwise the autopilot follows the slow heading and weaves
        let ox, oy;
        if (pointer.active) {
            ox = pointer.x - 0.5;
            oy = pointer.y - 0.5;
        } else if (reduceMotion) {
            ox = oy = 0;
        } else {
            ox = turn * 0.6 + 0.1 * Math.sin(elapsed * 0.63 + 1.3);
            oy = 0.22 * Math.sin(elapsed * 0.19 + 1.1) + 0.1 * Math.sin(elapsed * 0.5 + 0.4);
            // bank away from the nearest incoming icons, as if threading through the field
            let ax = 0, ay = 0;
            for (const f of flyers) {
                if (f.z < 1.1) {
                    const wgt = 1.1 - f.z;
                    ax += Math.cos(f.ang) * f.rad * wgt;
                    ay += Math.sin(f.ang) * f.rad * wgt;
                }
            }
            ox = Math.max(-0.8, Math.min(0.8, ox - ax * 0.35));
            oy = Math.max(-0.7, Math.min(0.7, oy - ay * 0.35));
        }
        const tvx = cx + ox * w * 0.14;
        const tvy = cy + oy * h * 0.14;
        if (!vpInit) { vpx = cx; vpy = cy; vpInit = true; }
        vpx += (tvx - vpx) * 0.05;
        vpy += (tvy - vpy) * 0.05;
        // engine rumble — high-frequency jitter that intensifies with thrust
        if (!reduceMotion) {
            const rumble = (0.5 + 7 * surge) * 0.35;
            vpx += Math.sin(elapsed * 53.7) * rumble;
            vpy += Math.cos(elapsed * 61.3) * rumble;
        }

        const spin = elapsed;
        const boost = 1 + 0.6 * (warp - 1) + 0.7 * surge;

        // ambient dual-tone glow (lime core fading into a cool halo)
        const amb = ctx.createRadialGradient(vpx, vpy, 0, vpx, vpy, w * 0.55);
        amb.addColorStop(0, `rgba(${ACCENT}, 0.16)`);
        amb.addColorStop(0.35, `rgba(${ACCENT}, 0.05)`);
        amb.addColorStop(0.7, 'rgba(90, 140, 120, 0.05)');
        amb.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = amb;
        ctx.fillRect(0, 0, w, h);

        // warp star-streaks — faint hairlines streaming outward, exploding into speed lines on thrust
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        const reach = base * 0.62;
        const sLen = base * (0.04 + 1.0 * surge);
        const sAlpha = 0.05 + 0.55 * surge;
        streaks.forEach(s => {
            if (!reduceMotion) {
                s.r += speed * dt * 0.9 * s.seed;
                if (s.r > 1.25) Object.assign(s, makeStreak(0.05));
            }
            const cos = Math.cos(s.ang), sin = Math.sin(s.ang);
            const r0 = s.r * reach;
            const x0 = vpx + cos * r0, y0 = vpy + sin * r0;
            const ext = sLen * s.seed;
            const x1 = vpx + cos * (r0 + ext), y1 = vpy + sin * (r0 + ext);
            const a = sAlpha * Math.min(1, s.r / 0.25) * Math.min(1, (1.25 - s.r) / 0.3);
            if (a <= 0.01) return;
            const g = ctx.createLinearGradient(x0, y0, x1, y1);
            g.addColorStop(0, `rgba(${ACCENT}, 0)`);
            g.addColorStop(0.5, `rgba(225, 255, 205, ${a})`);
            g.addColorStop(1, `rgba(${ACCENT}, 0)`);
            ctx.strokeStyle = g;
            ctx.lineWidth = 1 + 1.2 * surge;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        });
        ctx.restore();

        // expanding blueprint rings rushing forward (quiet sense of depth)
        rings.forEach(r => {
            if (!reduceMotion) {
                r.z -= speed * dt;
                if (r.z <= ZNEAR) r.z += (ZFAR - ZNEAR);
            }
            const rad = 0.52 * (focal / r.z);
            const a = Math.min(1, (ZFAR - r.z) / (ZFAR * 0.5)) * 0.1;
            ctx.beginPath();
            ctx.arc(vpx, vpy, rad, 0, TAU);
            ctx.strokeStyle = `rgba(${ACCENT}, ${a})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // ===== reactor core (scaled down so the destination light sits far down the tunnel) =====
        ctx.save();
        ctx.translate(vpx, vpy);
        ctx.scale(CORE_SCALE, CORE_SCALE);
        ctx.translate(-vpx, -vpy);

        // dual-tone bloom
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const bloomR = base * 0.3;
        const bloom = ctx.createRadialGradient(vpx, vpy, 0, vpx, vpy, bloomR);
        bloom.addColorStop(0, `rgba(${ACCENT}, ${Math.min(0.75, 0.42 * boost)})`);
        bloom.addColorStop(0.45, `rgba(${ACCENT}, ${0.1 * boost})`);
        bloom.addColorStop(0.75, 'rgba(120, 200, 160, 0.04)');
        bloom.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = bloom;
        ctx.beginPath();
        ctx.arc(vpx, vpy, bloomR, 0, TAU);
        ctx.fill();
        ctx.restore();

        // anamorphic lens flare — a wide razor-thin horizontal streak through the core
        const flarePulse = 1 + 0.06 * Math.sin(elapsed * 2.4);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.translate(vpx, vpy);
        // soft flat bloom (stretched ellipse)
        ctx.save();
        ctx.scale(1, 0.05);
        const flareR = base * 0.46 * flarePulse * (1 + 0.18 * (warp - 1));
        const fg = ctx.createRadialGradient(0, 0, 0, 0, 0, flareR);
        fg.addColorStop(0, `rgba(232, 255, 200, ${Math.min(0.6, 0.34 * boost)})`);
        fg.addColorStop(0.4, `rgba(${ACCENT}, ${0.12 * boost})`);
        fg.addColorStop(1, `rgba(${ACCENT}, 0)`);
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.arc(0, 0, flareR, 0, TAU);
        ctx.fill();
        ctx.restore();
        // razor-thin bright core line with faint cyan tips (the anamorphic signature)
        const lineW = flareR;
        const lg = ctx.createLinearGradient(-lineW, 0, lineW, 0);
        lg.addColorStop(0, 'rgba(120, 200, 255, 0)');
        lg.addColorStop(0.18, `rgba(120, 200, 255, ${0.18 * boost})`);
        lg.addColorStop(0.5, `rgba(255, 255, 255, ${Math.min(0.8, 0.5 * boost)})`);
        lg.addColorStop(0.82, `rgba(120, 200, 255, ${0.18 * boost})`);
        lg.addColorStop(1, 'rgba(120, 200, 255, 0)');
        ctx.fillStyle = lg;
        const lineH = Math.max(1, base * 0.004);
        ctx.fillRect(-lineW, -lineH / 2, lineW * 2, lineH);
        ctx.restore();

        // fine tick ring — a single quiet measurement scale
        ctx.save();
        ctx.strokeStyle = `rgba(${ACCENT}, 0.18)`;
        ctx.lineWidth = 1;
        const tickOut = base * 0.172;
        for (let i = 0; i < 48; i++) {
            const a = spin * 0.08 + (i / 48) * TAU;
            const r1 = (i % 4 === 0 ? base * 0.152 : base * 0.162);
            ctx.beginPath();
            ctx.moveTo(vpx + Math.cos(a) * r1, vpy + Math.sin(a) * r1);
            ctx.lineTo(vpx + Math.cos(a) * tickOut, vpy + Math.sin(a) * tickOut);
            ctx.stroke();
        }
        ctx.restore();

        // two counter-rotating reticle arcs (open viewfinder frame)
        reticle(base * 0.122, spin * 0.5, TAU * 0.32, 0.5, 1.5);
        reticle(base * 0.122, spin * 0.5 + Math.PI, TAU * 0.32, 0.5, 1.5);
        reticle(base * 0.1, -spin * 0.32 + 0.6, TAU * 0.18, 0.7, 2);
        reticle(base * 0.1, -spin * 0.32 + 0.6 + Math.PI, TAU * 0.18, 0.7, 2);

        // crisp inner ring + chromatic aberration fringes (lens stress grows on warp-in)
        const ringR = base * 0.066;
        const ca = 1 + 1.6 * (boost - 1);   // px split — wider during the warp burst
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(255, 40, 60, 0.28)';
        ctx.beginPath();
        ctx.arc(vpx + ca, vpy, ringR, 0, TAU);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(40, 130, 255, 0.28)';
        ctx.beginPath();
        ctx.arc(vpx - ca, vpy, ringR, 0, TAU);
        ctx.stroke();
        ctx.restore();
        ctx.beginPath();
        ctx.arc(vpx, vpy, ringR, 0, TAU);
        ctx.strokeStyle = `rgba(${ACCENT}, 0.5)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // signature: a single glint travels the ring with hand-eased accel/decel
        const glintLoop = 2.4;
        const gt = reduceMotion ? 0.25 : (elapsed % glintLoop) / glintLoop;
        const gEase = gt < 0.5 ? 2 * gt * gt : 1 - Math.pow(-2 * gt + 2, 2) / 2;  // easeInOutQuad
        const glintA = gEase * TAU - Math.PI / 2;
        const glintArc = 0.5;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        ctx.lineWidth = 2.4;
        const glintGrad = ctx.createLinearGradient(
            vpx + Math.cos(glintA - glintArc) * ringR, vpy + Math.sin(glintA - glintArc) * ringR,
            vpx + Math.cos(glintA + glintArc) * ringR, vpy + Math.sin(glintA + glintArc) * ringR
        );
        glintGrad.addColorStop(0, `rgba(${ACCENT}, 0)`);
        glintGrad.addColorStop(0.5, 'rgba(255,255,255,0.95)');
        glintGrad.addColorStop(1, `rgba(${ACCENT}, 0)`);
        ctx.strokeStyle = glintGrad;
        ctx.beginPath();
        ctx.arc(vpx, vpy, ringR, glintA - glintArc, glintA + glintArc);
        ctx.stroke();
        ctx.restore();

        // hot core orb (white-hot center, breathing pulse + subtle flicker, flares on warp-in)
        const flicker = 1 + 0.04 * Math.sin(elapsed * 23.3);
        const pulse = 1 + 0.1 * Math.sin(elapsed * 2.4);
        const orbR = base * 0.052 * pulse * flicker * (1 + 0.13 * (warp - 1));
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const orb = ctx.createRadialGradient(vpx, vpy, 0, vpx, vpy, orbR);
        orb.addColorStop(0, 'rgba(255,255,255,0.98)');
        orb.addColorStop(0.3, `rgba(${ACCENT}, 0.95)`);
        orb.addColorStop(1, `rgba(${ACCENT}, 0)`);
        ctx.fillStyle = orb;
        ctx.beginPath();
        ctx.arc(vpx, vpy, orbR, 0, TAU);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath();
        ctx.arc(vpx, vpy, orbR * 0.28, 0, TAU);
        ctx.fill();
        ctx.restore();

        ctx.restore();   // end core scale

        // streaming icons (advance, respawn, draw far -> near)
        if (!reduceMotion) {
            flyers.forEach(f => {
                // an icon bearing straight at the camera glances off instead of clipping through
                if (!f.deflected && f.z < 0.6 && f.rad < 0.17) {
                    f.deflected = true;
                    f.vrad = 1.3 + Math.random() * 0.9;                         // kicked outward
                    f.vspin = (Math.random() < 0.5 ? -1 : 1) * (3 + Math.random() * 3);
                    f.ang += (Math.random() - 0.5) * 0.5;                        // glances to one side
                    f.hit = 1;
                }
                f.z -= speed * dt;
                if (f.deflected) {
                    f.rad += f.vrad * dt;                          // veers off-axis and whips past the edge
                    f.spin += f.vspin * dt;                        // tumbles from the impact
                    f.vspin *= Math.max(0, 1 - dt * 2.5);          // tumble settles
                    f.hit = Math.max(0, f.hit - dt * 2.4);         // flash decays
                }
                if (f.z <= ZNEAR) Object.assign(f, makeFlyer(ZFAR));
            });
        }
        const flightWarp = warp + surge * 2.4;   // icons streak harder during thrust
        [...flyers].sort((a, b) => b.z - a.z).forEach(f => drawFlyer(f, flightWarp));

        ctx.restore();   // end view bank-roll
        if (!reduceMotion) rafId = requestAnimationFrame(draw);
    };

    let rafId = null;
    const start = () => {
        resize();
        if (reduceMotion) draw(performance.now());
        else if (!rafId) rafId = requestAnimationFrame(draw);
    };

    if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(() => {
            resize();
            if (reduceMotion) draw(performance.now());
        }).observe(canvas);
    } else {
        window.addEventListener('resize', resize);
    }

    start();
};

const animateCounters = () => {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const run = el => {
        const target = parseInt(el.dataset.count, 10) || 0;
        const duration = 1100;
        const start = performance.now();
        const step = now => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased).toString();
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    if (typeof IntersectionObserver === 'undefined') {
        counters.forEach(run);
        return;
    }
    const obs = new IntersectionObserver((entries, o) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                run(entry.target);
                o.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });
    counters.forEach(el => obs.observe(el));
};

initAnimateObserver();
initFeatured();
initWorks();
initHeroCanvas();
animateCounters();

const yearSpan = document.getElementById('currentYear');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
