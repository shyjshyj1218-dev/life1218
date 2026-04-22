"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type CarItem = {
  id: string;
  brand: string;
  name: string;
  category: string;
  basePrice: number;
  price: string;
  image: string;
};

type EstimateItem = {
  id: string;
  brand: string;
  name: string;
  category: string;
  expectedMonthlyPayment: string;
};

type SuggestionItem = { id: string; brand: string; name: string; category: string };

// 카테고리별 색상 매핑
const CAT: Record<string, { badge: string; bg: string; tabActive: string }> = {
  SUV:     { badge: "bg-emerald-100 text-emerald-700", bg: "bg-gradient-to-br from-emerald-50 to-emerald-100", tabActive: "bg-emerald-600" },
  전기차:  { badge: "bg-blue-100 text-blue-700",      bg: "bg-gradient-to-br from-blue-50 to-blue-100",      tabActive: "bg-blue-600" },
  세단:    { badge: "bg-violet-100 text-violet-700",   bg: "bg-gradient-to-br from-violet-50 to-violet-100",  tabActive: "bg-violet-600" },
  픽업:    { badge: "bg-orange-100 text-orange-700",   bg: "bg-gradient-to-br from-orange-50 to-orange-100",  tabActive: "bg-orange-600" },
  하이브리드: { badge: "bg-teal-100 text-teal-700",   bg: "bg-gradient-to-br from-teal-50 to-teal-100",      tabActive: "bg-teal-600" },
};
const DEFAULT_CAT = { badge: "bg-slate-100 text-slate-600", bg: "bg-gradient-to-br from-slate-50 to-slate-100", tabActive: "bg-slate-600" };
function getCat(c: string) { return CAT[c] ?? DEFAULT_CAT; }

// 간단한 차 SVG 아이콘
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

// 스켈레톤 카드
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="skeleton h-32 w-full rounded-lg" />
      <div className="skeleton mt-4 h-4 w-3/4 rounded" />
      <div className="skeleton mt-2 h-3 w-1/2 rounded" />
      <div className="skeleton mt-3 h-8 w-full rounded-lg" />
    </div>
  );
}

export function CarGrid() {
  const [cars, setCars] = useState<CarItem[]>([]);
  const [isLoadingCars, setIsLoadingCars] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState("");
  const [prepayAvailable, setPrepayAvailable] = useState<"가능" | "불가능">("가능");
  const [prepayAmount, setPrepayAmount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [creditInfo, setCreditInfo] = useState<"high" | "mid" | "low" | "rehab">("mid");
  const [incomeType, setIncomeType] = useState<"worker" | "business" | "corporate" | "freelancer" | "other">("worker");
  const [estimateResults, setEstimateResults] = useState<EstimateItem[]>([]);
  const [selectedCarName, setSelectedCarName] = useState("");
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimateError, setEstimateError] = useState("");
  const [modalStep, setModalStep] = useState<"form" | "result">("form");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  // 모달 내 차종 검색
  const [carSearchInput, setCarSearchInput] = useState("");
  const [carSearchResults, setCarSearchResults] = useState<SuggestionItem[]>([]);
  const [showCarResults, setShowCarResults] = useState(false);
  const [isCarSearching, setIsCarSearching] = useState(false);
  const carSearchRef = useRef<HTMLDivElement>(null);

  function openEstimateModal(carId: string, carLabel = "") {
    setSelectedCarId(carId);
    setCarSearchInput(carLabel);
    setCarSearchResults([]);
    setShowCarResults(false);
    setPrepayAvailable("가능");
    setPrepayAmount(0);
    setCreditInfo("mid");
    setIncomeType("worker");
    setEstimateResults([]);
    setSelectedCarName("");
    setEstimateError("");
    setModalStep("form");
    setIsModalOpen(true);
  }

  function closeEstimateModal() {
    setIsModalOpen(false);
    setCarSearchInput("");
    setCarSearchResults([]);
    setShowCarResults(false);
  }

  async function fetchCars(query: string) {
    setIsLoadingCars(true);
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    const res = await fetch(`/api/cars?${params.toString()}`);
    const result = (await res.json()) as { cars?: CarItem[] };
    setCars(result.cars ?? []);
    setIsLoadingCars(false);
  }

  async function handleEstimate() {
    if (!selectedCarId) return;
    setIsEstimating(true);
    setEstimateError("");

    const [res] = await Promise.all([
      fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedCarId,
          creditScore: creditInfo === "rehab" ? "low" : creditInfo,
          debtStatus: creditInfo === "rehab" ? "rehab" : "none",
          incomeType,
          prepayAvailable: prepayAvailable === "가능",
          prepayAmount,
        }),
      }),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);

    if (!res.ok) {
      setEstimateError("견적 계산 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsEstimating(false);
      return;
    }

    const result = (await res.json()) as { selectedCar?: string; estimates: EstimateItem[] };
    setSelectedCarName(result.selectedCar ?? "");
    setEstimateResults(result.estimates ?? []);
    setModalStep("result");
    setIsEstimating(false);
  }

  // 차량 목록 fetch (debounce)
  useEffect(() => {
    const t = setTimeout(() => fetchCars(searchKeyword), 250);
    return () => clearTimeout(t);
  }, [searchKeyword]);

  // 배너 견적확인 버튼 이벤트 수신 → 빈 폼 모달 오픈
  useEffect(() => {
    function handler() { openEstimateModal("", ""); }
    window.addEventListener("ks:openEstimate", handler);
    return () => window.removeEventListener("ks:openEstimate", handler);
  }, []);

  // 모달 내 차종 검색 debounce
  useEffect(() => {
    if (!carSearchInput.trim()) {
      setCarSearchResults([]);
      setShowCarResults(false);
      setIsCarSearching(false);
      return;
    }
    setIsCarSearching(true);
    const t = setTimeout(async () => {
      const res = await fetch(`/api/cars/suggest?q=${encodeURIComponent(carSearchInput)}`);
      const data = (await res.json()) as { suggestions: SuggestionItem[] };
      setCarSearchResults(data.suggestions ?? []);
      setShowCarResults((data.suggestions ?? []).length > 0);
      setIsCarSearching(false);
    }, 200);
    return () => clearTimeout(t);
  }, [carSearchInput]);

  // 모달 차종 검색 외부 클릭 시 닫기
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (carSearchRef.current && !carSearchRef.current.contains(e.target as Node)) {
        setShowCarResults(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 자동완성 제안
  useEffect(() => {
    if (!searchKeyword.trim()) { setSuggestions([]); setShowSuggestions(false); return; }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/cars/suggest?q=${encodeURIComponent(searchKeyword)}`);
      const data = (await res.json()) as { suggestions: SuggestionItem[] };
      setSuggestions(data.suggestions ?? []);
      setShowSuggestions((data.suggestions ?? []).length > 0);
    }, 150);
    return () => clearTimeout(t);
  }, [searchKeyword]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSelectSuggestion(item: SuggestionItem) {
    setSearchKeyword(`${item.brand} ${item.name}`);
    setShowSuggestions(false);
  }

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-xl font-bold text-slate-900 sm:text-3xl">추천 차량</h2>
        </div>

        {/* 검색창 */}
        <div className="mt-3">
          <div className="search-wrapper" ref={searchWrapperRef}>
            <form className="search-form" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="car-search">
                <input
                  required
                  autoComplete="off"
                  placeholder="브랜드 또는 차종 검색"
                  id="car-search"
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onKeyDown={(e) => e.key === "Escape" && setShowSuggestions(false)}
                />
                <div className="search-icon">
                  <svg strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" fill="none" className="search-swap-on">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                  <svg strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" fill="none" className="search-swap-off">
                    <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                </div>
                <button
                  type="button"
                  className="search-close-btn"
                  onClick={() => { setSearchKeyword(""); setSuggestions([]); setShowSuggestions(false); }}
                >
                  <svg viewBox="0 0 20 20" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" fillRule="evenodd" />
                  </svg>
                </button>
              </label>
            </form>

            {showSuggestions && (
              <ul className="search-suggestions" role="listbox">
                {suggestions.map((item) => (
                  <li key={item.id} role="option" aria-selected={false} className="search-suggestion-item" onMouseDown={() => handleSelectSuggestion(item)}>
                    <span>
                      <span className="search-suggestion-brand">{item.brand}</span>{" "}
                      <span className="search-suggestion-name">{item.name}</span>
                    </span>
                    <span className="search-suggestion-category">{item.category}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 차량 그리드 */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {isLoadingCars
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : cars.map((car) => {
                const colors = getCat(car.category);
                return (
                  <div key={car.id} className="group relative rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                    {/* 이미지 영역 */}
                    <button
                      type="button"
                      onClick={() => openEstimateModal(car.id, `${car.brand} ${car.name}`)}
                      className="w-full text-left"
                    >
                      <div className={`relative flex h-32 items-center justify-center rounded-t-xl ${colors.bg}`}>
                        {/* 카테고리 뱃지 */}
                        <span className={`badge absolute left-2 top-2 ${colors.badge}`}>
                          {car.category}
                        </span>
                        <CarIcon className="h-16 w-16 text-slate-400" />
                      </div>
                    </button>

                    {/* 카드 본문 */}
                    <div className="p-4">
                      <button
                        type="button"
                        onClick={() => openEstimateModal(car.id, `${car.brand} ${car.name}`)}
                        className="w-full text-left"
                      >
                        <p className="text-xs text-slate-400">{car.brand}</p>
                        <h3 className="mt-0.5 text-base font-bold text-slate-900">{car.name}</h3>
                        <p className="mt-1 text-sm font-semibold text-blue-600">{car.price}</p>
                      </button>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEstimateModal(car.id, `${car.brand} ${car.name}`)}
                          className="flex-1 rounded-lg bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-500"
                        >
                          견적 받기
                        </button>
                        <Link
                          href={`/cars/${car.id}`}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          상세
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {!isLoadingCars && cars.length === 0 && (
          <p className="mt-6 text-center text-sm text-slate-500">
            검색 결과가 없습니다. 다른 차량명을 입력해보세요.
          </p>
        )}
      </div>

      {/* 견적 계산 중 풀스크린 로딩 */}
      {isEstimating && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/70 backdrop-blur-sm">
          <div className="estimate-loader">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="estimate-loader-square" />
            ))}
          </div>
          <p className="mt-10 text-sm font-semibold tracking-wide text-white">
            맞춤 견적을 계산하고 있습니다...
          </p>
        </div>
      )}

      {/* 견적 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-2 backdrop-blur-sm sm:p-4" onClick={closeEstimateModal}>
          <div className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-7" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                {modalStep === "form" ? "맞춤 견적 정보 입력" : "맞춤 견적 결과"}
              </h3>
              <button type="button" onClick={closeEstimateModal} className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100">
                닫기
              </button>
            </div>

            {modalStep === "form" ? (
              <form className="mt-5 grid gap-4">
                <div className="grid gap-2 text-sm font-medium text-slate-700">
                  1. 차종선택
                  <div className="relative" ref={carSearchRef}>
                    <input
                      type="text"
                      className="input-base"
                      placeholder="차량명을 검색하세요 (예: 쏘렌토, EV6)"
                      value={carSearchInput}
                      onChange={(e) => {
                        setCarSearchInput(e.target.value);
                        setSelectedCarId("");
                      }}
                      onFocus={() => carSearchResults.length > 0 && setShowCarResults(true)}
                    />
                    {isCarSearching && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">검색 중...</span>
                    )}
                    {selectedCarId && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-500">✓ 선택됨</span>
                    )}
                    {showCarResults && carSearchResults.length > 0 && (
                      <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                        {carSearchResults.map((item) => {
                          const c = getCat(item.category);
                          return (
                            <li key={item.id}>
                              <button
                                type="button"
                                onMouseDown={() => {
                                  setSelectedCarId(item.id);
                                  setCarSearchInput(`${item.brand} ${item.name}`);
                                  setShowCarResults(false);
                                }}
                                className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-blue-50"
                              >
                                <span className="text-sm text-slate-800">
                                  <span className="text-slate-400">{item.brand}</span>{" "}
                                  <span className="font-semibold">{item.name}</span>
                                </span>
                                <span className={`badge text-xs ${c.badge}`}>{item.category}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  2. 신용정보
                  <select className="input-base" value={creditInfo} onChange={(e) => setCreditInfo(e.target.value as typeof creditInfo)}>
                    <option value="high">700점 이상</option>
                    <option value="mid">600점대</option>
                    <option value="low">500점대 이하</option>
                    <option value="rehab">개인회생/파산/신복위</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  3. 소득형태
                  <select className="input-base" value={incomeType} onChange={(e) => setIncomeType(e.target.value as "worker" | "business" | "corporate" | "freelancer" | "other")}>
                    <option value="worker">직장인</option>
                    <option value="business">개인사업자</option>
                    <option value="corporate">법인사업자</option>
                    <option value="freelancer">프리랜서</option>
                    <option value="other">기타</option>
                  </select>
                </label>

                <div className="grid gap-3 text-sm font-medium text-slate-700">
                  <p>4. 선납보증 가능 여부</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(["가능", "불가능"] as const).map((v) => (
                      <button key={v} type="button" onClick={() => setPrepayAvailable(v)}
                        className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${prepayAvailable === v ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
                      <span>선납보증 금액</span>
                      <span className="font-semibold text-slate-800">{prepayAmount}만원</span>
                    </div>
                    <input type="range" min={0} max={500} step={10} value={prepayAmount} onChange={(e) => setPrepayAmount(Number(e.target.value))} className="w-full accent-blue-600" />
                    <div className="mt-1 flex justify-between text-xs text-slate-500">
                      <span>0만원</span><span>500만원</span>
                    </div>
                  </div>
                </div>

                <button type="button" onClick={handleEstimate}
                  className="mt-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-700">
                  견적 바로 받아보기
                </button>
                {estimateError && <p className="text-sm text-red-600">{estimateError}</p>}
              </form>
            ) : (
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="text-base font-semibold text-slate-900">
                  {selectedCarName ? `${selectedCarName} 기준 추천 결과` : "맞춤 견적 결과"}
                </h4>
                <ul className="mt-3 grid gap-2">
                  {estimateResults.map((item) => (
                    <li key={item.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                      {item.brand} {item.name} ({item.category}) - {item.expectedMonthlyPayment}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => setModalStep("form")}
                  className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                  입력 정보 다시 수정하기
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
