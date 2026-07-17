"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { db, auth } from "@/lib/firebase";

type Reservation = {
    id: string;
    name: string;
    phone: string;
    seats: string[];
  };

const TOTAL_SEATS = 32;

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (user) => {
        if (!user) {
          router.replace("/admin/login");
          return;
        }

        const unsubscribeSnapshot = onSnapshot(
          collection(db, "reservations"),
          (snapshot) => {
            const grouped = new Map<string, Reservation>();

snapshot.docs.forEach((docItem) => {
  const data = docItem.data();

  const key = `${data.name}-${data.phone}`;

  if (!grouped.has(key)) {
    grouped.set(key, {
      id: docItem.id,
      name: data.name,
      phone: data.phone,
      seats: [data.seat],
    });
  } else {
    grouped.get(key)!.seats.push(data.seat);
  }
});

setReservations(Array.from(grouped.values()));
            setLoading(false);
          }
        );

        return unsubscribeSnapshot;
      }
    );

    return () => unsubscribeAuth();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);

    alert("로그아웃 되었습니다.");

    router.replace("/admin/login");
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("예약을 취소하시겠습니까?");

    if (!ok) return;

    await deleteDoc(doc(db, "reservations", id));

    alert("예약이 취소되었습니다.");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        불러오는 중...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="mx-auto max-w-6xl">

        <div className="flex items-center justify-between">

          <h1 className="text-5xl font-bold">
            관리자 페이지
          </h1>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-6 py-3 font-bold hover:bg-red-500"
          >
            로그아웃
          </button>

        </div>

        <div className="mt-8 grid grid-cols-2 gap-6">

          <div className="rounded-xl border border-gray-700 bg-gray-900 p-6">
            <p className="text-gray-400">
              총 예약자
            </p>

            <p className="mt-2 text-4xl font-bold text-yellow-400">
              {reservations.length}명
            </p>
          </div>

          <div className="rounded-xl border border-gray-700 bg-gray-900 p-6">
            <p className="text-gray-400">
              남은 좌석
            </p>

            <p className="mt-2 text-4xl font-bold text-green-400">
  {
    TOTAL_SEATS -
    reservations.reduce(
      (sum, item) => sum + item.seats.length,
      0
    )
  }석
</p>
          </div>

        </div>

        {reservations.length === 0 ? (
          <p className="mt-12 text-xl">
            예약자가 없습니다.
          </p>
        ) : (
          <div className="mt-10 space-y-5">

            {reservations.map((item) => (

              <div
                key={item.id}
                className="rounded-xl border border-gray-700 bg-gray-900 p-6"
              >

                <div className="space-y-2">

                  <p>
                    👤 <b>이름</b> : {item.name}
                  </p>

                  <p>
                    📞 <b>전화번호</b> : {item.phone}
                  </p>

                  <p>
                  💺 <b>좌석</b> : {item.seats.join(", ")}
                  </p>
                  <p>
  🎟 <b>매수</b> : {item.seats.length}매
</p>

<p>
  💰 <b>금액</b> : ₩{(item.seats.length * 25000).toLocaleString()}
</p>

                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="mt-6 rounded-lg bg-red-600 px-5 py-3 font-bold hover:bg-red-500"
                >
                  예약 취소
                </button>

              </div>

            ))}

          </div>
        )}

      </div>
    </main>
  );
}