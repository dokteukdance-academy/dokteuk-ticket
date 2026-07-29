"use client";

import { useEffect, useState } from "react";

import SeatMap from "@/components/SeatMap";
import ReservationForm from "@/components/ReservationForm";
import PriceInfo from "@/components/PriceInfo";

import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";

export default function ReservePage() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [pendingSeats, setPendingSeats] = useState<string[]>([]);
  const [confirmedSeats, setConfirmedSeats] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "reservations"),
      (snapshot) => {
        const pending: string[] = [];
        const confirmed: string[] = [];

        snapshot.docs.forEach((document) => {
          const data = document.data();

          const reservationSeats: string[] =
            Array.isArray(data.seats)
              ? data.seats
              : [];

          if (data.confirmed === true) {
            confirmed.push(...reservationSeats);
          } else {
            pending.push(...reservationSeats);
          }
        });

        setPendingSeats([...new Set(pending)]);
        setConfirmedSeats([...new Set(confirmed)]);
      },
      (error) => {
        console.error(
          "좌석 예약 정보 불러오기 실패:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSeatSelect = (seat: string) => {
    const isUnavailable =
      pendingSeats.includes(seat) ||
      confirmedSeats.includes(seat);

    if (isUnavailable) {
      alert("이미 다른 사람이 예약한 좌석입니다.");
      return;
    }

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(
        selectedSeats.filter(
          (selectedSeat) => selectedSeat !== seat
        )
      );

      return;
    }

    if (selectedSeats.length >= 10) {
      alert("최대 10매까지 선택 가능합니다.");
      return;
    }

    setSelectedSeats([
      ...selectedSeats,
      seat,
    ]);
  };

  const handlePayment = () => {
    if (selectedSeats.length === 0) {
      alert("좌석을 선택해주세요.");
      return;
    }

    if (!name.trim() || !phone.trim()) {
      alert("이름과 전화번호를 입력해주세요.");
      return;
    }

    const unavailableSeats =
      selectedSeats.filter(
        (seat) =>
          pendingSeats.includes(seat) ||
          confirmedSeats.includes(seat)
      );

    if (unavailableSeats.length > 0) {
      alert(
        `다른 사람이 먼저 예약한 좌석이 있습니다.

${unavailableSeats.join(", ")}

좌석을 다시 선택해주세요.`
      );

      setSelectedSeats(
        selectedSeats.filter(
          (seat) =>
            !unavailableSeats.includes(seat)
        )
      );

      return;
    }

    localStorage.setItem(
      "selectedSeats",
      JSON.stringify(selectedSeats)
    );

    localStorage.setItem(
      "customerName",
      name.trim()
    );

    localStorage.setItem(
      "customerPhone",
      phone.trim()
    );

    window.location.assign("/payment/manual");
  };

  return (
    <main className="min-h-screen overflow-y-auto bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-2 text-center text-5xl font-bold">
          좌석 선택
        </h1>

        <p className="mb-10 text-center text-gray-400">
          원하는 좌석을 선택하세요.
        </p>

        <div className="mx-auto max-w-md">
          <ReservationForm
            name={name}
            phone={phone}
            setName={setName}
            setPhone={setPhone}
          />

          <PriceInfo />
        </div>

        <section className="mt-8 w-full pb-8">
          <SeatMap
            selectedSeats={selectedSeats}
            pendingSeats={pendingSeats}
            confirmedSeats={confirmedSeats}
            onSelect={handleSeatSelect}
          />
        </section>

        <div className="mx-auto mt-10 max-w-md space-y-3 rounded-xl border border-gray-700 bg-gray-900 p-6">
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
              ₩
              {(
                selectedSeats.length * 25000
              ).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="pb-20 text-center">
          <button
            type="button"
            onClick={handlePayment}
            className="mt-8 rounded-lg bg-yellow-500 px-8 py-4 font-bold text-black transition hover:bg-yellow-400"
          >
            예매하기
          </button>
        </div>
      </div>
    </main>
  );
}