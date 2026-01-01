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

const REVEAL_DELAY = 1900;
const LOADER_FALLBACK_DELAY = REVEAL_DELAY + 2200;

if (pageFrame && !revealOverlay) {
    pageFrame.addEventListener(
        'animationend',
        event => {
            if (event.animationName === 'page-unveil') {
                document.body.classList.remove('is-revealing');
            }
        },
        { once: true }
    );
}

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
        {
            threshold: 0.2,
        }
    );

    animatedElements.forEach(el => observeAnimateElement(el));
};

const getPublishedTime = entry => new Date(entry.publishedAt || entry.date || '').getTime() || 0;

const createMagazineCard = entry => {
    const card = document.createElement('article');
    card.className = 'magazine-card';
    if (entry.highlight) {
        card.classList.add('magazine-card--spotlight');
    }
    card.setAttribute('data-animate', '');

    if (entry.image && entry.image.src) {
        const cover = document.createElement('div');
        cover.className = 'magazine-card__cover';
        const img = document.createElement('img');
        img.src = entry.image.src;
        img.alt = entry.image.alt || '';
        cover.appendChild(img);
        card.appendChild(cover);
    }

    const body = document.createElement('div');
    body.className = 'magazine-card__body';

    if (entry.label) {
        const label = document.createElement('div');
        label.className = 'magazine-card__label';
        label.textContent = entry.label;
        body.appendChild(label);
    }

    if (entry.title) {
        const title = document.createElement('h3');
        title.className = 'magazine-card__title';
        title.textContent = entry.title;
        body.appendChild(title);
    }

    if (entry.excerpt) {
        const excerpt = document.createElement('p');
        excerpt.className = 'magazine-card__excerpt';
        excerpt.textContent = entry.excerpt;
        body.appendChild(excerpt);
    }

    if (entry.quote) {
        const quote = document.createElement('p');
        quote.className = 'magazine-card__quote';
        quote.textContent = `“${entry.quote.replace(/^“|”$/g, '')}”`;
        body.appendChild(quote);
    }

    if (Array.isArray(entry.chips) && entry.chips.length) {
        const meta = document.createElement('div');
        meta.className = 'magazine-card__meta';
        entry.chips.forEach(chipText => {
            const chip = document.createElement('span');
            chip.className = 'magazine-chip';
            chip.textContent = chipText;
            meta.appendChild(chip);
        });
        body.appendChild(meta);
    }

    const targetLink = entry.link || (entry.slug ? `magazine/?slug=${encodeURIComponent(entry.slug)}` : '');

    if (targetLink) {
        const cta = document.createElement('a');
        cta.className = 'magazine-card__link';
        cta.href = targetLink;
        cta.textContent = '자세히 보기 →';
        cta.setAttribute('aria-label', `${entry.title || '매거진'} 자세히 보기`);
        body.appendChild(cta);
    }

    card.appendChild(body);
    observeAnimateElement(card);
    return card;
};

const loadMagazine = async () => {
    const magazineList = document.getElementById('magazineList');
    if (!magazineList) return;
    magazineList.innerHTML = '';
    try {
        const response = await fetch('assets/data/magazine.json', { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error('매거진 데이터를 불러오지 못했습니다.');
        }
        const entries = await response.json();
        if (!Array.isArray(entries) || !entries.length) return;
        const sorted = entries.slice().sort((a, b) => getPublishedTime(b) - getPublishedTime(a));
        const latest = sorted[0];
        const card = createMagazineCard(latest);
        magazineList.appendChild(card);
    } catch (error) {
        const fallback = document.createElement('p');
        fallback.className = 'magazine-card__excerpt';
        fallback.textContent = '매거진을 불러오는 데 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
        magazineList.appendChild(fallback);
        console.error(error);
    }
};

const apps = [
    {
        name: '자기암시',
        category: 'Mind Ritual',
        description: '목소리로 나를 설득하는 루틴, 자기암시 앱에서 하루를 디자인해보세요.',
        status: 'iOS 배포',
        launch: 'Android 1월 예정',
        link: 'services/self-affirm/'
    },
    {
        name: '냥냥 튜너',
        category: 'Music Utility',
        description: '고양이의 감성을 담은 튜닝 도구, 냥냥 튜너와 함께 악기를 세밀하게 조율해보세요.',
        status: 'iOS 배포',
        launch: 'Android 1월 예정',
        link: 'services/nyangnyang-tuner/'
    },
    {
        name: '주짓수 대회 보드',
        category: 'Community · Web',
        description: '전국 주짓수 대회를 달력과 지도에서 한눈에 확인하고 바로 이동하세요.',
        status: '운영중',
        launch: '2024',
        link: 'services/jiujitsu/'
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
                <span class="app-card__pill">${app.status}</span>
                <span class="app-card__pill">${app.launch}</span>
            </div>
            <span class="app-card__cta">자세히 보기 →</span>
        `;

        appList.appendChild(card);
    });
}

loadMagazine();
initAnimateObserver();

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
