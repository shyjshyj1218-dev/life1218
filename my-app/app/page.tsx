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

        {/* 차량 그리드 */}
        <section className="bg-slate-100 py-10 sm:py-14">
          <CarGrid />
        </section>

        {/* 신뢰 지표 */}
        <section className="section-cta py-12">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
              {[
                { num: "500+", label: "누적 고객" },
                { num: "12", label: "취급 브랜드" },
                { num: "24h", label: "상담 응답" },
                { num: "100%", label: "투명 견적" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-extrabold text-white sm:text-4xl">{stat.num}</p>
                  <p className="mt-1 text-sm font-medium text-blue-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
