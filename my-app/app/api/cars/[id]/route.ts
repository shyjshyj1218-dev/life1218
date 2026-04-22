import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("cars_with_brand")
    .select("id, name, category, base_price, brand_name")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: "차량을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({
    car: {
      id: data.id,
      brand: data.brand_name,
      name: data.name,
      category: data.category,
      basePrice: data.base_price,
    },
  });
}
