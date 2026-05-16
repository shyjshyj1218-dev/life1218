"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode } from "react";

const navItems = [
  { href: "/admin", label: "대시보드", icon: "📊", exact: true },
  { href: "/admin/leads", label: "고객 목록", icon: "👥" },
  { href: "/admin/cars", label: "차량 관리", icon: "🚗" },
];

export default function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* 사이드바 */}
      <aside className="flex w-56 shrink-0 flex-col bg-slate-900 text-white">
        <div className="flex h-14 items-center border-b border-slate-800 px-5">
          <span className="text-lg font-extrabold tracking-tight">
            카<span className="text-blue-400">in</span>
            <span className="ml-2 text-xs font-normal text-slate-400">관리자</span>
          </span>
        </div>

        <nav className="mt-3 flex-1 space-y-0.5 px-2">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-0.5 border-t border-slate-800 px-2 py-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <span className="text-base">🔗</span>
            사이트 보기
          </a>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-red-900/60 hover:text-red-300"
          >
            <span className="text-base">🚪</span>
            로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 */}
      <div className="flex-1 overflow-auto">
        <main className="min-h-screen p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
