import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

type EstimateBody = {
  selectedCarId?: string;
  creditScore?: "high" | "mid" | "low";
  debtStatus?: "none" | "rehab" | "bankruptcy" | "credit";
  incomeType?: "worker" | "business" | "corporate" | "freelancer" | "other";
  prepayAvailable?: boolean;
  prepayAmount?: number;
};

const creditMultiplier = {
  high: 0.9,
  mid: 1,
  low: 1.15,
};

const incomeMultiplier = {
  worker: 0.95,
  business: 1,
  corporate: 0.92,
  freelancer: 1.08,
  other: 1.1,
};

const debtStatusMultiplier = {
  none: 1,
  rehab: 1.12,
  bankruptcy: 1.2,
  credit: 1.08,
};

export async function POST(request: Request) {
  const body = (await request.json()) as EstimateBody;

  if (!body.selectedCarId) {
    return NextResponse.json(
      { message: "차종 선택 정보가 누락되었습니다." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServerClient();
  const { data: selectedCar, error: selectedCarError } = await supabase
    .from("cars_with_brand")
    .select("id, name, category")
    .eq("id", body.selectedCarId)
    .single();

  if (selectedCarError || !selectedCar) {
    return NextResponse.json(
      { message: "선택한 차량 정보를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const { data: cars, error: carsError } = await supabase
    .from("cars_with_brand")
    .select("id, name, category, base_price, brand_name")
    .eq("category", selectedCar.category)
    .order("base_price", { ascending: true })
    .limit(8);

  if (carsError) {
    return NextResponse.json(
      { message: "견적 계산용 차량 조회에 실패했습니다." },
      { status: 500 }
    );
  }

  const credit = body.creditScore ?? "mid";
  const debtStatus = body.debtStatus ?? "none";
  const income = body.incomeType ?? "business";
  const prepayAvailable = body.prepayAvailable ?? false;
  const prepayAmount = body.prepayAmount ?? 0;
  const prepayDiscount = prepayAvailable
    ? Math.min((prepayAmount / 2000) * 0.2, 0.2)
    : 0;

  const estimates = (cars ?? []).map((car) => {
    const monthly = Math.max(
      10,
      Math.round(
        car.base_price * creditMultiplier[credit] * incomeMultiplier[income] * (1 - prepayDiscount)
          * debtStatusMultiplier[debtStatus]
      )
    );

    return {
      id: car.id,
      brand: car.brand_name,
      name: car.name,
      category: car.category,
      expectedMonthlyPayment: `월 ${monthly}만원`,
    };
  });

  return NextResponse.json({
    selectedCar: selectedCar.name,
    estimates,
  });
}
