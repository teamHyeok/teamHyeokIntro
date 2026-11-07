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
 *  detail      true -> scripts/generate-app-pages.js writes /services/<slug>/
 *              (false keeps a hand-made page there untouched)
 *  platform    'iOS', 'Web', or both joined with ' · ' (e.g. 'Web · iOS';
 *              the first one is the main way to use it)
 *  shots       App Store screenshots shown on the detail page
 *  shotsLandscape  true when screenshots are landscape (wider than tall)
 *
 * Optional, used by the generated detail page (and the home popup):
 *  website     the product's own site → "사이트 방문" button + JSON-LD sameAs
 *  websiteLabel  button text for `website` when it isn't a product site
 *  playUrl     public Google Play listing — set it only once the listing is
 *              public (`android` + `androidUrl` drive the home-card badge)
 *  price       App Store price in KRW for paid apps (JSON-LD offers; default 0)
 *  seoTitle    <title> of the detail page
 *  metaDescription  meta description of the detail page (default description)
 *  longDescription  paragraphs for the detail page's About section
 *  shotAlts    alt text per screenshot, in the same order as `shots`
 */
const TEAMHYEOK_APPS = [
    {
        slug: 'self-affirm',
        developer: ['임우주', '최찬혁'],
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
        developer: ['최연재', '최찬혁'],
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
        developer: ['임우주', '최찬혁'],
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
        developer: ['최찬혁'],
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
        detail: false,
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
        developer: ['임우주', '최찬혁'],
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
        developer: ['신예나', '최찬혁'],
        android: true,
        androidUrl: 'https://play.google.com/store/apps/details?id=kr.teamhyeok.realstudytimer',
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
        developer: ['신예나', '최찬혁'],
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
        developer: ['최찬혁'],
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
        developer: ['최연재', '최찬혁'],
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
        slug: 'yusulga',
        developer: ['최찬혁'],
        android: true,
        androidUrl: 'https://play.google.com/store/apps/details?id=com.yusulga.app',
        name: '유술가들',
        tagline: '주짓수·레슬링·유도 그래플러를 위한 커뮤니티. 대회·체육관 정보부터 스파링 파트너 찾기까지.',
        description: '유술가들은 주짓수·레슬링·유도를 수련하는 그래플러를 위한 웹 커뮤니티입니다. 대회 일정과 체육관(PT) 정보를 모아보고, 게시판에서 정보를 나누고, 함께 구를 스파링 파트너를 찾을 수 있습니다.',
        group: 'web',
        groupLabel: '웹',
        platform: 'Web',
        category: 'WebApplication',
        icon: 'assets/images/yusulga.svg',
        page: 'https://yusulga.com/',
        external: true,
        detail: false,
        features: [],
        keywords: '유술가들, 주짓수 커뮤니티, 레슬링, 유도, 그래플링, 스파링 파트너, 주짓수 대회, BJJ, 팀혁'
    },
    {
        slug: 'jiujitsu',
        developer: ['최찬혁'],
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
        developer: ['최찬혁'],
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
    },
    {
        slug: 'sowa-filter',
        developer: ['최찬혁'],
        name: '소와필터',
        tagline: '세상에 모든 필터들',
        description: '소와필터(SOWA)는 찍는 순간 바로 필름이 되는 카메라입니다. 올드폰·필름·디카 감성을 담은 다양한 필름 룩을 촬영 화면에서 미리 입혀, 보정 없이 찍기만 해도 감성 사진이 완성됩니다.',
        group: 'tool',
        groupLabel: '도구',
        platform: 'iOS',
        category: 'PhotographyApplication',
        icon: 'assets/images/apps/sowa-filter.jpg',
        page: 'https://apps.apple.com/kr/app/id6789873216',
        appStoreId: '6789873216',
        external: true,
        detail: false,
        shots: [
            'assets/images/apps/shots/sowa-filter-1.jpg',
            'assets/images/apps/shots/sowa-filter-2.jpg',
            'assets/images/apps/shots/sowa-filter-3.jpg'
        ],
        features: ['촬영 화면에 미리 입혀지는 필름 프리뷰', '올드폰·필름·디카 등 다양한 감성 룩', '보정 없이 찍기만 하면 완성되는 사진', '감성 팩으로 골라 쓰는 수십 가지 필터'],
        keywords: '소와필터, SOWA, 필름 카메라, 필터 카메라, 감성 필터, 팀혁'
    },
    {
        slug: 'jomooljomool',
        developer: ['최찬혁'],
        name: '조물조물',
        tagline: '왁뿌볼, 또각이를 돈주고 사?',
        description: '조물조물은 누르고 부수고 주무르는 촉감 놀이 앱입니다. 껍질을 톡 깨는 왁뿌볼, 리듬처럼 타건하는 또각이, 조물조물 주무르는 말랑이까지 — 손끝으로 스트레스를 스르르 풀어보세요.',
        group: 'life',
        groupLabel: '라이프스타일',
        platform: 'iOS',
        category: 'GameApplication',
        icon: 'assets/images/apps/jomooljomool.jpg',
        page: 'https://apps.apple.com/kr/app/id6794860401',
        appStoreId: '6794860401',
        external: true,
        detail: false,
        shots: [
            'assets/images/apps/shots/jomooljomool-1.jpg',
            'assets/images/apps/shots/jomooljomool-2.jpg',
            'assets/images/apps/shots/jomooljomool-3.jpg'
        ],
        features: ['왁뿌볼·또각이·말랑이 세 가지 촉감 놀이', '손끝으로 톡톡 터지는 짜릿한 손맛', '리듬처럼 콤보를 쌓는 타건 재미', '뽑기 없이 모으는 수집의 재미'],
        keywords: '조물조물, 왁뿌볼, 말랑이, 또각이, 촉감 놀이, 스트레스 해소, 팀혁'
    },
    {
        slug: 'geuljaengideul',
        developer: ['최연재', '최찬혁'],
        name: '글쟁이들',
        tagline: '세로로 넘겨 읽는 짧은 글 피드',
        description: '글쟁이들은 짧은 글을 세로로 넘겨 읽는 숏폼 글 피드입니다. 한 화면에 글 한 편, 위로 넘기면 다음 글이 이어집니다. 감동·웃김·슬픔 등 감정으로 고르고, 마음에 드는 한 줄은 저장하거나 직접 써보세요.',
        group: 'life',
        groupLabel: '라이프스타일',
        platform: 'iOS',
        category: 'SocialNetworkingApplication',
        icon: 'assets/images/apps/geuljaengideul.jpg',
        page: 'https://apps.apple.com/kr/app/id6784302663',
        appStoreId: '6784302663',
        external: true,
        detail: false,
        shots: [
            'assets/images/apps/shots/geuljaengideul-1.jpg',
            'assets/images/apps/shots/geuljaengideul-2.jpg',
            'assets/images/apps/shots/geuljaengideul-3.jpg'
        ],
        features: ['세로 스와이프로 넘겨 읽는 숏폼 글 피드', '감정별로 고르는 감성 글귀', '명조 활자와 따뜻한 종이 무드', '좋아요·저장, 내 글 작성까지'],
        keywords: '글쟁이들, 감성 글귀, 짧은 글, 숏폼, 글 피드, 팀혁'
    },
    {
        slug: 'yesulgadeul',
        developer: ['최찬혁'],
        name: '예술가들',
        tagline: '음악·미술·문학 공모전, 신춘문예, 콩쿠르, 레지던시를 한곳에 모아 마감일과 지원 조건을 공고 원문 기준으로 나란히 보여 줍니다.',
        description: '예술가들은 음악·미술·문학 창작자가 지원할 공모전, 대회, 지원사업, 레지던시를 모아 지원 조건까지 같은 틀로 정리한 웹 서비스이자 iOS 앱입니다. 마감일, 참가비, 상금·지원금, 나이·지역 제한, 신인 참가 가능 여부, 저작권과 AI 사용 규정을 공고 원문에서 확인한 만큼만 보여 주고, 확인하지 못한 조건은 ‘원문에 기재 없음’으로 남깁니다. 로그인 없이 저장할 수 있고, iOS 앱에서 마감 알림을 켜면 마감 3일 전·전날·당일 아침 9시에 알려 줍니다.',
        longDescription: [
            '예술가들은 음악·미술·문학 분야의 공모전, 대회, 창작 지원사업, 레지던시를 한곳에 모아 마감일과 지원 조건을 정리하는 서비스입니다. 웹(yesulgadeul.com)에서 바로 쓸 수 있고, 같은 화면에 마감 알림과 기기 캘린더 연동을 더한 iOS 앱(iPhone·iPad)도 App Store에 있습니다.',
            '콩쿠르·가요제·작곡 공모전을 찾는 뮤지션, 미술대전·신진작가 공모·입주작가 모집을 살피는 작가, 신춘문예·신인문학상·웹소설 공모전에 응모하려는 사람처럼 지원할 곳을 스스로 찾아야 하는 창작자를 위해 만들었습니다. 상금은 공고 첫 장에 크게 적혀 있어도 저작권 귀속이나 선정 뒤 의무는 유의사항 끝에 작게 적혀 있곤 해서, 이런 조건을 공모마다 같은 순서로 옮겨 나란히 볼 수 있게 했습니다.',
            '공모 찾기에서 분야·유형·마감·참가비·나이·지역·신인 참가 가능 여부·상금으로 걸러 보고, 마감 달력에서 날짜별 마감을 확인합니다. 마음에 드는 공모는 로그인 없이 저장하고, 마감일을 구글 캘린더나 휴대폰 캘린더에 넣을 수 있습니다. iOS 앱에서 ‘마감 알림 켜기’를 누르면 저장한 공모의 마감 3일 전·전날·당일 아침 9시에, 아직 접수 전인 공모는 접수 시작일 아침에도 알림이 옵니다.',
            '정보는 주최 기관의 공식 공고를 기준으로 정리하고, 원문에 없는 조건은 짐작해 채우지 않고 ‘원문에 기재 없음’으로 남깁니다. 요약은 AI의 도움을 받아 초안을 쓰되 마감일·금액·자격은 사람이 원문과 대조해 확인하며, 공모에 좋다·나쁘다 같은 평가는 붙이지 않습니다. 회원가입이나 로그인 없이 쓰고 쿠키와 광고도 없으며, 저장한 공모는 이 기기에만 보관됩니다.'
        ],
        seoTitle: '예술가들 — 음악·미술·문학 공모전·신춘문예·콩쿠르 일정과 마감 알림 | 팀혁',
        metaDescription: '음악·미술·문학 공모전, 신춘문예, 콩쿠르, 레지던시의 마감일과 참가비·상금·저작권 조건을 공고 원문 기준으로 정리한 웹 서비스이자 iOS 앱입니다. 로그인 없이 저장하고 앱으로 마감 알림을 받습니다.',
        group: 'web',
        groupLabel: '웹',
        platform: 'Web · iOS',
        category: 'ReferenceApplication',
        icon: 'assets/images/apps/yesulgadeul.jpg',
        page: 'services/yesulgadeul/',
        website: 'https://yesulgadeul.com/',
        appStoreId: '6824825275',
        detail: true,
        shots: [
            'assets/images/apps/shots/yesulgadeul-1.webp',
            'assets/images/apps/shots/yesulgadeul-2.webp',
            'assets/images/apps/shots/yesulgadeul-3.webp',
            'assets/images/apps/shots/yesulgadeul-4.webp'
        ],
        shotAlts: [
            '예술가들 홈 화면 — 음악·미술·문학 분야별 접수 중인 공모와 7일 안에 마감되는 공모 달력',
            '공모 찾기 목록 — 공모마다 D-day, 마감일, 상금, 참가비, 나이·지역 조건을 한눈에 표시',
            '공모 상세 화면 — 상금, 지원 대상, 신인 참가 가능, 저작권 창작자 유지, AI 사용 불가 같은 조건을 공고 원문 기준으로 정리',
            '공모를 저장하면 뜨는 마감 알림 안내 — 마감 3일 전·전날·당일 아침 9시에 알림'
        ],
        features: [
            '공모전·콩쿠르·신춘문예·레지던시를 분야·유형·조건으로 찾기',
            '마감·참가비·상금·자격·저작권·AI 규정을 원문 기준으로 정리',
            '저장한 공모의 마감 3일 전·전날·당일 아침 알림 (iOS 앱)',
            '로그인 없이 저장 · 마감일을 캘린더에 바로 넣기'
        ],
        keywords: '예술가들, 미술 공모전, 문학 공모전, 신춘문예 일정, 콩쿠르 일정, 레지던시 공모, 예술 지원사업, 공모전 마감 알림, 팀혁'
    },
    {
        slug: 'kkangtong-phone',
        developer: ['최찬혁'],
        name: '깡통폰',
        tagline: '아이콘도 빨간 배지도 없이 꼭 쓰는 앱 이름만 글자 위젯으로 남겨, iPhone을 폴더폰처럼 심심하게 만드는 디지털 디톡스 앱.',
        description: '깡통폰은 iPhone 홈 화면에 아이콘 대신 꼭 쓰는 앱 이름만 글자로 놓는 디지털 디톡스 위젯 앱입니다. 필요한 앱만 고르면 iPhone 기본 위젯에 이름이 차분하게 놓이고, 이름을 누르면 그 앱이 열립니다. 상황별 앱 목록과 피처폰·종이 스타일을 지원하며, 계정·광고·데이터 수집 없이 한 번 구매로 모든 기능을 씁니다.',
        longDescription: [
            '깡통폰은 iPhone을 옛날 폴더폰처럼 ‘볼 게 별로 없는’ 폰으로 만드는 디지털 디톡스 앱입니다. 알록달록한 아이콘과 빨간 숫자 배지 대신 꼭 쓰는 앱의 이름만 홈 화면 위젯에 글자로 남깁니다. 종이·세이지·미드나이트·로즈 같은 완성형 스타일이나 피처폰 테마로 글꼴·간격·색을 맞출 수 있어, 어떤 배경화면 위에서도 차분하게 놓입니다.',
            '스마트폰은 계속 써야 하지만 습관처럼 폰을 여는 일을 줄이고 싶은 사람을 위한 앱입니다. 업무·주말·잠들기 전처럼 상황마다 앱 목록을 따로 만들어 두고(목록 10개, 목록마다 앱 54개까지), 집중 모드나 제어 센터(iOS 18 이상)·단축어로 바꿔 씁니다.',
            '처음 실행하면 위젯 스타일(다크·라이트·피처폰)을 고르고 초성 검색으로 필요한 앱만 골라 위젯을 만듭니다. 위젯은 지금 쓰는 홈 화면에 직접 추가하고, 이어서 다른 페이지 숨기기·Dock 정리·스크린 타임 설정(iPhone 설정 앱에서 직접)을 선택형 3단계로 안내합니다. 이름을 누르면 깡통폰이 잠깐 보인 뒤 그 앱이 열리고, 전화·카메라 같은 일부 Apple 앱은 처음에 한 번 추가하는 작은 도우미 단축어로 엽니다.',
            '계정·추적·분석 도구·광고가 없고, 앱이 스스로 네트워크에 접속하지 않습니다. 목록과 꾸미기 설정은 iPhone 안에만 저장되며 App Store 개인정보 라벨도 ‘데이터가 수집되지 않음’입니다. 한 번 사면(₩4,900) 앱 안 구입·구독 없이 모든 기능을 쓰고, iOS 17 이상 iPhone에서 한국어·영어(Potato Phone)·일본어(ポテトフォン)로 쓸 수 있습니다.'
        ],
        seoTitle: '깡통폰 — 아이폰 디지털 디톡스 앱, 앱 이름만 남기는 글자 위젯 | 팀혁',
        metaDescription: '깡통폰은 아이콘과 빨간 배지 대신 꼭 쓰는 앱 이름만 글자 위젯으로 남기는 iPhone 디지털 디톡스 앱입니다. 상황별 앱 목록과 피처폰·종이 스타일을 지원하고, 계정·광고·데이터 수집 없이 한 번 구매로 모든 기능을 씁니다.',
        group: 'life',
        groupLabel: '라이프스타일',
        platform: 'iOS',
        category: 'LifestyleApplication',
        icon: 'assets/images/apps/kkangtong-phone.jpg',
        page: 'services/kkangtong-phone/',
        website: 'https://choichanhyeok.github.io/kkangtong/',
        websiteLabel: '지원 페이지',
        appStoreId: '6823266702',
        price: 4900,
        detail: true,
        shots: [
            'assets/images/apps/shots/kkangtong-phone-1.webp',
            'assets/images/apps/shots/kkangtong-phone-2.webp',
            'assets/images/apps/shots/kkangtong-phone-3.webp',
            'assets/images/apps/shots/kkangtong-phone-4.webp'
        ],
        shotAlts: [
            '깡통폰 글자 위젯을 놓은 iPhone 홈 화면 — 메시지·사진·캘린더 같은 앱 이름만 글자로 보임',
            '깡통폰을 연 화면 — 시계와 내가 고른 앱 이름만 보이고, 이름을 누르면 그 앱이 열림',
            '위젯 스타일 고르기 — 다크·라이트·피처폰 중에서 선택',
            '상황별 앱 목록 — 개인·업무·주말 목록을 만들어 두고 바꿔 쓰기'
        ],
        features: [
            '앱 이름만 글자로 남기는 위젯 (6페이지 · 페이지당 9개)',
            '종이·세이지·미드나이트·로즈 스타일과 피처폰 테마',
            '상황별 앱 목록 10개 · 집중 모드·제어 센터로 전환',
            '계정·광고·데이터 수집 없음, 한 번 구매로 모든 기능'
        ],
        keywords: '깡통폰, 디지털 디톡스 앱, 폰 중독 줄이기, 아이폰 미니멀 홈 화면, 아이폰 글자 위젯, 아이폰 홈 화면 정리, Potato Phone, 팀혁'
    },
    {
        slug: 'hyeokmyeonggadeul',
        developer: ['최찬혁'],
        name: '혁명가들',
        tagline: '언제, 어디서, 누가, 무엇 때문에 모이는지 — 전국 집회·행진·문화제 일정을 지역과 주제별로 출처와 함께 정리합니다.',
        description: '혁명가들은 전국의 집회·행진·문화제 일정을 17개 시·도와 주제(누가·무엇을)로 나눠 보여 주는 민간 정보 서비스입니다. 주최 단체가 직접 낸 공지를 근거로 일시·장소·주최·취지를 정리하고, 항목마다 출처와 확인한 날짜를 붙입니다. 상세 화면에서 캘린더에 넣기(하루 전 알림)·네이버 지도·카카오맵·공유를 바로 쓸 수 있고, iPhone 앱으로도 볼 수 있습니다.',
        longDescription: [
            '혁명가들은 전국에서 열리는 집회·행진·문화제 일정을 한곳에 모은, 정부·경찰기관과 관련 없는 민간 정보 서비스입니다. 다가오는 일정은 날짜순으로, 또는 17개 시·도별 지역과 ‘누가(노동자·장애인·성소수자·여성·농어민 등)’·‘무엇을(정치·기후·주거·교육·추모 등)’로 나눈 주제별로 볼 수 있습니다. 언제·어디서·어떤 주제인지 세 가지만 차례로 고르는 ‘집회 찾기’로 좁혀 볼 수도 있습니다.',
            '여러 단체의 홈페이지와 SNS에 흩어진 일정을 한 번에 확인하려는 사람을 위해 만들었습니다. 로그인 없이 웹사이트에서 바로 볼 수 있고, iPhone 앱에서는 일정을 공유 시트로 보내거나 ‘캘린더에 넣기’로 하루 전 알림이 채워진 일정 추가 화면을 열 수 있습니다. 저장은 이용자가 직접 고르며, 앱은 기기의 캘린더를 읽지 않습니다.',
            '공개되는 집회 신고 정보에는 일시·장소·신고 인원은 있어도 누가 무엇 때문에 모이는지는 없습니다. 그래서 주최 단체가 직접 낸 공지를 1차 근거로 제목·주최·취지를 채우고, 경찰 발표 목록은 일시·장소 대조에, 언론 보도는 사실 확인에 씁니다. 자료 조사는 AI(Claude)가 돕지만 사람이 출처를 대조한 항목만 공개하며, 확인하지 못한 시각·장소·인원은 추측하지 않고 비워 둡니다.',
            '진보·보수 같은 성향은 나누지 않고, 주제 태그는 무엇에 관한 집회인지만 말합니다. 집회를 평가하거나 참여를 권하지 않으며, 개인 이름·연락처 없이 단체명만 싣습니다. 회원가입·댓글·광고가 없고 쿠키나 방문 통계 도구도 쓰지 않아 개인정보를 수집하지 않습니다.'
        ],
        seoTitle: '혁명가들 — 전국 집회·행진·문화제 일정을 지역·주제별로 | 팀혁',
        metaDescription: '혁명가들은 전국 집회·행진·문화제 일정을 지역과 주제별로 정리합니다. 오늘·이번 주말 일정을 출처와 함께 보고 캘린더에 넣거나 지도로 열 수 있으며, 진보·보수 성향은 나누지 않습니다.',
        group: 'web',
        groupLabel: '웹',
        platform: 'Web · iOS',
        category: 'ReferenceApplication',
        icon: 'assets/images/apps/hyeokmyeonggadeul.jpg',
        page: 'services/hyeokmyeonggadeul/',
        website: 'https://hyeokmyeonggadeul.com/',
        appStoreId: '6827177468',
        detail: true,
        shots: [
            'assets/images/apps/shots/hyeokmyeonggadeul-1.webp',
            'assets/images/apps/shots/hyeokmyeonggadeul-2.webp',
            'assets/images/apps/shots/hyeokmyeonggadeul-3.webp',
            'assets/images/apps/shots/hyeokmyeonggadeul-4.webp'
        ],
        shotAlts: [
            '혁명가들 홈 화면 — 다가오는 집회 수, 집회 찾기 버튼, 오늘·내일·이번 주말 바로가기와 날짜별 집회 수',
            '집회 찾기 — 언제·어디서·어떤 주제인지 차례로 골라 일정을 좁히는 화면',
            '날짜별 일정 목록 — 시각, 행사 종류, 장소, 주최 단체와 주제 태그',
            '행사 상세 화면 — 일시·장소, 네이버 지도·카카오맵, 주최 측 공지 출처, 캘린더에 넣기와 공유'
        ],
        features: [
            '17개 시·도 지역과 누가·무엇을 주제로 나눈 전국 일정',
            '언제·어디서·주제를 차례로 고르는 집회 찾기',
            '항목마다 주최 측 공지 등 출처와 확인 날짜 표시',
            '캘린더에 넣기(하루 전 알림) · 네이버 지도·카카오맵 · 공유'
        ],
        keywords: '혁명가들, 전국 집회 일정, 오늘 집회, 서울 집회 일정, 주말 집회, 시위 일정, 행진·문화제 일정, 팀혁'
    }
];

const APP_ORDER = ['yesulgadeul', 'kkangtong-phone', 'hyeokmyeonggadeul', 'study-timer', 'sowa-filter', 'yusulga', 'please-sleep', 'donelog', 'self-affirm', 'nyangnyang-tuner', 'geuljaengideul', 'jomooljomool', 'sojung-filter', 'dare30', 'aeiou-kr', 'aeiou-jp', 'jiujitsu', 'black-white-chef'];
TEAMHYEOK_APPS.sort((a, b) => {
    const ia = APP_ORDER.indexOf(a.slug), ib = APP_ORDER.indexOf(b.slug);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TEAMHYEOK_APPS;
}
if (typeof window !== 'undefined') {
    window.TEAMHYEOK_APPS = TEAMHYEOK_APPS;
}
