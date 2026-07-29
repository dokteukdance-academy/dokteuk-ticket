import { NextResponse } from "next/server";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: Request) {
  try {
    const { reservationNumber } = await req.json();

    const snapshot = await getDocs(collection(db, "reservations"));

    const reservation = snapshot.docs.find(
      (d) => d.data().reservationNumber === reservationNumber
    );

    if (!reservation) {
      return NextResponse.json({
        success: false,
        message: "예약번호를 찾을 수 없습니다.",
      });
    }

    await deleteDoc(doc(db, "reservations", reservation.id));

    await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/sms/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: reservation.data().customerName,
            phone: reservation.data().customerPhone,
            seat: reservation.data().seats.join(", "),
            quantity: reservation.data().seats.length,
          }),
        }
      );

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json({
      success: false,
      message: "취소 실패",
    });
  }
}