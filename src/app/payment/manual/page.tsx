"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function ManualPaymentPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [seats, setSeats] = useState<string[]>([]);

  useEffect(() => {
    setName(localStorage.getItem("customerName") || "");
    setPhone(localStorage.getItem("customerPhone") || "");

    const savedSeats = JSON.parse(
      localStorage.getItem("selectedSeats") || "[]"
    );

    setSeats(savedSeats);
  }, []);

  const handleComplete = async () => {
    console.log("★★★★★ 입금완료 버튼 클릭 ★★★★★");
    try {
      setLoading(true);

      const reservationNumber =
        "DK" + Date.now().toString().slice(-8);

      localStorage.setItem(
        "reservationNumber",
        reservationNumber
      );

      await addDoc(collection(db, "reservations"), {
        reservationNumber,
        customerName: name,
        customerPhone: phone,
        seats,
        amount: seats.length * 25000,
        status: "입금확인중",
        confirmed: false,
        createdAt: new Date().toISOString(),
      });
      const smsResponse = await fetch("/api/sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationNumber,
          name,
          phone,
          seat: seats.join(", "),
          quantity: seats.length,
        }),
      });
      
      console.log("SMS STATUS:", smsResponse.status);
      
      const smsResult = await smsResponse.json();
      
      console.log("SMS RESULT:", smsResult);
      
      if (!smsResponse.ok) {
        console.log("문자 발송 실패", smsResult);
      }

      alert(
        `예약이 접수되었습니다.

예약번호 : ${reservationNumber}

이 번호로 홈페이지에서 직접 예약취소가 가능합니다.`
      );

      router.push("/reserve/complete");
    } catch (err) {
      console.error(err);
      alert("예약 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-8">
          카카오페이 송금
        </h1>

        <div className="bg-gray-900 rounded-xl p-6 space-y-6">
        <div className="space-y-2">

<p>
  <span className="text-gray-400">예약자</span>
  <br />
  <span className="font-bold">{name}</span>
</p>

<p>
  <span className="text-gray-400">전화번호</span>
  <br />
  <span className="font-bold">{phone}</span>
</p>

<p>
  <span className="text-gray-400">선택좌석</span>
  <br />
  <span className="font-bold text-yellow-400">
    {seats.join(", ")}
  </span>
</p>

<p>
  <span className="text-gray-400">결제금액</span>
  <br />
  <span className="font-bold text-2xl">
    ₩{(seats.length * 25000).toLocaleString()}
  </span>
</p>

</div>

<div className="border-t border-gray-700 pt-6">

<h2 className="text-xl font-bold mb-4 text-center">
  카카오페이 QR
</h2>

<Image
  src="/kakao-qr.png"
  alt="카카오 QR"
  width={260}
  height={260}
  className="mx-auto rounded-lg"
/>

<p className="mt-6 text-center text-gray-400">
  QR을 스캔하여
  <br />
  위 금액을 송금해주세요.
</p>

</div>
<button
            onClick={handleComplete}
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-500 text-black font-bold py-4 rounded-lg transition"
          >
            {loading ? "저장중..." : "입금 완료했습니다"}
          </button>

        </div>

      </div>

    </main>
  );
}