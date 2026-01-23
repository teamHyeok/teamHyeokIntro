# 주짓수 대회 정보 조사용 GPT 프롬프트

아래 내용을 그대로 복사해 GPT에게 요청하세요. (필요 시 `이미 등록된 대회 목록` 섹션의 항목을 최신 데이터로 업데이트하세요.)

---

## 프롬프트

너는 주짓수 대회 정보를 조사·정리하는 리서치 어시스턴트야. 아래 요구사항을 만족해서 **JSON**만 출력해줘.

### 목표
- 국내(한국) 주짓수 대회 정보를 최신 기준으로 수집·정리한다.
- 이미 등록된 대회(2월~4월)와 중복되는 항목은 **절대 포함하지 않는다**.

### 출력 형식 (JSON 스키마 예시)
```json
{
  "events": [
    {
      "name": "대회명",
      "organizer": "주최/주관",
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD",
      "region": "서울/경기/부산 등",
      "venue": "대회 장소",
      "address": "상세 주소",
      "city": "도시",
      "country": "KR",
      "registration_url": "접수 링크",
      "info_url": "공식 안내/공지 링크",
      "contact": "문의 채널(이메일/카카오/전화 등)",
      "gi_division": true,
      "nogi_division": false,
      "belt_divisions": ["White", "Blue", "Purple", "Brown", "Black"],
      "weight_classes": true,
      "ruleset": "IBJJF/자체 규정 등",
      "status": "upcoming",
      "source_urls": [
        "https://...",
        "https://..."
      ],
      "last_verified_at": "YYYY-MM-DD"
    }
  ]
}
```

### 작성 규칙
1. **JSON 외 텍스트는 절대 출력하지 말 것.**
2. `source_urls`에 반드시 공식 근거 링크를 포함할 것. (공식 홈페이지, 공지 게시물, 접수 페이지 등)
3. 날짜는 ISO 형식(YYYY-MM-DD)으로 통일.
4. 지역/도시는 한국 기준으로 작성.
5. 동일 대회가 다른 이름으로 반복되지 않도록 교차 확인.

### 이미 등록된 대회 목록 (2월~4월)
아래 목록과 **중복되는 대회는 제외**하고, 겹치지 않는 대회만 `events`에 포함해줘.

```json
{
  "existing_events": [
    {
      "name": "(예시) 기존 대회명 A",
      "start_date": "2025-02-15",
      "end_date": "2025-02-16",
      "region": "서울",
      "venue": "(예시) 체육관 이름"
    },
    {
      "name": "(예시) 기존 대회명 B",
      "start_date": "2025-03-09",
      "end_date": "2025-03-09",
      "region": "경기",
      "venue": "(예시) 체육센터 이름"
    },
    {
      "name": "(예시) 기존 대회명 C",
      "start_date": "2025-04-20",
      "end_date": "2025-04-20",
      "region": "부산",
      "venue": "(예시) 실내체육관"
    }
  ]
}
```

> 위 `existing_events`는 반드시 최신 보유 데이터로 교체한 뒤 사용하세요.

---

## 출력 예시 (중복 제외 반영)
```json
{
  "events": [
    {
      "name": "(예시) 신규 대회명 D",
      "organizer": "(예시) 주최 단체",
      "start_date": "2025-05-11",
      "end_date": "2025-05-11",
      "region": "대전",
      "venue": "(예시) 체육관",
      "address": "(예시) 대전시 ...",
      "city": "대전",
      "country": "KR",
      "registration_url": "https://example.com/register",
      "info_url": "https://example.com/info",
      "contact": "contact@example.com",
      "gi_division": true,
      "nogi_division": true,
      "belt_divisions": ["White", "Blue", "Purple", "Brown", "Black"],
      "weight_classes": true,
      "ruleset": "IBJJF",
      "status": "upcoming",
      "source_urls": [
        "https://example.com/info",
        "https://example.com/register"
      ],
      "last_verified_at": "2025-01-05"
    }
  ]
}
```
