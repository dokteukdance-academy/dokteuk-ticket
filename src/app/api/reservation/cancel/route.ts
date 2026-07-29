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

    const inputNumber = String(reservationNumber ?? "")
      .trim()
      .toUpperCase();

    if (!inputNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "예매번호를 입력해주세요.",
        },
        { status: 400 }
      );
    }

    const snapshot = await getDocs(
      collection(db, "reservations")
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
      return NextResponse.json(
        {
          success: false,
          message: "예약을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    const reservation = target.data();

    const reservationRef = doc(
      db,
      "reservations",
      target.id
    );

    // 예약 삭제
    await deleteDoc(reservationRef);

    console.log("예약 삭제 성공:", inputNumber);

    // 취소 문자는 실패해도 예약 취소 결과에는 영향을 주지 않도록 처리
    try {
      const smsCancelUrl = new URL(
        "/api/sms/cancel",
        req.url
      );

      const smsResponse = await fetch(smsCancelUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationNumber: inputNumber,
          name: reservation.customerName,
          phone: reservation.customerPhone,
          seat: Array.isArray(reservation.seats)
            ? reservation.seats.join(", ")
            : "",
          quantity: Array.isArray(reservation.seats)
            ? reservation.seats.length
            : 0,
        }),
      });

      const smsResult = await smsResponse.json().catch(() => null);

      console.log("취소 문자 응답:", {
        status: smsResponse.status,
        result: smsResult,
      });

      if (!smsResponse.ok) {
        console.error("취소 문자 발송 실패:", smsResult);
      }
    } catch (smsError) {
      console.error("취소 문자 요청 오류:", smsError);
    }

    return NextResponse.json({
      success: true,
      message: "예매가 정상적으로 취소되었습니다.",
    });
  } catch (err) {
    console.error("취소 오류:", err);

    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}