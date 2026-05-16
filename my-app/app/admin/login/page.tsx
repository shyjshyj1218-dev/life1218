"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("비밀번호가 틀렸습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900">
            카<span className="text-blue-600">in</span>
          </span>
          <p className="mt-2 text-sm font-medium text-slate-500">관리자 페이지</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base mt-2"
              placeholder="관리자 비밀번호 입력"
              required
              autoFocus
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>

          {error && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
