import Link from "next/link";

export default function CompletePage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-2xl bg-gray-900 p-10 text-center shadow-xl border border-gray-700">

        <div className="text-6xl mb-6">🎉</div>

        <h1 className="text-4xl font-bold text-white">
          예약 완료
        </h1>

        <p className="mt-4 text-gray-400">
          예매가 정상적으로 완료되었습니다.
        </p>

        <div className="mt-10 rounded-xl bg-black p-6 text-left space-y-4">

          <div>
            <p className="text-gray-500 text-sm">예약번호</p>
            <p className="text-yellow-400 font-bold">
              DKT-20260001
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">공연명</p>
            <p className="text-white">
              도깨비 페스티벌 2026
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">상태</p>
            <p className="text-green-400">
              예약 완료
            </p>
          </div>

        </div>

        <Link
          href="/"
          className="mt-10 inline-block rounded-lg bg-yellow-500 px-8 py-4 font-bold text-black hover:bg-yellow-400"
        >
          홈으로
        </Link>

      </div>
    </main>
  );
}