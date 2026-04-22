"use client";

import { useState } from "react";

export function ConsultationForm({ defaultCarModel }: { defaultCarModel?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(formData: FormData) {
    setIsSubmitting(true);
    setErrorMsg("");

    const payload = {
      customerName: String(formData.get("customerName") ?? ""),
      phone:        String(formData.get("phone")        ?? ""),
      carModel:     String(formData.get("carModel")     ?? ""),
      budget:       String(formData.get("budget")       ?? ""),
      note:         String(formData.get("note")         ?? ""),
    };

    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const result = (await response.json()) as { message: string };
      setErrorMsg(result.message ?? "오류가 발생했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
      return;
    }

    setIsDone(true);
    setIsSubmitting(false);
  }

  if (isDone) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
        <div className="success-circle flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
          <svg
            viewBox="0 0 52 52"
            className="h-12 w-12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="26" cy="26" r="25" stroke="#2563eb" strokeWidth="2" fill="none" />
            <polyline
              className="success-check"
              points="14,27 22,35 38,18"
              stroke="#2563eb"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
        <h3 className="mt-5 text-xl font-bold text-slate-900">상담 신청 완료!</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          전담 매니저가 <strong className="text-slate-800">24시간 이내</strong>에 연락드립니다.
          <br />
          조금만 기다려 주세요 😊
        </p>
        <button
          type="button"
          onClick={() => setIsDone(false)}
          className="mt-6 rounded-lg border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          다시 작성하기
        </button>
      </div>
    );
  }

  return (
    <form
      action={onSubmit}
      className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          이름 <span className="sr-only">(필수)</span>
          <input
            name="customerName"
            className="input-base"
            placeholder="홍길동"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          연락처 <span className="sr-only">(필수)</span>
          <input
            name="phone"
            className="input-base"
            placeholder="010-0000-0000"
            required
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          희망 차종
          <input
            name="carModel"
            className="input-base"
            placeholder="쏘렌토, EV6 등"
            defaultValue={defaultCarModel ?? ""}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          월 예산
          <input name="budget" className="input-base" placeholder="40만원 ~ 60만원" />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        요청사항
        <textarea name="note" className="input-base min-h-24" placeholder="기타 요청사항을 적어주세요." />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 active:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {isSubmitting ? "전송 중..." : "상담 신청 보내기"}
      </button>
      {errorMsg ? <p className="text-sm text-red-600">{errorMsg}</p> : null}
    </form>
  );
}
