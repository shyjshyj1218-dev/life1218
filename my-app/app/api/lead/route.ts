import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

type LeadBody = {
  customerName?: string;
  phone?: string;
  carModel?: string;
  budget?: string;
  note?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LeadBody;

  if (!body.customerName || !body.phone) {
    return NextResponse.json(
      { message: "이름과 연락처는 필수입니다." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("leads").insert({
    customer_name: body.customerName,
    phone: body.phone,
    car_model: body.carModel ?? null,
    budget: body.budget ?? null,
    note: body.note ?? null,
  });

  if (error) {
    console.error("leads 저장 실패:", error.message);
  }

  return NextResponse.json({
    message: "상담 신청이 접수되었습니다. 곧 연락드릴게요.",
  });
}
