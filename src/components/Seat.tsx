type SeatProps = {
  seat: string;
  selected: boolean;
  pending?: boolean;
  confirmed?: boolean;
  blocked?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export default function Seat({
  seat,
  selected,
  pending = false,
  confirmed = false,
  blocked = false,
  disabled = false,
  onClick,
}: SeatProps) {
  const isDisabled =
    pending ||
    confirmed ||
    blocked ||
    disabled;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={`
        w-10
        h-10
        min-w-[40px]
        min-h-[40px]
        flex-shrink-0
        rounded
        border
        font-semibold
        transition

        ${
          blocked
            ? "border-gray-700 bg-gray-800 text-gray-400 cursor-not-allowed"
            : disabled
            ? "border-gray-500 bg-gray-500 text-white cursor-not-allowed"
            : confirmed
            ? "border-red-600 bg-red-600 text-white cursor-not-allowed"
            : pending
            ? "border-white bg-white text-black cursor-not-allowed"
            : selected
            ? "border-green-500 bg-green-500 text-white"
            : "border-gray-600 bg-gray-700 text-white hover:border-yellow-500 hover:bg-yellow-500 hover:text-black"
        }
      `}
    >
      {blocked ? "X" : disabled ? "♿" : seat}
    </button>
  );
}