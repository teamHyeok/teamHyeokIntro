/**
 * interactions.js — the "mission HUD" interaction layer.
 *
 * Turns passive scrolling into a guided, game-like flight through the story:
 *   · a clickable section rail + scroll-progress bar (orientation + jump nav)
 *   · keyboard section stepping (↑/↓ · PageUp/Down · J/K)
 *   · pointer-reactive 3D tilt + spotlight on cards
 *   · magnetic hero buttons
 *   · choreographed staggered reveals + a hero scroll cue
 *
 * Everything degrades: reduced-motion disables the kinetic bits, touch/coarse
 * pointers skip tilt + magnet, and the rail simply navigates.
 */
(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* ------------------------------------------------------------------ *
     *  Section model
     * ------------------------------------------------------------------ */
    const SECTION_DEFS = [
        { id: 'hero', num: '00', label: 'Intro' },
        { id: 'about', num: '01', label: 'Team' },
        { id: 'picks', num: '02', label: 'Picks' },
        { id: 'apps', num: '03', label: 'Works' }
    ];
    const sections = SECTION_DEFS
        .map(def => Object.assign({}, def, { el: document.getElementById(def.id) }))
        .filter(s => s.el);

    const HEADER_OFFSET = 76;   // sticky top-bar clearance

    /* ------------------------------------------------------------------ *
     *  HUD: top progress bar + vertical section rail
     * ------------------------------------------------------------------ */
    let progressFill = null;
    let railFill = null;
    const railNodes = [];
    let activeIdx = -1;

    const scrollToSection = idx => {
        const s = sections[idx];
        if (!s) return;
        // clear the sticky top bar so the section heading isn't tucked behind it
        const top = s.el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    const buildHud = () => {
        if (!sections.length) return;

        // top scroll-progress bar (every viewport)
        const bar = document.createElement('div');
        bar.className = 'scroll-progress';
        progressFill = document.createElement('span');
        progressFill.className = 'scroll-progress__fill';
        bar.appendChild(progressFill);
        document.body.appendChild(bar);

        // vertical rail (shown on wide screens via CSS)
        const rail = document.createElement('nav');
        rail.className = 'nav-rail';
        rail.setAttribute('aria-label', '섹션 바로가기');

        const track = document.createElement('span');
        track.className = 'nav-rail__track';
        railFill = document.createElement('span');
        railFill.className = 'nav-rail__fill';
        track.appendChild(railFill);
        rail.appendChild(track);

        sections.forEach((s, i) => {
            const node = document.createElement('button');
            node.type = 'button';
            node.className = 'nav-rail__node';
            node.setAttribute('aria-label', `${s.label} 섹션으로 이동`);
            node.innerHTML =
                `<span class="nav-rail__num">${s.num}</span>` +
                `<span class="nav-rail__label">${s.label}</span>`;
            node.addEventListener('click', () => scrollToSection(i));
            rail.appendChild(node);
            railNodes.push(node);
        });

        document.body.appendChild(rail);
    };

    const updateHud = () => {
        const scrollTop = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docH > 0 ? Math.min(1, Math.max(0, scrollTop / docH)) : 0;

        if (progressFill) progressFill.style.transform = `scaleX(${progress})`;
        if (railFill) railFill.style.transform = `scaleY(${progress})`;

        // active = last section whose top has crossed 40% of the viewport
        const marker = scrollTop + window.innerHeight * 0.4;
        let idx = 0;
        sections.forEach((s, i) => {
            const top = s.el.getBoundingClientRect().top + window.scrollY;
            if (marker >= top) idx = i;
        });
        if (idx !== activeIdx) {
            activeIdx = idx;
            railNodes.forEach((n, i) => n.classList.toggle('is-active', i === idx));
        }

        // fade the hero scroll cue once the visitor starts moving
        if (scrollCue) scrollCue.classList.toggle('is-gone', scrollTop > 120);
    };

    /* ------------------------------------------------------------------ *
     *  Keyboard section stepping (J / K — power-user shortcut)
     *
     *  Deliberately NOT bound to the arrow / page keys: hijacking those
     *  breaks the universal "nudge the page" expectation. J/K are rarely
     *  used for scrolling, so they add a game-like control without
     *  stealing native behaviour.
     * ------------------------------------------------------------------ */
    const onKeydown = e => {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
        const t = e.target;
        if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;

        let dir = 0;
        if (e.key === 'j' || e.key === 'J') dir = 1;
        else if (e.key === 'k' || e.key === 'K') dir = -1;
        else return;

        const next = Math.min(sections.length - 1, Math.max(0, activeIdx + dir));
        if (next === activeIdx) return;
        e.preventDefault();
        scrollToSection(next);
    };

    /* ------------------------------------------------------------------ *
     *  Pointer-reactive tilt + spotlight
     * ------------------------------------------------------------------ */
    const initTilt = () => {
        if (!finePointer || reduceMotion) return;
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

    /* ------------------------------------------------------------------ *
     *  Magnetic hero buttons
     * ------------------------------------------------------------------ */
    const initMagnetic = () => {
        if (!finePointer || reduceMotion) return;
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

    /* ------------------------------------------------------------------ *
     *  Staggered reveals
     *
     *  A one-shot cascade: when a [data-stagger] group enters view its
     *  children pop in sequence, then we strip the inline delays so any
     *  hover transitions on those children stay snappy afterwards.
     * ------------------------------------------------------------------ */
    const initStagger = () => {
        const groups = document.querySelectorAll('[data-stagger]');
        if (!groups.length) return;

        // Only now do we let CSS hide the children — so if this script never
        // runs, the content stays fully visible (progressive enhancement).
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
        }, { threshold: 0.2 });
        groups.forEach(g => obs.observe(g));
    };

    /* ------------------------------------------------------------------ *
     *  Wire-up
     * ------------------------------------------------------------------ */
    const scrollCue = document.querySelector('.scroll-cue');

    buildHud();
    initStagger();
    initTilt();
    initMagnetic();

    let ticking = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { updateHud(); ticking = false; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('keydown', onKeydown);
    updateHud();
})();
