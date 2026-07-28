import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const reservationNumber = body.reservationNumber;

    if (!reservationNumber) {
      return NextResponse.json({
        success: false,
        message: "예약번호가 없습니다.",
      });
    }

    const snapshot = await getDocs(
      collection(db, "reservations")
    );

    let targetId = "";

    snapshot.forEach((item) => {
      const data = item.data();

      if (data.reservationNumber === reservationNumber) {
        targetId = item.id;
      }
    });


    if (!targetId) {
      return NextResponse.json({
        success: false,
        message: "예약번호를 찾을 수 없습니다.",
      });
    }


    await deleteDoc(
      doc(db, "reservations", targetId)
    );


    return NextResponse.json({
      success: true,
      message: "취소 완료",
    });


  } catch (error) {

    console.error(error);

    return NextResponse.json({
      success: false,
      message: "서버 오류",
    });

  }
}