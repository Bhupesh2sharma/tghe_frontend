"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useGetPackagesQuery } from "../../store/api";
import Link from "next/link";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1544735716-e421e4284f1b?auto=format&fit=crop&q=80&w=800";

const fadeInVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
} as const;

function ExperienceCard({
  id,
  title,
  duration,
  durationDescription,
  image,
}: {
  id: string;
  title: string;
  duration: string;
  durationDescription?: string;
  image: string;
}) {
  return (
    <motion.article
      variants={fadeInVariants}
      className="flex h-full w-[290px] min-w-[290px] max-w-[290px] shrink-0 flex-col items-center overflow-hidden rounded-[48px] bg-white p-6 shadow-xl transition-transform hover:-translate-y-1 sm:w-[320px] sm:min-w-[320px] sm:max-w-[320px] lg:w-[340px] lg:min-w-[340px] lg:max-w-[340px] lg:rounded-[64px]"
    >
      <div className="relative aspect-[16/11] w-full shrink-0 overflow-hidden rounded-[32px] bg-neutral-100">
        <Image
          src={image || PLACEHOLDER_IMAGE}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 290px, (max-width: 1024px) 320px, 340px"
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-between gap-6 py-8">
        <div className="flex flex-col items-center gap-4">
          <h3 className="line-clamp-2 min-h-[50px] text-center text-xl font-bold uppercase leading-[1.1] tracking-tight text-[#00843d] md:min-h-[72px] md:text-3xl" style={{ fontFamily: '"Lexend Deca", sans-serif' }}>
            {title}
          </h3>
          <p className="text-center text-lg font-semibold text-[#00843d] md:text-xl">
            {duration}
          </p>
          {durationDescription && (
            <p className="text-center text-sm font-medium text-[#00843d]/80 -mt-2">
              {durationDescription}
            </p>
          )}
        </div>

        <Link
          href={`/experiences/${id}`}
          className="inline-flex min-h-[50px] min-w-[200px] items-center justify-center rounded-full bg-[#00843d] px-8 py-3 text-lg font-semibold uppercase leading-7 tracking-widest text-white transition-all hover:bg-[#006b31] hover:shadow-lg active:scale-95 sm:text-[22px] sm:leading-[33px]"
        >
          DETAILS
        </Link>
      </div>
    </motion.article>
  );
}

export default function ExperiencesSection() {
  const { data: packagesResponse, isLoading } = useGetPackagesQuery();
  const packages = packagesResponse?.data ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);

  // Only duplicate for seamless loop if we have enough items (e.g. > 3)
  // This prevents the carousel from looking "fake" when there are only 1 or 2 items
  const shouldLoop = packages.length >= 4;
  const allExperiences = shouldLoop ? [...packages, ...packages] : packages;

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || allExperiences.length === 0 || !shouldLoop) return;

    let animationFrameId: number;
    const scrollSpeed = 0.5; // Pixels per frame

    const scroll = () => {
      if (!isPaused.current) {
        scrollContainer.scrollLeft += scrollSpeed;

        // Reset scroll position for seamless loop
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [shouldLoop, packages]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = 320 + 32; // card width (avg) + gap
    scrollRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <section className="relative w-full bg-[#ff4106] px-6 py-20 text-center">
        <p className="text-xl font-medium text-white/80 animate-pulse">Loading amazing experiences...</p>
      </section>
    );
  }

  if (packages.length === 0) return null;

  return (
    <section className="relative w-full bg-[#ff4106] px-6 py-8 sm:px-12 sm:py-10 md:px-20 md:py-12 lg:px-24">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInVariants}
        className="mb-16 text-center font-semibold tracking-tight text-white md:mb-20"
        style={{
          fontFamily: '"Lexend Deca", sans-serif',
          fontSize: "clamp(40px, 8vw, 92px)",
          lineHeight: "1"
        }}
      >
        Experiences.
      </motion.h2>

      <div className="relative mx-auto max-w-[1100px]">
        {/* Navigation Controls - only show if shouldLoop is active or there are enough items */}
        {(shouldLoop || packages.length > 3) && (
          <>
            <div className="absolute -left-6 top-1/2 z-30 -translate-y-1/2 md:-left-12 lg:-left-16">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-[#ff4106] shadow-xl backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-90"
                aria-label="Previous"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            </div>

            <div className="absolute -right-6 top-1/2 z-30 -translate-y-1/2 md:-right-12 lg:-right-16">
              <button
                type="button"
                onClick={() => handleScroll("right")}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-[#ff4106] shadow-xl backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-90"
                aria-label="Next"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </>
        )}

        {/* Cards Container */}
        <div
          ref={scrollRef}
          onMouseEnter={() => (isPaused.current = true)}
          onMouseLeave={() => (isPaused.current = false)}
          className={`hide-scrollbar flex ${packages.length < 3 ? 'justify-center' : ''} gap-8 overflow-x-auto scroll-smooth px-4 py-8`}
          style={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          {allExperiences.map((exp, idx) => (
            <div
              key={`${exp._id}-${idx}`}
              className="shrink-0"
            >
              <ExperienceCard
                id={exp._id}
                title={exp.title || exp.name}
                duration={exp.duration || ""}
                durationDescription={exp.durationDescription}
                image={exp.images?.[0] || exp.image || PLACEHOLDER_IMAGE}
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
