"use client";

import { useRouter } from "next/navigation";

type ConcertProps = {
  title: string;
  place: string;
  date: string;
  time: string;
};

export default function ConcertCard({
  title,
  place,
  date,
  time,
}: ConcertProps) {
  const router = useRouter();

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-lg">
      <h2 className="text-3xl font-bold text-white">{title}</h2>

      <div className="mt-4 space-y-2 text-gray-300">
        <p>📍 공연장 : {place}</p>
        <p>📅 날짜 : {date}</p>
        <p>🕖 시간 : {time}</p>
      </div>

      <button
        onClick={() => router.push("/reserve")}
        className="mt-6 rounded-lg bg-yellow-500 px-6 py-3 font-bold text-black hover:bg-yellow-400"
      >
        예매하기
      </button>
    </div>
  );
}