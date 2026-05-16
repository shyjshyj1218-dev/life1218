"use client";

import { useEffect, useMemo, useState } from "react";

type Lead = {
  id: string;
  customer_name: string;
  phone: string;
  car_model: string | null;
  budget: string | null;
  note: string | null;
  created_at: string;
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((r) => r.json())
      .then((d: { leads?: Lead[]; message?: string }) => {
        if (d.message && !d.leads) throw new Error(d.message);
        setLeads(d.leads ?? []);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(
      (l) =>
        l.customer_name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.car_model ?? "").toLowerCase().includes(q)
    );
  }, [leads, search]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">고객 목록</h1>
          <p className="mt-1 text-sm text-slate-500">
            상담 신청한 고객 정보입니다. 총{" "}
            <span className="font-semibold text-slate-900">{leads.length}</span>명
          </p>
        </div>
      </div>

      {/* 검색 */}
      <div className="mt-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base max-w-xs"
          placeholder="이름, 연락처, 차종 검색"
        />
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">{error}</p>
          <p className="mt-1 text-xs text-red-500">
            .env.local에 SUPABASE_SERVICE_ROLE_KEY가 있는지 확인하세요.
          </p>
        </div>
      )}

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-400">로딩 중...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            {search ? "검색 결과가 없습니다." : "아직 상담 신청이 없습니다."}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["이름", "연락처", "희망 차종", "예산", "신청일시", "요청사항"].map((h) => (
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
              {filtered.map((lead) => (
                <>
                  <tr
                    key={lead.id}
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {lead.customer_name}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {lead.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{lead.car_model ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{lead.budget ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                      {new Date(lead.created_at).toLocaleString("ko-KR", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 max-w-[160px] truncate text-slate-500">
                      {lead.note ?? "—"}
                    </td>
                  </tr>
                  {expanded === lead.id && lead.note && (
                    <tr key={`${lead.id}-note`} className="bg-blue-50">
                      <td colSpan={6} className="px-4 py-3">
                        <p className="text-xs font-semibold text-slate-500">요청사항 전체</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-700">{lead.note}</p>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
