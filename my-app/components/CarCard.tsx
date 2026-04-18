type CarCardProps = {
  name: string;
  fuelType: string;
  monthlyPrice: string;
};

export function CarCard({ name, fuelType, monthlyPrice }: CarCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
      <p className="mt-2 text-sm text-slate-600">연료: {fuelType}</p>
      <p className="mt-1 text-sm text-slate-600">월 예상: {monthlyPrice}</p>
      <a
        href="/contact"
        className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
      >
        상담하기
      </a>
    </article>
  );
}
