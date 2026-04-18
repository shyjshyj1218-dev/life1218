"use client";

import { useEffect, useState } from "react";

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

export function CarGrid() {
  const [cars, setCars] = useState<CarItem[]>([]);
  const [isLoadingCars, setIsLoadingCars] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState("");
  const [prepayAvailable, setPrepayAvailable] = useState<"가능" | "불가능">("가능");
  const [prepayAmount, setPrepayAmount] = useState(500);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [creditScore, setCreditScore] = useState<"high" | "mid" | "low">("mid");
  const [incomeType, setIncomeType] = useState<
    "worker" | "business" | "corporate" | "freelancer" | "other"
  >("worker");
  const [debtStatus, setDebtStatus] = useState<"none" | "rehab" | "bankruptcy" | "credit">(
    "none"
  );
  const [estimateResults, setEstimateResults] = useState<EstimateItem[]>([]);
  const [selectedCarName, setSelectedCarName] = useState("");
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimateError, setEstimateError] = useState("");
  const [modalStep, setModalStep] = useState<"form" | "result">("form");

  function openEstimateModal(carId: string) {
    setSelectedCarId(carId);
    setPrepayAvailable("가능");
    setPrepayAmount(500);
    setCreditScore("mid");
    setIncomeType("worker");
    setDebtStatus("none");
    setEstimateResults([]);
    setSelectedCarName("");
    setEstimateError("");
    setModalStep("form");
    setIsModalOpen(true);
  }

  function closeEstimateModal() {
    setIsModalOpen(false);
  }

  async function fetchCars(query: string) {
    setIsLoadingCars(true);
    const response = await fetch(`/api/cars?query=${encodeURIComponent(query)}`);
    const result = (await response.json()) as { cars?: CarItem[] };
    setCars(result.cars ?? []);
    setIsLoadingCars(false);
  }

  async function handleEstimate() {
    if (!selectedCarId) return;

    setIsEstimating(true);
    setEstimateError("");

    const response = await fetch("/api/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selectedCarId,
        creditScore,
        debtStatus,
        incomeType,
        prepayAvailable: prepayAvailable === "가능",
        prepayAmount,
      }),
    });

    if (!response.ok) {
      setEstimateError("견적 계산 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsEstimating(false);
      return;
    }

    const result = (await response.json()) as {
      selectedCar?: string;
      estimates: EstimateItem[];
    };
    setSelectedCarName(result.selectedCar ?? "");
    setEstimateResults(result.estimates ?? []);
    setModalStep("result");
    setIsEstimating(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCars(searchKeyword);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  return (
    <>
      <section className="py-10 sm:py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <h2 className="text-xl font-bold text-slate-900 sm:text-3xl">추천 차량</h2>
          <div className="mt-3">
            <input
              type="text"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="🔍"
              className="input-base"
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {cars.map((car) => (
              <button
                type="button"
                key={car.id}
                onClick={() => openEstimateModal(car.id)}
                className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-transform duration-200 active:scale-[0.99] sm:hover:scale-[1.02]"
              >
                <div className="flex h-32 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500">
                  이미지 영역
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  {car.brand} {car.name}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{car.price}</p>
              </button>
            ))}
          </div>
          {isLoadingCars ? (
            <p className="mt-4 text-sm text-slate-500">차량 데이터를 불러오는 중입니다...</p>
          ) : null}
          {!isLoadingCars && cars.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              검색 결과가 없습니다. 다른 차량명을 입력해보세요.
            </p>
          ) : null}
        </div>
      </section>

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-2 backdrop-blur-sm sm:p-4"
          onClick={closeEstimateModal}
        >
          <div
            className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                {modalStep === "form" ? "맞춤 견적 정보 입력" : "맞춤 견적 결과"}
              </h3>
              <button
                type="button"
                onClick={closeEstimateModal}
                className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
              >
                닫기
              </button>
            </div>

            {modalStep === "form" ? (
              <form className="mt-5 grid gap-4">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  1. 차종선택
                  <select
                    className="input-base"
                    value={selectedCarId}
                    onChange={(event) => setSelectedCarId(event.target.value)}
                  >
                    {cars.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.brand} {car.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  2. 신용점수
                  <select
                    className="input-base"
                    value={creditScore}
                    onChange={(event) => setCreditScore(event.target.value as "high" | "mid" | "low")}
                  >
                    <option value="high">700점 이상</option>
                    <option value="mid">600점대</option>
                    <option value="low">500점대 이하</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  개인회생/파산/신복위
                  <select
                    className="input-base"
                    value={debtStatus}
                    onChange={(event) =>
                      setDebtStatus(
                        event.target.value as "none" | "rehab" | "bankruptcy" | "credit"
                      )
                    }
                  >
                    <option value="none">해당 없음</option>
                    <option value="rehab">개인회생</option>
                    <option value="bankruptcy">파산</option>
                    <option value="credit">신복위</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  3. 소득형태
                  <select
                    className="input-base"
                    value={incomeType}
                    onChange={(event) =>
                      setIncomeType(
                        event.target.value as
                          | "worker"
                          | "business"
                          | "corporate"
                          | "freelancer"
                          | "other"
                      )
                    }
                  >
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
                    <button
                      type="button"
                      onClick={() => setPrepayAvailable("가능")}
                      className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                        prepayAvailable === "가능"
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      가능
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrepayAvailable("불가능")}
                      className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                        prepayAvailable === "불가능"
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      불가능
                    </button>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
                      <span>선납보증 금액</span>
                      <span className="font-semibold text-slate-800">{prepayAmount}만원</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={2000}
                      step={10}
                      value={prepayAmount}
                      onChange={(event) => setPrepayAmount(Number(event.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-xs text-slate-500">
                      <span>0만원</span>
                      <span>2000만원</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleEstimate}
                  disabled={isEstimating}
                  className="mt-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-700"
                >
                  {isEstimating ? "견적 계산 중..." : "견적 바로 받아보기"}
                </button>
                {estimateError ? <p className="text-sm text-red-600">{estimateError}</p> : null}
              </form>
            ) : (
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="text-base font-semibold text-slate-900">
                  {selectedCarName ? `${selectedCarName} 기준 추천 결과` : "맞춤 견적 결과"}
                </h4>
                <ul className="mt-3 grid gap-2">
                  {estimateResults.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                    >
                      {item.brand} {item.name} ({item.category}) - {item.expectedMonthlyPayment}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setModalStep("form")}
                  className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  입력 정보 다시 수정하기
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
