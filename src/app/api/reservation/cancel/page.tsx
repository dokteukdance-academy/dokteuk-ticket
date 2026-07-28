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

      const response = await fetch("/api/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationNumber,
        }),
      });
      
      const result = await response.json();
      
      console.log(result);
      
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
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-gray-900 rounded-xl p-8 border border-gray-700">

        <h1 className="text-3xl font-bold text-center mb-8">
          예약 취소
        </h1>

        <input
          type="text"
          placeholder="예약번호 입력"
          value={reservationNumber}
          onChange={(e) => setReservationNumber(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-6"
        />

        <button
          onClick={handleCancel}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-600 py-4 rounded-lg font-bold"
        >
          {loading ? "취소중..." : "예약 취소"}
        </button>

      </div>
    </main>
  );
}