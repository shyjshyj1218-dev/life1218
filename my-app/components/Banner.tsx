import Image from "next/image";
import Link from "next/link";

const BANNER_IMAGE_PATH = "/banner/자동차배너.jpg";

export function Banner() {
  return (
    <section className="bg-slate-100 py-4 sm:py-8">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Link
          href="/contact"
          className="block overflow-hidden rounded-xl border border-slate-200 bg-white"
        >
          <div className="relative aspect-[16/8] w-full sm:aspect-[16/5]">
            <Image
              src={BANNER_IMAGE_PATH}
              alt="광고 배너"
              fill
              priority
              className="object-cover"
            />
          </div>
        </Link>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:max-w-sm sm:grid-cols-2">
          <Link
            href="/cars"
            className="rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-700"
          >
            견적확인
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 hover:bg-slate-50 active:bg-slate-100"
          >
            상담신청
          </Link>
        </div>s
      </div>
    </section>
  );
}
