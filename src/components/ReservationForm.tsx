type Props = {
    name: string;
    phone: string;
    setName: (value: string) => void;
    setPhone: (value: string) => void;
  };
  
  export default function ReservationForm({
    name,
    phone,
    setName,
    setPhone,
  }: Props) {
    return (
      <div className="flex flex-col gap-4 mb-8 w-96">
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 rounded bg-gray-800 text-white"
        />
  
        <input
          type="text"
          placeholder="전화번호"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="p-3 rounded bg-gray-800 text-white"
        />
      </div>
    );
  }