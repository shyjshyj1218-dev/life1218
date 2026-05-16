import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

function isAuthed(request: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  const cookie = request.cookies.get("admin_auth");
  return !!secret && cookie?.value === secret;
}

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("cars_with_brand")
      .select("id, name, category, base_price, deposit, brand_name")
      .order("brand_name")
      .order("name");

    if (error) throw error;
    return NextResponse.json({ cars: data ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "서버 오류";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      brand_id?: string;
      name?: string;
      category?: string;
      base_price?: number;
      deposit?: number | null;
      tier?: string;
    };

    if (!body.brand_id || !body.name?.trim() || !body.base_price) {
      return NextResponse.json(
        { message: "브랜드, 차종명, 월납입금은 필수입니다." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("cars")
      .insert({
        brand_id: body.brand_id,
        name: body.name.trim(),
        category: body.category ?? null,
        base_price: Number(body.base_price),
        deposit: body.deposit != null ? Number(body.deposit) : null,
        tier: body.tier ?? null,
        available: true,
      })
      .select("id")
      .single();

    if (error) throw error;
    return NextResponse.json({ message: "차량 추가 완료", id: data.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "서버 오류";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      id?: string;
      name?: string;
      category?: string;
      base_price?: number;
      deposit?: number | null;
    };
    if (!body.id) {
      return NextResponse.json({ message: "id가 필요합니다." }, { status: 400 });
    }

    const updates: Record<string, string | number | null> = {};
    if (body.name !== undefined && body.name.trim()) {
      updates.name = body.name.trim();
    }
    if (body.category !== undefined) {
      updates.category = body.category;
    }
    if (body.base_price != null && !isNaN(Number(body.base_price))) {
      updates.base_price = Number(body.base_price);
    }
    if ("deposit" in body) {
      updates.deposit = body.deposit != null ? Number(body.deposit) : null;
    }
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: "변경할 항목이 없습니다." }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("cars")
      .update(updates)
      .eq("id", body.id);

    if (error) throw error;
    return NextResponse.json({ message: "업데이트 완료" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "서버 오류";
    return NextResponse.json({ message }, { status: 500 });
  }
}
