"use client";

import HeroCarousel from "./HeroCarousel";

export default function Hero() {
  return (
    <section className="w-full bg-[#ff4106] pt-4 pb-10 md:pt-8 md:pb-16 lg:pt-12">
      {/* Carousel Container - Spans browser ends */}
      <div className="relative w-full">
        <HeroCarousel />
      </div>

      <div className="mx-auto w-full px-4 sm:px-6 md:px-12 lg:px-20">

        {/* CTA */}
        <div className="flex justify-center px-0 pt-4 sm:pt-6">
          <a
            href="https://whatsform.com/2eio7z"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#00843d] px-10 py-3 text-lg font-black uppercase tracking-[0.05em] text-white transition-all hover:bg-[#006b31] hover:scale-105 active:scale-95 shadow-xl sm:px-16 sm:text-xl"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            ENQUIRE NOW
          </a>
        </div>
      </div>
    </section>
  );
}
