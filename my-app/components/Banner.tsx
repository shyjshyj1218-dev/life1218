"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const SLIDES = [
  { src: "/banner/차량2.jpg",      alt: "차량 배너 1" },
  { src: "/banner/자동차배너.jpg",  alt: "차량 배너 2" },
];

const AUTO_PLAY_MS = 4500;

export function Banner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 터치 스와이프
  const touchStartX = useRef<number | null>(null);

  function handleEstimateClick() {
    window.dispatchEvent(new CustomEvent("ks:openEstimate"));
  }

  const goTo = useCallback((idx: number) => {
    setCurrent((idx + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // 자동 슬라이드
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(next, AUTO_PLAY_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, paused, next]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  }

  return (
    <section className="bg-slate-100">
      {/* ── 슬라이더 ───────────────────────────────────────── */}
      <div
        className="relative overflow-hidden bg-white"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* 슬라이드 트랙 */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className="relative aspect-[16/8] w-full flex-shrink-0 sm:aspect-[16/5]"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* 좌우 화살표 */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); prev(); }}
          aria-label="이전 배너"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); next(); }}
          aria-label="다음 배너"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        {/* 하단 점(도트) 인디케이터 */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.preventDefault(); goTo(i); }}
              aria-label={`배너 ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 bg-white shadow"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* 진행 바 */}
        {!paused && (
          <div
            key={current}
            className="absolute bottom-0 left-0 h-0.5 bg-blue-400/70"
            style={{ animation: `progress ${AUTO_PLAY_MS}ms linear forwards` }}
          />
        )}
      </div>

      {/* ── 버튼 영역 ─────────────────────────────────────── */}
      <div className="w-full py-6 sm:py-8">
        <div className="flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-10">
          <button
            type="button"
            onClick={handleEstimateClick}
            className="group flex w-72 items-center justify-center gap-3 rounded-2xl bg-blue-600 px-10 py-6 text-lg font-bold text-white shadow-lg transition-all duration-150 hover:bg-blue-500 hover:shadow-xl active:scale-95"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 transition-transform duration-150 group-hover:scale-110">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            견적 확인하기
          </button>
          <Link
            href="/contact"
            className="group flex w-72 items-center justify-center gap-3 rounded-2xl border-2 border-slate-300 bg-white px-10 py-6 text-lg font-bold text-slate-700 shadow-sm transition-all duration-150 hover:border-blue-400 hover:text-blue-600 hover:shadow-lg active:scale-95"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 transition-transform duration-150 group-hover:scale-110">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            상담 신청하기
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}
