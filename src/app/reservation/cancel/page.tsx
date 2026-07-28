"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelReservationPage() {
  const router = useRouter();

  const [reservationNumber, setReservationNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!reservationNumber) {
      alert("예약번호를 입력해주세요.");
      return;
    }

    const ok = confirm("예약을 취소하시겠습니까?");
    if (!ok) return;

    try {
      setLoading(true);

      const response = await fetch("/api/reservation/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationNumber,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.message || "예약 취소 실패");
        return;
      }

      alert("예약이 취소되었습니다.");

      router.push("/");
    } catch (err) {
      console.error(err);
      alert("예약 취소 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl bg-gray-900 p-8 border border-gray-700">

        <h1 className="text-3xl font-bold text-white text-center">
          예약 취소
        </h1>

        <p className="text-gray-400 text-center mt-3">
          예약번호를 입력해주세요.
        </p>

        <input
          type="text"
          value={reservationNumber}
          onChange={(e) => setReservationNumber(e.target.value)}
          placeholder="예약번호"
          className="mt-8 w-full rounded-lg bg-black border border-gray-700 px-4 py-3 text-white"
        />

        <button
          onClick={handleCancel}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-gray-600 py-3 font-bold"
        >
          {loading ? "취소중..." : "예약 취소"}
        </button>

      </div>
    </main>
  );
}