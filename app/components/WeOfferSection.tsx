"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
} as const;

const services = [
  { label: "transport", img: "/img/1.png" },
  { label: "sight seeing", img: "/img/2.png" },
  { label: "accomodation", img: "/img/3.png" },
  { label: "travel guide", img: "/img/4.png" },
  { label: "adventures", img: "/img/5.png" },
  { label: "permits", img: "/img/6.png" },
];

export default function WeOfferSection() {
  return (
    <section className="relative w-full bg-[#ff4106] px-6 py-8 sm:px-12 sm:py-10 md:px-20 md:py-12 lg:px-24">
      <div className="mx-auto max-w-[1400px]">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInVariants}
          className="mb-14 text-center font-semibold tracking-tight text-white md:mb-16"
          style={{
            fontFamily: '"Lexend Deca", sans-serif',
            fontSize: "clamp(40px, 8vw, 92px)",
            lineHeight: "1"
          }}
        >
          We offer.
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.1 }}
          className="mx-auto grid w-full max-w-6xl grid-cols-3 gap-6 sm:flex sm:items-center sm:justify-between sm:gap-4 md:gap-6"
        >
          {services.map(({ label, img }) => (
            <motion.div
              key={label}
              variants={fadeInVariants}
              className="group flex flex-1 flex-col items-center text-center transition-transform hover:scale-105"
            >
              <div className="relative h-14 w-14 shrink-0 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-32 lg:w-32">
                <Image
                  src={img}
                  alt={label}
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative line at the bottom */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
          className="mx-auto mt-10 h-[1.5px] w-full bg-white/30 md:mt-12 origin-center"
        />
      </div>
    </section>
  );
}
