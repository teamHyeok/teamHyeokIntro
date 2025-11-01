document.documentElement.classList.add('has-js');

const apps = [
    {
        name: '냥냥 튜너',
        category: 'Music Utility',
        description: '고양이의 감성을 담은 튜닝 도구, 냥냥 튜너와 함께 악기를 세밀하게 조율해보세요.',
        status: 'Beta',
        launch: '2024',
        link: 'services/nyangnyang-tuner/'
    }
];

const appList = document.getElementById('appList');

if (appList) {
    apps.forEach(app => {
        const card = document.createElement('a');
        card.className = 'app-card';
        card.href = app.link;
        card.setAttribute('data-animate', '');

        card.innerHTML = `
            <span class="app-card__badge">${app.category}</span>
            <h3 class="app-card__title">${app.name}</h3>
            <p class="app-card__description">${app.description}</p>
            <div class="app-card__meta">
                <span class="app-card__pill">상태 ${app.status}</span>
                <span class="app-card__pill">출시 ${app.launch}</span>
            </div>
            <span class="app-card__cta">자세히 보기 →</span>
        `;

        appList.appendChild(card);
    });
}

const animatedElements = document.querySelectorAll('[data-animate]');

if (animatedElements.length) {
    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.2,
        }
    );

    animatedElements.forEach(el => observer.observe(el));
}

const heroVisual = document.querySelector('.hero__visual');
if (heroVisual) {
    heroVisual.addEventListener('pointermove', event => {
        const rect = heroVisual.getBoundingClientRect();
        const xRatio = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
        const yRatio = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
        heroVisual.style.transform = `perspective(900px) rotateX(${-yRatio}deg) rotateY(${xRatio}deg)`;
    });

    heroVisual.addEventListener('pointerleave', () => {
        heroVisual.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
}

const yearSpan = document.getElementById('currentYear');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
