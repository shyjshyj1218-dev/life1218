import Link from "next/link";

const navItems = [
  { label: "회사소개", href: "/about" },
  { label: "차량보기", href: "/cars" },
  { label: "상담신청", href: "/contact" },
];

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-end justify-between px-4 pb-2 pt-4 sm:px-6">
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-5xl font-extrabold tracking-tight text-slate-900">카<span className="text-blue-600">in</span></span>
          <span className="mt-0.5 text-xs font-medium text-slate-400">— Be in the moment</span>
        </Link>
        <nav className="hidden gap-6 pb-1 text-sm font-medium text-slate-700 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-blue-600">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-3 gap-2 px-4 pb-3 md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-xs font-semibold text-slate-700 active:bg-slate-100"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
