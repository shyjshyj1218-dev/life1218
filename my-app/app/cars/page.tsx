import { CarCard } from "@/components/CarCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const sampleCars = [
  { name: "기아 EV6", fuelType: "전기", monthlyPrice: "월 57만원대" },
  { name: "현대 쏘렌토", fuelType: "하이브리드", monthlyPrice: "월 62만원대" },
  { name: "기아 카니발", fuelType: "디젤", monthlyPrice: "월 69만원대" },
];

export default function CarsPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900">차량 리스트</h1>
        <p className="mt-3 text-sm text-slate-600">
          우선 샘플 데이터로 구성했고, 나중에 DB/API 연결로 교체하면 됩니다.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {sampleCars.map((car) => (
            <CarCard
              key={car.name}
              name={car.name}
              fuelType={car.fuelType}
              monthlyPrice={car.monthlyPrice}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
