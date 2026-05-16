import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = (await request.json()) as { password?: string };
  const secret = process.env.ADMIN_SECRET;

  if (!secret || password !== secret) {
    return NextResponse.json({ message: "비밀번호가 틀렸습니다." }, { status: 401 });
  }

  const res = NextResponse.json({ message: "로그인 성공" });
  res.cookies.set("admin_auth", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ message: "로그아웃" });
  res.cookies.set("admin_auth", "", { maxAge: 0, path: "/" });
  return res;
}
