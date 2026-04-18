import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900">회사소개</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          이 페이지는 회사소개 콘텐츠를 넣는 공간입니다. 브랜드 소개, 운영
          철학, 서비스 강점, 파트너사 정보 등을 섹션 단위로 추가하면 됩니다.
        </p>
      </main>
      <Footer />
    </div>
  );
}
