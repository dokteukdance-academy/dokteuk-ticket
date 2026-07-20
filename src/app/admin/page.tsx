"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { auth, db } from "@/lib/firebase";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

type Reservation = {
  id: string;
  customerName: string;
  customerPhone: string;
  seats: string[];
  amount: number;
};

const TOTAL_SEATS = 241;

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const unsubscribeFirestore = onSnapshot(
        collection(db, "reservations"),
        (snapshot) => {
          const list: Reservation[] = snapshot.docs.map((docItem) => {
            const data = docItem.data();

            return {
              id: docItem.id,
              customerName: data.customerName || "",
              customerPhone: data.customerPhone || "",
              seats: data.seats || [],
              amount: data.amount || 0,
            };
          });

          setReservations(list);
          setLoading(false);
        }
      );

      return () => unsubscribeFirestore();
    });

    return () => unsubscribeAuth();
  }, [router]);

  async function handleLogout() {
    await signOut(auth);
    router.replace("/admin/login");
  }

  async function handleDelete(id: string) {
    const ok = confirm("예약을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      const reservationRef = doc(db, "reservations", id);
      const reservationSnap = await getDoc(reservationRef);

      if (!reservationSnap.exists()) {
        alert("예약 정보를 찾을 수 없습니다.");
        return;
      }

      const reservation = reservationSnap.data();

      const seats: string[] = reservation.seats || [];

      const concertRef = doc(db, "concerts", "summer2026");
      const concertSnap = await getDoc(concertRef);

      if (concertSnap.exists()) {
        const concert = concertSnap.data();

        const reservedSeats: string[] =
          concert.reservedSeats || [];

        const newReservedSeats = reservedSeats.filter(
          (seat) => !seats.includes(seat)
        );

        await updateDoc(concertRef, {
          reservedSeats: newReservedSeats,
          remainingSeats:
            (concert.remainingSeats || 0) + seats.length,
        });
      }

      await deleteDoc(reservationRef);

      alert("예약이 취소되었습니다.");
    } catch (err) {
      console.error(err);
      alert("예약 삭제 실패");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        불러오는 중...
      </main>
    );
  }

  const reservedCount = reservations.reduce(
    (sum, item) => sum + item.seats.length,
    0
  );

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="mx-auto max-w-6xl">

        <div className="flex justify-between items-center">

          <h1 className="text-4xl font-bold">
            관리자 페이지
          </h1>

          <div className="flex gap-3">

            <button
              onClick={() => router.push("/admin/scan")}
              className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-lg font-bold"
            >
              📷 QR 스캔
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-500 px-5 py-3 rounded-lg font-bold"
            >
              로그아웃
            </button>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-5 mt-10">

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400">
              총 예약자
            </p>

            <p className="text-4xl font-bold text-yellow-400 mt-3">
              {reservations.length}명
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400">
              남은 좌석
            </p>

            <p className="text-4xl font-bold text-green-400 mt-3">
              {TOTAL_SEATS - reservedCount}석
            </p>
          </div>

        </div>

        <div className="mt-12 space-y-5">

          {reservations.length === 0 && (
            <div className="text-gray-400">
              예약자가 없습니다.
            </div>
          )}

          {reservations.map((item) => (

            <div
              key={item.id}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6"
            >

              <div className="space-y-2">

                <p>
                  👤 이름 :
                  <span className="font-bold ml-2">
                    {item.customerName}
                  </span>
                </p>

                <p>
                  📞 전화번호 :
                  <span className="ml-2">
                    {item.customerPhone}
                  </span>
                </p>

                <p>
                  💺 좌석 :
                  <span className="ml-2">
                    {item.seats.join(", ")}
                  </span>
                </p>

                <p>
                  🎟 매수 :
                  <span className="ml-2">
                    {item.seats.length}매
                  </span>
                </p>

                <p>
                  💰 결제금액 :
                  <span className="ml-2 font-bold">
                    ₩{item.amount.toLocaleString()}
                  </span>
                </p>

              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="mt-5 bg-red-600 hover:bg-red-500 px-5 py-2 rounded-lg"
              >
                예약 삭제
              </button>

            </div>

          ))}

        </div>

      </div>
    </main>
  );
}