"use client";

import { CarVisual } from "./CarVisual";

export type EstimateCarResult = {
  id: string;
  brand: string;
  name: string;
  category: string;
  monthlyPayment: number;
  monthlyPaymentLabel: string;
  feasibility: {
    canProceed: boolean;
    requiredPrepayAmount: number;
    offeredPrepayAmount: number;
    reason?: string;
  };
};

type Props = {
  selectedCar: EstimateCarResult;
  alternatives: EstimateCarResult[];
  onEdit: () => void;
};

export function EstimateResultPanel({ selectedCar, alternatives, onEdit }: Props) {
  const { feasibility } = selectedCar;

  return (
    <div className="mt-5 space-y-6">
      {/* 신청 차량 */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <CarVisual
          brand={selectedCar.brand}
          name={selectedCar.name}
          category={selectedCar.category}
          size="lg"
        />
        <div className="space-y-3 p-4 sm:p-5">
          <div>
            <p className="text-xs font-medium text-slate-500">신청 차량</p>
            <p className="mt-0.5 text-lg font-bold text-slate-900">
              {selectedCar.brand} {selectedCar.name}
            </p>
          </div>
          <p className="text-2xl font-extrabold text-blue-600">
            {selectedCar.monthlyPaymentLabel}
          </p>
          <p className="text-xs text-slate-500">
            {selectedCar.category} · 입력 조건 기준 예상 월 납입금
          </p>

          <div
            className={`rounded-xl border px-4 py-3 ${
              feasibility.canProceed
                ? "border-emerald-200 bg-emerald-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <p
              className={`text-sm font-bold ${
                feasibility.canProceed ? "text-emerald-800" : "text-red-800"
              }`}
            >
              {feasibility.canProceed ? "진행 가능" : "진행 불가"}
            </p>
            {feasibility.canProceed ? (
              <p className="mt-1 text-xs text-emerald-700">
                선납보증금 조건을 충족하여 해당 차량 진행이 가능합니다.
              </p>
            ) : (
              <p className="mt-1 text-xs leading-relaxed text-red-700">
                {feasibility.reason}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 진행 가능한 다른 차량 */}
      <section>
        <h4 className="text-sm font-bold text-slate-900">
          입력하신 조건으로 진행 가능한 차량
        </h4>
        <p className="mt-1 text-xs text-slate-500">
          선납보증금 기준을 충족하는 차량입니다.
        </p>

        {alternatives.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            현재 조건으로 진행 가능한 다른 차량이 없습니다. 선납보증금을
            늘리거나 신용 조건을 조정해 보세요.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {alternatives.map((car) => (
              <li
                key={car.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <CarVisual
                  brand={car.brand}
                  name={car.name}
                  category={car.category}
                  size="sm"
                />
                <div className="border-t border-slate-100 px-3 py-3">
                  <p className="text-sm font-semibold text-slate-800">
                    {car.brand} {car.name}
                  </p>
                  <p className="mt-1 text-base font-bold text-blue-600">
                    {car.monthlyPaymentLabel}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button
        type="button"
        onClick={onEdit}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        입력 정보 다시 수정하기
      </button>
    </div>
  );
}
