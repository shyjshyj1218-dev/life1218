"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ConsultationForm } from "@/components/ConsultationForm";
import Link from "next/link";
import { use, useEffect, useState } from "react";

type Car = { id: string; brand: string; name: string; category: string; basePrice: number };

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

const FEATURES = ["전담 매니저 배정", "투명한 견적 공개", "빠른 출고 지원", "서류 대행 서비스"];

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
          <div className="mx-auto w-full max-w-3xl px-6">
            <div className="skeleton h-64 w-full rounded-2xl" />
            <div className="skeleton mt-6 h-6 w-1/3 rounded" />
            <div className="skeleton mt-3 h-4 w-1/2 rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const bg = CAT_BG[car.category] ?? "bg-gradient-to-br from-slate-50 to-slate-100";
  const badge = CAT_BADGE[car.category] ?? "bg-slate-100 text-slate-600";

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main>
        {/* 히어로 이미지 */}
        <section className={`${bg} py-12`}>
          <div className="mx-auto w-full max-w-4xl px-6">
            <Link href="/" className="text-sm text-slate-500 hover:text-blue-600">
              ← 목록으로
            </Link>
            <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className={`flex h-48 w-full flex-1 items-center justify-center rounded-2xl border border-white/60 bg-white/40 shadow-sm sm:max-w-xs`}>
                <svg viewBox="0 0 64 32" fill="none" className="h-24 w-40 text-slate-400">
                  <rect x="6" y="14" width="52" height="12" rx="3" fill="currentColor" opacity="0.15" />
                  <path d="M10 14 L18 6 H46 L54 14" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
                  <rect x="6" y="14" width="52" height="12" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="18" cy="27" r="4" stroke="currentColor" strokeWidth="2" fill="white" />
                  <circle cx="46" cy="27" r="4" stroke="currentColor" strokeWidth="2" fill="white" />
                  <line x1="28" y1="14" x2="36" y2="14" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>

              <div className="flex-1">
                <span className={`badge text-xs ${badge}`}>{car.category}</span>
                <p className="mt-2 text-sm font-semibold text-slate-500">{car.brand}</p>
                <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{car.name}</h1>
                <p className="mt-3 text-2xl font-bold text-blue-600">
                  월 {car.basePrice}만원~
                </p>
                <div className="mt-4">
                  <a
                    href="#consult"
                    className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow hover:bg-blue-500"
                  >
                    상담 신청하기
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 포함 서비스 */}
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

        {/* 상담 신청 */}
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
