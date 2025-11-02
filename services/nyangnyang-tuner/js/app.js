(function () {
    const stage = document.querySelector('.mascot-stage');
    const parallaxItems = stage ? stage.querySelectorAll('[data-depth]') : [];
    const motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const allowMotion = motionQuery ? !motionQuery.matches : true;

    if (stage && allowMotion) {
        const setParallax = (xRatio, yRatio) => {
            const rotateX = (0.5 - yRatio) * 18;
            const rotateY = (xRatio - 0.5) * 18;
            stage.style.setProperty('--tilt-x', `${rotateX}deg`);
            stage.style.setProperty('--tilt-y', `${rotateY}deg`);

            parallaxItems.forEach(item => {
                const depth = Number.parseFloat(item.dataset.depth || '0');
                const offsetX = (xRatio - 0.5) * depth * 80;
                const offsetY = (yRatio - 0.5) * depth * 80;
                item.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
            });
        };

        const handlePointerMove = event => {
            const rect = stage.getBoundingClientRect();
            const xRatio = (event.clientX - rect.left) / rect.width;
            const yRatio = (event.clientY - rect.top) / rect.height;
            setParallax(xRatio, yRatio);
        };

        const resetStage = () => {
            stage.style.setProperty('--tilt-x', '0deg');
            stage.style.setProperty('--tilt-y', '0deg');
            parallaxItems.forEach(item => {
                item.style.transform = 'translate3d(0, 0, 0)';
            });
        };

        stage.addEventListener('pointermove', handlePointerMove);
        stage.addEventListener('pointerleave', resetStage);

        if (motionQuery) {
            const handleMotionChange = event => {
                if (event.matches) {
                    resetStage();
                    stage.removeEventListener('pointermove', handlePointerMove);
                    stage.removeEventListener('pointerleave', resetStage);
                }
            };

            if (typeof motionQuery.addEventListener === 'function') {
                motionQuery.addEventListener('change', handleMotionChange);
            } else if (typeof motionQuery.addListener === 'function') {
                motionQuery.addListener(handleMotionChange);
            }
        }
    }

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.setProperty('--feature-index', index);
    });

    const badges = document.querySelectorAll('.hero-badge');
    badges.forEach((badge, index) => {
        badge.style.setProperty('--badge-index', index);
    });
})();
