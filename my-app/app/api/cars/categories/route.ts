import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createSupabaseServerClient();

  const { data } = await supabase
    .from("cars")
    .select("category")
    .not("category", "is", null)
    .order("category");

  const unique = [
    ...new Set((data ?? []).map((c) => c.category).filter(Boolean)),
  ] as string[];

  return NextResponse.json({ categories: ["전체", ...unique] });
}
