/**
 * Single source of truth for TeamHyeok products.
 * Loaded in the browser as a global (window.TEAMHYEOK_APPS) and required by
 * the Node page/sitemap generators (module.exports).
 *
 * Fields:
 *  slug        URL slug under /services/
 *  page        internal link used by home cards (always our own page)
 *  appStoreId  iTunes id (iOS apps only)
 *  category    Schema.org applicationCategory
 *  status      'soon' for unreleased apps
 *  detail      true -> a generated detail page exists at /services/<slug>/
 */
const TEAMHYEOK_APPS = [
    {
        slug: 'self-affirm',
        name: '자기암시',
        tagline: '목소리로 나를 설득하는 하루 루틴. 확언을 만들고, 즐겨찾기하고, 알림으로 되새깁니다.',
        description: '자기암시는 내가 원하는 확언(긍정 문장)을 직접 만들고, 듣기 좋은 목소리와 알림으로 하루 종일 반복해 들려주는 마인드 트레이닝 앱입니다. 원하는 시간과 횟수로 루틴을 설정하고, 즐겨찾기한 문장을 iPhone·iPad·Apple Watch에서 동일하게 되새기세요.',
        group: 'life',
        groupLabel: '라이프스타일',
        platform: 'iOS',
        category: 'LifestyleApplication',
        icon: 'assets/images/apps/self-affirm.jpg',
        page: 'services/self-affirm/',
        appStoreId: '6754752885',
        detail: true,
        features: [
            '원하는 확언을 직접 작성하고 즐겨찾기',
            '시간·횟수를 지정하는 반복 알림 루틴',
            'iPhone·iPad·Apple Watch 동기화',
            '밤에는 조용히 쉬는 수면 모드'
        ],
        keywords: '자기암시, 확언, 긍정 확언, 마인드셋, affirmation, 루틴 앱, 팀혁'
    },
    {
        slug: 'donelog',
        name: '갓생로그',
        tagline: '해낸 일을 기록하는 하루 브이로그. 작은 성취를 모아 회고로 돌려줍니다.',
        description: '갓생로그는 \'해야 할 일\'이 아니라 \'오늘 해낸 일\'을 기록하는 성취 로그 앱입니다. 작은 성취를 사진과 한 줄로 남기고, 모인 기록을 주간·월간 회고로 돌려받아 꾸준함을 눈으로 확인하세요.',
        group: 'life',
        groupLabel: '라이프스타일',
        platform: 'iOS',
        category: 'LifestyleApplication',
        icon: 'assets/images/apps/donelog.jpg',
        page: 'services/donelog/',
        appStoreId: '6765966189',
        detail: true,
        features: [
            '오늘 해낸 일을 사진과 메모로 기록',
            '성취가 쌓이는 캘린더 뷰',
            '주간·월간 회고 리포트',
            '꾸준함을 돕는 가벼운 알림'
        ],
        keywords: '갓생로그, 갓생, 성취 기록, 회고, done list, 하루 기록, 팀혁'
    },
    {
        slug: 'dare30',
        name: '작심 한달',
        tagline: '30일 챌린지로 습관을 만드는 트래커. 스티커와 코인으로 동기를 더합니다.',
        description: '작심 한달은 30일 챌린지 단위로 습관을 만드는 트래커입니다. 매일 체크할 때마다 스티커와 코인으로 보상을 받으며, 작심삼일을 넘어 한 달 완주를 목표로 동기를 설계했습니다.',
        group: 'life',
        groupLabel: '라이프스타일',
        platform: 'iOS',
        category: 'LifestyleApplication',
        icon: 'assets/images/apps/dare30.jpg',
        page: 'services/dare30/',
        appStoreId: '6760480813',
        detail: true,
        features: [
            '30일 단위 습관 챌린지',
            '매일 체크로 모으는 스티커·코인 보상',
            '한눈에 보는 달성률과 연속 기록',
            '여러 습관을 동시에 관리'
        ],
        keywords: '작심한달, 습관 트래커, 30일 챌린지, habit tracker, 습관 만들기, 팀혁'
    },
    {
        slug: 'aeiou-kr',
        name: '아에이오우 KR',
        tagline: '외국인을 위한 한글 첫걸음. 손글씨·음성 인식으로 익히는 한국어 학습.',
        description: '아에이오우 KR은 외국인을 위한 한글 학습 앱입니다. 손글씨 인식과 음성 인식으로 자음·모음부터 단어까지 직접 쓰고 말하며 익히도록 준비 중입니다.',
        group: 'learn',
        groupLabel: '학습',
        platform: 'iOS',
        category: 'EducationApplication',
        icon: 'assets/images/apps/aeiou-kr.svg',
        page: 'services/aeiou-kr/',
        status: 'soon',
        detail: true,
        features: [
            '손글씨 인식으로 익히는 한글 쓰기',
            '음성 인식 발음 연습',
            '자음·모음부터 단어까지 단계별 학습',
            '오프라인 지원 예정'
        ],
        keywords: '아에이오우, 한글 학습, 한국어 학습, learn korean, hangul, 외국인 한국어, 팀혁'
    },
    {
        slug: 'aeiou-jp',
        name: 'aeiou JP',
        tagline: '오프라인으로 즐기는 일본어 학습. 히라가나부터 3,000+ 단어, SRS 복습까지.',
        description: 'aeiou JP는 인터넷 없이도 즐기는 일본어 학습 앱입니다. 히라가나·가타카나 기초부터 3,000개 이상의 단어를 SRS(간격 반복) 시스템으로 외우고, 손글씨로 직접 써보며 익힐 수 있습니다.',
        group: 'learn',
        groupLabel: '학습',
        platform: 'iOS',
        category: 'EducationApplication',
        icon: 'assets/images/apps/aeiou-jp.jpg',
        page: 'services/aeiou-jp/',
        appStoreId: '6761683071',
        detail: true,
        features: [
            '히라가나·가타카나 기초부터',
            '3,000개 이상 단어 사전',
            'SRS 간격 반복 복습',
            '오프라인 완전 지원'
        ],
        keywords: 'aeiou jp, 일본어 학습, 히라가나, 가타카나, 일본어 단어, learn japanese, 팀혁'
    },
    {
        slug: 'study-timer',
        name: '순공야르',
        tagline: '움직임으로 자리 비움을 잡아내는 순공 타이머. 진짜 집중한 시간만 기록합니다.',
        description: '순공야르는 움직임 기반으로 자리 비움을 감지하는 순공(순수 공부) 타이머입니다. 카메라가 책상 앞을 지키며 자리를 비우면 자동으로 멈춰, 진짜 집중한 시간만 정확히 기록하고 동기화합니다.',
        group: 'learn',
        groupLabel: '학습',
        platform: 'iOS',
        category: 'EducationApplication',
        icon: 'assets/images/apps/study-timer.jpg',
        page: 'services/study-timer/',
        appStoreId: '6766282371',
        detail: true,
        features: [
            '움직임 기반 자리 비움 자동 감지',
            '순공 시간만 정확히 측정',
            '일·주·월 공부 기록 통계',
            '기기 간 동기화'
        ],
        keywords: '순공야르, 순공 타이머, 공부 타이머, 자리비움, study timer, 집중 타이머, 팀혁'
    },
    {
        slug: 'please-sleep',
        name: '언제자요',
        tagline: '코골이까지 분석하는 수면 알람. Apple Watch 수면 데이터와 함께 기록합니다.',
        description: '언제자요는 잠드는 시간부터 코골이까지 분석해주는 수면 알람 앱입니다. Apple Watch의 수면 데이터와 함께 수면 패턴을 기록하고, 가장 개운한 타이밍에 깨워주는 스마트 알람을 제공합니다.',
        group: 'health',
        groupLabel: '건강',
        platform: 'iOS',
        category: 'HealthApplication',
        icon: 'assets/images/apps/please-sleep.jpg',
        page: 'services/please-sleep/',
        appStoreId: '6758732586',
        detail: true,
        features: [
            '코골이·잠꼬대 사운드 분석',
            'Apple Watch 수면 데이터 연동',
            '수면 패턴 기록과 리포트',
            '개운한 기상을 위한 스마트 알람'
        ],
        keywords: '언제자요, 수면 알람, 코골이 분석, 수면 기록, sleep tracker, 수면 패턴, 팀혁'
    },
    {
        slug: 'nyangnyang-tuner',
        name: '냥냥 튜너',
        tagline: '고양이 감성으로 기타·베이스를 정확하게. 마이크로 음을 세밀하게 조율합니다.',
        description: '냥냥 튜너는 고양이 감성의 귀여운 인터페이스로 기타·베이스·우쿨렐레를 정확하게 조율하는 악기 튜너입니다. 마이크로 입력된 음을 실시간으로 세밀하게 분석해 정확한 음정을 맞춰줍니다.',
        group: 'tool',
        groupLabel: '도구',
        platform: 'iOS',
        category: 'UtilitiesApplication',
        icon: 'assets/images/apps/nyangnyang-tuner.jpg',
        page: 'services/nyangnyang-tuner/',
        appStoreId: '6749933012',
        detail: true,
        features: [
            '기타·베이스·우쿨렐레 튜닝',
            '마이크 실시간 음정 분석',
            '고양이 감성의 직관적 UI',
            '다양한 튜닝 프리셋'
        ],
        keywords: '냥냥튜너, 기타 튜너, 베이스 튜너, 악기 튜너, guitar tuner, 튜닝 앱, 팀혁'
    },
    {
        slug: 'sojung-filter',
        name: '소중필터',
        tagline: '감성을 입히는 사진·영상 필터. 한 번의 탭으로 분위기를 완성합니다.',
        description: '소중필터는 사진과 영상에 감성적인 분위기를 입히는 필터 앱입니다. 복잡한 보정 없이 한 번의 탭으로 색감과 무드를 완성하고, 소중한 순간을 더 소중하게 남기세요.',
        group: 'tool',
        groupLabel: '도구',
        platform: 'iOS',
        category: 'MultimediaApplication',
        icon: 'assets/images/apps/sojung-filter.jpg',
        page: 'services/sojung-filter/',
        appStoreId: '6762511423',
        detail: true,
        features: [
            '감성 사진·영상 필터',
            '원탭으로 완성되는 색감 보정',
            '다양한 무드 프리셋',
            '간편한 공유'
        ],
        keywords: '소중필터, 사진 필터, 영상 필터, 감성 필터, photo filter, 사진 보정, 팀혁'
    },
    {
        slug: 'jiujitsu',
        name: '주짓수 대회 보드',
        tagline: '전국 주짓수 대회를 달력과 지도에서 한눈에. 바로 신청 페이지로 이동하세요.',
        description: '전국 주짓수 대회를 달력과 지도에서 한눈에 모아보는 웹 서비스입니다. 일정과 위치를 확인하고 바로 신청 페이지로 이동하세요.',
        group: 'web',
        groupLabel: '웹',
        platform: 'Web',
        category: 'WebApplication',
        icon: 'assets/images/jiujitsu_main.JPG',
        page: 'services/jiujitsu/',
        detail: false,
        features: [],
        keywords: '주짓수 대회, 주짓수 일정, 주짓수 지도, 주짓수 신청, BJJ, 팀혁'
    },
    {
        slug: 'black-white-chef',
        name: '흑백요리사 맵',
        tagline: '흑백요리사에 등장한 셰프들의 식당을 한 지도에 모았습니다.',
        description: '넷플릭스 흑백요리사에 등장한 셰프들의 식당을 한 지도에 모은 웹 서비스입니다. 위치와 정보를 한눈에 확인하세요.',
        group: 'web',
        groupLabel: '웹',
        platform: 'Web',
        category: 'WebApplication',
        icon: 'assets/images/blackandwhite.JPG',
        page: 'services/black-white-chef/',
        detail: false,
        features: [],
        keywords: '흑백요리사, 흑백요리사 식당, 셰프 맵, 맛집 지도, 팀혁'
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TEAMHYEOK_APPS;
}
if (typeof window !== 'undefined') {
    window.TEAMHYEOK_APPS = TEAMHYEOK_APPS;
}
