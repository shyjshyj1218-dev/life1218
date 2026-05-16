"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Lead = {
  id: string;
  customer_name: string;
  phone: string;
  car_model: string | null;
  budget: string | null;
  created_at: string;
};

type Stats = {
  leadsTotal: number;
  leadsToday: number;
  carsTotal: number;
  recentLeads: Lead[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [leadsRes, carsRes] = await Promise.all([
          fetch("/api/admin/leads"),
          fetch("/api/admin/cars"),
        ]);

        if (!leadsRes.ok) throw new Error(await leadsRes.text());
        if (!carsRes.ok) throw new Error(await carsRes.text());

        const leadsData = (await leadsRes.json()) as { leads: Lead[] };
        const carsData = (await carsRes.json()) as { cars: unknown[] };

        const leads = leadsData.leads ?? [];
        const today = new Date().toISOString().slice(0, 10);
        const leadsToday = leads.filter((l) => l.created_at?.startsWith(today)).length;

        setStats({
          leadsTotal: leads.length,
          leadsToday,
          carsTotal: carsData.cars?.length ?? 0,
          recentLeads: leads.slice(0, 5),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "데이터 로드 실패");
      }
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">대시보드</h1>
      <p className="mt-1 text-sm text-slate-500">전체 현황을 확인하세요.</p>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">오류: {error}</p>
          <p className="mt-1 text-xs text-red-500">
            .env.local에 SUPABASE_SERVICE_ROLE_KEY가 설정되어 있는지 확인하세요.
          </p>
        </div>
      )}

      {/* 통계 카드 */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "전체 상담 신청",
            value: stats?.leadsTotal ?? "—",
            color: "text-blue-600",
            href: "/admin/leads",
          },
          {
            label: "오늘 신청",
            value: stats?.leadsToday ?? "—",
            color: "text-emerald-600",
            href: "/admin/leads",
          },
          {
            label: "등록 차량",
            value: stats?.carsTotal ?? "—",
            color: "text-violet-600",
            href: "/admin/cars",
          },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {s.label}
            </p>
            <p className={`mt-3 text-4xl font-extrabold ${s.color}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      {/* 최근 상담 신청 */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">최근 상담 신청</h2>
          <Link href="/admin/leads" className="text-xs font-semibold text-blue-600 hover:underline">
            전체 보기 →
          </Link>
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {!stats ? (
            <div className="p-8 text-center text-sm text-slate-400">
              {error ? "" : "로딩 중..."}
            </div>
          ) : stats.recentLeads.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              아직 상담 신청이 없습니다.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["이름", "연락처", "희망 차종", "신청일"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {lead.customer_name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <a href={`tel:${lead.phone}`} className="hover:text-blue-600">
                        {lead.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{lead.car_model ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(lead.created_at).toLocaleString("ko-KR", {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
