"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type Reservation = {
  id: string;
  customerName: string;
  seats: string[];
  reservationNumber: string;
  entered?: boolean;
};

export default function CheckPage() {
  const searchParams = useSearchParams();

  const code = searchParams.get("code");

  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] =
    useState<Reservation | null>(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!code) return;

    async function loadReservation() {
      try {
        const q = query(
          collection(db, "reservations"),
          where("reservationNumber", "==", code)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setMessage("예약을 찾을 수 없습니다.");
          setLoading(false);
          return;
        }

        const data = snapshot.docs[0];

        setReservation({
          id: data.id,
          ...(data.data() as any),
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage("조회 실패");
        setLoading(false);
      }
    }

    loadReservation();
  }, [code]);

  async function enterReservation() {
    if (!reservation) return;

    if (reservation.entered) {
      alert("이미 입장한 티켓입니다.");
      return;
    }

    await updateDoc(doc(db, "reservations", reservation.id), {
      entered: true,
    });

    alert("입장 완료");

    location.reload();
  }

  if (loading)
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        조회중...
      </main>
    );

  if (!reservation)
    return (
      <main className="min-h-screen bg-black text-red-500 flex items-center justify-center text-3xl">
        {message}
      </main>
    );

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

      <div className="bg-gray-900 rounded-xl p-10 w-[420px]">

        <h1 className="text-3xl font-bold mb-8">
          티켓 확인
        </h1>

        <p className="mb-3">
          이름 :
          <span className="font-bold ml-2">
            {reservation.customerName}
          </span>
        </p>

        <p className="mb-3">
          예매번호 :
          <span className="ml-2">
            {reservation.reservationNumber}
          </span>
        </p>

        <p className="mb-6">
          좌석 :
          <span className="ml-2">
            {reservation.seats.join(", ")}
          </span>
        </p>

        {reservation.entered ? (
          <div className="bg-red-600 text-center rounded-lg py-4 font-bold text-xl">
            이미 입장한 티켓입니다.
          </div>
        ) : (
          <button
            onClick={enterReservation}
            className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-lg text-xl font-bold"
          >
            입장 처리
          </button>
        )}

      </div>

    </main>
  );
}