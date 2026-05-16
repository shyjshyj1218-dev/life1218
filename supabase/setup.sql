-- =============================================================================
-- life1218 — 새 Supabase 프로젝트 초기 설정 (빈 프로젝트 1회 실행용)
-- =============================================================================
-- 사용법:
--   1. Supabase 대시보드 → SQL Editor → New query
--   2. 이 파일 전체를 붙여넣고 Run
--   3. Project Settings → API 에서 URL / anon key 복사
--   4. my-app/.env.local 에 SUPABASE_URL, SUPABASE_ANON_KEY 설정
--
-- "destructive operations" 경고:
--   예전 스크립트의 DROP POLICY / CREATE OR REPLACE 가 원인이었습니다.
--   이 파일은 새 프로젝트 전용이라 해당 구문을 넣지 않았습니다.
--   방금 만든 빈 프로젝트라면 경고가 없거나 Run 해도 안전합니다.
--
-- 참고: docs/database-schema.md
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. 테이블
-- -----------------------------------------------------------------------------

create table if not exists public.brands (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.cars (
  id          uuid primary key default gen_random_uuid(),
  brand_id    uuid not null references public.brands (id) on delete restrict,
  name        text not null,
  category    text,
  base_price  integer,
  available   boolean not null default true,
  deposit     integer,
  tier        text,
  created_at  timestamptz not null default now()
);

create index if not exists cars_brand_id_idx on public.cars (brand_id);
create index if not exists cars_category_idx on public.cars (category);
create index if not exists cars_available_idx on public.cars (available);

create table if not exists public.leads (
  id             uuid primary key default gen_random_uuid(),
  customer_name  text not null,
  phone          text not null,
  car_model      text,
  budget         text,
  note           text,
  created_at     timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 2. 뷰 (API에서 cars_with_brand 조회)
-- -----------------------------------------------------------------------------

create view public.cars_with_brand as
select
  c.id,
  c.name,
  c.category,
  c.base_price,
  c.deposit,
  c.tier,
  c.available,
  b.name as brand_name
from public.cars c
inner join public.brands b on b.id = c.brand_id
where c.available = true;

-- -----------------------------------------------------------------------------
-- 3. RLS (anon 키로 Next.js API 접근)
-- -----------------------------------------------------------------------------

alter table public.brands enable row level security;
alter table public.cars enable row level security;
alter table public.leads enable row level security;

-- brands: 읽기만 (새 프로젝트에서만 실행 — 재실행 시 policy 이름 중복 오류 가능)
create policy "brands_select_anon"
  on public.brands
  for select
  to anon, authenticated
  using (true);

-- cars: 읽기만 (categories API 등)
create policy "cars_select_anon"
  on public.cars
  for select
  to anon, authenticated
  using (true);

-- leads: 상담 신청 insert
create policy "leads_insert_anon"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- -----------------------------------------------------------------------------
-- 4. 권한 (PostgREST / supabase-js)
-- -----------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select on public.brands to anon, authenticated;
grant select on public.cars to anon, authenticated;
grant select on public.cars_with_brand to anon, authenticated;

grant insert on public.leads to anon, authenticated;

-- -----------------------------------------------------------------------------
-- 5. 시드 데이터 (브랜드 → 차량)
--    가격·보증금 단위: 만원 (docs/database-schema.md)
-- -----------------------------------------------------------------------------

insert into public.brands (name) values
  ('현대'),
  ('기아'),
  ('제네시스'),
  ('쉐보레'),
  ('KGM'),
  ('르노'),
  ('벤츠'),
  ('아우디'),
  ('BMW'),
  ('테슬라'),
  ('BYD'),
  ('포르쉐')
on conflict (name) do nothing;

insert into public.cars (brand_id, name, category, base_price, deposit, tier)
select b.id, v.car_name, v.category, v.base_price, v.deposit, v.tier
from (
  values
    -- 현대
    ('현대', '쏘렌토',       'SUV',     62, 300, '일반'),
    ('현대', '그랜저',       '세단',    58, 280, '일반'),
    ('현대', '아이오닉 5',   '전기차',  55, 250, '일반'),
    ('현대', '투싼',         'SUV',     48, 220, '경제'),
    -- 기아
    ('기아', '카니발',       'RV',      65, 320, '일반'),
    ('기아', 'K8',           '세단',    56, 270, '일반'),
    ('기아', 'EV6',          '전기차',  52, 240, '일반'),
    ('기아', '스포티지',     'SUV',     45, 200, '경제'),
    -- 제네시스
    ('제네시스', 'GV80',     'SUV',     95, 500, '프리미엄'),
    ('제네시스', 'G80',      '세단',    88, 480, '프리미엄'),
    -- 쉐보레
    ('쉐보레', '트랙스',       'SUV',     35, 150, '경제'),
    ('쉐보레', '트레일블레이저', 'SUV',  38, 160, '경제'),
    ('쉐보레', '말리부',       '세단',    42, 180, '경제'),
    ('쉐보레', '콜로라도',     '픽업',    55, 250, '일반'),
    -- 테슬라
    ('테슬라', 'Model 3',    '전기차',  89, 500, '프리미엄'),
    ('테슬라', 'Model Y',    '전기차',  95, 520, '프리미엄'),
    ('테슬라', 'Model S',    '전기차', 120, 600, '프리미엄'),
    ('테슬라', 'Model X',    '전기차', 125, 620, '프리미엄'),
    -- BMW / 벤츠 / 아우디
    ('BMW', '3시리즈',        '세단',    78, 400, '프리미엄'),
    ('BMW', 'X3',             'SUV',     82, 420, '프리미엄'),
    ('벤츠', 'C-Class',       '세단',    85, 430, '프리미엄'),
    ('벤츠', 'GLC',           'SUV',     90, 450, '프리미엄'),
    ('아우디', 'A4',          '세단',    76, 390, '프리미엄'),
    ('아우디', 'Q5',          'SUV',     84, 410, '프리미엄'),
    -- 기타
    ('KGM', '토레스',         'SUV',     44, 190, '경제'),
    ('르노', '그랑 콜레오스',  'SUV',     46, 195, '경제'),
    ('BYD', '돌핀',           '전기차',  38, 170, '경제'),
    ('BYD', '씰',             '전기차',  52, 230, '일반'),
    ('포르쉐', '타이칸',       '전기차', 150, 700, '프리미엄'),
    -- 4열 그리드 마지막 줄 채움 (32대)
    ('현대', '스타리아',       'RV',      59, 290, '일반'),
    ('기아', '레이',           '경차',    32, 140, '경제'),
    ('제네시스', 'GV70',       'SUV',     92, 480, '프리미엄')
) as v(brand_name, car_name, category, base_price, deposit, tier)
inner join public.brands b on b.name = v.brand_name
where not exists (
  select 1
  from public.cars c
  where c.brand_id = b.id
    and c.name = v.car_name
);

-- -----------------------------------------------------------------------------
-- 완료 확인 (선택)
-- -----------------------------------------------------------------------------
-- select count(*) as brand_count from public.brands;
-- select count(*) as car_count from public.cars;
-- select * from public.cars_with_brand order by brand_name, name limit 10;
