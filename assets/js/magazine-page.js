document.documentElement.classList.add('has-js');

const listEl = document.getElementById('magazineList');
const detailEl = document.getElementById('magazineDetail');
const yearSpan = document.getElementById('currentYear');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

const getPublishedTime = entry => new Date(entry.publishedAt || entry.date || '').getTime() || 0;

const renderList = (entries, activeSlug) => {
    listEl.innerHTML = '';
    if (!entries.length) {
        const empty = document.createElement('p');
        empty.className = 'magazine-empty';
        empty.textContent = '등록된 매거진이 없습니다.';
        listEl.appendChild(empty);
        return;
    }

    entries.forEach(entry => {
        const item = document.createElement('a');
        item.className = 'magazine-list__item';
        item.href = `?slug=${encodeURIComponent(entry.slug || '')}#magazineDetail`;
        item.dataset.slug = entry.slug;

        const title = document.createElement('h3');
        title.className = 'magazine-list__title';
        title.textContent = entry.title || '제목 미정';
        item.appendChild(title);

        const meta = document.createElement('div');
        meta.className = 'magazine-list__meta';
        if (entry.publishedAt) {
            const date = document.createElement('span');
            date.textContent = entry.publishedAt;
            meta.appendChild(date);
        }
        if (entry.label) {
            const label = document.createElement('span');
            label.textContent = entry.label;
            meta.appendChild(label);
        }
        item.appendChild(meta);

        const excerpt = document.createElement('p');
        excerpt.className = 'magazine-card__excerpt';
        excerpt.textContent = entry.excerpt || '';
        item.appendChild(excerpt);

        if (entry.slug === activeSlug) {
            item.setAttribute('aria-current', 'true');
        }

        item.addEventListener('click', event => {
            event.preventDefault();
            const url = new URL(window.location.href);
            url.searchParams.set('slug', entry.slug);
            window.history.replaceState({}, '', `${url.pathname}?${url.searchParams.toString()}#magazineDetail`);
            renderDetail(entry);
            renderList(entries, entry.slug);
            // On the stacked mobile layout the detail sits below the list, so
            // bring it into view to confirm the selection changed.
            if (window.matchMedia('(max-width: 768px)').matches) {
                detailEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        listEl.appendChild(item);
    });
};

const renderDetail = entry => {
    detailEl.innerHTML = '';
    if (!entry) {
        const empty = document.createElement('p');
        empty.className = 'magazine-empty';
        empty.textContent = '매거진을 선택하면 전체 글을 볼 수 있습니다.';
        detailEl.appendChild(empty);
        return;
    }

    if (entry.image && entry.image.src) {
        const cover = document.createElement('div');
        cover.className = 'magazine-detail__cover';
        const img = document.createElement('img');
        img.src = `../${entry.image.src}`;
        img.alt = entry.image.alt || '';
        img.loading = 'lazy';
        if (entry.image.width) img.width = entry.image.width;
        if (entry.image.height) img.height = entry.image.height;
        cover.appendChild(img);
        detailEl.appendChild(cover);
    }

    if (entry.publishedAt) {
        const date = document.createElement('div');
        date.className = 'magazine-detail__date';
        date.textContent = entry.publishedAt;
        detailEl.appendChild(date);
    }

    const title = document.createElement('h3');
    title.className = 'magazine-detail__title';
    title.textContent = entry.title || '제목 미정';
    detailEl.appendChild(title);

    if (entry.quote) {
        const quote = document.createElement('p');
        quote.className = 'magazine-card__quote';
        quote.textContent = `“${entry.quote.replace(/^“|”$/g, '')}”`;
        detailEl.appendChild(quote);
    }

    if (Array.isArray(entry.chips) && entry.chips.length) {
        const chips = document.createElement('div');
        chips.className = 'magazine-detail__chips';
        entry.chips.forEach(text => {
            const chip = document.createElement('span');
            chip.className = 'magazine-chip';
            chip.textContent = text;
            chips.appendChild(chip);
        });
        detailEl.appendChild(chips);
    }

    if (Array.isArray(entry.body) && entry.body.length) {
        const body = document.createElement('div');
        body.className = 'magazine-detail__body';
        entry.body.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            body.appendChild(p);
        });
        detailEl.appendChild(body);
    } else if (entry.excerpt) {
        const p = document.createElement('p');
        p.className = 'magazine-detail__body';
        p.textContent = entry.excerpt;
        detailEl.appendChild(p);
    }
};

const injectStructuredData = entries => {
    if (!entries.length) return;
    const site = 'https://teamhyeok.com';
    const data = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: '팀혁 매거진',
        description: '제품을 만들며 배운 것들을 기록하는 팀혁의 인사이트 매거진.',
        url: `${site}/magazine/`,
        publisher: { '@type': 'Organization', name: '팀혁 TeamHyeok', url: site },
        blogPost: entries.map(entry => ({
            '@type': 'BlogPosting',
            headline: entry.title || '제목 미정',
            description: entry.excerpt || '',
            datePublished: entry.publishedAt || undefined,
            url: `${site}/magazine/?slug=${encodeURIComponent(entry.slug || '')}`,
            image: entry.image && entry.image.src ? `${site}/${entry.image.src}` : undefined,
            author: { '@type': 'Organization', name: '팀혁 TeamHyeok' },
        })),
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
};

const loadMagazinePage = async () => {
    try {
        const res = await fetch('../assets/data/magazine.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error('매거진을 불러오지 못했습니다.');
        const entries = await res.json();
        const sorted = Array.isArray(entries) ? entries.slice().sort((a, b) => getPublishedTime(b) - getPublishedTime(a)) : [];
        const url = new URL(window.location.href);
        const slug = url.searchParams.get('slug');
        const active = sorted.find(item => item.slug === slug) || sorted[0];
        renderList(sorted, active?.slug);
        renderDetail(active);
        injectStructuredData(sorted);
    } catch (error) {
        detailEl.innerHTML = '';
        const fallback = document.createElement('p');
        fallback.className = 'magazine-empty';
        fallback.textContent = '매거진을 불러오는 데 실패했습니다.';
        detailEl.appendChild(fallback);
        console.error(error);
    }
};

loadMagazinePage();
