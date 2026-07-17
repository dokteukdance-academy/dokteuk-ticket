import Link from "next/link";

interface ReserveTicketButtonProps {
  className?: string;
  size?: "default" | "large";
}

export default function ReserveTicketButton({
  className = "",
  size = "default",
}: ReserveTicketButtonProps) {
  const sizeClasses =
    size === "large"
      ? "h-16 px-12 text-xl"
      : "h-14 px-10 text-lg";

  return (
    <Link
      href="/reserve"
      className={`inline-flex items-center justify-center rounded-full bg-white font-semibold text-black transition-all duration-300 hover:scale-[1.03] gold-glow focus-gold ${sizeClasses} ${className}`}
    >
      Reserve Ticket
    </Link>
  );
}
