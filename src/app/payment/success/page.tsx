"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import QRCode from "react-qr-code";

import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

function SuccessContent() {
  const searchParams = useSearchParams();

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) return;

    const confirmPayment = async () => {
      try {
        const seats = JSON.parse(
          localStorage.getItem("selectedSeats") || "[]"
        );

        const customerName =
          localStorage.getItem("customerName") || "";

        const customerPhone =
          localStorage.getItem("customerPhone") || "";

        const response = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
            seats,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "결제 승인 실패");
        }

        await addDoc(collection(db, "reservations"), {
          orderId,
          reservationNumber: orderId,
          paymentKey,
          amount: Number(amount),
          customerName,
          customerPhone,
          seats,
          createdAt: serverTimestamp(),
        });

        localStorage.removeItem("selectedSeats");
        localStorage.removeItem("customerName");
        localStorage.removeItem("customerPhone");
      } catch (err) {
        console.error(err);
      }
    };

    confirmPayment();
  }, [paymentKey, orderId, amount]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      <h1 className="text-4xl font-bold text-green-400 mb-4">
        ✅ 결제가 완료되었습니다.
      </h1>

      <p className="text-gray-400 mb-10">
        예매가 정상적으로 완료되었습니다.
      </p>

      <div className="bg-gray-900 rounded-xl p-8 w-full max-w-md space-y-5">
        <div className="flex justify-between">
          <span className="text-gray-400">예약번호</span>

          <span className="font-bold text-yellow-400">
            {orderId}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">결제금액</span>

          <span>{amount}원</span>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col items-center">
          <QRCode
            value={orderId || ""}
            size={220}
            bgColor="#ffffff"
            fgColor="#000000"
          />

          <p className="mt-6 text-sm text-gray-400">
            공연장 입장 시 QR코드를 보여주세요.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-black text-white">
          로딩중...
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}