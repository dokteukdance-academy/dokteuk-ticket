"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelPage() {
  const router = useRouter();

  const [reservationNumber, setReservationNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reservation = params.get("reservation");

    if (reservation) {
      setReservationNumber(reservation);
    }
  }, []);

  const handleCancel = async () => {
    if (!reservationNumber.trim()) {
      alert("예약번호를 입력해주세요.");
      return;
    }

    if (!confirm("예약을 취소하시겠습니까?")) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/reservation/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationNumber: reservationNumber.trim(),
        }),
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.message || "예약 취소 실패");
        return;
      }

      alert("예약이 정상적으로 취소되었습니다.");

      router.push("/");
    } catch (err) {
      console.error(err);
      alert("예약 취소 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl bg-gray-900 border border-gray-700 p-8">

        <h1 className="text-3xl font-bold text-center text-white mb-2">
          예약 취소
        </h1>

        <p className="text-center text-gray-400 mb-8">
          문자에서 들어오셨다면 예약번호가 자동으로 입력됩니다.
        </p>

        <input
          type="text"
          placeholder="예) DK12345678"
          value={reservationNumber}
          onChange={(e) => setReservationNumber(e.target.value)}
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-4 text-white mb-6 outline-none focus:border-yellow-500"
        />

        <button
          onClick={handleCancel}
          disabled={loading}
          className="w-full rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-gray-600 py-4 font-bold text-white transition"
        >
          {loading ? "취소중..." : "예약 취소"}
        </button>

      </div>
    </main>
  );
}