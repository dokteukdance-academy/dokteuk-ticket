import { NextRequest, NextResponse } from "next/server";
import { SolapiMessageService } from "solapi";

const messageService = new SolapiMessageService(
  process.env.SOLAPI_API_KEY!,
  process.env.SOLAPI_API_SECRET!
);

export async function POST(req: NextRequest) {
  try {
    const { name, phone, seat, quantity } = await req.json();

    await messageService.send({
      to: phone.replace(/-/g, ""),
      from: "01044661071", // 솔라피 등록번호
      text: `[독특댄스아카데미]

${name}님의 예약이 취소되었습니다.

좌석 : ${seat}
수량 : ${quantity}매

궁금하신 사항은
독특댄스아카데미로 문의해주세요.

감사합니다.`
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}