# 카인우리 — 자동차 리스·렌트 맞춤 견적 플랫폼

> **MVP 버전 · 2026.05.16 완성**

카인우리는 고객이 본인의 신용 조건(신용점수, 부채 여부, 예산)을 입력하면  
맞춤형 차량 월납입금 견적을 즉시 확인할 수 있는 자동차 금융 플랫폼입니다.

---

## 주요 기능

### 고객 화면
| 기능 | 설명 |
|------|------|
| 차량 목록 | 브랜드·차종별 카드 그리드, Supabase에서 실시간 조회 |
| 맞춤 견적 | 신용점수·부채·예산 입력 → 월납입금·진행 가능 여부 즉시 계산 |
| 견적 결과 | 선택 차량 가능/불가 이유 + 예산 내 대안 차량 목록 표시 |
| 상담 신청 | 고객 이름·연락처·메모 → Supabase leads 테이블 저장 |

### 관리자 화면 (`/admin`)
| 기능 | 설명 |
|------|------|
| 대시보드 | 전체 상담 수, 오늘 상담 수, 등록 차량 수 요약 |
| 고객 관리 | 상담 신청 목록 조회·검색 |
| 차량 관리 | 브랜드별 차량 목록, 월납입금·최소보증금 인라인 수정 |
| 차량명 수정 | 차량명 더블클릭 → 인라인 편집 |
| 카테고리 수정 | 카테고리 더블클릭 → 드롭다운 선택 |
| 차량 추가 | 모달 폼으로 신규 차량 DB 등록 |

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 데이터베이스 | Supabase (PostgreSQL) |
| 인증 | Cookie 기반 어드민 인증 + Next.js Middleware |
| 배포 예정 | Vercel |

---

## 프로젝트 구조

```
my-app/
├── app/
│   ├── page.tsx                  # 메인 홈 (차량 목록 + 견적)
│   ├── api/
│   │   ├── cars/route.ts         # 차량 목록 API
│   │   ├── estimate/route.ts     # 맞춤 견적 계산 API
│   │   └── admin/
│   │       ├── auth/route.ts     # 관리자 로그인/로그아웃
│   │       ├── leads/route.ts    # 고객 상담 목록 API
│   │       ├── cars/route.ts     # 차량 조회·수정·추가 API
│   │       └── brands/route.ts   # 브랜드 목록 API
│   └── admin/
│       ├── login/page.tsx        # 관리자 로그인 페이지
│       └── (protected)/
│           ├── layout.tsx        # 관리자 사이드바 레이아웃
│           ├── page.tsx          # 대시보드
│           ├── leads/page.tsx    # 고객 관리
│           └── cars/page.tsx     # 차량 관리
├── components/
│   ├── CarGrid.tsx               # 차량 카드 그리드
│   ├── CarVisual.tsx             # 차량 시각화 컴포넌트
│   └── EstimateResultPanel.tsx   # 견적 결과 패널
├── lib/
│   ├── estimate.ts               # 월납입금·보증금 계산 로직
│   └── supabase-admin.ts         # Supabase service_role 클라이언트
├── middleware.ts                 # /admin 경로 인증 보호
└── styles/site.css               # 전역 커스텀 스타일
```

---

## 환경 변수 설정

`.env.local` 파일을 생성하고 아래 값을 입력하세요.

```env
# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# 관리자 페이지 비밀번호
ADMIN_SECRET=원하는비밀번호
```

---

## 데이터베이스 초기화

Supabase SQL Editor에서 `supabase/setup.sql`을 실행하면  
`brands`, `cars`, `leads` 테이블과 초기 차량 데이터가 세팅됩니다.

---

## 로컬 실행

```bash
cd my-app
npm install
npm run dev
```

- 메인 홈: http://localhost:3000
- 관리자: http://localhost:3000/admin

---

## 개발 회고 (2026.05.16)

### 오늘 작업 내용
- **맞춤 견적 고도화**: 선택 차량 가능/불가 판단 로직 구현, 불가 시 선납보증금 부족 이유 표시, 대안 차량 목록 제공
- **관리자 페이지 전체 구축**
  - Cookie 인증 + Middleware로 `/admin` 경로 보호
  - 대시보드 (KPI 카드 + 최근 상담 내역)
  - 고객 상담 목록 (검색 기능 포함)
  - 차량 관리 (브랜드별 분류, 월납입금·보증금 인라인 수정)
  - 차량명·카테고리 더블클릭 인라인 편집
  - 신규 차량 추가 모달

### 아키텍처 결정 사항
- 관리자 API는 `service_role` 키를 사용해 RLS를 우회, 일반 API는 `anon` 키로 RLS 정책 준수
- 견적 계산 로직은 `lib/estimate.ts`로 분리해 API와 UI 재사용 가능하게 구성
- 관리자와 일반 사용자 페이지를 같은 Next.js 앱 내에서 경로로 분리 (`/admin/*`)

### 다음 단계 (배포 후)
- [ ] Vercel 배포 + 도메인 연결
- [ ] 차량 이미지 실제 사진으로 교체
- [ ] 신용점수·부채 조건별 보증금 데이터 실제값으로 입력
- [ ] 고객 상담 알림 (이메일 or 카카오 알림톡)
