"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import QRCode from "react-qr-code";

import { db } from "@/lib/firebase";

type TicketReservation = {
  reservationNumber: string;
  customerName: string;
  seats: string[];
  confirmed: boolean;
  status?: string;
  entered?: boolean;
  ticketToken: string;
};

export default function TicketPage() {
  const params = useParams();
  const token = String(params.token || "");

  const [reservation, setReservation] =
    useState<TicketReservation | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTicket() {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        const ticketQuery = query(
          collection(db, "reservations"),
          where("ticketToken", "==", token),
          limit(1)
        );

        const snapshot = await getDocs(ticketQuery);

        if (snapshot.empty) {
          setReservation(null);
          setLoading(false);
          return;
        }

        const data = snapshot.docs[0].data();

        setReservation({
          reservationNumber: data.reservationNumber || "",
          customerName: data.customerName || "",
          seats: data.seats || [],
          confirmed: data.confirmed || false,
          status: data.status || "",
          entered: data.entered || false,
          ticketToken: data.ticketToken || "",
        });
      } catch (error) {
        console.error("티켓 조회 실패:", error);
        setReservation(null);
      } finally {
        setLoading(false);
      }
    }

    loadTicket();
  }, [token]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        입장권을 불러오는 중...
      </main>
    );
  }

  if (!reservation || !reservation.confirmed) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 text-center">
        <p className="text-5xl mb-5">❌</p>

        <h1 className="text-2xl font-bold text-red-400">
          유효하지 않은 입장권입니다.
        </h1>

        <p className="text-gray-400 mt-4">
          취소되었거나 존재하지 않는 입장권입니다.
        </p>
      </main>
    );
  }

  if (reservation.status === "cancelled") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 text-center">
        <p className="text-5xl mb-5">🚫</p>

        <h1 className="text-2xl font-bold text-red-400">
          취소된 입장권입니다.
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">
        🎟 QR 입장권
      </h1>

      <div className="bg-white p-5 rounded-2xl">
        <QRCode
          value={token}
          size={240}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>

      <div className="mt-8 bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md space-y-4">
        <div className="flex justify-between gap-4">
          <span className="text-gray-400">
            예약자
          </span>

          <span className="font-bold">
            {reservation.customerName}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-400">
            예약번호
          </span>

          <span className="font-bold text-yellow-400 break-all text-right">
            {reservation.reservationNumber}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-400">
            좌석
          </span>

          <span className="font-bold text-right">
            {reservation.seats.join(", ")}
          </span>
        </div>

        <div className="border-t border-gray-700 pt-4 text-center">
          {reservation.entered ? (
            <p className="text-yellow-400 font-bold">
              ⚠️ 이미 입장 처리된 티켓입니다.
            </p>
          ) : (
            <p className="text-green-400 font-bold">
              ✅ 사용 가능한 입장권입니다.
            </p>
          )}
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-400 text-center">
        공연장 입장 시 직원에게 이 QR코드를 보여주세요.
      </p>
    </main>
  );
}