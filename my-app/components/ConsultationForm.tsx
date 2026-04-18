"use client";

import { useState } from "react";

export function ConsultationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(formData: FormData) {
    setIsSubmitting(true);
    setMessage("");

    const payload = {
      customerName: String(formData.get("customerName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      carModel: String(formData.get("carModel") ?? ""),
      budget: String(formData.get("budget") ?? ""),
      note: String(formData.get("note") ?? ""),
    };

    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { message: string };
    setMessage(result.message);
    setIsSubmitting(false);
  }

  return (
    <form action={onSubmit} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        이름
        <input name="customerName" className="input-base" placeholder="홍길동" required />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        연락처
        <input name="phone" className="input-base" placeholder="010-0000-0000" required />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        희망 차종
        <input name="carModel" className="input-base" placeholder="쏘렌토, EV6 등" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        월 예산
        <input name="budget" className="input-base" placeholder="40만원 ~ 60만원" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        요청사항
        <textarea name="note" className="input-base min-h-24" />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {isSubmitting ? "전송 중..." : "상담 신청 보내기"}
      </button>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </form>
  );
}
