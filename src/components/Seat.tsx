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
  h-10 
  w-10 
  min-w-10 
  flex-shrink-0 
  rounded 
  font-semibold 
  transition
  
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