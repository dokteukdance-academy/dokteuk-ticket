"use client";

export default function FailPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold text-red-500">
        ❌ 결제가 취소되었거나 실패했습니다.
      </h1>
    </main>
  );
}