import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";

const SECRET_KEY = process.env.TOSS_SECRET_KEY!;

export async function POST(req: NextRequest) {
  try {
    const {
      paymentKey,
      orderId,
      amount,
      seats,
    } = await req.json();

    console.log("받은 seats:", seats);

    const response = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(SECRET_KEY + ":").toString("base64"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: Number(amount),
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, {
        status: response.status,
      });
    }

    if (!Array.isArray(seats) || seats.length === 0) {
      return NextResponse.json({
        success: true,
        message: "좌석 없음",
      });
    }

    const concertRef = doc(db, "concerts", "summer2026");

    const concertSnap = await getDoc(concertRef);

    if (!concertSnap.exists()) {
      return NextResponse.json(
        {
          message: "concert 문서가 없습니다.",
        },
        {
          status: 404,
        }
      );
    }

    await updateDoc(concertRef, {
      reservedSeats: arrayUnion(...seats),
      remainingSeats: increment(-seats.length),
    });

    console.log("reservedSeats 업데이트 완료:", seats);

    return NextResponse.json({
      success: true,
      payment: result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "결제 승인 실패",
      },
      {
        status: 500,
      }
    );
  }
}