export type CreditScore = "high" | "mid" | "low";
export type DebtStatus = "none" | "rehab" | "bankruptcy" | "credit";
export type IncomeType = "worker" | "business" | "corporate" | "freelancer" | "other";

const creditMultiplier: Record<CreditScore, number> = {
  high: 0.9,
  mid: 1,
  low: 1.15,
};

const incomeMultiplier: Record<IncomeType, number> = {
  worker: 0.95,
  business: 1,
  corporate: 0.92,
  freelancer: 1.08,
  other: 1.1,
};

const debtStatusMultiplier: Record<DebtStatus, number> = {
  none: 1,
  rehab: 1.12,
  bankruptcy: 1.2,
  credit: 1.08,
};

/** 신용·차량 보증금 기준 최소 선납보증금 (만원) */
export function getRequiredPrepayAmount(
  credit: CreditScore,
  debtStatus: DebtStatus,
  carDeposit: number | null
): number {
  const creditMin: Record<CreditScore, number> = {
    high: 50,
    mid: 100,
    low: 150,
  };

  let required = creditMin[credit] ?? 100;

  if (debtStatus === "rehab") required = Math.max(required, 150);
  if (debtStatus === "bankruptcy") required = Math.max(required, 200);
  if (debtStatus === "credit") required = Math.max(required, 120);

  if (carDeposit != null && carDeposit > 0) {
    required = Math.max(required, Math.round(carDeposit * 0.25));
  }

  return required;
}

export function calcMonthlyPayment(
  basePrice: number,
  credit: CreditScore,
  income: IncomeType,
  debtStatus: DebtStatus,
  prepayAvailable: boolean,
  prepayAmount: number
): number {
  const prepayDiscount = prepayAvailable
    ? Math.min((prepayAmount / 2000) * 0.2, 0.2)
    : 0;

  return Math.max(
    10,
    Math.round(
      basePrice *
        creditMultiplier[credit] *
        incomeMultiplier[income] *
        (1 - prepayDiscount) *
        debtStatusMultiplier[debtStatus]
    )
  );
}

export type FeasibilityResult = {
  canProceed: boolean;
  requiredPrepayAmount: number;
  offeredPrepayAmount: number;
  reason?: string;
};

export function checkPrepayFeasibility(
  credit: CreditScore,
  debtStatus: DebtStatus,
  carDeposit: number | null,
  prepayAvailable: boolean,
  prepayAmount: number
): FeasibilityResult {
  const requiredPrepayAmount = getRequiredPrepayAmount(credit, debtStatus, carDeposit);
  const offeredPrepayAmount = prepayAvailable ? prepayAmount : 0;
  const canProceed = offeredPrepayAmount >= requiredPrepayAmount;

  if (canProceed) {
    return { canProceed: true, requiredPrepayAmount, offeredPrepayAmount };
  }

  const reason = prepayAvailable
    ? `고객님 신용 기준 선납보증금 최소 ${requiredPrepayAmount}만원이 필요합니다. (현재 입력: ${offeredPrepayAmount}만원)`
    : `선납보증 진행이 필요합니다. 신용 기준 최소 ${requiredPrepayAmount}만원 선납보증금이 필요합니다. (선납 불가 선택)`;

  return {
    canProceed: false,
    requiredPrepayAmount,
    offeredPrepayAmount,
    reason,
  };
}
