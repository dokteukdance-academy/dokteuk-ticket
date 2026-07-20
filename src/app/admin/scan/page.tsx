"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";

export default function AdminScanPage() {
  const router = useRouter();

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");

    let started = false;

    html5QrCode
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250,
        },
        async (decodedText) => {
          console.log(decodedText);

          if (started) {
            await html5QrCode.stop();
            started = false;
          }

          router.push(
            `/admin/check?code=${encodeURIComponent(decodedText)}`
          );
        },
        () => {}
      )
      .then(() => {
        started = true;
      })
      .catch(console.error);

    return () => {
      if (started) {
        html5QrCode
          .stop()
          .then(() => html5QrCode.clear())
          .catch(() => {});
      }
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-10">
        📷 QR 스캔
      </h1>

      <div
        id="reader"
        className="w-[350px]"
      />

      <button
        onClick={() => router.push("/admin")}
        className="mt-10 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg"
      >
        ← 관리자 페이지
      </button>
    </main>
  );
}