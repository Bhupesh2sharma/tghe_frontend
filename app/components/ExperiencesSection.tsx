"use client";

import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <article className="flex h-full w-full flex-col items-center overflow-hidden rounded-[48px] bg-white p-6 shadow-xl transition-transform hover:-translate-y-1 lg:rounded-[64px]">
      <div className="relative aspect-[16/11] w-full shrink-0 overflow-hidden rounded-[32px] bg-neutral-100">
        <Image
          src={image || PLACEHOLDER_IMAGE}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 340px"
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
    </article>
  );
}

const MOBILE_BREAKPOINT = 768;

export default function ExperiencesSection() {
  const { data: packagesResponse, isLoading } = useGetPackagesQuery();
  const packages = packagesResponse?.data ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const isPaused = useRef(false);
  const [cardsToShow, setCardsToShow] = useState(3);
  const total = packages.length;

  useEffect(() => {
    const updateCardsToShow = () => {
      setCardsToShow(window.innerWidth < MOBILE_BREAKPOINT ? 1 : 3);
    };
    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);
    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  // Clamp index when switching mobile ↔ desktop so we don't show empty slides
  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, Math.max(0, total - cardsToShow)));
  }, [cardsToShow, total]);
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < total - cardsToShow;

  const goNext = useCallback(() => {
    setDirection("right");
    setCurrentIndex((i) => {
      if (i >= total - cardsToShow) return 0;
      return i + 1;
    });
  }, [total, cardsToShow]);

  const goPrev = useCallback(() => {
    if (!canGoLeft) return;
    setDirection("left");
    setCurrentIndex((i) => i - 1);
  }, [canGoLeft]);

  // Auto-play
  useEffect(() => {
    if (total <= cardsToShow) return;
    const interval = setInterval(() => {
      if (!isPaused.current) goNext();
    }, 3500);
    return () => clearInterval(interval);
  }, [goNext, total, cardsToShow]);

  const visiblePackages = packages.slice(currentIndex, currentIndex + cardsToShow);

  if (isLoading) {
    return (
      <section className="relative w-full bg-[#ff4106] px-6 py-20 text-center">
        <p className="text-xl font-medium text-white/80 animate-pulse">Loading amazing experiences...</p>
      </section>
    );
  }

  if (packages.length === 0) return null;

  const slideVariants = {
    enter: (dir: "left" | "right") => ({
      x: dir === "right" ? 120 : -120,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.45, ease: "easeInOut" as const },
    },
    exit: (dir: "left" | "right") => ({
      x: dir === "right" ? -120 : 120,
      opacity: 0,
      transition: { duration: 0.35, ease: "easeInOut" as const },
    }),
  };

  return (
    <section className="relative w-full bg-[#ff4106] px-6 py-8 sm:px-12 sm:py-10 md:px-20 md:py-12 lg:px-24 overflow-x-hidden">
      <div className="mb-8 md:mb-10">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInVariants}
          className="text-center font-semibold tracking-tight text-white"
          style={{
            fontFamily: '"Lexend Deca", sans-serif',
            fontSize: "clamp(40px, 8vw, 92px)",
            lineHeight: "1"
          }}
        >
          Experiences.
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInVariants}
          className="mx-auto mt-6 max-w-xl text-center text-white/90"
          style={{
            fontFamily: '"Lexend Deca", sans-serif',
            fontSize: "clamp(15px, 2vw, 17px)",
            lineHeight: "1.7"
          }}
        >
          Handcrafted journeys through Sikkim and the Himalayas, built for every kind of traveller.
        </motion.p>
      </div>

      <div className="relative mx-auto max-w-[1100px]">
        {/* Left Arrow */}
        {total > cardsToShow && (
          <>
            <div className="absolute -left-6 top-1/2 z-30 -translate-y-1/2 md:-left-12 lg:-left-16">
              <button
                type="button"
                onClick={goPrev}
                disabled={!canGoLeft}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#00843d] shadow-xl backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-90 border border-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
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
                onClick={goNext}
                disabled={!canGoRight}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#00843d] shadow-xl backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-90 border border-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
                aria-label="Next"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </>
        )}

        {/* Cards */}
        <div
          className="overflow-hidden py-8"
          onMouseEnter={() => (isPaused.current = true)}
          onMouseLeave={() => (isPaused.current = false)}
        >
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={`grid gap-6 ${
                cardsToShow === 1
                  ? "grid-cols-1 max-w-[340px] mx-auto"
                  : total === 1
                    ? "grid-cols-1 max-w-[340px] mx-auto"
                    : total === 2
                      ? "grid-cols-2"
                      : "grid-cols-3"
              }`}
            >
              {visiblePackages.map((exp) => (
                <ExperienceCard
                  key={exp._id}
                  id={exp._id}
                  title={exp.title || exp.name}
                  duration={exp.duration || ""}
                  durationDescription={exp.durationDescription}
                  image={exp.images?.[0] || exp.image || PLACEHOLDER_IMAGE}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        {total > cardsToShow && (
          <div className="flex items-center justify-center gap-2 mt-2">
            {Array.from({ length: total - cardsToShow + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setDirection(i > currentIndex ? "right" : "left");
                  setCurrentIndex(i);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex
                  ? "w-8 bg-[#00843d]"
                  : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
