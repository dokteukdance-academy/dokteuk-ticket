import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/firebase";

import {
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

export async function POST(req: NextRequest) {
    console.log("★★★★★ API CANCEL 실행 ★★★★★");
  try {
    const { reservationNumber } = await req.json();

    const snapshot = await getDocs(collection(db, "reservations"));

    const target = snapshot.docs.find(
      (docItem) =>
        docItem.data().reservationNumber === reservationNumber
    );

    if (!target) {
      return NextResponse.json({
        success: false,
        message: "예약을 찾을 수 없습니다.",
      });
    }

    const reservationRef = doc(db, "reservations", target.id);
    const reservation = target.data();

    await deleteDoc(reservationRef);

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sms/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: reservation.customerName,
        phone: reservation.customerPhone,
        seat: reservation.seats.join(", "),
        quantity: reservation.seats.length,
      }),
    });

    return NextResponse.json({
      success: true,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json({
      success: false,
    });
  }
}