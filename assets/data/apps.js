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
 *  shots       App Store screenshots shown on the detail page
 *  shotsLandscape  true when screenshots are landscape (wider than tall)
 */
const TEAMHYEOK_APPS = [
    {
        slug: 'self-affirm',
        name: '자기암시',
        tagline: '내가 정한 확언을 원하는 시간에 알림으로 받는 마인드 루틴. 계정 없이 로컬 알림만 씁니다.',
        description: '자기암시는 기억하고 싶은 확언(긍정 문장)을 등록해두면 원하는 시간에 알림으로 보내주는 앱입니다. 주기 알림과 지정 시간 알림으로 하루 종일 문구를 되새기고, 밤에는 조용한 시간으로 알림을 잠시 멈춥니다. 회원가입 없이 로컬 알림만 사용해 개인정보를 최소화했습니다.',
        group: 'life',
        groupLabel: '라이프스타일',
        platform: 'iOS',
        category: 'LifestyleApplication',
        icon: 'assets/images/apps/self-affirm.jpg',
        page: 'services/self-affirm/',
        appStoreId: '6754752885',
        detail: false,
        shots: [
            'assets/images/apps/shots/self-affirm-1.webp',
            'assets/images/apps/shots/self-affirm-2.webp'
        ],
        features: [
            '주기(30분~12시간) 또는 지정 시간 반복 알림',
            '명언·유머·응원 테마 문구와 나만의 문구 등록',
            '밤에는 자동으로 멈추는 조용한 시간',
            '계정·회원가입 없이 로컬 알림만 사용'
        ],
        keywords: '자기암시, 확언, 확언 알림, 긍정 확언, affirmation, 마인드셋, 팀혁'
    },
    {
        slug: 'donelog',
        name: '갓생로그',
        tagline: '매일 해낸 일을 3초 영상으로 남기는 기록 앱. 하루의 클립이 자동으로 데일리 브이로그가 됩니다.',
        description: '갓생로그는 매일 해낸 일을 3초 영상 클립으로 기록하는 앱입니다. 할 일을 완료할 때마다 3초를 촬영하면, 하루가 끝날 때 클립들이 하나의 데일리 브이로그로 자동 합쳐집니다. 추억 탭에서 지난 영상을 다시 보고, 주간·월간 통계와 연속 기록으로 꾸준함을 눈으로 확인하세요.',
        group: 'life',
        groupLabel: '라이프스타일',
        platform: 'iOS',
        category: 'LifestyleApplication',
        icon: 'assets/images/apps/donelog.jpg',
        page: 'services/donelog/',
        appStoreId: '6765966189',
        detail: false,
        shots: [
            'assets/images/apps/shots/donelog-1.webp',
            'assets/images/apps/shots/donelog-2.webp'
        ],
        features: [
            '할 일 완료마다 3초 클립 촬영',
            '하루 클립이 자동으로 데일리 브이로그로 합성',
            '추억 탭에서 지난 기록 영상 감상',
            '주간·월간 통계와 연속 기록 추적'
        ],
        keywords: '갓생로그, 갓생, 브이로그 기록, 데일리 브이로그, 성취 기록, done log, 팀혁'
    },
    {
        slug: 'dare30',
        name: '작심 한달',
        tagline: '7·30·365일 챌린지로 습관을 만드는 트래커. 잔디밭을 채우고 캐릭터의 응원을 받으세요.',
        description: '작심 한달은 매일의 작은 도전을 기록해 습관으로 만드는 챌린지 앱입니다. 7·30·365일 기간을 정해 매일 체크인하면 GitHub 스타일 잔디밭이 채워지고, 6종의 캐릭터가 매일 다른 말로 응원합니다. 체크인할 때마다 코인을 모아 새 캐릭터를 해금하고 홈 화면을 꾸며보세요.',
        group: 'life',
        groupLabel: '라이프스타일',
        platform: 'iOS',
        category: 'LifestyleApplication',
        icon: 'assets/images/apps/dare30.jpg',
        page: 'services/dare30/',
        appStoreId: '6760480813',
        detail: false,
        shots: [
            'assets/images/apps/shots/dare30-1.webp',
            'assets/images/apps/shots/dare30-2.webp'
        ],
        features: [
            '7·30·365일 챌린지 기간 선택',
            'GitHub 스타일 잔디밭으로 진행률 확인',
            '6종 캐릭터의 매일 다른 응원 메시지',
            '코인으로 캐릭터 해금 · iCloud 동기화'
        ],
        keywords: '작심한달, 습관 트래커, 30일 챌린지, habit tracker, 습관 만들기, 챌린지 앱, 팀혁'
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
        tagline: '히라가나 쓰기부터 N5 단어, 상황별 회화까지. AI가 매일 학습을 짜주는 일본어 앱.',
        description: 'aeiou JP는 히라가나 첫 글자부터 실전 회화까지 함께하는 일본어 학습 앱입니다. 획순 가이드와 실시간 채점으로 가나를 직접 써보고, JLPT N5 필수 단어를 과학적 간격 반복(SRS)으로 외우며, 카페·식당 등 10가지 상황별 대화를 연습합니다. AI가 진도와 취약점을 분석해 매일 최적의 학습을 추천합니다.',
        group: 'learn',
        groupLabel: '학습',
        platform: 'iOS',
        category: 'EducationApplication',
        icon: 'assets/images/apps/aeiou-jp.jpg',
        page: 'services/aeiou-jp/',
        appStoreId: '6761683071',
        detail: false,
        shots: [
            'assets/images/apps/shots/aeiou-jp-1.webp',
            'assets/images/apps/shots/aeiou-jp-2.webp'
        ],
        features: [
            '획순 가이드·실시간 채점으로 가나 쓰기',
            'JLPT N5 단어를 간격 반복(SRS)으로 암기',
            '카페·식당 등 10가지 상황별 회화 연습',
            'AI 추천 학습과 오답 노트 자동 생성'
        ],
        keywords: 'aeiou jp, 일본어 학습, 히라가나, 가타카나, JLPT N5, learn japanese, 팀혁'
    },
    {
        slug: 'study-timer',
        name: '순공야르',
        tagline: '카메라로 자리 비움을 잡아내는 순공 타이머. 진짜 집중한 시간만 기록합니다.',
        description: '순공야르는 카메라로 자리 비움을 감지하는 순공(순수 공부) 타이머입니다. 자리를 비우면 자동으로 멈춰 진짜 집중한 시간만 정확히 측정하고, 공부 중·자리 비움·복귀 상태를 실시간으로 표시합니다. 주간·월간 통계와 위젯, 라이브 액티비티, iCloud 동기화를 지원합니다.',
        group: 'learn',
        groupLabel: '학습',
        platform: 'iOS',
        category: 'EducationApplication',
        icon: 'assets/images/apps/study-timer.jpg',
        page: 'services/study-timer/',
        appStoreId: '6766282371',
        detail: false,
        shots: [
            'assets/images/apps/shots/study-timer-1.webp',
            'assets/images/apps/shots/study-timer-2.webp'
        ],
        features: [
            '카메라 자리 감지로 순공 시간 자동 측정',
            '공부 중·자리 비움·복귀 실시간 상태 표시',
            '주간·월간 통계와 공유 카드',
            '위젯·라이브 액티비티·iCloud 동기화'
        ],
        keywords: '순공야르, 순공 타이머, 공부 타이머, 자리비움, study timer, 집중 타이머, 팀혁'
    },
    {
        slug: 'please-sleep',
        name: '언제자요',
        tagline: '기상 시간만 정하면 언제 자야 할지 알려주는 수면 알람. 취침·기상 알람을 함께 관리합니다.',
        description: '언제자요는 기상 시간을 기준으로 추천 취침 시간을 계산해주는 수면 알람 앱입니다. "몇 시에 일어날까"를 정하면 "언제 자야 할까"가 자동으로 따라오고, 취침 알람과 기상 알람으로 수면 루틴을 부드럽게 만듭니다. 잠드는 시간(버퍼)과 요일별 반복, 내가 만든 커스텀 알람 사운드까지 지원합니다.',
        group: 'health',
        groupLabel: '건강',
        platform: 'iOS',
        category: 'HealthApplication',
        icon: 'assets/images/apps/please-sleep.jpg',
        page: 'services/please-sleep/',
        appStoreId: '6758732586',
        detail: false,
        shots: [
            'assets/images/apps/shots/please-sleep-1.webp',
            'assets/images/apps/shots/please-sleep-2.webp'
        ],
        features: [
            '기상 시간 기반 추천 취침 시간 계산',
            '취침 알람 + 기상 알람으로 수면 루틴 관리',
            '잠드는 시간(버퍼)·요일별 반복 설정',
            '내가 만든 커스텀 알람 사운드 지원'
        ],
        keywords: '언제자요, 수면 알람, 취침 시간 계산, 기상 알람, sleep alarm, 수면 루틴, 팀혁'
    },
    {
        slug: 'nyangnyang-tuner',
        name: '냥냥 튜너',
        tagline: '마이크로 음을 센트 단위까지 잡아내는 크로매틱 튜너. 대부분의 악기를 정확하게 조율합니다.',
        description: '냥냥 튜너는 마이크로 입력된 음을 센트 단위로 정밀하게 분석하는 크로매틱 튜너입니다. 기타·베이스를 비롯한 대부분의 악기를 실시간으로 조율하고, 노이즈 필터로 시끄러운 환경에서도 안정적으로 음정을 잡아줍니다. iPad 레이아웃과 가로 모드를 지원합니다.',
        group: 'tool',
        groupLabel: '도구',
        platform: 'iOS',
        category: 'UtilitiesApplication',
        icon: 'assets/images/apps/nyangnyang-tuner.jpg',
        page: 'services/nyangnyang-tuner/',
        appStoreId: '6749933012',
        detail: false,
        shots: [
            'assets/images/apps/shots/nyangnyang-tuner-1.webp',
            'assets/images/apps/shots/nyangnyang-tuner-2.webp'
        ],
        shotsLandscape: true,
        features: [
            '실시간 음정·피치 표시',
            '센트 단위 정밀 크로매틱 튜닝',
            '기타·베이스 등 대부분의 악기 지원',
            '노이즈 필터 · iPad/가로 모드'
        ],
        keywords: '냥냥튜너, 크로매틱 튜너, 기타 튜너, 베이스 튜너, guitar tuner, 악기 튜너, 팀혁'
    },
    {
        slug: 'sojung-filter',
        name: '소중필터',
        tagline: '아날로그 필름 감성을 입히는 사진·영상 필터. 5가지 무드로 순간을 물들입니다.',
        description: '소중필터는 아날로그 필름의 감성을 사진과 영상에 입히는 필터 앱입니다. 산책·여름·소중·기억·새벽 5가지 필터로 무드를 완성하고, 강도·그레인·밝기·색온도를 미세하게 조정할 수 있습니다. 사진은 물론 영상도 원본 화질 그대로 내보내고, 비교 슬라이더로 원본과 나란히 확인하세요.',
        group: 'tool',
        groupLabel: '도구',
        platform: 'iOS',
        category: 'MultimediaApplication',
        icon: 'assets/images/apps/sojung-filter.jpg',
        page: 'services/sojung-filter/',
        appStoreId: '6762511423',
        detail: false,
        shots: [
            'assets/images/apps/shots/sojung-filter-1.webp',
            'assets/images/apps/shots/sojung-filter-2.webp'
        ],
        features: [
            '산책·여름·소중·기억·새벽 5가지 필름 필터',
            '사진·영상 모두 필터 적용 · 원본 화질 내보내기',
            '강도·그레인·밝기·색온도 미세 조정',
            '비교 슬라이더로 원본과 나란히 확인'
        ],
        keywords: '소중필터, 사진 필터, 영상 필터, 감성 필터, 필름 필터, photo filter, 팀혁'
    },
    {
        slug: 'jiujitsu',
        name: '주짓수 대회 정보 사이트',
        tagline: '전국 주짓수 대회를 달력과 지도에서 한눈에. 바로 신청 페이지로 이동하세요.',
        description: '전국 주짓수 대회를 달력과 지도에서 한눈에 모아보는 웹 서비스입니다. 일정과 위치를 확인하고 바로 신청 페이지로 이동하세요.',
        group: 'web',
        groupLabel: '웹',
        platform: 'Web',
        category: 'WebApplication',
        icon: 'assets/images/jiujitsu_main.webp',
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
        icon: 'assets/images/blackandwhite.webp',
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
