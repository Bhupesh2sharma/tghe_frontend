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

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
} as const;

const services = [
  { label: "Transport", img: "/img/1.png" },
  { label: "Sight Seeing", img: "/img/2.png" },
  { label: "Accommodation", img: "/img/3.png" },
  { label: "Travel Guide", img: "/img/4.png" },
  { label: "Adventures", img: "/img/5.png" },
  { label: "Permits", img: "/img/6.png" },
];

export default function WeOfferSection() {
  return (
    <section className="relative w-full bg-[#ff4106] px-6 py-16 sm:px-12 sm:py-20 md:px-20 md:py-24 lg:px-24 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#00843d]/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#00843d]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInVariants}
          className="mb-16 text-center md:mb-20"
        >
          <h2
            className="font-semibold tracking-tight text-white"
            style={{
              fontFamily: '"Lexend Deca", sans-serif',
              fontSize: "clamp(40px, 8vw, 92px)",
              lineHeight: "1",
            }}
          >
            We offer.
          </h2>
          <p
            className="mx-auto mt-6 max-w-xl text-white/90"
            style={{
              fontFamily: '"Lexend Deca", sans-serif',
              fontSize: "clamp(15px, 2vw, 17px)",
              lineHeight: "1.7",
            }}
          >
            Everything you need for an extraordinary Himalayan experience.
          </p>
        </motion.div>

        {/* Service Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.08 }}
          className="grid grid-cols-3 gap-4 sm:grid-cols-6 sm:gap-6 md:gap-8"
        >
          {services.map(({ label, img }) => (
            <motion.div
              key={label}
              variants={cardVariants}
              className="group flex flex-col items-center justify-center"
            >
              <div className="relative h-14 w-14 transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24">
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

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
          className="mx-auto mt-16 h-px w-full max-w-3xl bg-slate-200 dark:bg-slate-700 origin-center"
        />
      </div>
    </section>
  );
}
