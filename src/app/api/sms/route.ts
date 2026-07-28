/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { SolapiMessageService } from "solapi";

const messageService = new SolapiMessageService(
  process.env.SOLAPI_API_KEY!,
  process.env.SOLAPI_API_SECRET!
);

export async function POST(req: NextRequest) {
  try {
    const {
      reservationNumber,
      name,
      phone,
      seat,
      quantity,
    } = await req.json();

    await messageService.send({
        to: phone.replace(/-/g, ""),
        from: "01044661071",
        text: `[독특댄스아카데미]

${name}님 예매가 접수되었습니다.

예약번호 : ${reservationNumber}

좌석 : ${seat}
수량 : ${quantity}매

입금 확인 후 예약이 확정됩니다.

예약 취소
${process.env.NEXT_PUBLIC_SITE_URL}/cancel?reservation=${reservationNumber}

감사합니다.`,
      });

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {
    console.error("SMS ERROR:", error);
    console.error("SMS ERROR MESSAGE:", error?.message);
    console.error("SMS ERROR RESPONSE:", error?.response);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "문자 발송 실패",
      },
      {
        status: 500,
      }
    );
  }
}