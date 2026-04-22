import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import Link from "next/link";

const strengths = [
  {
    icon: "⚡",
    title: "즉시 견적",
    desc: "복잡한 서류 없이 몇 가지 정보만으로 실시간 월 납입금을 확인하세요.",
  },
  {
    icon: "🚗",
    title: "12개 브랜드 · 전 차종",
    desc: "현대·기아부터 벤츠·BMW·테슬라까지, 원하는 차량을 한 곳에서 비교하세요.",
  },
  {
    icon: "🤝",
    title: "전담 매니저",
    desc: "상담 신청 후 24시간 이내 전담 매니저가 직접 연락드립니다.",
  },
  {
    icon: "🔒",
    title: "투명한 계약",
    desc: "숨겨진 비용 없이 견적서 그대로 계약을 진행합니다.",
  },
];

const steps = [
  { step: "01", title: "차량 선택", desc: "원하는 브랜드와 모델을 고르세요." },
  { step: "02", title: "견적 확인", desc: "신용·소득 정보 입력 후 월 납입금을 바로 확인하세요." },
  { step: "03", title: "상담 신청", desc: "전담 매니저가 24시간 내 연락드립니다." },
  { step: "04", title: "계약 & 출고", desc: "서류 완료 후 빠른 출고를 도와드립니다." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main>
        {/* 히어로 */}
        <section className="bg-gradient-to-br from-slate-900 to-blue-900 py-20 text-white">
          <div className="mx-auto w-full max-w-6xl px-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">
              About KS RENTCAR
            </p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-5xl">
              합리적인 렌트카,
              <br />
              KS RENTCAR가 함께합니다
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              KS RENTCAR는 고객이 원하는 차량을 가장 합리적인 조건으로 만날 수 있도록
              돕는 자동차 렌트 플랫폼입니다. 복잡한 과정 없이 간편하게 견적을 확인하고,
              전담 매니저의 밀착 서비스를 경험해 보세요.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/cars"
                className="rounded-lg bg-blue-500 px-6 py-3 text-sm font-semibold hover:bg-blue-400"
              >
                차량 보러가기
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold hover:bg-white/20"
              >
                상담 신청하기
              </Link>
            </div>
          </div>
        </section>

        {/* 강점 4가지 */}
        <section className="py-16">
          <div className="mx-auto w-full max-w-6xl px-6">
            <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              KS RENTCAR를 선택해야 하는 이유
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {strengths.map((s) => (
                <div
                  key={s.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <span className="text-3xl">{s.icon}</span>
                  <h3 className="mt-3 text-base font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 이용 프로세스 */}
        <section className="bg-white py-16">
          <div className="mx-auto w-full max-w-6xl px-6">
            <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              이용 프로세스
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <div key={s.step} className="relative flex flex-col items-start">
                  {i < steps.length - 1 && (
                    <span className="absolute right-0 top-4 hidden h-0.5 w-1/2 bg-blue-100 lg:block" />
                  )}
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-extrabold text-white">
                    {s.step}
                  </span>
                  <h3 className="mt-4 text-sm font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 숫자로 보는 KS RENTCAR */}
        <section className="section-cta py-14">
          <div className="mx-auto w-full max-w-6xl px-6">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              숫자로 보는 KS RENTCAR
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { num: "500+", label: "누적 고객" },
                { num: "12", label: "취급 브랜드" },
                { num: "24h", label: "상담 응답시간" },
                { num: "100%", label: "투명 계약" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl font-extrabold">{stat.num}</p>
                  <p className="mt-1 text-sm font-medium text-blue-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              지금 바로 시작하세요
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              원하는 차량을 골라 무료 견적을 받아보세요. 전담 매니저가 최적의 조건을 찾아드립니다.
            </p>
            <Link
              href="/cars"
              className="mt-6 rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-md hover:bg-blue-500 active:bg-blue-700"
            >
              견적 받으러 가기 →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
