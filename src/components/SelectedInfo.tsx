type Props = {
    selectedSeats: string[];
  };
  
  export default function SelectedInfo({
    selectedSeats,
  }: Props) {
    const totalPrice = selectedSeats.length * 25000;
  
    return (
      <div className="mt-10 rounded-xl bg-gray-900 border border-gray-700 p-6 w-96 space-y-4">
  
        <div className="flex justify-between">
          <span>선택 좌석</span>
  
          <span className="text-yellow-400 font-bold">
            {selectedSeats.length
              ? selectedSeats.join(", ")
              : "-"}
          </span>
        </div>
  
        <div className="flex justify-between">
          <span>매수</span>
  
          <span>{selectedSeats.length}매</span>
        </div>
  
        <div className="flex justify-between">
          <span>총 금액</span>
  
          <span className="font-bold">
            ₩{totalPrice.toLocaleString()}
          </span>
        </div>
  
      </div>
    );
  }