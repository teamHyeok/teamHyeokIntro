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
    // use the actual viewport width (matches the CSS 769px breakpoint); defaults
    // to the mobile track on any uncertainty rather than forcing the deck
    const isDesktop = window.innerWidth >= 769;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const HEADER_OFFSET = 0;   // panels are full-height; snap aligns them to the top

    /* ================================================================== *
     *  Stage model
     * ================================================================== */
    // MOBILE only: give the Editor's Picks their own scene and turn the numbers
    // into a summary scene right before Works. (Desktop keeps them merged in
    // #stats.) Picks are rendered by main.js before this runs, so we can move
    // the already-built DOM across.
    const picksSection = document.getElementById('picks');
    if (!isDesktop && picksSection) {
        const picksHead = document.querySelector('#stats .stats__picks-head');
        const picksGrid = document.getElementById('featuredList');
        if (picksHead && picksGrid) {
            picksSection.appendChild(picksHead);
            picksSection.appendChild(picksGrid);
            picksSection.removeAttribute('hidden');
            // spotlight pick first (top-left of the gallery)
            const heroCard = picksGrid.querySelector('.feature-card--hero');
            if (heroCard) picksGrid.insertBefore(heroCard, picksGrid.firstChild);
            picksSection.classList.add('picks-gallery');
        }
    }

    // MOBILE only: Works becomes a DRAGGABLE auto-scrolling banner. It drifts
    // slowly leftward on its own, but you can grab and flick through it (native
    // momentum scroll); it loops seamlessly and resumes drifting after release.
    // Desktop keeps its filterable carousel untouched.
    const appListEl = document.getElementById('appList');
    if (!isDesktop && appListEl && appListEl.children.length) {
        appListEl.classList.add('apps-marquee');
        // a banner doesn't filter — hide the chips and soften the copy (mobile only)
        const filtersEl = document.getElementById('appFilters');
        if (filtersEl) filtersEl.style.display = 'none';
        const appsDesc = document.querySelector('#apps .section__header p');
        if (appsDesc) appsDesc.textContent = 'App Store와 웹에 출시한 제품들입니다.';

        // Build the infinite, draggable loop. (Even under reduced-motion you can
        // still flick through it; only the auto-drift below is motion-gated.)
        // clone the set TWICE → three identical sets, so it loops forever in
        // BOTH directions (flick left or right). Clones are decorative.
        const baseCount = appListEl.children.length;
        const originals = [...appListEl.children];
        for (let s = 0; s < 2; s++) {
            originals.forEach(card => {
                const clone = card.cloneNode(true);
                clone.classList.add('is-clone');
                clone.setAttribute('aria-hidden', 'true');
                clone.setAttribute('tabindex', '-1');
                appListEl.appendChild(clone);
            });
        }

        // width of one set = where the 2nd set begins
        let setW = 0;
        const measure = () => {
            const secondSet = appListEl.children[baseCount];
            setW = secondSet ? secondSet.offsetLeft - appListEl.firstElementChild.offsetLeft : 0;
        };
        const recenter = () => { if (setW > 0) appListEl.scrollLeft = setW; };
        measure();
        recenter();                       // start in the middle set (runway both ways)
        window.addEventListener('load', () => { measure(); recenter(); });
        window.addEventListener('resize', () => { measure(); recenter(); });

        // jump back to the middle set whenever we drift a full set away — the
        // sets are identical, so the jump is invisible (seamless infinite loop)
        const wrap = () => {
            if (setW <= 0) return;
            const sl = appListEl.scrollLeft;
            if (sl < setW * 0.5) appListEl.scrollLeft = sl + setW;
            else if (sl >= setW * 1.5) appListEl.scrollLeft = sl - setW;
        };
        appListEl.addEventListener('scroll', wrap, { passive: true });

        // a finger-down pauses the auto-drift; it resumes ~1.5s after release so
        // any flick/momentum can play out first
        let dragging = false, resumeT = 0;
        const grab = () => { dragging = true; clearTimeout(resumeT); };
        const release = () => { clearTimeout(resumeT); resumeT = setTimeout(() => { dragging = false; }, 1500); };
        appListEl.addEventListener('pointerdown', grab, { passive: true });
        appListEl.addEventListener('pointerup', release, { passive: true });
        appListEl.addEventListener('pointercancel', release, { passive: true });

        // auto-drift: a slow, continuous leftward scroll. Runs regardless of the
        // deck/reduced-motion state (a gentle horizontal banner the owner wants),
        // and self-heals setW if the first measure ran before layout settled.
        const SPEED = 0.6;   // px per frame (~36px/s — a slow drift)
        const tick = () => {
            if (setW <= 0) { measure(); recenter(); }
            else if (!dragging && document.visibilityState !== 'hidden') {
                appListEl.scrollLeft += SPEED;
                wrap();
            }
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    const STAGE_DEFS = isDesktop
        ? [
            { id: 'hero', num: '01', label: 'Intro' },
            { id: 'about', num: '02', label: 'Team' },
            { id: 'stats', num: '03', label: 'Highlights' },
            { id: 'apps', num: '04', label: 'Works' }
        ]
        : [
            { id: 'hero', num: '01', label: 'Intro' },
            { id: 'about', num: '02', label: 'Team' },
            { id: 'picks', num: '03', label: 'Picks' },
            { id: 'stats', num: '04', label: 'Numbers' },
            { id: 'apps', num: '05', label: 'Works' }
        ];
    const stages = STAGE_DEFS
        .map(def => Object.assign({}, def, { el: document.getElementById(def.id) }))
        .filter(s => s.el);
    let activeIdx = 0;
    let navLock = 0;
    // assigned by the mobile transform-deck branch so shared wire-up (data-jump
    // buttons) can drive the deck instead of a native scroll
    let mobileGoScene = null;

    /* ================================================================== *
     *  Staccato entrance choreography
     * ================================================================== */
    // ordered selectors whose matches pop in, one after another, per stage
    const STAGE_FX = {
        hero: ['.hero__eyebrow', '.hero__line', '.hero__subtitle', '.hero__actions', '.hero-cluster'],
        about: ['.section__header', '.principle'],
        // desktop: numbers + picks share #stats; mobile: numbers only (picks → #picks)
        stats: isDesktop
            ? ['.stats__header', '.stat', '.stats__picks-head', '.feature-card', '.works-cta']
            : ['.stats__header', '.stat'],
        picks: ['.stats__picks-head', '.feature-card'],
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
    let deckHint = null;
    const buildOverlays = () => {
        const bar = document.createElement('div');
        bar.className = 'scroll-progress';
        progressFill = document.createElement('span');
        progressFill.className = 'scroll-progress__fill';
        bar.appendChild(progressFill);
        document.body.appendChild(bar);

        // a quiet vertical-swipe hint for the mobile deck — the tour controller is
        // hidden there, so otherwise the up/down swipe affordance is invisible.
        // syncTour() flips its direction (down on normal scenes, up on the last).
        deckHint = document.createElement('div');
        deckHint.className = 'deck-hint at-first';   // deck starts on the hero (its own cue)
        deckHint.setAttribute('aria-hidden', 'true');
        deckHint.innerHTML = '<span class="deck-hint__chev"></span><span class="deck-hint__label">SWIPE</span>';
        document.body.appendChild(deckHint);
    };

    // nudge the hero warp tunnel (only visible while the Intro stage is on screen)
    const fireWarp = () => {
        if (!reduceMotion) window.__warpBoost = 1.4;
    };

    /* ================================================================== *
     *  Tour controller
     * ================================================================== */
    let elIdx = null, elName = null, elPrev = null, elNext = null;
    const dotEls = [];

    const goTo = idx => {
        const i = Math.max(0, Math.min(stages.length - 1, idx));
        const dir = i >= activeIdx ? 1 : -1;
        stages[i].el.scrollTop = 0;   // always present the stage from its top (no clipped middle)
        const top = stages[i].el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
        activeIdx = i;
        navLock = Date.now() + 800;
        syncTour();
        fireWarp(dir);
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
        if (deckHint) {
            deckHint.classList.toggle('at-first', activeIdx === 0);              // hero owns the cue
            deckHint.classList.toggle('at-last', activeIdx === stages.length - 1); // points up
        }
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
     *  Discrete scene navigation — one wheel / swipe / key = one scene
     * ================================================================== */
    let gestureLock = false;
    const lockGesture = () => { gestureLock = true; window.setTimeout(() => { gestureLock = false; }, 760); };

    // does the active panel still have room to scroll inside, in this direction?
    // ignore negligible overflow so a stage that's only a hair taller than the
    // screen still advances on a flick instead of "eating" the gesture
    const innerCanScroll = dir => {
        const panel = stages[activeIdx] && stages[activeIdx].el;
        if (!panel || panel.scrollHeight - panel.clientHeight <= 12) return false;
        const atTop = panel.scrollTop <= 4;
        const atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 4;
        return (dir > 0 && !atBottom) || (dir < 0 && !atTop);
    };

    const step = dir => {
        const next = activeIdx + dir;
        if (next < 0 || next >= stages.length) return;
        lockGesture();
        goTo(next);
    };

    const onWheel = e => {
        if (reduceMotion || Math.abs(e.deltaY) < 6) return;
        const dir = e.deltaY > 0 ? 1 : -1;
        if (innerCanScroll(dir)) return;          // tall stage scrolls inside first
        e.preventDefault();                        // block the free page scroll
        if (!gestureLock) step(dir);
    };

    // touch swipe (mobile): one swipe = one scene, unless the panel scrolls inside
    let touchY = null;
    const onTouchStart = e => { touchY = e.touches[0].clientY; };
    const onTouchEnd = e => {
        if (reduceMotion || touchY == null) return;
        const dy = touchY - e.changedTouches[0].clientY;
        touchY = null;
        if (Math.abs(dy) < 45) return;
        const dir = dy > 0 ? 1 : -1;
        if (innerCanScroll(dir) || gestureLock) return;
        step(dir);
    };

    const onKeydown = e => {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
        const t = e.target;
        if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
        const key = e.key;
        if (key === 'ArrowDown' || key === 'ArrowRight' || key === 'PageDown' || key === ' ') {
            if (innerCanScroll(1)) return;
            e.preventDefault(); if (!gestureLock) step(1);
        } else if (key === 'ArrowUp' || key === 'ArrowLeft' || key === 'PageUp') {
            if (innerCanScroll(-1)) return;
            e.preventDefault(); if (!gestureLock) step(-1);
        }
    };

    /* ================================================================== *
     *  Wire-up
     * ================================================================== */
    const scrollCue = document.querySelector('.scroll-cue');

    buildStageFx();
    buildOverlays();

    // quick-jump shortcuts work on both tracks (desktop warps, mobile scrolls)
    document.querySelectorAll('[data-jump]').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = stages.findIndex(s => s.id === btn.dataset.jump);
            if (i < 0) return;
            if (isDesktop) goTo(i);
            else if (mobileGoScene) mobileGoScene(i);
            else stages[i].el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        });
    });

    let ticking = false;
    let lastY = window.scrollY;
    const updateProgress = () => {
        const y = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docH > 0 ? Math.min(1, Math.max(0, y / docH)) : 0;
        if (progressFill) progressFill.style.transform = `scaleX(${progress})`;
        return y;
    };

    if (isDesktop) {
        /* ============================================================ *
         *  DESKTOP — stepped warp deck
         * ============================================================ */
        buildTour();
        if (finePointer && !reduceMotion) { initTilt(); initMagnetic(); }
        window.addEventListener('keydown', onKeydown);
        if (!reduceMotion) {
            window.addEventListener('wheel', onWheel, { passive: false });
            window.addEventListener('touchstart', onTouchStart, { passive: true });
            window.addEventListener('touchend', onTouchEnd, { passive: true });
        }

        const startChoreo = () => playStage(activeIdx);
        if (reduceMotion) {
            document.documentElement.classList.add('fx-off');
        } else if (document.body.classList.contains('is-loaded')) {
            window.setTimeout(startChoreo, 250);
        } else {
            window.addEventListener('load', () => window.setTimeout(startChoreo, 1000), { once: true });
        }
        window.setTimeout(() => {
            if (!document.querySelector('.stage-on')) document.documentElement.classList.add('fx-off');
        }, 4000);

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const y = updateProgress();
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
    } else {
        /* ============================================================ *
         *  MOBILE — JS transform deck. Each swipe slides <main> by one
         *  full screen (translateY), so transitions are fully controlled
         *  and smooth — no native scroll-snap jank. A scene taller than
         *  the screen scrolls inside first; the next flick advances. Every
         *  arrival replays the staccato choreography + a warp pulse.
         * ============================================================ */
        const hero = document.querySelector('.hero');
        const cue = scrollCue;
        const main = document.querySelector('main');
        const supportsSvh = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('height', '100svh');

        if (reduceMotion || !main || !supportsSvh || typeof requestAnimationFrame === 'undefined') {
            /* ---- fallback: a plain, natural-scroll page (content visible) ---- */
            if (reduceMotion || typeof IntersectionObserver === 'undefined') {
                document.documentElement.classList.add('fx-off');
            } else {
                const io = new IntersectionObserver((entries, obs) => {
                    entries.forEach(en => {
                        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
                    });
                }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
                document.querySelectorAll('.fx').forEach(el => { if (!el.closest('#hero')) io.observe(el); });
                document.querySelectorAll('#hero .fx').forEach(el => el.classList.add('in'));
                if (hero) window.setTimeout(() => hero.classList.add('cue-on'), 1200);
                window.addEventListener('scroll', () => { if (cue) cue.classList.add('is-gone'); }, { once: true, passive: true });
                window.setTimeout(() => {
                    if (!document.querySelector('.fx.in')) document.documentElement.classList.add('fx-off');
                }, 6500);
            }
            const onScrollFb = () => {
                if (ticking) return;
                ticking = true;
                requestAnimationFrame(() => { updateProgress(); ticking = false; });
            };
            window.addEventListener('scroll', onScrollFb, { passive: true });
            onScrollFb();
        } else {
            /* ---- the transform deck: DIRECT MANIPULATION ----
               The deck follows your finger 1:1 as you drag, then settles to the
               nearest scene on release (by distance OR flick velocity) with a
               snappy ease-out. Feels connected and smooth, not a stiff snap. */
            const last = stages.length - 1;
            let scene = 0;
            let H = window.innerHeight;          // px height of one scene (== 100svh)
            const measure = () => { H = stages[0].el.getBoundingClientRect().height || window.innerHeight; };

            // toggle the eased CSS transition off (track finger) / on (settle).
            // '' restores the rule in main.css (the single source of the curve)
            const ease = on => { main.style.transition = on ? '' : 'none'; };
            const place = px => { main.style.transform = `translateY(${px}px)`; };
            const rest = () => place(-scene * H);

            const setProgress = () => {
                if (progressFill) progressFill.style.transform = `scaleX(${last ? scene / last : 0})`;
            };

            // mark a scene as the active one: reset its inner scroll, replay the
            // staccato choreography, pulse the warp, sync cue + progress
            const arrive = i => {
                scene = i;
                const el = stages[i].el;
                if (el) el.scrollTop = 0;
                playStage(i);
                fireWarp();
                setProgress();
                if (cue) cue.classList.toggle('is-gone', i !== 0);
                if (hero) hero.classList.toggle('cue-on', i === 0);
            };

            let settling = false, settleTimer = 0;
            const settleTo = (n, changed) => {
                const t = Math.max(0, Math.min(last, n));
                measure();
                ease(true);
                if (changed && t !== scene) arrive(t); else scene = t;
                rest();
                settling = true;
                window.clearTimeout(settleTimer);
                settleTimer = window.setTimeout(() => { settling = false; }, 560);
            };

            // programmatic nav (keyboard, the "전부 둘러보기" button)
            const goScene = n => {
                const t = Math.max(0, Math.min(last, n));
                if (t === scene) return;
                settleTo(t, true);
            };
            mobileGoScene = goScene;

            /* ---- finger tracking ---- */
            let sx = 0, sy = 0, sT = 0, base = 0, mode = null, canUp = false, canDown = false;

            const onStart = e => {
                if (e.touches.length !== 1 || settling) { mode = 'ignore'; return; }
                const t = e.touches[0];
                sx = t.clientX; sy = t.clientY; sT = Date.now();
                measure();
                base = -scene * H;
                mode = null;                       // undecided until the finger commits
                // Can the active scene scroll INSIDE before the swipe turns the page?
                // Only when it's genuinely scrollable (overflow auto/scroll — excludes
                // the hero) AND genuinely overflows. A scene that merely fits, or
                // overflows by a hair, must NOT eat the swipe (that was the "first
                // swipe does nothing" bug).
                const el = stages[scene].el;
                const oy = el ? getComputedStyle(el).overflowY : 'visible';
                const room = el ? el.scrollHeight - el.clientHeight : 0;
                const scrollable = !!el && (oy === 'auto' || oy === 'scroll') && room > 24;
                canDown = scrollable && el.scrollTop + el.clientHeight < el.scrollHeight - 4;
                canUp = scrollable && el.scrollTop > 4;
            };

            const onMove = e => {
                if (mode === 'ignore' || mode === 'native') return;
                const t = e.touches[0];
                const dx = t.clientX - sx, dy = t.clientY - sy;
                if (mode === null) {
                    if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;       // wait for intent
                    if (Math.abs(dx) > Math.abs(dy)) { mode = 'native'; return; }   // horizontal → carousel
                    const dir = dy < 0 ? 1 : -1;                            // swipe up = next scene
                    if ((dir > 0 && canDown) || (dir < 0 && canUp)) { mode = 'native'; return; }  // scroll inside first
                    mode = 'deck';
                    ease(false);                   // from here we drive the transform
                }
                if (mode === 'deck') {
                    e.preventDefault();            // block native scroll while we own the gesture
                    let move = dy;
                    if ((scene === 0 && move > 0) || (scene === last && move < 0)) move *= 0.34;  // rubber-band at the ends
                    place(base + move);
                }
            };

            const onEnd = e => {
                if (mode !== 'deck') { mode = null; return; }
                mode = null;
                const t = e.changedTouches[0];
                const dy = t.clientY - sy;          // < 0 → swiped up → next
                const dt = (Date.now() - sT) || 1;
                const vel = dy / dt;                // px/ms
                const dist = H * 0.16;              // ~16% of the screen commits the turn
                let target = scene;
                if ((dy < -dist || vel < -0.45) && scene < last) target = scene + 1;
                else if ((dy > dist || vel > 0.45) && scene > 0) target = scene - 1;
                settleTo(target, target !== scene);
            };

            window.addEventListener('touchstart', onStart, { passive: true });
            window.addEventListener('touchmove', onMove, { passive: false });   // needs preventDefault
            window.addEventListener('touchend', onEnd, { passive: true });
            window.addEventListener('touchcancel', () => { if (mode === 'deck') settleTo(scene, false); mode = null; }, { passive: true });

            // arrow / page keys (hardware keyboards, accessibility)
            window.addEventListener('keydown', e => {
                if (settling || e.metaKey || e.ctrlKey || e.altKey) return;
                const tg = e.target;
                if (tg && (/^(INPUT|TEXTAREA|SELECT)$/.test(tg.tagName) || tg.isContentEditable)) return;
                if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); goScene(scene + 1); }
                else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goScene(scene - 1); }
            });

            window.addEventListener('orientationchange', () => { window.setTimeout(() => { measure(); ease(true); rest(); }, 60); }, { passive: true });

            // Apply the deck layout NOW and KEEP it. The loading screen hides the
            // page until is-loaded, so the deck is already in place at reveal time.
            // mdeck is never removed by any failsafe — removing it would unlock the
            // page into a tall natural scroll with the choreography content still
            // hidden (that was the blank-page bug on slow connections).
            window.scrollTo(0, 0);
            document.documentElement.classList.add('mdeck');
            setProgress();

            // Play the hero entrance the moment the page is actually shown
            // (body.is-loaded, set by main.js after load). Tie it to that class via
            // a MutationObserver — NOT the raw load event — with a hard cap so it can
            // never hang. Runs exactly once and never re-hides content.
            let introRan = false;
            const intro = () => {
                if (introRan) return;
                introRan = true;
                // warp owns the screen for a beat, then the headline rises in
                window.setTimeout(() => { playStage(0); fireWarp(); }, 480);
                window.setTimeout(() => { if (hero) hero.classList.add('cue-on'); }, 1680);
            };
            if (document.body.classList.contains('is-loaded')) {
                intro();
            } else if (typeof MutationObserver !== 'undefined') {
                const mo = new MutationObserver(() => {
                    if (document.body.classList.contains('is-loaded')) { mo.disconnect(); intro(); }
                });
                mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
                window.setTimeout(() => { mo.disconnect(); intro(); }, 9000);   // never hang
            } else {
                window.addEventListener('load', () => window.setTimeout(intro, 1100), { once: true });
                window.setTimeout(intro, 9000);
            }

            // Last-resort safety: content must NEVER stay hidden. If no scene has
            // revealed in time, force everything visible. This only ADDS fx-off and
            // keeps mdeck, so the deck still slides — it can never blank the page.
            window.setTimeout(() => {
                if (!document.querySelector('.stage-on')) document.documentElement.classList.add('fx-off');
            }, 10000);

            window.addEventListener('resize', setProgress, { passive: true });
        }
    }
})();
