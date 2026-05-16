import { NextResponse } from "next/server";
import {
  calcMonthlyPayment,
  checkPrepayFeasibility,
  type CreditScore,
  type DebtStatus,
  type IncomeType,
} from "@/lib/estimate";
import { createSupabaseServerClient } from "@/lib/supabase";

type EstimateBody = {
  selectedCarId?: string;
  creditScore?: CreditScore;
  debtStatus?: DebtStatus;
  incomeType?: IncomeType;
  prepayAvailable?: boolean;
  prepayAmount?: number;
};

type DbCar = {
  id: string;
  name: string;
  category: string | null;
  base_price: number | null;
  brand_name: string;
  deposit: number | null;
};

function buildCarResult(
  car: DbCar,
  credit: CreditScore,
  income: IncomeType,
  debtStatus: DebtStatus,
  prepayAvailable: boolean,
  prepayAmount: number
) {
  const basePrice = car.base_price ?? 0;
  const monthlyPayment = calcMonthlyPayment(
    basePrice,
    credit,
    income,
    debtStatus,
    prepayAvailable,
    prepayAmount
  );
  const feasibility = checkPrepayFeasibility(
    credit,
    debtStatus,
    car.deposit,
    prepayAvailable,
    prepayAmount
  );

  return {
    id: car.id,
    brand: car.brand_name,
    name: car.name,
    category: car.category ?? "",
    basePrice,
    deposit: car.deposit,
    monthlyPayment,
    monthlyPaymentLabel: `월 ${monthlyPayment}만원`,
    feasibility,
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as EstimateBody;

  if (!body.selectedCarId) {
    return NextResponse.json(
      { message: "차종 선택 정보가 누락되었습니다." },
      { status: 400 }
    );
  }

  const credit = body.creditScore ?? "mid";
  const debtStatus = body.debtStatus ?? "none";
  const income = body.incomeType ?? "business";
  const prepayAvailable = body.prepayAvailable ?? false;
  const prepayAmount = body.prepayAmount ?? 0;

  const supabase = createSupabaseServerClient();

  const { data: allCars, error: carsError } = await supabase
    .from("cars_with_brand")
    .select("id, name, category, base_price, brand_name, deposit")
    .order("brand_name", { ascending: true })
    .order("name", { ascending: true })
    .limit(40);

  if (carsError) {
    return NextResponse.json(
      { message: "견적 계산용 차량 조회에 실패했습니다." },
      { status: 500 }
    );
  }

  const cars = (allCars ?? []) as DbCar[];
  const selected = cars.find((c) => c.id === body.selectedCarId);

  if (!selected) {
    return NextResponse.json(
      { message: "선택한 차량 정보를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const selectedCar = buildCarResult(
    selected,
    credit,
    income,
    debtStatus,
    prepayAvailable,
    prepayAmount
  );

  const alternatives = cars
    .filter((car) => car.id !== selected.id)
    .map((car) => buildCarResult(car, credit, income, debtStatus, prepayAvailable, prepayAmount))
    .filter((car) => car.feasibility.canProceed)
    .slice(0, 8);

  return NextResponse.json({
    selectedCar,
    alternatives,
  });
}
