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

    // 입력값 정리
    const inputNumber = String(reservationNumber ?? "")
      .trim()
      .toUpperCase();

    const snapshot = await getDocs(collection(db, "reservations"));

    // 디버그 로그
    console.log("입력된 예매번호:", JSON.stringify(inputNumber));
    console.log(
      "DB 예매번호 목록:",
      snapshot.docs.map((docItem) =>
        String(docItem.data().reservationNumber ?? "")
          .trim()
          .toUpperCase()
      )
    );

    const target = snapshot.docs.find((docItem) => {
      const savedNumber = String(
        docItem.data().reservationNumber ?? ""
      )
        .trim()
        .toUpperCase();

      return savedNumber === inputNumber;
    });

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
    console.error("취소 오류:", err);

    return NextResponse.json({
      success: false,
      message: "서버 오류",
    });
  }
}