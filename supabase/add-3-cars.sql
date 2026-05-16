-- 기존 DB에 차량 3대 추가 (4열 그리드 마지막 줄 1개 → 4개 맞춤, 총 32대)
-- Supabase SQL Editor에서 실행

insert into public.cars (brand_id, name, category, base_price, deposit, tier)
select b.id, v.car_name, v.category, v.base_price, v.deposit, v.tier
from (
  values
    ('현대', '스타리아',     'RV',   59, 290, '일반'),
    ('기아', '레이',         '경차', 32, 140, '경제'),
    ('제네시스', 'GV70',     'SUV',  92, 480, '프리미엄')
) as v(brand_name, car_name, category, base_price, deposit, tier)
inner join public.brands b on b.name = v.brand_name
where not exists (
  select 1 from public.cars c
  where c.brand_id = b.id and c.name = v.car_name
);
