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
  reservationNumber: string;
  customerName: string;
  customerPhone: string;
  seats: string[];
  amount: number;
  confirmed: boolean;
  createdAt: string;
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
              reservationNumber: data.reservationNumber || "",
              customerName: data.customerName || "",
              customerPhone: data.customerPhone || "",
              seats: data.seats || [],
              amount: data.amount || 0,
              confirmed: data.confirmed || false,
              createdAt: data.createdAt || "",
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
  
      const response = await fetch("/api/sms/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationNumber: reservation.reservationNumber,
          name: reservation.customerName,
          phone: reservation.customerPhone,
          seat: reservation.seats.join(", "),
          quantity: reservation.seats.length,
        }),
      });
  
      const result = await response.json();
  
      if (!result.success) {
        console.error("취소 문자 발송 실패");
      }
  
      await deleteDoc(reservationRef);
  
      alert("예약이 취소되었습니다.");
    } catch (err) {
      console.error(err);
      alert("예약 삭제 실패");
    }
  }

  async function handleConfirm(id: string) {
    try {
      const reservationRef = doc(db, "reservations", id);
      const reservationSnap = await getDoc(reservationRef);
  
      if (!reservationSnap.exists()) {
        alert("예약 정보를 찾을 수 없습니다.");
        return;
      }
  
      const reservation = reservationSnap.data();
  
      // QR 입장권에 사용할 추측 불가능한 고유 토큰
      const ticketToken = crypto.randomUUID().replace(/-/g, "");
  
      // 예약 확정 및 QR 토큰 저장
      await updateDoc(reservationRef, {
        confirmed: true,
        status: "confirmed",
        ticketToken,
        entered: false,
        confirmedAt: new Date().toISOString(),
      });
  
      // QR 입장권 링크가 포함된 확정 문자 발송
      const response = await fetch("/api/sms/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationNumber: reservation.reservationNumber,
          name: reservation.customerName,
          phone: reservation.customerPhone,
          seat: reservation.seats.join(", "),
          quantity: reservation.seats.length,
          ticketToken,
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok || !result.success) {
        console.error("확정 문자 발송 실패:", result);
        alert(
          "예약은 확정됐지만 문자 발송에 실패했습니다.\n콘솔을 확인해주세요."
        );
        return;
      }
  
      alert("예약이 확정되고 QR 입장권 문자가 발송되었습니다.");
    } catch (err) {
      console.error(err);
      alert("예약 확정 실패");
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

                <p>
                  📌 상태 :
                  {item.confirmed ? (
                    <span className="ml-2 text-green-400 font-bold">
                      ✅ 예약 확정
                    </span>
                  ) : (
                    <span className="ml-2 text-yellow-400 font-bold">
                      ⏳ 예약 대기
                    </span>
                  )}
                </p>

                <p>
                  🕒 예약시간 :
                  <span className="ml-2">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString("ko-KR")
                      : "-"}
                  </span>
                </p>

              </div>

              <div className="mt-5 flex gap-3">
              {!item.confirmed && (
                  <button
                    onClick={() => handleConfirm(item.id)}
                    className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg"
                  >
                    예약 확정
                  </button>
                )}

                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-lg"
                >
                  예약 삭제
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </main>
  );
}