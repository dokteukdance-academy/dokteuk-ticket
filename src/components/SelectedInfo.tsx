type Props = {
    selectedSeat: string;
    grade: string;
    price: number;
  };
  
  export default function SelectedInfo({
    selectedSeat,
    grade,
    price,
  }: Props) {
    return (
      <div className="mt-10 rounded-xl bg-gray-900 border border-gray-700 p-6 w-96 space-y-4">
  
        <div className="flex justify-between">
          <span>선택 좌석</span>
          <span className="text-yellow-400 font-bold">
            {selectedSeat || "-"}
          </span>
        </div>
  

  
        <div className="flex justify-between">
  <span>가격</span>
  <span className="font-bold">
    ₩25,000
  </span>
</div>
  
      </div>
    );
  }