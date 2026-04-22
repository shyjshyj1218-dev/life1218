"use client";

import Image from "next/image";
import Link from "next/link";

const BANNER_IMAGE_PATH = "/banner/자동차배너.jpg";

export function Banner() {
  function handleEstimateClick() {
    window.dispatchEvent(new CustomEvent("ks:openEstimate"));
  }

  return (
    <section className="bg-slate-100">
      {/* 배너 이미지 - 여백 없이 전체 너비 */}
      <Link href="/contact" className="block overflow-hidden bg-white">
        <div className="relative aspect-[16/8] w-full sm:aspect-[16/5]">
          <Image
            src={BANNER_IMAGE_PATH}
            alt="광고 배너"
            fill
            priority
            className="object-cover"
          />
        </div>
      </Link>
      {/* 버튼 영역 */}
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
    </section>
  );
}
