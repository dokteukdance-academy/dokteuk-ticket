"use client";

import { useState } from "react";
import {
    collection,
    getDocs,
    query,
    where,
    deleteDoc,
  } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Reservation = {
  name: string;
  phone: string;
  seats: string[];
};

export default function SearchPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [result, setResult] = useState<Reservation | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!name || !phone) {
      alert("이름과 전화번호를 입력해주세요.");
      return;
    }

    const q = query(
      collection(db, "reservations"),
      where("name", "==", name),
      where("phone", "==", phone)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      setResult(null);
      setSearched(true);
      return;
    }

    const seats = snapshot.docs.map(
      (doc) => doc.data().seat as string
    );

    setResult({
      name,
      phone,
      seats,
    });

    setSearched(true);
  };

  const handleCancel = async () => {
    if (!result) return;
  
    const ok = window.confirm("정말 예매를 취소하시겠습니까?");
  
    if (!ok) return;
  
    const q = query(
      collection(db, "reservations"),
      where("name", "==", result.name),
      where("phone", "==", result.phone)
    );
  
    const snapshot = await getDocs(q);
  
    for (const document of snapshot.docs) {
      await deleteDoc(document.ref);
    }
  
    alert("예매가 취소되었습니다.");
  
    setResult(null);
    setSearched(false);
    setName("");
    setPhone("");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-2xl border border-gray-700 bg-gray-900 p-10">

        <h1 className="text-4xl font-bold text-center">
          예매 조회
        </h1>

        <p className="mt-3 text-center text-gray-400">
          이름과 전화번호를 입력하세요.
        </p>

        <div className="mt-8 space-y-4">

          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg bg-gray-800 p-4"
          />

          <input
            type="text"
            placeholder="전화번호"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg bg-gray-800 p-4"
          />

          <button
            onClick={handleSearch}
            className="w-full rounded-lg bg-yellow-500 py-4 font-bold text-black hover:bg-yellow-400"
          >
            예매 조회
          </button>

        </div>

        {searched && !result && (
          <div className="mt-10 rounded-xl bg-red-900/30 border border-red-600 p-6 text-center">
            예약 정보를 찾을 수 없습니다.
          </div>
        )}

        {result && (
          <div className="mt-10 rounded-xl bg-black p-6 space-y-4">

            <div>
              <p className="text-gray-500 text-sm">이름</p>
              <p className="text-xl">{result.name}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">전화번호</p>
              <p className="text-xl">{result.phone}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">좌석</p>

              <p className="text-xl font-bold text-yellow-400">
                {result.seats.join(", ")}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">매수</p>

              <p className="text-xl">
                {result.seats.length}매
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">총 금액</p>

              <p className="text-xl">
                ₩{(result.seats.length * 25000).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">상태</p>

              <p className="text-green-400 font-bold">
                예약 완료
              </p>
              <button
  onClick={handleCancel}
  className="mt-6 w-full rounded-lg bg-red-500 py-3 font-bold text-white hover:bg-red-600"
>
  예매 취소
</button>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}