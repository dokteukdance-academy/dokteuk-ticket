"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CompletePage() {
  const [reservationNumber, setReservationNumber] = useState("");

  useEffect(() => {
    setReservationNumber(
      localStorage.getItem("reservationNumber") || "-"
    );
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reservationNumber);
      alert("예매번호가 복사되었습니다.");
    } catch {
      alert("복사에 실패했습니다.");
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-2xl bg-gray-900 p-10 text-center shadow-xl border border-gray-700">

        <div className="text-6xl mb-6">🎉</div>

        <h1 className="text-4xl font-bold text-white">
          예매 접수 완료
        </h1>

        <p className="mt-4 text-gray-400 leading-7">
          예매 접수가 완료되었습니다.
          <br />
          입금 확인 후 예약 확정 문자가 발송됩니다.
        </p>

        <div className="mt-10 rounded-xl bg-black p-6 text-left space-y-6">

          <div>
            <p className="text-gray-500 text-sm">예매번호</p>

            <div className="flex items-center justify-between mt-2">
              <p className="text-yellow-400 font-bold text-xl">
                {reservationNumber}
              </p>

              <button
                onClick={handleCopy}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 rounded-lg text-sm font-bold"
              >
                📋 복사
              </button>
            </div>
          </div>

          <div className="space-y-4">

<div>
  <p className="text-gray-500 text-sm">공연명</p>
  <p className="text-white font-semibold">
    독특댄스아카데미 콘서트 2026
  </p>
</div>

<div>
  <p className="text-gray-500 text-sm">공연일시</p>
  <p className="text-white">
    2026년 8월 23일 (일) 오후 5:00
  </p>
</div>

<div>
  <p className="text-gray-500 text-sm">공연장</p>
  <p className="text-white">
    대전 서구문화원 6층 공연장
  </p>
</div>

</div>

          <div>
            <p className="text-gray-500 text-sm">상태</p>
            <p className="font-bold text-yellow-400">
              🟡 입금 확인 대기
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">안내사항</p>

            <div className="mt-2 text-sm text-gray-300 leading-7">
              <p>• 입금 확인 후 예약 확정 문자가 발송됩니다.</p>
              <p>• 공연 당일 예매번호를 제시해 주세요.</p>
              <p>• 예매번호는 예약 취소 시에도 필요합니다.</p>
            </div>
          </div>

        </div>

        <Link
          href="/"
          className="mt-10 inline-block rounded-lg bg-yellow-500 px-8 py-4 font-bold text-black hover:bg-yellow-400 transition"
        >
          홈으로
        </Link>

      </div>
    </main>
  );
}