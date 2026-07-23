type SeatProps = {
    seat: string;
    selected: boolean;
    reserved?: boolean;
    blocked?: boolean;
    disabled?: boolean;
    onClick: () => void;
  };
  
  export default function Seat({
    seat,
    selected,
    reserved = false,
    blocked = false,
    disabled = false,
    onClick,
  }: SeatProps) {
    const isDisabled = reserved || blocked || disabled;
  
    return (
      <button
        disabled={isDisabled}
        onClick={onClick}
        className={`
          flex
          items-center
          justify-center
  
          w-8
          h-8
  
          md:w-10
          md:h-10
  
          text-[10px]
          md:text-sm
  
          rounded
          font-semibold
  
          flex-shrink-0
          transition-all
  
          ${
            blocked
              ? "bg-red-600 text-white cursor-not-allowed"
              : disabled
              ? "bg-gray-500 text-white cursor-not-allowed"
              : reserved
              ? "bg-red-400 text-white cursor-not-allowed"
              : selected
              ? "bg-green-500 text-white"
              : "bg-gray-700 hover:bg-yellow-500"
          }
        `}
      >
        {blocked ? "X" : disabled ? "♿" : seat}
      </button>
    );
  }