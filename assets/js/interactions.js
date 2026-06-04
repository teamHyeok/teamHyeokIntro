/**
 * interactions.js — motion layer that makes the content feel alive on scroll.
 *
 * Desktop and mobile are handled as two separate, self-contained tracks so
 * each can be tuned to its own optimum:
 *   SHARED   · scroll-progress bar, hero depart-parallax, staggered reveals
 *   DESKTOP  · pointer tilt + spotlight on cards, magnetic hero buttons
 *   MOBILE   · (press feedback lives in CSS; JS keeps the parallax gentle)
 *
 * Degrades cleanly: reduced-motion skips the kinetic parts; the reveal-hiding
 * is gated on a JS-set class so content never gets stuck invisible.
 */
(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(min-width: 769px)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* ================================================================== *
     *  SHARED — scroll progress bar
     * ================================================================== */
    let progressFill = null;
    const buildProgressBar = () => {
        const bar = document.createElement('div');
        bar.className = 'scroll-progress';
        progressFill = document.createElement('span');
        progressFill.className = 'scroll-progress__fill';
        bar.appendChild(progressFill);
        document.body.appendChild(bar);
    };

    /* ================================================================== *
     *  SHARED — hero depart parallax (content drifts up + fades on scroll)
     * ================================================================== */
    const heroContent = document.querySelector('.hero__content');
    const heroVisual = document.querySelector('.hero__visual');
    // mobile gets a gentler drift and no fade so nothing crowds the names bar
    const DRIFT = isDesktop ? 0.22 : 0.12;
    const FADE_OVER = isDesktop ? 520 : 9999;   // px of scroll to fully fade (off on mobile)

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

        // only now let CSS hide the children — if this script never runs the
        // content stays fully visible (progressive enhancement)
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
     *  Wire-up
     * ================================================================== */
    const scrollCue = document.querySelector('.scroll-cue');

    buildProgressBar();
    initStagger();

    // DESKTOP-only kinetic flourishes
    if (isDesktop && finePointer && !reduceMotion) {
        initTilt();
        initMagnetic();
    }

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

            // feed scroll velocity into the hero warp tunnel — it lunges when you
            // scroll and the canvas decays it back to cruise (see main.js)
            if (!reduceMotion) {
                const v = Math.abs(y - lastY);
                window.__warpBoost = Math.min(1.4, (window.__warpBoost || 0) + v / 700);
            }
            lastY = y;
            ticking = false;
        });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
})();
