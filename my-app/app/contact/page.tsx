import { ConsultationForm } from "@/components/ConsultationForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900">상담 페이지</h1>
        <p className="mt-3 text-sm text-slate-600">
          고객 상담 접수를 위한 기본 폼 페이지입니다.
        </p>
        <div className="mt-8">
          <ConsultationForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
