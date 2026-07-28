/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const { reservationNumber } = await req.json();

    console.log("입력 예약번호:", reservationNumber);

    const snapshot = await getDocs(collection(db, "reservations"));

    console.log(
      "DB 예약번호:",
      snapshot.docs.map((d) => d.data().reservationNumber)
    );

    const reservation = snapshot.docs.find(
      (d) => d.data().reservationNumber === reservationNumber
    );

    console.log("찾은 예약:", reservation?.data());

    if (!reservation) {
      console.log("예약번호를 찾지 못함");

      return NextResponse.json({
        success: false,
        message: "예약번호를 찾을 수 없습니다.",
      });
    }

    console.log("예약 찾음");

    await deleteDoc(doc(db, "reservations", reservation.id));

    console.log("삭제 완료");

    return NextResponse.json({
      success: true,
    });

} catch (err: unknown) {
    console.error("API ERROR:", err);
  
    const message =
      err instanceof Error ? err.message : "취소 실패";
  
    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 500,
      }
    );
  }
}