"use client";

type Car = { id: string; brand: string; name: string; category: string; basePrice: number };

// ─── 색상 ─────────────────────────────────────────────────────
const CAT_BG: Record<string, string> = {
  SUV:        "from-emerald-50 to-emerald-100",
  전기차:     "from-blue-50 to-blue-100",
  세단:       "from-violet-50 to-violet-100",
  픽업:       "from-orange-50 to-orange-100",
  하이브리드: "from-teal-50 to-teal-100",
};
const CAT_BADGE: Record<string, string> = {
  SUV:        "bg-emerald-100 text-emerald-700",
  전기차:     "bg-blue-100 text-blue-700",
  세단:       "bg-violet-100 text-violet-700",
  픽업:       "bg-orange-100 text-orange-700",
  하이브리드: "bg-teal-100 text-teal-700",
};
const CAT_ACCENT: Record<string, string> = {
  SUV:        "text-emerald-600",
  전기차:     "text-blue-600",
  세단:       "text-violet-600",
  픽업:       "text-orange-600",
  하이브리드: "text-teal-600",
};
const CAT_BTN: Record<string, string> = {
  SUV:        "bg-emerald-600 hover:bg-emerald-500",
  전기차:     "bg-blue-600 hover:bg-blue-500",
  세단:       "bg-violet-600 hover:bg-violet-500",
  픽업:       "bg-orange-600 hover:bg-orange-500",
  하이브리드: "bg-teal-600 hover:bg-teal-500",
};

// ─── 콘텐츠 데이터 ────────────────────────────────────────────
type CatContent = {
  tagline: string;
  summary: string;
  fuelCity: string;
  fuelHighway: string;
  fuelCombined: string;
  fuelUnit: string;
  specs: { label: string; value: string }[];
  targets: { icon: string; text: string }[];
  pros: string[];
  cons: string[];
};

const CAT_CONTENT: Record<string, CatContent> = {
  SUV: {
    tagline: "넓은 공간 · 강인한 주행성능 · 다목적 활용",
    summary: "도심 출퇴근부터 주말 캠핑까지 단 한 대로 해결. 높은 시야, AWD 선택 가능, 넉넉한 트렁크가 강점입니다.",
    fuelCity: "10.5~13.5", fuelHighway: "12.0~15.5", fuelCombined: "11.0~14.5", fuelUnit: "km/L",
    specs: [
      { label: "탑승", value: "5~7인" }, { label: "트렁크", value: "500~800L" },
      { label: "출력", value: "150~300ps" }, { label: "구동", value: "FWD/AWD" },
      { label: "크기", value: "중형~대형" }, { label: "지상고", value: "170mm+" },
    ],
    targets: [
      { icon: "👨‍👩‍👧‍👦", text: "가족 단위" }, { icon: "🏕️", text: "아웃도어족" },
      { icon: "🏙️", text: "장거리 출퇴근" }, { icon: "🚗", text: "첫 차 구매자" },
    ],
    pros: ["넓은 공간·트렁크", "높은 운전 시야", "험로 AWD 가능"],
    cons: ["세단보다 연비 낮음", "주차 시 큰 차체"],
  },
  전기차: {
    tagline: "무소음 · 즉각 가속 · 유지비 최저",
    summary: "1회 충전 400~600km 주행. 연료비·엔진오일 불필요, 정부 보조금 혜택으로 장기 보유 시 경제적입니다.",
    fuelCity: "5.5~7.5", fuelHighway: "4.5~6.5", fuelCombined: "5.0~7.0", fuelUnit: "km/kWh",
    specs: [
      { label: "배터리", value: "58~100kWh" }, { label: "주행거리", value: "400~600km" },
      { label: "급속충전", value: "약 18~30분" }, { label: "출력", value: "170~450ps" },
      { label: "CO₂", value: "0g/km" }, { label: "구동", value: "후륜/AWD" },
    ],
    targets: [
      { icon: "💰", text: "유지비 절감" }, { icon: "🌿", text: "친환경 선호" },
      { icon: "🏠", text: "자가 충전 가능" }, { icon: "⚡", text: "스포티 드라이빙" },
    ],
    pros: ["유지비 최저", "즉각적 가속감", "정부 보조금"],
    cons: ["충전 인프라 의존", "겨울철 주행거리 감소"],
  },
  세단: {
    tagline: "뛰어난 연비 · 안정적 고속주행 · 세련된 스타일",
    summary: "낮은 무게중심과 공기역학적 차체로 고속 안정성 탁월. 연비 효율·유지비 모두 우수한 도심 최적 차종.",
    fuelCity: "12.0~16.0", fuelHighway: "14.0~18.0", fuelCombined: "13.0~17.0", fuelUnit: "km/L",
    specs: [
      { label: "탑승", value: "5인" }, { label: "트렁크", value: "450~550L" },
      { label: "출력", value: "120~250ps" }, { label: "구동", value: "FWD/RWD" },
      { label: "최고속", value: "180~250km/h" }, { label: "크기", value: "소형~대형" },
    ],
    targets: [
      { icon: "👔", text: "직장인·비즈니스" }, { icon: "🛣️", text: "장거리 통근" },
      { icon: "🎯", text: "효율 중시" }, { icon: "🅿️", text: "도심 주차 빈번" },
    ],
    pros: ["뛰어난 연비", "고속 안정성", "세련된 디자인"],
    cons: ["SUV 대비 작은 공간", "험로 주행 어려움"],
  },
  픽업: {
    tagline: "대용량 적재 · 강력한 견인 · 험로 정복",
    summary: "개방형 적재함과 4WD로 화물·레저 모두 해결. 보트·캐러밴 견인, 건설현장·농장 활용에 최적화.",
    fuelCity: "8.0~11.0", fuelHighway: "10.0~13.0", fuelCombined: "9.0~12.0", fuelUnit: "km/L",
    specs: [
      { label: "적재함", value: "1.5~1.8m" }, { label: "최대적재", value: "700~1,000kg" },
      { label: "견인력", value: "3,000~4,500kg" }, { label: "출력", value: "170~300ps" },
      { label: "구동", value: "4WD/AWD" }, { label: "지상고", value: "200mm+" },
    ],
    targets: [
      { icon: "🏗️", text: "상업·사업용" }, { icon: "🏕️", text: "헤비 아웃도어" },
      { icon: "🚜", text: "농장·임업" }, { icon: "💪", text: "실용성 최우선" },
    ],
    pros: ["대용량 적재", "높은 견인력", "험로 탁월"],
    cons: ["도심 주차 불편", "연비 낮음"],
  },
  하이브리드: {
    tagline: "도심 연비 최강 · 충전 불필요 · 친환경",
    summary: "가솔린 엔진+전기 모터 결합. 별도 충전 없이 회생제동으로 자동 충전되며, 내연기관 대비 연비 30~50% 향상.",
    fuelCity: "16.0~22.0", fuelHighway: "15.0~19.0", fuelCombined: "16.0~21.0", fuelUnit: "km/L",
    specs: [
      { label: "합산출력", value: "100~220ps" }, { label: "배터리", value: "1.5~2.0kWh" },
      { label: "CO₂ 절감", value: "30~40%" }, { label: "충전방식", value: "회생제동 자동" },
      { label: "구동", value: "FWD/AWD" }, { label: "연료", value: "가솔린" },
    ],
    targets: [
      { icon: "🚦", text: "도심 출퇴근" }, { icon: "💵", text: "연료비 절감" },
      { icon: "🔌", text: "충전 인프라 없는 분" }, { icon: "🌍", text: "친환경 관심" },
    ],
    pros: ["도심 연비 최강", "충전 인프라 불필요", "CO₂ 감소"],
    cons: ["전기차보다 연료비 높음", "배터리 교체 비용"],
  },
};

const DEFAULT: CatContent = {
  tagline: "합리적 가격 · 안정적 성능 · 실용적 선택",
  summary: "도심 및 근교 주행 모두 적합한 실용적 차량. 안정적인 주행 성능과 편안한 승차감을 제공합니다.",
  fuelCity: "11.0~15.0", fuelHighway: "13.0~17.0", fuelCombined: "12.0~16.0", fuelUnit: "km/L",
  specs: [
    { label: "탑승", value: "5인" }, { label: "구동", value: "FWD" },
    { label: "출력", value: "120~200ps" }, { label: "변속기", value: "자동 6단" },
    { label: "연료", value: "가솔린" }, { label: "서스펜션", value: "맥퍼슨" },
  ],
  targets: [
    { icon: "🚗", text: "일상 출퇴근" }, { icon: "👨‍👩‍👦", text: "소가족" },
    { icon: "💰", text: "가성비 중시" }, { icon: "🎓", text: "첫 차 구매" },
  ],
  pros: ["합리적 가격", "낮은 유지비", "안정적 성능"],
  cons: ["특출난 장점 없음", "선택지 제한적"],
};

// ─── 아이콘 ───────────────────────────────────────────────────
function CarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="6" y="14" width="52" height="12" rx="3" fill="currentColor" opacity="0.15" />
      <path d="M10 14 L18 6 H46 L54 14" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      <rect x="6" y="14" width="52" height="12" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="18" cy="27" r="4" stroke="currentColor" strokeWidth="2" fill="white" />
      <circle cx="46" cy="27" r="4" stroke="currentColor" strokeWidth="2" fill="white" />
      <line x1="28" y1="14" x2="36" y2="14" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// ─── 모달 컴포넌트 ─────────────────────────────────────────────
type Props = {
  car: Car;
  onClose: () => void;
  onEstimate: () => void;
};

export function CarDetailModal({ car, onClose, onEstimate }: Props) {
  const bg     = CAT_BG[car.category]    ?? "from-slate-50 to-slate-100";
  const badge  = CAT_BADGE[car.category]  ?? "bg-slate-100 text-slate-600";
  const accent = CAT_ACCENT[car.category] ?? "text-blue-600";
  const btn    = CAT_BTN[car.category]    ?? "bg-blue-600 hover:bg-blue-500";
  const c      = CAT_CONTENT[car.category] ?? DEFAULT;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 헤더 ─────────────────────────────────────── */}
        <div className={`bg-gradient-to-br ${bg} px-5 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CarIcon className="h-10 w-16 text-slate-400" />
              <div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge}`}>{car.category}</span>
                  <span className="text-xs text-slate-400">{car.brand}</span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 leading-tight">{car.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{c.tagline}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className={`text-lg font-bold ${accent}`}>월 {car.basePrice}만원~</p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/60 hover:text-slate-600"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">{c.summary}</p>
        </div>

        {/* ── 본문 ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-px bg-slate-100">

          {/* 왼쪽: 제원 + 연비 */}
          <div className="bg-white px-4 py-3 space-y-3">
            {/* 주요 제원 */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">주요 제원</p>
              <div className="grid grid-cols-3 gap-1.5">
                {c.specs.map((s) => (
                  <div key={s.label} className="rounded-lg bg-slate-50 px-2 py-1.5 text-center">
                    <p className="text-[10px] text-slate-400">{s.label}</p>
                    <p className="text-xs font-semibold text-slate-800">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 연비 */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">연비 ({c.fuelUnit})</p>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="rounded-lg bg-slate-50 px-2 py-2">
                  <p className="text-[10px] text-slate-400">도심</p>
                  <p className={`text-sm font-bold ${accent}`}>{c.fuelCity}</p>
                </div>
                <div className={`rounded-lg px-2 py-2 ${badge}`}>
                  <p className="text-[10px] opacity-70">복합</p>
                  <p className="text-sm font-extrabold">{c.fuelCombined}</p>
                </div>
                <div className="rounded-lg bg-slate-50 px-2 py-2">
                  <p className="text-[10px] text-slate-400">고속</p>
                  <p className={`text-sm font-bold ${accent}`}>{c.fuelHighway}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 추천 대상 + 장단점 */}
          <div className="bg-white px-4 py-3 space-y-3">
            {/* 추천 대상 */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">이런 분께 추천</p>
              <div className="grid grid-cols-2 gap-1.5">
                {c.targets.map((t) => (
                  <div key={t.text} className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1.5">
                    <span className="text-base">{t.icon}</span>
                    <span className="text-xs font-medium text-slate-700">{t.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 장단점 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-emerald-50 px-3 py-2">
                <p className="text-[10px] font-bold text-emerald-600 mb-1">✅ 장점</p>
                {c.pros.map((p) => (
                  <p key={p} className="text-[11px] text-slate-700 leading-snug">• {p}</p>
                ))}
              </div>
              <div className="rounded-lg bg-rose-50 px-3 py-2">
                <p className="text-[10px] font-bold text-rose-500 mb-1">⚠️ 단점</p>
                {c.cons.map((co) => (
                  <p key={co} className="text-[11px] text-slate-700 leading-snug">• {co}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 푸터 CTA ─────────────────────────────────── */}
        <div className="flex items-center gap-3 border-t border-slate-100 bg-white px-5 py-3">
          <button
            type="button"
            onClick={onEstimate}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition-colors ${btn}`}
          >
            견적 받기
          </button>
          <a
            href="/contact"
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            상담 신청하기
          </a>
        </div>
      </div>
    </div>
  );
}
