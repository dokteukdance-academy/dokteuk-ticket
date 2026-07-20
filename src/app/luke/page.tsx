"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

type Reservation = {
  id: string;
  name: string;
  phone: string;
  seat: string;
};

export default function AdminPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    async function loadReservations() {
      const snapshot = await getDocs(collection(db, "reservations"));

      const list: Reservation[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Reservation, "id">),
      }));

      setReservations(list);
    }

    loadReservations();
  }, []);

  const deleteReservation = async (reservationId: string) => {
    await deleteDoc(doc(db, "reservations", reservationId));

    setReservations((prev) =>
      prev.filter((item) => item.id !== reservationId)
    );
  };

  const login = () => {
    if (id === "admin" && password === "1234") {
      setIsLogin(true);
    } else {
      alert("아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <>
      {!isLogin ? (
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="w-[400px] border border-gray-700 rounded-xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">
              관리자 로그인
            </h1>

            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 mb-4"
            />

            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 mb-4"
            />

            <button
              onClick={login}
              className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded"
            >
              로그인
            </button>
          </div>
        </main>
      ) : (
        <main className="min-h-screen bg-black text-white p-10">
          <h1 className="text-4xl font-bold">예약 목록</h1>

          <div className="mt-8 space-y-4">
            {reservations.map((item) => (
              <div
                key={item.id}
                className="border border-gray-700 rounded-lg p-4"
              >
                <p>이름 : {item.name}</p>
                <p>전화번호 : {item.phone}</p>
                <p>좌석 : {item.seat}</p>

                <button
                  onClick={() => deleteReservation(item.id)}
                  className="mt-3 bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                >
                  예약 취소
                </button>
              </div>
            ))}
          </div>
        </main>
      )}
    </>
  );
}