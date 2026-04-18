import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() ?? "";

  const supabase = createSupabaseServerClient();
  let dbQuery = supabase
    .from("cars_with_brand")
    .select("id, name, category, base_price, brand_name")
    .order("brand_name", { ascending: true })
    .order("name", { ascending: true })
    .limit(40);

  if (query) {
    dbQuery = dbQuery.or(`name.ilike.%${query}%,brand_name.ilike.%${query}%`);
  }

  const { data, error } = await dbQuery;

  if (error) {
    return NextResponse.json(
      { message: "차량 목록 조회에 실패했습니다." },
      { status: 500 }
    );
  }

  const cars = (data ?? []).map((car) => ({
    id: car.id,
    brand: car.brand_name,
    name: car.name,
    category: car.category,
    basePrice: car.base_price,
    price: `월 ${car.base_price}만원`,
    image: "",
  }));

  return NextResponse.json({ cars });
}
