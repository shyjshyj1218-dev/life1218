import Link from "next/link";

const quickLinks = [
  { label: "홈", href: "/" },
  { label: "차량 보기", href: "/cars" },
  { label: "회사소개", href: "/about" },
  { label: "상담신청", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* 브랜드 */}
          <div>
            <p className="text-lg font-extrabold text-slate-900">KS RENTCAR</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              합리적인 가격으로 원하는 차량을 <br />
              빠르고 편리하게 만나보세요.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://pf.kakao.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-yellow-900 hover:bg-yellow-300"
              >
                K
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-xs font-bold text-white hover:opacity-80"
              >
                IG
              </a>
            </div>
          </div>

          {/* 빠른 링크 */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-slate-400">메뉴</p>
            <ul className="mt-3 grid gap-2">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-600 hover:text-blue-600 hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-slate-400">연락처</p>
            <ul className="mt-3 grid gap-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="text-base">📞</span>
                <a href="tel:010-0000-0000" className="hover:text-blue-600">
                  010-0000-0000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-base">✉️</span>
                <a href="mailto:contact@ksrentcar.com" className="hover:text-blue-600">
                  contact@ksrentcar.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-base">📍</span>
                <span>서울특별시 강남구 (주소 확정 후 업데이트)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-base">⏰</span>
                <span>평일 09:00 – 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-6 sm:flex-row">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} KS RENTCAR. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            사업자등록번호: 000-00-00000 | 대표: 홍길동
          </p>
        </div>
      </div>
    </footer>
  );
}
