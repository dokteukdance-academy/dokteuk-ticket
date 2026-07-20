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
  const renderBlock = (block: string[][]) => (
    <div className="flex flex-col gap-3 flex-shrink-0">
      {block.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
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
    <div className="w-full overflow-x-auto">
      <div
        className="mx-auto"
        style={{ width: "max-content", minWidth: "920px" }}
      >
        <div className="mb-8 h-8 rounded bg-yellow-500 flex items-center justify-center text-black font-bold">
          STAGE
        </div>

        <div className="flex gap-10">
          {renderBlock(seatBlocks.left)}
          {renderBlock(seatBlocks.center)}
          {renderBlock(seatBlocks.right)}
        </div>
      </div>
    </div>
  );
}