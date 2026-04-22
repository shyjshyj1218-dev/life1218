# 데이터베이스 스키마 (Supabase / PostgreSQL)

이 문서는 `brands`, `cars` 테이블과 `cars_with_brand` 뷰의 구조·의미를 정리한 것이다.  
단위: 월납/가격·보증금은 **만원** 기준이라고 가정한다.

---

## 1. `brands` (자동차 브랜드)

| 컬럼         | 타입         | 제약                | 설명        |
| ------------ | ------------ | ------------------- | ----------- |
| `id`         | `uuid`       | PK, `gen_random_uuid()` | 브랜드 ID |
| `name`       | `text`       | NOT NULL, UNIQUE  | 브랜드명   |
| `created_at` | `timestamp`   | DEFAULT `now()`  | 생성 시각 |

**관계:** `cars.brand_id`가 이 테이블을 참조한다.

### 예시 seed 데이터 (브랜드명)

현대, 기아, 제네시스, 쉐보레, KGM, 르노, 벤츠, 아우디, BMW, 테슬라, BYD, 포르쉐 등.

---

## 2. `cars` (차량)

| 컬럼         | 타입         | 제약                | 설명 |
| ------------ | ------------ | ------------------- | ---- |
| `id`         | `uuid`       | PK, `gen_random_uuid()` | 차량 ID |
| `brand_id`   | `uuid`       | FK → `brands(id)`  | 소속 브랜드 |
| `name`       | `text`       | NOT NULL           | 모델명 (예: Model 3, 트랙스) |
| `category`   | `text`       |                    | 차종/카테고리 (예: 전기차, SUV, 세단) |
| `base_price` | `integer`    |                    | 기준 월 납입 등 가격 (만원 단위) |
| `available`  | `boolean`    | DEFAULT `true`     | 취급/노출 여부 |
| `created_at` | `timestamp`   | DEFAULT `now()`  | 등록 시각 |
| `deposit`    | `integer`    | (선택적 추가)      | **보증금 (만원 단위)** |
| `tier`       | `text`       | (선택적 추가)      | **차량 티어(등급)**. 예: `경제`, `일반`, `프리미엄` 또는 `1`, `2` 등 문자열로 자유롭게 관리 |

`deposit`, `tier`는 `ADD COLUMN IF NOT EXISTS`로 나중에 붙이는 전형적인 확장이다.

### 예시 seed (개념)

- 테슬라 UUID 기준: Model 3 / Y / S / X 등  
- 쉐보레 UUID 기준: 트랙스, 트레일블레이저, 말리부, 콜로라도 등  

실제 `brand_id`는 `brands`에 넣은 행의 `id`와 일치해야 한다.

---

## 3. `cars_with_brand` (뷰)

`cars`와 `brands`를 조인해 API·목록용으로 쓰기 쉬운 형태로 만든 뷰다.

| 컬럼 / 별칭   | 출처        | 설명 |
| ------------- | ----------- | ---- |
| `id`          | `cars.id`   | 차량 ID |
| `name`        | `cars.name` | 모델명 |
| `category`    | `cars.category` | 카테고리 |
| `base_price`  | `cars.base_price` | 가격 (만원) |
| `brand_name`  | `brands.name` | 브랜드명 (표시용) |

뷰 정의에서 `SELECT` 다음에 `ORDER BY`를 넣는 것은 DB·버전에 따라 뷰 생성 시 제한될 수 있어, **정렬은 조회 쿼리(SELECT)에서** 하는 편이 안전하다.

> **참고:** 현재 뷰에는 `cars.deposit`, `cars.tier`가 포함되어 있지 않다.  
> 앱에서 보증금·티어가 필요하면 뷰의 `SELECT`에 컬럼을 추가하거나, 테이블을 직접 조인해 조회하면 된다.

---

## 4. 관계 요약 (ER)

```text
brands (1) ----< (N) cars
     id              brand_id
```

---

## 5. `leads` (상담 신청)

상담 신청 폼 제출 시 `/api/lead`가 이 테이블에 저장합니다.  
**Supabase SQL Editor에서 먼저 실행해야 저장이 됩니다.**

```sql
create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone         text not null,
  car_model     text,
  budget        text,
  note          text,
  created_at    timestamp default now()
);
```

---

## 6. 마이그레이션·실행 순서 팁

스크립트를 한 번에 돌릴 때는 대략 다음 순서를 권장한다.

1. `CREATE TABLE` — `brands` 먼저, 이어서 `cars`  
2. `INSERT` — `brands` 후 `cars` (올바른 `brand_id` 사용)  
3. `ALTER TABLE cars` — `deposit`, `tier` 추가  
4. `CREATE OR REPLACE VIEW cars_with_brand`  

기존 DB에 `ORDER BY`가 들어간 뷰 정의로 오류가 나면, `ORDER BY`를 제거한 뷰 정의를 사용한다.
