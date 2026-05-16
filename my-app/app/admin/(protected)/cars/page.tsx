"use client";

import { useEffect, useMemo, useState } from "react";

type Car = {
  id: string;
  brand_name: string;
  name: string;
  category: string;
  base_price: number;
  deposit: number | null;
};

type Brand = { id: string; name: string };

type FieldKey = "base_price" | "deposit";
type EditMap = Record<string, Partial<Record<FieldKey, string>>>;
type StatusMap = Record<string, "saving" | "saved" | "error">;

const CATEGORIES = ["SUV", "세단", "전기차", "RV", "픽업", "경차", "하이브리드", "기타"];
const TIERS = ["경제", "일반", "프리미엄"];

const BLANK_FORM = {
  brand_id: "",
  name: "",
  category: "SUV",
  base_price: "",
  deposit: "",
  tier: "일반",
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 가격·보증금 수정 상태
  const [editing, setEditing] = useState<EditMap>({});
  const [status, setStatus] = useState<StatusMap>({});

  // 차량명 인라인 수정 상태
  const [nameEditId, setNameEditId] = useState<string | null>(null);
  const [nameEditVal, setNameEditVal] = useState("");

  // 카테고리 인라인 수정 상태
  const [catEditId, setCatEditId] = useState<string | null>(null);

  // 추가 모달
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/cars").then((r) => r.json()),
      fetch("/api/admin/brands").then((r) => r.json()),
    ])
      .then(([carsData, brandsData]) => {
        if (carsData.message && !carsData.cars) throw new Error(carsData.message);
        setCars(carsData.cars ?? []);
        setBrands(brandsData.brands ?? []);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  /* ── 수정 ── */
  function getVal(car: Car, field: FieldKey): string {
    return editing[car.id]?.[field] ?? String(car[field] ?? "");
  }

  function handleChange(id: string, field: FieldKey, value: string) {
    setEditing((p) => ({ ...p, [id]: { ...p[id], [field]: value } }));
    setStatus((p) => ({ ...p, [id]: undefined as unknown as "saving" }));
  }

  function isChanged(car: Car) {
    const e = editing[car.id];
    if (!e) return false;
    if (e.base_price !== undefined && Number(e.base_price) !== car.base_price) return true;
    if (e.deposit !== undefined && Number(e.deposit) !== (car.deposit ?? 0)) return true;
    return false;
  }

  async function handleSave(car: Car) {
    if (!isChanged(car)) return;
    setStatus((p) => ({ ...p, [car.id]: "saving" }));

    const e = editing[car.id] ?? {};
    const body: Record<string, unknown> = { id: car.id };
    if (e.base_price !== undefined && Number(e.base_price) !== car.base_price)
      body.base_price = Number(e.base_price);
    if (e.deposit !== undefined) {
      const v = e.deposit === "" ? null : Number(e.deposit);
      if (v !== car.deposit) body.deposit = v;
    }

    const res = await fetch("/api/admin/cars", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setCars((prev) =>
        prev.map((c) =>
          c.id === car.id
            ? {
                ...c,
                base_price: body.base_price != null ? Number(body.base_price) : c.base_price,
                deposit: "deposit" in body ? (body.deposit as number | null) : c.deposit,
              }
            : c
        )
      );
      setEditing((p) => { const n = { ...p }; delete n[car.id]; return n; });
      setStatus((p) => ({ ...p, [car.id]: "saved" }));
      setTimeout(() => setStatus((p) => ({ ...p, [car.id]: undefined as unknown as "saving" })), 2000);
    } else {
      setStatus((p) => ({ ...p, [car.id]: "error" }));
    }
  }

  function btnLabel(id: string, changed: boolean) {
    const s = status[id];
    if (s === "saving") return "저장 중...";
    if (s === "saved") return "✓ 저장됨";
    if (s === "error") return "오류";
    return changed ? "저장" : "저장";
  }

  function btnClass(id: string, changed: boolean) {
    const s = status[id];
    if (s === "saved") return "bg-emerald-100 text-emerald-700 cursor-default";
    if (s === "error") return "bg-red-100 text-red-700";
    if (s === "saving") return "bg-blue-200 text-blue-700 cursor-wait";
    if (changed) return "bg-blue-600 text-white hover:bg-blue-500";
    return "bg-slate-100 text-slate-400 cursor-not-allowed";
  }

  /* ── 차량명 인라인 수정 ── */
  function startNameEdit(car: Car) {
    setNameEditId(car.id);
    setNameEditVal(car.name);
  }

  async function commitNameEdit(car: Car) {
    const trimmed = nameEditVal.trim();
    if (!trimmed || trimmed === car.name) {
      setNameEditId(null);
      return;
    }
    const res = await fetch("/api/admin/cars", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: car.id, name: trimmed }),
    });
    if (res.ok) {
      setCars((prev) =>
        prev.map((c) => (c.id === car.id ? { ...c, name: trimmed } : c))
      );
    }
    setNameEditId(null);
  }

  function handleNameKeyDown(e: React.KeyboardEvent, car: Car) {
    if (e.key === "Enter") commitNameEdit(car);
    if (e.key === "Escape") setNameEditId(null);
  }

  /* ── 카테고리 인라인 수정 ── */
  async function commitCatEdit(car: Car, newCat: string) {
    setCatEditId(null);
    if (newCat === car.category) return;
    const res = await fetch("/api/admin/cars", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: car.id, category: newCat }),
    });
    if (res.ok) {
      setCars((prev) =>
        prev.map((c) => (c.id === car.id ? { ...c, category: newCat } : c))
      );
    }
  }

  /* ── 차량 추가 ── */
  function openModal() {
    setForm({ ...BLANK_FORM, brand_id: brands[0]?.id ?? "" });
    setAddError("");
    setShowModal(true);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.brand_id || !form.name.trim() || !form.base_price) {
      setAddError("브랜드, 차종명, 월납입금은 필수입니다.");
      return;
    }
    setAdding(true);
    setAddError("");

    const res = await fetch("/api/admin/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand_id: form.brand_id,
        name: form.name.trim(),
        category: form.category,
        base_price: Number(form.base_price),
        deposit: form.deposit ? Number(form.deposit) : null,
        tier: form.tier,
      }),
    });

    if (res.ok) {
      // 목록 새로고침
      const updated = await fetch("/api/admin/cars").then((r) => r.json());
      setCars(updated.cars ?? []);
      setShowModal(false);
    } else {
      const d = (await res.json()) as { message: string };
      setAddError(d.message ?? "추가 실패");
    }
    setAdding(false);
  }

  const brandNames = useMemo(
    () => [...new Set(cars.map((c) => c.brand_name).filter(Boolean))].sort(),
    [cars]
  );

  return (
    <div>
      {/* 헤더 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">차량 관리</h1>
          <p className="mt-1 text-sm text-slate-500">
            월 납입금·최소 보증금 수정, 신규 차량 추가가 즉시 DB에 반영됩니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            총 {cars.length}대
          </span>
          <button
            onClick={openModal}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            + 차량 추가
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">{error}</p>
          <p className="mt-1 text-xs text-red-500">
            .env.local에 SUPABASE_SERVICE_ROLE_KEY가 있는지 확인하세요.
          </p>
        </div>
      )}

      {/* 차량 테이블 — 브랜드별 */}
      {loading ? (
        <div className="mt-10 text-center text-sm text-slate-400">로딩 중...</div>
      ) : (
        <div className="mt-6 space-y-8">
          {brandNames.map((brand) => {
            const brandCars = cars.filter((c) => c.brand_name === brand);
            return (
              <section key={brand}>
                <h2 className="mb-3 flex items-center gap-2">
                  <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-bold text-white">
                    {brand}
                  </span>
                  <span className="text-xs text-slate-400">{brandCars.length}대</span>
                  <span className="h-px flex-1 bg-slate-200" />
                </h2>
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        {["차종", "카테고리", "현재 월납입금", "월납입금 수정", "현재 최소보증금", "최소보증금 수정", ""].map((h, i) => (
                          <th key={i} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {brandCars.map((car) => {
                        const changed = isChanged(car);
                        return (
                          <tr key={car.id} className="hover:bg-slate-50">
                            <td className="whitespace-nowrap px-4 py-3">
                              {nameEditId === car.id ? (
                                <input
                                  autoFocus
                                  type="text"
                                  value={nameEditVal}
                                  onChange={(e) => setNameEditVal(e.target.value)}
                                  onBlur={() => commitNameEdit(car)}
                                  onKeyDown={(e) => handleNameKeyDown(e, car)}
                                  className="w-36 rounded-lg border border-blue-400 px-2 py-1 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                              ) : (
                                <span
                                  onDoubleClick={() => startNameEdit(car)}
                                  title="더블클릭하여 수정"
                                  className="cursor-pointer rounded px-1 font-semibold text-slate-900 hover:bg-blue-50 hover:text-blue-700"
                                >
                                  {car.name}
                                </span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                              {catEditId === car.id ? (
                                <select
                                  autoFocus
                                  defaultValue={car.category ?? ""}
                                  onChange={(e) => commitCatEdit(car, e.target.value)}
                                  onBlur={() => setCatEditId(null)}
                                  className="rounded-lg border border-blue-400 px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                >
                                  {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                  ))}
                                </select>
                              ) : (
                                <span
                                  onDoubleClick={() => setCatEditId(car.id)}
                                  title="더블클릭하여 수정"
                                  className="cursor-pointer rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                                >
                                  {car.category ?? "—"}
                                </span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 font-semibold text-blue-600">월 {car.base_price}만원</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number" min={1}
                                  value={getVal(car, "base_price")}
                                  onChange={(e) => handleChange(car.id, "base_price", e.target.value)}
                                  className="w-24 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                                <span className="text-xs text-slate-400">만원</span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 font-semibold text-violet-600">
                              {car.deposit != null ? `${car.deposit}만원` : "—"}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number" min={0}
                                  value={getVal(car, "deposit")}
                                  onChange={(e) => handleChange(car.id, "deposit", e.target.value)}
                                  placeholder="미설정"
                                  className="w-24 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
                                />
                                <span className="text-xs text-slate-400">만원</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleSave(car)}
                                disabled={!changed || status[car.id] === "saving" || status[car.id] === "saved"}
                                className={`whitespace-nowrap rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ${btnClass(car.id, changed)}`}
                              >
                                {btnLabel(car.id, changed)}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* 차량 추가 모달 */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">신규 차량 추가</h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-slate-100"
              >
                닫기
              </button>
            </div>

            <form onSubmit={handleAdd} className="mt-5 space-y-4">
              {/* 브랜드 */}
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  브랜드 <span className="text-red-500">*</span>
                </span>
                <select
                  value={form.brand_id}
                  onChange={(e) => setForm((p) => ({ ...p, brand_id: e.target.value }))}
                  className="input-base mt-1"
                  required
                >
                  <option value="">브랜드 선택</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </label>

              {/* 차종명 */}
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  차종명 <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="input-base mt-1"
                  placeholder="예: 팰리세이드, 아이오닉 6"
                  required
                />
              </label>

              {/* 카테고리 + 티어 */}
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">카테고리</span>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="input-base mt-1"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">티어</span>
                  <select
                    value={form.tier}
                    onChange={(e) => setForm((p) => ({ ...p, tier: e.target.value }))}
                    className="input-base mt-1"
                  >
                    {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </label>
              </div>

              {/* 월납입금 + 보증금 */}
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    월납입금 (만원) <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="number" min={1}
                    value={form.base_price}
                    onChange={(e) => setForm((p) => ({ ...p, base_price: e.target.value }))}
                    className="input-base mt-1"
                    placeholder="예: 58"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">최소보증금 (만원)</span>
                  <input
                    type="number" min={0}
                    value={form.deposit}
                    onChange={(e) => setForm((p) => ({ ...p, deposit: e.target.value }))}
                    className="input-base mt-1"
                    placeholder="예: 300"
                  />
                </label>
              </div>

              {addError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{addError}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:bg-blue-300"
                >
                  {adding ? "추가 중..." : "차량 추가"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
