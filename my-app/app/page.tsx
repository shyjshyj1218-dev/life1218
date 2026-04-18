import { ConsultationForm } from "@/components/ConsultationForm";
import { Banner } from "@/components/Banner";
import { CarGrid } from "@/components/CarGrid";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main>
        <Banner />
        <CarGrid />
        <section className="py-16">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              빠른 상담 신청
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              기본 구조 확인용 상담 폼입니다. API 연결까지 포함되어 있습니다.
            </p>
            <div className="mt-6">
              <ConsultationForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
