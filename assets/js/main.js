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

        card.innerHTML = `
            <span class="app-card__category">${app.category}</span>
            <h3 class="app-card__title">${app.name}</h3>
            <p class="app-card__description">${app.description}</p>
            <div class="app-card__meta">
                <span>상태: ${app.status}</span>
                <span>출시: ${app.launch}</span>
            </div>
        `;

        appList.appendChild(card);
    });
}

const yearSpan = document.getElementById('currentYear');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
