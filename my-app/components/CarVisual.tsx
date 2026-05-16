const CAT_BG: Record<string, string> = {
  SUV: "from-emerald-50 to-emerald-100",
  전기차: "from-blue-50 to-blue-100",
  세단: "from-violet-50 to-violet-100",
  픽업: "from-orange-50 to-orange-100",
  RV: "from-cyan-50 to-cyan-100",
  하이브리드: "from-teal-50 to-teal-100",
};

const CAT_BADGE: Record<string, string> = {
  SUV: "bg-emerald-100 text-emerald-700",
  전기차: "bg-blue-100 text-blue-700",
  세단: "bg-violet-100 text-violet-700",
  픽업: "bg-orange-100 text-orange-700",
  RV: "bg-cyan-100 text-cyan-700",
  하이브리드: "bg-teal-100 text-teal-700",
};

export function getCarCategoryStyle(category: string) {
  return {
    bg: CAT_BG[category] ?? "from-slate-50 to-slate-100",
    badge: CAT_BADGE[category] ?? "bg-slate-100 text-slate-600",
  };
}

export function CarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="6" y="14" width="52" height="12" rx="3" fill="currentColor" opacity="0.15" />
      <path
        d="M10 14 L18 6 H46 L54 14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="none"
      />
      <rect x="6" y="14" width="52" height="12" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="18" cy="27" r="4" stroke="currentColor" strokeWidth="2" fill="white" />
      <circle cx="46" cy="27" r="4" stroke="currentColor" strokeWidth="2" fill="white" />
      <line x1="28" y1="14" x2="36" y2="14" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

type CarVisualProps = {
  brand: string;
  name: string;
  category: string;
  size?: "sm" | "md" | "lg";
};

export function CarVisual({ brand, name, category, size = "md" }: CarVisualProps) {
  const { bg, badge } = getCarCategoryStyle(category);
  const heights = { sm: "h-24", md: "h-36", lg: "h-44" };
  const iconSizes = { sm: "h-12 w-12", md: "h-16 w-16", lg: "h-20 w-20" };

  return (
    <div className={`relative flex ${heights[size]} items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${bg}`}>
      <span className={`badge absolute left-2 top-2 ${badge}`}>{category}</span>
      <CarIcon className={`${iconSizes[size]} text-slate-400`} />
      <div className="absolute bottom-2 left-2 right-2 text-left">
        <p className="text-[10px] text-slate-400">{brand}</p>
        <p className="text-sm font-bold text-slate-800">{name}</p>
      </div>
    </div>
  );
}
