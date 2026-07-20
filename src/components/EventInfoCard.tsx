import type { ReactNode } from "react";

type Concert = {
  venue: string;
  date: string;
  time: string;
  totalSeats: number;
  remainingSeats: number;
};

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

export default function EventInfoCard({
  concert,
}: {
  concert: Concert;
}) {
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
            <p className="text-2xl font-semibold md:text-3xl">
              {concert.date}
            </p>
            <p className="mt-2 text-text-muted">
              {concert.time}
            </p>
          </InfoBlock>

          <InfoBlock label="Event Location">
            <p className="text-2xl font-semibold md:text-3xl">
              {concert.venue}
            </p>
            <p className="mt-2 text-text-muted">
              대전서구문화원 6층 공연장
            </p>
          </InfoBlock>

          <InfoBlock label="Remaining Seats">
            <p className="text-5xl font-semibold text-accent-gold md:text-6xl">
              {concert.remainingSeats}
            </p>
            <p className="mt-2 text-text-muted">
              총 {concert.totalSeats}석
            </p>
          </InfoBlock>
        </div>
      </div>
    </section>
  );
}