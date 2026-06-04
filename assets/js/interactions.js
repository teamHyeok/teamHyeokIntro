/**
 * interactions.js — "warp tour" motion layer.
 *
 * The page is a sequence of stages (Intro → Team → Picks → Works) that the
 * visitor steps through by interaction: a bottom tour controller (prev /
 * progress dots / next) plus the ← / → arrow keys jump from stage to stage,
 * and every jump fires a warp surge — the hero tunnel lunges and a lime warp
 * pulse flashes. Free scrolling still works and keeps the controller in sync.
 *
 * Desktop and mobile are separate tracks:
 *   SHARED   · scroll-progress bar, hero parallax, staggered reveals, tour
 *   DESKTOP  · pointer tilt + spotlight on cards, magnetic hero buttons
 *
 * Degrades cleanly: reduced-motion → instant jumps, no surge/flash; the
 * reveal-hiding is gated on a JS-set class so content never gets stuck.
 */
(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(min-width: 769px)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const HEADER_OFFSET = 76;

    /* ================================================================== *
     *  Stage model
     * ================================================================== */
    const STAGE_DEFS = [
        { id: 'hero', num: '01', label: 'Intro' },
        { id: 'about', num: '02', label: 'Team' },
        { id: 'picks', num: '03', label: 'Picks' },
        { id: 'apps', num: '04', label: 'Works' }
    ];
    const stages = STAGE_DEFS
        .map(def => Object.assign({}, def, { el: document.getElementById(def.id) }))
        .filter(s => s.el);
    let activeIdx = 0;

    /* ================================================================== *
     *  SHARED — scroll progress bar + warp flash
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
        window.__warpBoost = 1.4;                 // hero tunnel lunges (see main.js)
        if (warpFlash) {
            warpFlash.classList.remove('is-firing');
            void warpFlash.offsetWidth;            // restart the animation
            warpFlash.classList.add('is-firing');
        }
    };

    /* ================================================================== *
     *  SHARED — tour controller
     * ================================================================== */
    let elIdx = null, elName = null, elPrev = null, elNext = null, dotEls = [];

    const goTo = idx => {
        const i = Math.max(0, Math.min(stages.length - 1, idx));
        const top = stages[i].el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        fireWarp();
        window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
        activeIdx = i;          // reflect immediately; scroll-sync keeps it honest after
        syncTour();
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
        elNext.textContent = '다음 ▸';   // "다음 ▸"
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
     *  SHARED — hero depart parallax
     * ================================================================== */
    const heroContent = document.querySelector('.hero__content');
    const heroVisual = document.querySelector('.hero__visual');
    const DRIFT = isDesktop ? 0.22 : 0.12;
    const FADE_OVER = isDesktop ? 520 : 9999;

    const applyParallax = y => {
        if (reduceMotion) return;
        if (heroContent) {
            heroContent.style.transform = `translateY(${(y * DRIFT).toFixed(1)}px)`;
            heroContent.style.opacity = y > 24 ? String(Math.max(0, 1 - (y - 24) / FADE_OVER)) : '';
        }
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${(y * DRIFT * 0.4).toFixed(1)}px)`;
        }
    };

    /* ================================================================== *
     *  SHARED — staggered group reveal (stats, principles)
     * ================================================================== */
    const initStagger = () => {
        const groups = document.querySelectorAll('[data-stagger]');
        if (!groups.length) return;
        document.documentElement.classList.add('has-hud');

        const cascade = group => {
            const kids = Array.from(group.children);
            kids.forEach((child, i) => { child.style.transitionDelay = i * 70 + 'ms'; });
            group.classList.add('stagger-in');
            const settle = kids.length * 70 + 650;
            window.setTimeout(() => {
                kids.forEach(child => { child.style.transitionDelay = ''; });
                group.classList.remove('stagger-in');
                group.classList.add('stagger-done');
            }, reduceMotion ? 0 : settle);
        };

        if (reduceMotion || typeof IntersectionObserver === 'undefined') {
            groups.forEach(g => g.classList.add('stagger-done'));
            return;
        }
        const obs = new IntersectionObserver((entries, o) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    cascade(entry.target);
                    o.unobserve(entry.target);
                }
            });
        }, { threshold: 0.18 });
        groups.forEach(g => obs.observe(g));
    };

    /* ================================================================== *
     *  DESKTOP — pointer tilt + spotlight on cards
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

    /* ================================================================== *
     *  DESKTOP — magnetic hero buttons
     * ================================================================== */
    const initMagnetic = () => {
        document.querySelectorAll('.hero__actions .cta-button, .hero__actions .ghost-button').forEach(btn => {
            const strength = 0.32;
            btn.addEventListener('pointermove', e => {
                const r = btn.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width / 2) * strength;
                const y = (e.clientY - r.top - r.height / 2) * strength;
                btn.style.transform = `translate(${x.toFixed(1)}px, ${(y - 2).toFixed(1)}px)`;
            });
            btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
        });
    };

    /* ================================================================== *
     *  Keyboard — ← / → step through stages (horizontal keys never scroll)
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

    buildOverlays();
    buildTour();
    initStagger();

    if (isDesktop && finePointer && !reduceMotion) {
        initTilt();
        initMagnetic();
    }

    window.addEventListener('keydown', onKeydown);

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

            // feed free-scroll velocity into the hero warp tunnel too
            if (!reduceMotion) {
                const v = Math.abs(y - lastY);
                window.__warpBoost = Math.min(1.4, (window.__warpBoost || 0) + v / 700);
            }
            lastY = y;

            // keep the tour controller in sync with whatever section is centred
            const marker = y + window.innerHeight * 0.4;
            let idx = 0;
            stages.forEach((s, i) => {
                if (marker >= s.el.getBoundingClientRect().top + window.scrollY) idx = i;
            });
            if (idx !== activeIdx) { activeIdx = idx; syncTour(); }

            ticking = false;
        });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
})();
