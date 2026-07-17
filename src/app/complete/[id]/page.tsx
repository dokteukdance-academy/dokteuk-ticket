"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Reservation = {
  reservationNumber: string;
  name: string;
  phone: string;
  seat: string;
  grade: string;
  price: number;
  status: string;
};

export default function CompletePage() {
  const params = useParams();
  const router = useRouter();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReservation = async () => {
      if (!params.id) return;

      const docRef = doc(db, "reservations", params.id as string);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        setReservation(snapshot.data() as Reservation);
      }

      setLoading(false);
    };

    loadReservation();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white">
        불러오는 중...
      </main>
    );
  }

  if (!reservation) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white">
        예약 정보를 찾을 수 없습니다.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-700 bg-gray-900 p-10 shadow-xl">

        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>

          <h1 className="text-4xl font-bold text-white">
            예약 완료
          </h1>

          <p className="mt-3 text-gray-400">
            예매가 정상적으로 완료되었습니다.
          </p>
        </div>

        <div className="mt-10 space-y-5">

          <div className="flex justify-between">
            <span className="text-gray-400">예약번호</span>
            <span className="font-bold text-yellow-400">
              {reservation.reservationNumber}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">이름</span>
            <span>{reservation.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">전화번호</span>
            <span>{reservation.phone}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">좌석</span>
            <span>{reservation.seat}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">등급</span>
            <span>{reservation.grade}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">가격</span>
            <span>
              ₩{reservation.price.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">상태</span>
            <span className="text-green-400">
              {reservation.status}
            </span>
          </div>

        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-10 w-full rounded-lg bg-yellow-500 py-4 font-bold text-black hover:bg-yellow-400"
        >
          홈으로
        </button>

      </div>
    </main>
  );
}