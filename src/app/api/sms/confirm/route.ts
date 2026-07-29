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
      ticketToken,
    } = await req.json();

    if (!ticketToken) {
      return NextResponse.json(
        {
          success: false,
          message: "티켓 토큰이 없습니다.",
        },
        {
          status: 400,
        }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const ticketUrl =
      `${siteUrl}/ticket/${ticketToken}`;

    const cancelUrl =
      `${siteUrl}/cancel?reservation=${reservationNumber}`;

    await messageService.send({
      to: phone.replace(/-/g, ""),
      from: "01044661071",
      text: `[독특댄스아카데미]

${name}님

입금이 확인되어
예매가 최종 확정되었습니다.

예약번호 : ${reservationNumber}

좌석 : ${seat}

QR 입장권
${ticketUrl}

예약취소
${cancelUrl}

공연장 입장 시
QR 입장권을 보여주세요.

감사합니다.`,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error("CONFIRM SMS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "확정 문자 발송 실패",
      },
      {
        status: 500,
      }
    );
  }
}