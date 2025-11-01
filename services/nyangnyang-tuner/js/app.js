(function () {
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-6px)';
            card.style.boxShadow = '0 18px 28px rgba(45, 55, 72, 0.18)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 12px 24px rgba(45, 55, 72, 0.1)';
        });

        card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        card.style.setProperty('--feature-index', index);
    });
})();
