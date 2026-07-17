import HeroSection from "@/components/HeroSection";
import EventInfoCard from "@/components/EventInfoCard";
import Footer from "@/components/Footer";
import ConcertCard from "@/components/ConcertCard";
import { concerts } from "@/lib/concert";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <HeroSection />

      <EventInfoCard />

      <section className="px-6 pb-10">
        <div className="mx-auto flex max-w-5xl justify-end gap-4">

          <Link
            href="/admin"
            className="rounded-lg bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-500 transition"
          >
            관리자
          </Link>

          <Link
            href="/reserve"
            className="rounded-lg bg-yellow-500 px-6 py-3 font-bold text-black hover:bg-yellow-400 transition"
          >
            예매하기
          </Link>

        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl space-y-8">
          {concerts.map((concert) => (
            <ConcertCard
              key={concert.id}
              title={concert.title}
              place={concert.place}
              date={concert.date}
              time={concert.time}
            />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}