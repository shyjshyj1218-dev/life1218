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
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ leads: data ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "서버 오류";
    return NextResponse.json({ message }, { status: 500 });
  }
}
