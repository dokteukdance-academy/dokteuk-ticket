import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const { ticketToken } = await req.json();

    if (!ticketToken) {
      return NextResponse.json(
        {
          success: false,
          status: "invalid",
          message: "티켓 토큰이 없습니다.",
        },
        {
          status: 400,
        }
      );
    }

    const ticketQuery = query(
      collection(db, "reservations"),
      where("ticketToken", "==", ticketToken),
      limit(1)
    );

    const snapshot = await getDocs(ticketQuery);

    if (snapshot.empty) {
      return NextResponse.json(
        {
          success: false,
          status: "invalid",
          message: "존재하지 않는 입장권입니다.",
        },
        {
          status: 404,
        }
      );
    }

    const reservationDoc = snapshot.docs[0];
    const reservation = reservationDoc.data();

    if (
      !reservation.confirmed ||
      reservation.status === "cancelled"
    ) {
      return NextResponse.json(
        {
          success: false,
          status: "cancelled",
          message: "취소되었거나 확정되지 않은 입장권입니다.",
        },
        {
          status: 400,
        }
      );
    }

    if (reservation.entered) {
      return NextResponse.json(
        {
          success: false,
          status: "entered",
          message: "이미 입장 처리된 입장권입니다.",
          customerName: reservation.customerName || "",
          seats: reservation.seats || [],
        },
        {
          status: 409,
        }
      );
    }

    await updateDoc(reservationDoc.ref, {
      entered: true,
      enteredAt: new Date().toISOString(),
      status: "entered",
    });

    return NextResponse.json({
      success: true,
      status: "entered",
      message: "입장 처리가 완료되었습니다.",
      reservationNumber: reservation.reservationNumber || "",
      customerName: reservation.customerName || "",
      seats: reservation.seats || [],
      quantity: reservation.seats?.length || 0,
    });
  } catch (error) {
    console.error("CHECK-IN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        status: "error",
        message: "입장 처리 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      }
    );
  }
}