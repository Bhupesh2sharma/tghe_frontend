"use client";

import Image from "next/image";
import { useRef } from "react";

const experiences = [
  {
    id: 1,
    title: "HIMALAYAN DELIGHT",
    duration: "6 Days / 5 Nights",
    image: "/experiences/himalayan-delight.jpg",
  },
  {
    id: 2,
    title: "HIMALAYAN BLISS",
    duration: "6 Days / 5 Nights",
    image: "/experiences/himalayan-bliss.jpg",
  },
  {
    id: 3,
    title: "HIMALAYAN ESCAPADE",
    duration: "7 Days / 6 Nights",
    image: "/experiences/himalayan-escapade.jpg",
  },
];

function ExperienceCard({
  title,
  duration,
  image,
}: {
  title: string;
  duration: string;
  image: string;
}) {
  return (
    <article className="flex w-[300px] shrink-0 flex-col items-center overflow-hidden rounded-[40px] bg-white p-6 shadow-xl transition-transform hover:-translate-y-1 sm:w-[340px] md:w-[380px] lg:w-[400px]">
      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[32px] bg-neutral-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 300px, (max-width: 1024px) 380px, 400px"
        />
      </div>

      <div className="flex flex-col items-center gap-4 py-8">
        <h3 className="text-center text-2xl font-black uppercase leading-tight tracking-tight text-[#00843d] md:text-3xl">
          {title}
        </h3>
        <p className="text-lg font-bold text-[#00843d] md:text-xl">
          {duration}
        </p>

        <a
          href="#details"
          className="mt-4 inline-flex min-h-[56px] min-w-[180px] items-center justify-center rounded-full bg-[#00843d] px-10 py-3 text-xl font-black uppercase tracking-wider text-white transition-all hover:bg-[#006b31] hover:shadow-lg active:scale-95"
        >
          DETAILS
        </a>
      </div>
    </article>
  );
}

export default function ExperiencesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.offsetWidth / 3;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative w-full bg-[#ff4106] px-6 py-20 sm:px-12 sm:py-28 md:px-20 md:py-32 lg:px-24">
      <h2 className="mb-16 text-center text-6xl font-black tracking-tight text-white sm:text-7xl md:mb-20 md:text-8xl lg:text-9xl">
        Experiences.
      </h2>

      <div className="relative mx-auto max-w-[1400px]">
        {/* Navigation Controls */}
        <div className="absolute -left-4 top-1/2 z-20 -translate-y-1/2 md:-left-8 lg:-left-12">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-[#ff4106] shadow-xl backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-90"
            aria-label="Previous"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        <div className="absolute -right-4 top-1/2 z-20 -translate-y-1/2 md:-right-8 lg:-right-12">
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-[#ff4106] shadow-xl backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-90"
            aria-label="Next"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Cards Container */}
        <div
          ref={scrollRef}
          className="hide-scrollbar flex gap-8 overflow-x-auto scroll-smooth px-4 py-8"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="shrink-0 scroll-snap-start"
              style={{ scrollSnapAlign: "center" }}
            >
              <ExperienceCard
                title={exp.title}
                duration={exp.duration}
                image={exp.image}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
