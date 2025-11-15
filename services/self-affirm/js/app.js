(function () {
    const motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const allowMotion = motionQuery ? !motionQuery.matches : true;

    const stage = document.querySelector('.affirm-stage');
    const device = document.querySelector('.affirm-flow__visual');

    const setTilt = (element, xRatio, yRatio, options = {}) => {
        const {
            xProperty = '--tilt-x',
            yProperty = '--tilt-y',
            maxTilt = 12,
        } = options;

        const centeredX = (xRatio - 0.5) * maxTilt;
        const centeredY = (0.5 - yRatio) * maxTilt;
        element.style.setProperty(xProperty, `${centeredY}deg`);
        element.style.setProperty(yProperty, `${centeredX}deg`);
    };

    if (stage && allowMotion) {
        const handlePointer = event => {
            const rect = stage.getBoundingClientRect();
            const xRatio = (event.clientX - rect.left) / rect.width;
            const yRatio = (event.clientY - rect.top) / rect.height;
            setTilt(stage, xRatio, yRatio, { maxTilt: 16 });
        };

        const resetStage = () => {
            stage.style.setProperty('--tilt-x', '0deg');
            stage.style.setProperty('--tilt-y', '0deg');
        };

        stage.addEventListener('pointermove', handlePointer);
        stage.addEventListener('pointerleave', resetStage);

        if (motionQuery) {
            const handlePreferenceChange = event => {
                if (event.matches) {
                    resetStage();
                    stage.removeEventListener('pointermove', handlePointer);
                    stage.removeEventListener('pointerleave', resetStage);
                }
            };

            if (typeof motionQuery.addEventListener === 'function') {
                motionQuery.addEventListener('change', handlePreferenceChange);
            } else if (typeof motionQuery.addListener === 'function') {
                motionQuery.addListener(handlePreferenceChange);
            }
        }
    }

    if (device && allowMotion) {
        const deviceElement = device.querySelector('.affirm-flow__device');
        if (deviceElement) {
            const handlePointer = event => {
                const rect = device.getBoundingClientRect();
                const xRatio = (event.clientX - rect.left) / rect.width;
                const yRatio = (event.clientY - rect.top) / rect.height;
                setTilt(deviceElement, xRatio, yRatio, {
                    xProperty: '--device-tilt-x',
                    yProperty: '--device-tilt-y',
                    maxTilt: 10,
                });
            };

            const resetDevice = () => {
                deviceElement.style.setProperty('--device-tilt-x', '0deg');
                deviceElement.style.setProperty('--device-tilt-y', '0deg');
            };

            device.addEventListener('pointermove', handlePointer);
            device.addEventListener('pointerleave', resetDevice);

            if (motionQuery) {
                const handlePreferenceChange = event => {
                    if (event.matches) {
                        resetDevice();
                        device.removeEventListener('pointermove', handlePointer);
                        device.removeEventListener('pointerleave', resetDevice);
                    }
                };

                if (typeof motionQuery.addEventListener === 'function') {
                    motionQuery.addEventListener('change', handlePreferenceChange);
                } else if (typeof motionQuery.addListener === 'function') {
                    motionQuery.addListener(handlePreferenceChange);
                }
            }
        }
    }

    const badges = document.querySelectorAll('.hero-badge');
    badges.forEach((badge, index) => {
        badge.style.setProperty('--badge-index', index);
    });
})();
