"use client";

import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      {/* 카카오톡 버튼 */}
      <a
        href="https://open.kakao.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="카카오톡 상담"
        className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
        style={{ backgroundColor: "#FEE500" }}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#3C1E1E">
          <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.611 1.558 4.91 3.906 6.283-.172.63-.621 2.293-.712 2.65-.112.44.161.434.338.316.139-.093 2.21-1.505 3.106-2.114.44.063.893.097 1.362.097 5.523 0 10-3.477 10-7.5S17.523 3 12 3z" />
        </svg>
      </a>

      {/* 상담원 연결 버튼 */}
      <a
        href="tel:010-0000-0000"
        aria-label="상담원 연결"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-200 hover:bg-green-400 hover:scale-110 active:scale-95"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 5.97 5.97l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>

      {/* 상단으로 이동 버튼 */}
      <button
        type="button"
        onClick={scrollTop}
        aria-label="상단으로 이동"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-200 hover:bg-blue-500 hover:scale-110 active:scale-95"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </div>
  );
}
