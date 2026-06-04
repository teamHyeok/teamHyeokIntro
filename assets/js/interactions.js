/**
 * interactions.js — "warp deck": a full-screen, step-through stage sequence.
 *
 * The page is five stages (Intro · Stats · Team · Picks · Works). Each fills
 * the screen; you step through with the bottom tour controller, the ← / →
 * keys, the dots, or by scrolling (panels snap into place). Arriving at a
 * stage REPLAYS a staccato entrance — its elements pop in one by one, like a
 * game intro — and fires a warp pulse (hero tunnel lunges + lime flash).
 *
 * Degrades cleanly: reduced-motion → no snap, no choreography, everything
 * visible. The choreography-hiding is gated on a JS-set class (+ a failsafe),
 * so content can never get stuck invisible.
 */
(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(min-width: 769px)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const HEADER_OFFSET = 0;   // panels are full-height; snap aligns them to the top

    /* ================================================================== *
     *  Stage model
     * ================================================================== */
    const STAGE_DEFS = [
        { id: 'hero', num: '01', label: 'Intro' },
        { id: 'stats', num: '02', label: 'Stats' },
        { id: 'about', num: '03', label: 'Team' },
        { id: 'picks', num: '04', label: 'Picks' },
        { id: 'apps', num: '05', label: 'Works' }
    ];
    const stages = STAGE_DEFS
        .map(def => Object.assign({}, def, { el: document.getElementById(def.id) }))
        .filter(s => s.el);
    let activeIdx = 0;
    let navLock = 0;

    /* ================================================================== *
     *  Staccato entrance choreography
     * ================================================================== */
    // ordered selectors whose matches pop in, one after another, per stage
    const STAGE_FX = {
        hero: ['.hero__eyebrow', '.hero__title', '.hero__subtitle', '.hero__actions', '.hero-cluster'],
        stats: ['.stats__header', '.stat'],
        about: ['.section__header', '.principle'],
        picks: ['.section__header', '.feature-card'],
        apps: ['.section__header', '.filter-bar', '.app-card']
    };

    const buildStageFx = () => {
        document.documentElement.classList.add('has-hud');   // enables .fx hiding + snap
        stages.forEach(stage => {
            const selectors = STAGE_FX[stage.id];
            if (!selectors) return;
            let i = 0;
            selectors.forEach(sel => {
                stage.el.querySelectorAll(sel).forEach(el => {
                    el.classList.add('fx');
                    el.style.setProperty('--i', i++);
                });
            });
        });
    };

    const playStage = idx => {
        const stage = stages[idx];
        if (!stage) return;
        stages.forEach(s => { if (s !== stage) s.el.classList.remove('stage-on'); });
        // restart the CSS animations even if it's the same stage
        stage.el.classList.remove('stage-on');
        void stage.el.offsetWidth;
        stage.el.classList.add('stage-on');
    };

    /* ================================================================== *
     *  Scroll progress bar + warp flash
     * ================================================================== */
    let progressFill = null;
    let warpFlash = null;
    const buildOverlays = () => {
        const bar = document.createElement('div');
        bar.className = 'scroll-progress';
        progressFill = document.createElement('span');
        progressFill.className = 'scroll-progress__fill';
        bar.appendChild(progressFill);
        document.body.appendChild(bar);

        warpFlash = document.createElement('div');
        warpFlash.className = 'warp-flash';
        warpFlash.setAttribute('aria-hidden', 'true');
        document.body.appendChild(warpFlash);
    };

    const fireWarp = () => {
        if (reduceMotion) return;
        window.__warpBoost = 1.4;
        if (warpFlash) {
            warpFlash.classList.remove('is-firing');
            void warpFlash.offsetWidth;
            warpFlash.classList.add('is-firing');
        }
    };

    /* ================================================================== *
     *  Tour controller
     * ================================================================== */
    let elIdx = null, elName = null, elPrev = null, elNext = null;
    const dotEls = [];

    const goTo = idx => {
        const i = Math.max(0, Math.min(stages.length - 1, idx));
        const top = stages[i].el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
        activeIdx = i;
        navLock = Date.now() + 800;
        syncTour();
        fireWarp();
        playStage(i);
    };

    const buildTour = () => {
        if (stages.length < 2) return;
        const tour = document.createElement('nav');
        tour.className = 'tour';
        tour.setAttribute('aria-label', '섹션 투어');

        elPrev = document.createElement('button');
        elPrev.type = 'button';
        elPrev.className = 'tour__btn tour__prev';
        elPrev.setAttribute('aria-label', '이전 섹션');
        elPrev.textContent = '◂';
        elPrev.addEventListener('click', () => goTo(activeIdx - 1));

        const meta = document.createElement('div');
        meta.className = 'tour__meta';
        elIdx = document.createElement('span');
        elIdx.className = 'tour__idx';
        elName = document.createElement('span');
        elName.className = 'tour__name';
        meta.append(elIdx, elName);

        const dots = document.createElement('div');
        dots.className = 'tour__dots';
        stages.forEach((s, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'tour__dot';
            dot.setAttribute('aria-label', `${s.label} 섹션으로 이동`);
            dot.addEventListener('click', () => goTo(i));
            dots.appendChild(dot);
            dotEls.push(dot);
        });

        elNext = document.createElement('button');
        elNext.type = 'button';
        elNext.className = 'tour__btn tour__next';
        elNext.textContent = '다음 ▸';
        elNext.addEventListener('click', () => goTo(activeIdx + 1));

        tour.append(elPrev, meta, dots, elNext);
        document.body.appendChild(tour);
        syncTour();
    };

    const syncTour = () => {
        const s = stages[activeIdx];
        if (elIdx) elIdx.textContent = s.num;
        if (elName) elName.textContent = s.label;
        dotEls.forEach((d, i) => d.classList.toggle('is-active', i === activeIdx));
        if (elPrev) elPrev.disabled = activeIdx === 0;
        if (elNext) elNext.disabled = activeIdx === stages.length - 1;
    };

    /* ================================================================== *
     *  Hero depart parallax
     * ================================================================== */
    const heroContent = document.querySelector('.hero__content');
    const heroVisual = document.querySelector('.hero__visual');
    const DRIFT = isDesktop ? 0.18 : 0.1;

    const applyParallax = y => {
        if (reduceMotion) return;
        const local = y - (stages[0] ? 0 : 0);   // hero starts at top
        if (heroContent && activeIdx === 0) {
            heroContent.style.transform = `translateY(${(local * DRIFT).toFixed(1)}px)`;
        }
        if (heroVisual && activeIdx === 0) {
            heroVisual.style.transform = `translateY(${(local * DRIFT * 0.4).toFixed(1)}px)`;
        }
    };

    /* ================================================================== *
     *  DESKTOP — pointer tilt + spotlight, magnetic buttons
     * ================================================================== */
    const initTilt = () => {
        document.querySelectorAll('.feature-card, .app-card').forEach(card => {
            card.addEventListener('pointermove', e => {
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
                card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
                const rx = (0.5 - py) * 6;
                const ry = (px - 0.5) * 6;
                card.style.transform =
                    `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px)`;
            });
            card.addEventListener('pointerleave', () => { card.style.transform = ''; });
        });
    };

    const initMagnetic = () => {
        document.querySelectorAll('.hero__actions .cta-button, .hero__actions .ghost-button').forEach(btn => {
            btn.addEventListener('pointermove', e => {
                const r = btn.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width / 2) * 0.32;
                const y = (e.clientY - r.top - r.height / 2) * 0.32;
                btn.style.transform = `translate(${x.toFixed(1)}px, ${(y - 2).toFixed(1)}px)`;
            });
            btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
        });
    };

    /* ================================================================== *
     *  Keyboard — ← / → step through stages
     * ================================================================== */
    const onKeydown = e => {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
        const t = e.target;
        if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(activeIdx + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(activeIdx - 1); }
    };

    /* ================================================================== *
     *  Wire-up
     * ================================================================== */
    const scrollCue = document.querySelector('.scroll-cue');

    buildStageFx();
    buildOverlays();
    buildTour();

    if (isDesktop && finePointer && !reduceMotion) {
        initTilt();
        initMagnetic();
    }
    window.addEventListener('keydown', onKeydown);

    // kick off the first stage's entrance once the page has finished revealing
    const startChoreo = () => playStage(activeIdx);
    if (reduceMotion) {
        document.documentElement.classList.add('fx-off');   // CSS reveals everything
    } else if (document.body.classList.contains('is-loaded')) {
        window.setTimeout(startChoreo, 250);
    } else {
        window.addEventListener('load', () => window.setTimeout(startChoreo, 1000), { once: true });
    }

    // failsafe: if choreography never ran, reveal everything after a few seconds
    window.setTimeout(() => {
        if (!document.querySelector('.stage-on')) document.documentElement.classList.add('fx-off');
    }, 4000);

    let ticking = false;
    let lastY = window.scrollY;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docH > 0 ? Math.min(1, Math.max(0, y / docH)) : 0;
            if (progressFill) progressFill.style.transform = `scaleX(${progress})`;
            applyParallax(y);
            if (scrollCue) scrollCue.classList.toggle('is-gone', y > 120);

            if (!reduceMotion) {
                const v = Math.abs(y - lastY);
                window.__warpBoost = Math.min(1.4, (window.__warpBoost || 0) + v / 700);
            }
            lastY = y;

            const marker = y + window.innerHeight * 0.5;
            let idx = 0;
            stages.forEach((s, i) => {
                if (marker >= s.el.getBoundingClientRect().top + window.scrollY) idx = i;
            });
            if (Date.now() > navLock && idx !== activeIdx) {
                activeIdx = idx;
                syncTour();
                fireWarp();
                playStage(idx);
            }
            ticking = false;
        });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
})();
