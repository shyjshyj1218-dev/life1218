import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) return NextResponse.json({ suggestions: [] });

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("cars_with_brand")
    .select("id, name, brand_name, category")
    .or(`name.ilike.%${query}%,brand_name.ilike.%${query}%`)
    .order("brand_name", { ascending: true })
    .order("name", { ascending: true })
    .limit(8);

  if (error) return NextResponse.json({ suggestions: [] });

  return NextResponse.json({
    suggestions: (data ?? []).map((c) => ({
      id: c.id,
      brand: c.brand_name,
      name: c.name,
      category: c.category,
    })),
  });
}
