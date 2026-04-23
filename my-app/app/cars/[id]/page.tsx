"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ConsultationForm } from "@/components/ConsultationForm";
import Link from "next/link";
import { use, useEffect, useState } from "react";

type Car = { id: string; brand: string; name: string; category: string; basePrice: number };

// ─── 카테고리별 색상 ───────────────────────────────────────────
const CAT_BG: Record<string, string> = {
  SUV:        "bg-gradient-to-br from-emerald-50 to-emerald-100",
  전기차:     "bg-gradient-to-br from-blue-50 to-blue-100",
  세단:       "bg-gradient-to-br from-violet-50 to-violet-100",
  픽업:       "bg-gradient-to-br from-orange-50 to-orange-100",
  하이브리드: "bg-gradient-to-br from-teal-50 to-teal-100",
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

// ─── 카테고리별 콘텐츠 데이터 ────────────────────────────────────
type CatContent = {
  tagline: string;
  description: string;
  fuelLabel: string;
  fuelCity: string;
  fuelHighway: string;
  fuelCombined: string;
  fuelUnit: string;
  fuelNote: string;
  specs: { label: string; value: string }[];
  targets: { icon: string; title: string; desc: string }[];
  pros: string[];
  cons: string[];
};

const CAT_CONTENT: Record<string, CatContent> = {
  SUV: {
    tagline: "넓은 공간과 강인한 주행성능을 동시에",
    description:
      "SUV는 넉넉한 실내 공간과 높은 착좌 위치, 그리고 다목적 활용성으로 국내에서 가장 많이 팔리는 차종입니다. 도심 출퇴근은 물론 주말 캠핑·아웃도어까지 단 한 대로 해결할 수 있어 가족 단위 구매자에게 특히 인기가 높습니다. 최신 모델은 첨단 운전자 보조 시스템(ADAS)과 넓은 화물 공간을 기본 제공하며, 어댑티브 크루즈 컨트롤, 차선 유지 보조, 스마트 주차 등 편의 장비도 풍부합니다.",
    fuelLabel: "복합 연비",
    fuelCity: "10.5 ~ 13.5",
    fuelHighway: "12.0 ~ 15.5",
    fuelCombined: "11.0 ~ 14.5",
    fuelUnit: "km/L",
    fuelNote: "※ 2,000cc 가솔린 기준 / 실제 연비는 운전 방식·도로 조건에 따라 달라질 수 있습니다.",
    specs: [
      { label: "차체 크기", value: "중형 ~ 대형" },
      { label: "탑승 인원", value: "5 ~ 7인" },
      { label: "트렁크 용량", value: "500 ~ 800L" },
      { label: "최고 출력", value: "150 ~ 300 ps" },
      { label: "구동 방식", value: "FWD / AWD 선택 가능" },
      { label: "서스펜션", value: "맥퍼슨 / 멀티링크" },
    ],
    targets: [
      { icon: "👨‍👩‍👧‍👦", title: "가족 단위 구매자", desc: "2~3열 넓은 공간으로 아이·유모차·짐을 한번에 해결" },
      { icon: "🏕️", title: "아웃도어 활동가", desc: "AWD와 충분한 지상고로 캠핑·등산 코스도 거뜬" },
      { icon: "🏙️", title: "도심 출퇴근족", desc: "높은 시야와 편안한 승차감으로 장거리 통근도 쾌적" },
      { icon: "🚗", title: "첫 차 구매자", desc: "다목적 활용도 덕분에 차량 교체 주기를 늘릴 수 있음" },
    ],
    pros: ["넓은 실내와 트렁크 공간", "높은 운전 시야", "AWD 선택 시 험로 주파 가능", "다양한 모델·가격대 선택지"],
    cons: ["세단 대비 연비 불리", "주차 시 큰 차체 부담", "고속 주행 안정성은 세단보다 낮음"],
  },
  전기차: {
    tagline: "조용하고 강력한 미래형 드라이빙",
    description:
      "전기차는 내연기관 없이 전기 모터만으로 구동하는 차세대 이동 수단입니다. 정숙성과 즉각적인 가속 반응이 뛰어나며, 주유소 방문 없이 가정용 충전기나 공공 충전소에서 편리하게 충전할 수 있습니다. 정부 보조금 혜택과 낮은 유지비(전기 연료비·엔진오일 없음) 덕분에 장기 보유 시 경제적 이점이 큽니다. 최신 모델은 1회 충전으로 400~600km 이상 주행이 가능해 주행거리 불안도 크게 해소됐습니다.",
    fuelLabel: "전비 (전력 소비 효율)",
    fuelCity: "5.5 ~ 7.5",
    fuelHighway: "4.5 ~ 6.5",
    fuelCombined: "5.0 ~ 7.0",
    fuelUnit: "km/kWh",
    fuelNote: "※ 1회 충전 주행거리 400~600km 수준 / 겨울철 저온 환경에서 주행거리가 10~20% 감소할 수 있습니다.",
    specs: [
      { label: "배터리 용량", value: "58 ~ 100 kWh" },
      { label: "최대 주행거리", value: "400 ~ 600 km (1회 충전)" },
      { label: "급속 충전 시간", value: "20~80% 약 18~30분" },
      { label: "최고 출력", value: "170 ~ 450 ps" },
      { label: "탄소 배출", value: "0 g/km (주행 중)" },
      { label: "구동 방식", value: "후륜 / AWD 듀얼모터" },
    ],
    targets: [
      { icon: "💰", title: "유지비 절감 원하는 분", desc: "연료비·엔진오일 등 유지비가 내연기관 대비 50% 이상 절감" },
      { icon: "🌿", title: "환경을 생각하는 분", desc: "주행 중 탄소 배출 0으로 친환경 라이프스타일 실현" },
      { icon: "🏠", title: "자가 충전 가능한 분", desc: "집이나 직장 주차장에 충전기가 있으면 최적의 선택" },
      { icon: "⚡", title: "역동적 드라이빙 선호", desc: "전기 모터 특유의 즉각적인 가속감으로 스포티한 드라이빙" },
    ],
    pros: ["유지비 최저 수준", "정숙하고 즉각적인 가속", "정부 보조금 혜택", "엔진 정비 불필요"],
    cons: ["충전 인프라 의존", "장거리 여행 시 충전 계획 필요", "초기 구매 비용 높음", "겨울철 주행거리 감소"],
  },
  세단: {
    tagline: "균형 잡힌 성능과 세련된 스타일",
    description:
      "세단은 독립적인 트렁크 공간과 낮은 무게중심을 갖춰 주행 안정성이 높고 공기역학적으로 유리한 차체 구조를 가집니다. 도심 출퇴근부터 고속도로 장거리 운전까지 고른 성능을 발휘하며, 세련된 외관 디자인으로 비즈니스 미팅에서도 좋은 인상을 줍니다. 연비 효율이 우수하고 주차·조향이 SUV보다 쉬워 도심 주행에 최적화된 차종입니다.",
    fuelLabel: "복합 연비",
    fuelCity: "12.0 ~ 16.0",
    fuelHighway: "14.0 ~ 18.0",
    fuelCombined: "13.0 ~ 17.0",
    fuelUnit: "km/L",
    fuelNote: "※ 1,600~2,000cc 가솔린 기준 / 터보 엔진 모델은 연비가 다소 낮을 수 있습니다.",
    specs: [
      { label: "차체 크기", value: "소형 ~ 대형" },
      { label: "탑승 인원", value: "5인" },
      { label: "트렁크 용량", value: "450 ~ 550L" },
      { label: "최고 출력", value: "120 ~ 250 ps" },
      { label: "구동 방식", value: "FWD / RWD" },
      { label: "최고 속도", value: "180 ~ 250 km/h" },
    ],
    targets: [
      { icon: "👔", title: "직장인·비즈니스맨", desc: "세련된 외관과 조용한 실내로 비즈니스 미팅에도 적합" },
      { icon: "🛣️", title: "장거리 통근자", desc: "우수한 연비와 안정적인 고속 주행으로 장거리도 편안" },
      { icon: "🎯", title: "효율을 중시하는 분", desc: "연비·유지비·가격 모두 균형 잡힌 실용적 선택" },
      { icon: "🅿️", title: "도심 주차 빈번한 분", desc: "상대적으로 작은 차체로 좁은 도심 주차가 수월" },
    ],
    pros: ["뛰어난 연비 효율", "고속 주행 안정성", "세련된 디자인", "합리적인 유지비"],
    cons: ["SUV 대비 작은 실내 공간", "가족용으로는 트렁크 제한적", "험로 주행 어려움"],
  },
  픽업: {
    tagline: "강력한 적재 능력과 오프로드 정복",
    description:
      "픽업트럭은 개방형 화물 적재함(베드)을 갖춰 대용량 화물 운반이 가능한 차종입니다. 강력한 엔진과 높은 견인 능력(토잉 캐퍼시티)으로 보트·캐러밴 등 대형 장비 운반에 탁월합니다. 4WD 시스템과 높은 최저 지상고 덕분에 비포장 험로, 건설 현장, 농장 환경에서도 거뜬히 활약합니다. 최근에는 편안한 실내 인테리어와 첨단 편의 장비를 갖춘 모델이 늘어 레저·일상 겸용으로도 인기를 얻고 있습니다.",
    fuelLabel: "복합 연비",
    fuelCity: "8.0 ~ 11.0",
    fuelHighway: "10.0 ~ 13.0",
    fuelCombined: "9.0 ~ 12.0",
    fuelUnit: "km/L",
    fuelNote: "※ 2,500~3,000cc 디젤 기준 / 4WD 상시 구동 시 연비가 낮아질 수 있습니다.",
    specs: [
      { label: "적재함(베드) 길이", value: "약 1.5 ~ 1.8m" },
      { label: "최대 적재량", value: "700 ~ 1,000 kg" },
      { label: "최대 견인력", value: "3,000 ~ 4,500 kg" },
      { label: "최고 출력", value: "170 ~ 300 ps" },
      { label: "구동 방식", value: "4WD / AWD" },
      { label: "최저 지상고", value: "200 mm 이상" },
    ],
    targets: [
      { icon: "🏗️", title: "사업·상업용 필요한 분", desc: "건설 자재, 농기계, 대형 화물 운반에 최적화" },
      { icon: "🏕️", title: "헤비 아웃도어족", desc: "보트·캐러밴 견인 및 비포장 험로 주파 가능" },
      { icon: "🚜", title: "농장·임업 종사자", desc: "험지 주파력과 높은 적재량으로 농업 현장에서 활약" },
      { icon: "💪", title: "실용성 최우선", desc: "SUV의 승차감과 트럭의 적재 능력을 동시에 원하는 분" },
    ],
    pros: ["대용량 화물 적재 가능", "높은 견인 능력", "험로 주파 탁월", "내구성·신뢰성 높음"],
    cons: ["도심 주차 매우 불편", "연비 낮음", "회전 반경 큼", "차량 가격 높음"],
  },
  하이브리드: {
    tagline: "연비와 환경, 두 마리 토끼를 잡다",
    description:
      "하이브리드 차량은 가솔린(또는 디젤) 엔진과 전기 모터를 결합해 두 동력원을 상황에 맞게 자동으로 전환합니다. 저속·정차 시에는 전기 모터로, 고속·가속 시에는 엔진과 모터를 함께 사용해 최적의 연비를 실현합니다. 별도 충전 없이도 회생제동으로 에너지를 충전하기 때문에 사용이 편리합니다. 내연기관 차량보다 연비가 30~50% 높고, 전기차보다 주행거리 걱정이 없어 과도기적 최적 선택으로 꼽힙니다.",
    fuelLabel: "복합 연비",
    fuelCity: "16.0 ~ 22.0",
    fuelHighway: "15.0 ~ 19.0",
    fuelCombined: "16.0 ~ 21.0",
    fuelUnit: "km/L",
    fuelNote: "※ 도심 저속 구간에서 전기 모터 비중이 높아 도심 연비가 특히 우수합니다.",
    specs: [
      { label: "엔진 + 모터 합산 출력", value: "100 ~ 220 ps" },
      { label: "배터리 용량", value: "1.5 ~ 2.0 kWh (보조 배터리)" },
      { label: "이산화탄소 배출", value: "내연기관 대비 30~40% 감소" },
      { label: "충전 방식", value: "회생제동 자동 충전 (외부 충전 불필요)" },
      { label: "구동 방식", value: "FWD / AWD" },
      { label: "연료 종류", value: "가솔린 (일반 주유)" },
    ],
    targets: [
      { icon: "🚦", title: "도심 출퇴근 위주", desc: "신호·정체 구간에서 전기 모터 비중이 높아 연비 극대화" },
      { icon: "💵", title: "연료비 절감 원하는 분", desc: "일반 가솔린 대비 연료비 30~50% 절약 가능" },
      { icon: "🔌", title: "충전 인프라 없는 분", desc: "전기차와 달리 별도 충전기 설치 없이 주유소만 이용" },
      { icon: "🌍", title: "친환경 관심 있는 분", desc: "CO₂ 배출을 줄이면서도 주행거리 제한 없이 운행 가능" },
    ],
    pros: ["뛰어난 연비 (도심 특히 우수)", "충전 인프라 불필요", "전기차 대비 저렴한 구매 비용", "조용하고 부드러운 주행"],
    cons: ["전기차보다는 높은 연료비", "배터리 교체 비용 발생 가능", "PHEV 대비 전기 전용 주행거리 짧음"],
  },
};

const DEFAULT_CONTENT: CatContent = {
  tagline: "합리적인 가격의 실용적인 선택",
  description: "다양한 라이프스타일에 맞는 실용적인 차량입니다. 안정적인 주행 성능과 편안한 승차감을 제공하며, 도심 및 근교 주행 모두에 적합합니다.",
  fuelLabel: "복합 연비",
  fuelCity: "11.0 ~ 15.0",
  fuelHighway: "13.0 ~ 17.0",
  fuelCombined: "12.0 ~ 16.0",
  fuelUnit: "km/L",
  fuelNote: "※ 실제 연비는 운전 방식·도로 조건에 따라 달라질 수 있습니다.",
  specs: [
    { label: "탑승 인원", value: "5인" },
    { label: "구동 방식", value: "FWD" },
    { label: "연료 종류", value: "가솔린" },
    { label: "최고 출력", value: "120 ~ 200 ps" },
    { label: "변속기", value: "자동 6단 / DCT" },
    { label: "서스펜션", value: "맥퍼슨 / 토션빔" },
  ],
  targets: [
    { icon: "🚗", title: "일상 출퇴근", desc: "편안한 승차감과 적절한 연비로 일상 드라이빙에 최적" },
    { icon: "👨‍👩‍👦", title: "소가족", desc: "적당한 공간과 합리적인 가격으로 가족 모두 만족" },
    { icon: "💰", title: "실용적인 선택", desc: "가성비를 중시하는 구매자에게 추천" },
    { icon: "🎓", title: "첫 차 구매자", desc: "합리적인 가격과 낮은 유지비로 첫 차로 적합" },
  ],
  pros: ["합리적인 가격", "안정적인 성능", "낮은 유지비", "편리한 부품 수급"],
  cons: ["특출난 장점보다 균형적", "고성능 버전 선택지 제한"],
};

const FEATURES = ["전담 매니저 배정", "투명한 견적 공개", "빠른 출고 지원", "서류 대행 서비스"];

// ─── 차 아이콘 ────────────────────────────────────────────────
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

// ─── 메인 컴포넌트 ──────────────────────────────────────────────
export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [car, setCar] = useState<Car | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/cars/${id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((d: { car?: Car } | null) => { if (d?.car) setCar(d.car); })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Header />
        <main className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-4xl">🚗</p>
          <h1 className="mt-4 text-xl font-bold text-slate-800">차량을 찾을 수 없습니다.</h1>
          <Link href="/" className="mt-6 text-sm text-blue-600 hover:underline">← 홈으로 돌아가기</Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Header />
        <main className="py-20">
          <div className="mx-auto w-full max-w-4xl px-6 space-y-4">
            <div className="skeleton h-72 w-full rounded-2xl" />
            <div className="skeleton h-6 w-1/3 rounded" />
            <div className="skeleton h-4 w-2/3 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const bg      = CAT_BG[car.category]    ?? "bg-gradient-to-br from-slate-50 to-slate-100";
  const badge   = CAT_BADGE[car.category]  ?? "bg-slate-100 text-slate-600";
  const accent  = CAT_ACCENT[car.category] ?? "text-blue-600";
  const btnColor = CAT_BTN[car.category]  ?? "bg-blue-600 hover:bg-blue-500";
  const content  = CAT_CONTENT[car.category] ?? DEFAULT_CONTENT;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>

        {/* ── 히어로 ─────────────────────────────────────────── */}
        <section className={`${bg} py-12`}>
          <div className="mx-auto w-full max-w-4xl px-6">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              목록으로
            </Link>

            <div className="mt-4 flex flex-col gap-8 sm:flex-row sm:items-center">
              {/* 차량 이미지 */}
              <div className="flex h-52 w-full flex-shrink-0 items-center justify-center rounded-2xl border border-white/60 bg-white/50 shadow-sm sm:w-64">
                <CarIcon className="h-28 w-48 text-slate-400" />
              </div>

              {/* 차량 기본 정보 */}
              <div className="flex-1">
                <span className={`badge text-xs ${badge}`}>{car.category}</span>
                <p className="mt-2 text-sm font-semibold text-slate-500">{car.brand}</p>
                <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{car.name}</h1>
                <p className={`mt-1 text-base font-medium italic ${accent}`}>{content.tagline}</p>
                <p className={`mt-3 text-2xl font-bold ${accent}`}>
                  월 {car.basePrice}만원~
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="#consult"
                    className={`rounded-xl px-6 py-3 text-sm font-bold text-white shadow transition-colors ${btnColor}`}
                  >
                    상담 신청하기
                  </a>
                  <a
                    href="#detail"
                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    차량 상세 보기
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 차량 소개 ───────────────────────────────────────── */}
        <section id="detail" className="bg-white py-12">
          <div className="mx-auto w-full max-w-4xl px-6">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {car.brand} {car.name} 소개
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">{content.description}</p>

            {/* 주요 제원 */}
            <h3 className="mt-8 text-lg font-bold text-slate-800">주요 제원</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {content.specs.map((s) => (
                <div key={s.label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">{s.label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 연비 정보 ───────────────────────────────────────── */}
        <section className="bg-slate-50 py-12">
          <div className="mx-auto w-full max-w-4xl px-6">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">연비 정보</h2>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-medium text-slate-400">도심 연비</p>
                <p className={`mt-2 text-2xl font-extrabold ${accent}`}>{content.fuelCity}</p>
                <p className="mt-1 text-xs text-slate-400">{content.fuelUnit}</p>
              </div>
              <div className={`rounded-2xl border-2 p-5 shadow-md ${badge.replace("text-", "border-").split(" ")[0]} bg-white text-center`}>
                <p className="text-xs font-medium text-slate-400">{content.fuelLabel}</p>
                <p className={`mt-2 text-2xl font-extrabold ${accent}`}>{content.fuelCombined}</p>
                <p className="mt-1 text-xs text-slate-400">{content.fuelUnit}</p>
                <span className="mt-2 inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">기준값</span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-medium text-slate-400">고속도로 연비</p>
                <p className={`mt-2 text-2xl font-extrabold ${accent}`}>{content.fuelHighway}</p>
                <p className="mt-1 text-xs text-slate-400">{content.fuelUnit}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">{content.fuelNote}</p>
          </div>
        </section>

        {/* ── 이런 분께 추천 ────────────────────────────────────── */}
        <section className="bg-white py-12">
          <div className="mx-auto w-full max-w-4xl px-6">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">이런 분께 추천해요</h2>
            <p className="mt-1 text-sm text-slate-500">{car.category} 차량을 구매할 때 이런 분들에게 특히 잘 맞습니다.</p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {content.targets.map((t) => (
                <div key={t.title} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                    {t.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">{t.title}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 장단점 ─────────────────────────────────────────── */}
        <section className="bg-slate-50 py-12">
          <div className="mx-auto w-full max-w-4xl px-6">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">장점 &amp; 단점</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="mb-3 font-bold text-emerald-700">✅ 장점</p>
                <ul className="space-y-2">
                  {content.pros.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-0.5 text-emerald-500">•</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
                <p className="mb-3 font-bold text-rose-600">⚠️ 단점</p>
                <ul className="space-y-2">
                  {content.cons.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-0.5 text-rose-400">•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── 포함 서비스 ─────────────────────────────────────── */}
        <section className="bg-white py-12">
          <div className="mx-auto w-full max-w-4xl px-6">
            <h2 className="text-xl font-bold text-slate-900">포함 서비스</h2>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="text-blue-500">✓</span>
                  <span className="text-sm font-medium text-slate-700">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 상담 신청 ───────────────────────────────────────── */}
        <section id="consult" className="py-14">
          <div className="mx-auto w-full max-w-2xl px-6">
            <h2 className="text-xl font-bold text-slate-900">
              {car.brand} {car.name} 상담 신청
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              전담 매니저가 24시간 이내 맞춤 견적을 안내드립니다.
            </p>
            <div className="mt-5">
              <ConsultationForm defaultCarModel={`${car.brand} ${car.name}`} />
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
