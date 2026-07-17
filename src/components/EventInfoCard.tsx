import type { ReactNode } from "react";
import { EVENT } from "@/lib/event";

function InfoBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-8 text-center md:px-8">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
        {label}
      </p>
      {children}
    </div>
  );
}

export default function EventInfoCard() {
  return (
    <section
      className="px-6 py-24"
      aria-labelledby="event-info-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2 id="event-info-heading" className="sr-only">
          Event Details
        </h2>

        <div className="glass-card grid grid-cols-1 divide-y divide-white/10 rounded-2xl md:grid-cols-3 md:divide-x md:divide-y-0">
          <InfoBlock label="Event Date">
            <p className="text-2xl font-semibold md:text-3xl">{EVENT.date}</p>
            <p className="mt-2 text-text-muted">{EVENT.time}</p>
          </InfoBlock>

          <InfoBlock label="Event Location">
            <p className="text-2xl font-semibold md:text-3xl">
              Dokteuk Dance Academy
            </p>
            <p className="mt-2 text-text-muted">Main Hall, Seoul</p>
          </InfoBlock>

          <InfoBlock label="Remaining Seats">
            <p className="text-5xl font-semibold text-accent-gold md:text-6xl">
              {EVENT.remainingSeats}
            </p>
            <p className="mt-2 text-text-muted">
              of {EVENT.totalSeats} seats available
            </p>
          </InfoBlock>
        </div>
      </div>
    </section>
  );
}
