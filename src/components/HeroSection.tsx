import { EVENT } from "@/lib/event";
import ReserveTicketButton from "./ReserveTicketButton";

export default function HeroSection() {
  const titleParts = EVENT.title.split("Summer Concert");
  const beforeAccent = titleParts[0];
  const hasAccent = titleParts.length > 1;

  return (
    <section
      className="hero-gradient relative flex min-h-screen flex-col items-center justify-center px-6"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-6xl text-center">
        <p className="animate-fade-in-up mb-6 text-xs font-medium uppercase tracking-[0.2em] text-text-muted md:text-sm">
          Dokteuk Dance Academy Presents
        </p>

        <h1
          id="hero-heading"
          className="animate-fade-in-up-delay-1 text-5xl font-semibold leading-[1.1] tracking-tight md:text-7xl lg:text-8xl"
        >
          {beforeAccent}
          {hasAccent && (
            <span className="gold-text-gradient">Summer Concert</span>
          )}
        </h1>

        <div className="animate-fade-in-up-delay-2 mx-auto mt-4 h-px w-24 bg-accent-gold md:mt-6" />

        <p className="animate-fade-in-up-delay-2 mx-auto mt-8 max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
          An evening of artistry, movement, and celebration. Secure your seat
          for an unforgettable performance.
        </p>

        <div className="animate-fade-in-up-delay-3 mt-12">
          <ReserveTicketButton size="large" />
        </div>
      </div>

      <div
        className="animate-bounce-subtle absolute bottom-10 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-text-muted"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
