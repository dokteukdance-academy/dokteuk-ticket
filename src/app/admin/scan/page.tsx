"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";

type ScanResult = {
  success: boolean;
  status: string;
  message: string;
  reservationNumber?: string;
  customerName?: string;
  seats?: string[];
  quantity?: number;
};

function extractTicketToken(decodedText: string) {
  const trimmedText = decodedText.trim();

  try {
    const url = new URL(trimmedText);
    const parts = url.pathname.split("/").filter(Boolean);

    const ticketIndex = parts.indexOf("ticket");

    if (ticketIndex !== -1 && parts[ticketIndex + 1]) {
      return parts[ticketIndex + 1];
    }
  } catch {
    // QR에 URL이 아닌 토큰만 들어 있는 경우 그대로 사용
  }

  return trimmedText;
}

export default function AdminScanPage() {
  const router = useRouter();

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const processingRef = useRef(false);

  const [result, setResult] = useState<ScanResult | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;

    let mounted = true;
    let started = false;

    async function startScanner() {
      try {
        await html5QrCode.start(
          {
            facingMode: "environment",
          },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250,
            },
          },
          async (decodedText) => {
            if (processingRef.current) return;

            processingRef.current = true;
            setScanning(false);

            try {
              if (started) {
                await html5QrCode.stop();
                started = false;
              }

              const ticketToken = extractTicketToken(decodedText);

              const response = await fetch("/api/check-in", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ticketToken,
                }),
              });

              const data: ScanResult = await response.json();

              if (mounted) {
                setResult(data);
              }
            } catch (error) {
              console.error("QR 입장 처리 실패:", error);

              if (mounted) {
                setResult({
                  success: false,
                  status: "error",
                  message: "입장 처리 중 오류가 발생했습니다.",
                });
              }
            }
          },
          () => {
            // QR을 찾지 못한 순간마다 발생하는 오류는 무시
          }
        );

        started = true;
      } catch (error) {
        console.error("카메라 실행 실패:", error);

        if (mounted) {
          setCameraError(
            "카메라를 실행할 수 없습니다. 카메라 권한을 확인해주세요."
          );
        }
      }
    }

    startScanner();

    return () => {
      mounted = false;

      if (started) {
        html5QrCode
          .stop()
          .then(() => html5QrCode.clear())
          .catch(() => {});
        } else {
          html5QrCode.clear();
        }
    };
  }, []);

  function handleScanAgain() {
    window.location.reload();
  }

  function getResultStyle() {
    if (!result) {
      return "border-gray-700 bg-gray-900";
    }

    if (result.success) {
      return "border-green-500 bg-green-950";
    }

    if (result.status === "entered") {
      return "border-yellow-500 bg-yellow-950";
    }

    return "border-red-500 bg-red-950";
  }

  function getResultIcon() {
    if (!result) return "";

    if (result.success) return "✅";

    if (result.status === "entered") return "⚠️";

    return "❌";
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">
        📷 QR 입장 확인
      </h1>

      {scanning && !result && (
        <p className="text-gray-400 mb-6">
          관객의 QR 입장권을 카메라에 보여주세요.
        </p>
      )}

      {cameraError ? (
        <div className="w-full max-w-md bg-red-950 border border-red-500 rounded-xl p-6 text-center">
          <p className="text-5xl mb-4">📵</p>

          <p className="text-red-300 font-bold">
            {cameraError}
          </p>
        </div>
      ) : (
        !result && (
          <div className="bg-white rounded-xl overflow-hidden">
            <div
              id="reader"
              className="w-[350px] max-w-[90vw]"
            />
          </div>
        )
      )}

      {result && (
        <div
          className={`w-full max-w-md border-2 rounded-2xl p-7 text-center ${getResultStyle()}`}
        >
          <p className="text-6xl mb-5">
            {getResultIcon()}
          </p>

          <h2 className="text-2xl font-bold mb-3">
            {result.success
              ? "입장 완료"
              : result.status === "entered"
              ? "이미 입장한 티켓"
              : "입장 불가"}
          </h2>

          <p className="text-lg">
            {result.message}
          </p>

          {(result.customerName || result.reservationNumber) && (
            <div className="mt-6 border-t border-white/20 pt-5 space-y-3 text-left">
              {result.customerName && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-300">
                    예약자
                  </span>

                  <span className="font-bold">
                    {result.customerName}
                  </span>
                </div>
              )}

              {result.reservationNumber && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-300">
                    예약번호
                  </span>

                  <span className="font-bold text-right break-all">
                    {result.reservationNumber}
                  </span>
                </div>
              )}

              {result.seats && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-300">
                    좌석
                  </span>

                  <span className="font-bold text-right">
                    {result.seats.join(", ")}
                  </span>
                </div>
              )}

              {typeof result.quantity === "number" && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-300">
                    매수
                  </span>

                  <span className="font-bold">
                    {result.quantity}매
                  </span>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleScanAgain}
            className="mt-7 w-full bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-bold"
          >
            다음 QR 스캔
          </button>
        </div>
      )}

      <button
        onClick={() => router.push("/admin")}
        className="mt-8 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg"
      >
        ← 관리자 페이지
      </button>
    </main>
  );
}