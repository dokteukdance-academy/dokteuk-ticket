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
  reservedSeats: string[];
  onSelect: (seat: string) => void;
};

export default function SeatMap({
  selectedSeats,
  reservedSeats,
  onSelect,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, []);

  const renderBlock = (block: string[][]) => (
    <div className="flex flex-col gap-3 flex-shrink-0">
      {block.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-2 justify-center"
        >
          {row.map((seat, index) => {
            if (seat === "") {
              return (
                <div
                  key={index}
                  className="w-10 h-10 flex-shrink-0"
                />
              );
            }

            return (
              <Seat
                key={seat}
                seat={seat}
                selected={selectedSeats.includes(seat)}
                reserved={reservedSeats.includes(seat)}
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
    <div
      ref={scrollRef}
      className="w-full overflow-x-auto overflow-y-hidden touch-pan-x"
    >
      <div className="flex justify-center">
        <div
          className="flex flex-col items-center py-4"
          style={{
            minWidth: "960px",
          }}
        >
          <div className="w-full mb-8">
            <div className="h-8 rounded bg-yellow-500 flex items-center justify-center text-black font-bold">
              STAGE
            </div>
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