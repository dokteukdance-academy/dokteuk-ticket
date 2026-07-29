"use client";

import { useEffect, useRef } from "react";
import Seat from "./Seat";
import {
  seatBlocks,
  BLOCKED_SEATS,
  DISABLED_SEATS,
} from "@/lib/seat";

type Props = {
  selectedSeats: string[];
  pendingSeats: string[];
  confirmedSeats: string[];
  onSelect: (seat: string) => void;
};

export default function SeatMap({
  selectedSeats,
  pendingSeats,
  confirmedSeats,
  onSelect,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, []);

  const renderBlock = (block: string[][]) => (
    <div className="flex flex-shrink-0 flex-col gap-2">
      {block.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center gap-2"
        >
          {row.map((seat, index) => {
            if (seat === "") {
              return (
                <div
                  key={index}
                  className="h-10 w-10 flex-shrink-0"
                />
              );
            }

            return (
              <Seat
                key={seat}
                seat={seat}
                selected={selectedSeats.includes(seat)}
                pending={pendingSeats.includes(seat)}
                confirmed={confirmedSeats.includes(seat)}
                blocked={BLOCKED_SEATS.includes(seat)}
                disabled={DISABLED_SEATS.includes(seat)}
                onClick={() => onSelect(seat)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded bg-gray-700" />
          <span>선택 가능</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded bg-green-500" />
          <span>선택 좌석</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded border border-gray-300 bg-white" />
          <span>입금 확인 중</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded bg-red-600" />
          <span>예약 확정</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="
          overflow-x-auto
          overflow-y-visible
          touch-pan-x
          pb-6
          scrollbar-thin
        "
      >
        <div
          className="mx-auto"
          style={{
            width: "max-content",
            minWidth: "960px",
            padding: "0 20px",
          }}
        >
          <div
            className="
              mb-8
              flex
              h-10
              items-center
              justify-center
              rounded-lg
              bg-yellow-500
              text-lg
              font-bold
              text-black
            "
          >
            STAGE
          </div>

          <div className="flex justify-center gap-10">
            {renderBlock(seatBlocks.left)}
            {renderBlock(seatBlocks.center)}
            {renderBlock(seatBlocks.right)}
          </div>
        </div>
      </div>
    </div>
  );
}