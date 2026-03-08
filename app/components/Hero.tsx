"use client";

import { motion } from "framer-motion";
import HeroCarousel from "./HeroCarousel";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full bg-[#ff4106] pt-4 pb-8 sm:pt-8 sm:pb-10 md:pt-12 md:pb-12 lg:pt-12 lg:pb-12"
    >
      {/* Carousel Container - Spans browser ends */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative w-full"
      >
        <HeroCarousel />
      </motion.div>

      <div className="mx-auto w-full px-4 sm:px-6 md:px-12 lg:px-20">

        {/* CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex justify-center px-0 pt-4 sm:pt-6"
        >
          <a
            href="https://whatsform.com/2eio7z"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[50px] min-w-[200px] items-center justify-center rounded-full bg-[#00843d] px-8 py-3 text-lg font-semibold uppercase leading-7 tracking-widest text-white shadow-xl transition-all hover:bg-[#006b31] hover:scale-105 active:scale-95 sm:text-[22px] sm:leading-[33px]"
          >
            ENQUIRE NOW
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
}
