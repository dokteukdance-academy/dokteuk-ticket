"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SeatMap from "@/components/SeatMap";

import ReservationForm from "@/components/ReservationForm";
import PriceInfo from "@/components/PriceInfo";

import { db } from "@/lib/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

export default function ReservePage() {
  const router = useRouter();

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const loadReservedSeats = async () => {
    const snapshot = await getDocs(collection(db, "reservations"));

    const reserved = snapshot.docs.map(
      (doc) => doc.data().seat as string
    );

    setReservedSeats(reserved);
  };

  useEffect(() => {
    loadReservedSeats();
  }, []);

  const handleSeatSelect = (seat: string) => {
    if (reservedSeats.includes(seat)) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
      return;
    }

    if (selectedSeats.length >= 10) {
      alert("최대 10매까지 선택 가능합니다.");
      return;
    }

    setSelectedSeats([...selectedSeats, seat]);
  };

  const handleReserve = async () => {
    if (selectedSeats.length === 0) {
      alert("좌석을 선택해주세요.");
      return;
    }

    if (!name || !phone) {
      alert("이름과 전화번호를 입력해주세요.");
      return;
    }

    const reservationNumber =
      "DKT-" + Date.now().toString().slice(-8);

    for (const seat of selectedSeats) {
      await addDoc(collection(db, "reservations"), {
        reservationNumber,
        name,
        phone,
        seat,
        price: 25000,
        status: "예약 완료",
        createdAt: new Date(),
      });
    }

    await loadReservedSeats();

    setSelectedSeats([]);
    setName("");
    setPhone("");

    router.push("/complete");
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-10">
      <h1 className="text-5xl font-bold mb-2">
        좌석 선택
      </h1>

      <p className="text-gray-400 mb-10">
        원하는 좌석을 선택하세요.
      </p>

      <ReservationForm
        name={name}
        phone={phone}
        setName={setName}
        setPhone={setPhone}
      />

      <PriceInfo />

      <SeatMap
        selectedSeats={selectedSeats}
        reservedSeats={reservedSeats}
        onSelect={handleSeatSelect}
      />

      <div className="mt-8 rounded-xl bg-gray-900 border border-gray-700 p-6 w-96 space-y-3">
        <div className="flex justify-between">
          <span>선택 좌석</span>
          <span className="text-yellow-400">
            {selectedSeats.length
              ? selectedSeats.join(", ")
              : "-"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>매수</span>
          <span>{selectedSeats.length}매</span>
        </div>

        <div className="flex justify-between">
          <span>총 금액</span>
          <span className="font-bold">
            ₩{(selectedSeats.length * 25000).toLocaleString()}
          </span>
        </div>
      </div>

      <button
        onClick={handleReserve}
        className="mt-8 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-lg transition"
      >
        예매하기
      </button>
    </main>
  );
}