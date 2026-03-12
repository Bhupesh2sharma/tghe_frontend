"use client";

import { motion } from "framer-motion";

const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
} as const;

export default function WeAreSection() {
  return (
    <section className="relative w-full bg-[#ff4106] px-6 py-8 sm:px-12 sm:py-10 md:px-20 md:py-12 lg:px-24">
      <div className="mx-auto max-w-[1400px]">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInVariants}
          className="mb-10 text-center font-semibold tracking-tight text-white md:mb-12"
          style={{
            fontFamily: '"Lexend Deca", sans-serif',
            fontSize: "clamp(40px, 8vw, 92px)",
            lineHeight: "1"
          }}
        >
          We Are.
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mx-auto flex max-w-5xl flex-col items-center space-y-8 text-center text-white/90 sm:space-y-10 md:space-y-12"
        >
          <motion.p variants={fadeInVariants} className="font-medium text-base leading-relaxed tracking-tight sm:text-[20px] sm:leading-[28px]" style={{ fontFamily: '"Lexend Deca", sans-serif' }}>
            We are The Great Himalayan Escape, your trusted travel partner for
            exploring the breathtaking beauty of Sikkim and the Himalayas.
            Dedicated to creating unforgettable journeys, we specialize in
            customized travel packages that cater to adventure enthusiasts,
            nature lovers, and cultural explorers alike.
          </motion.p>

          <motion.p variants={fadeInVariants} className="font-medium text-[20px] leading-[28px] tracking-tight">
            Our offerings range from serene retreats and thrilling treks to
            immersive cultural tours and family getaways, all tailored to provide
            authentic and memorable experiences. With a strong focus on
            sustainability, we aim to promote local communities and preserve the
            natural and cultural heritage of the region.
          </motion.p>

          <motion.p variants={fadeInVariants} className="font-medium text-[20px] leading-[28px] tracking-tight" >
            At The Great Himalayan Escape, we believe every journey should be
            unique and transformative. Whether it&apos;s uncovering hidden gems or
            experiencing the grandeur of the Himalayas, we ensure your escape is
            nothing short of extraordinary.
          </motion.p>

          <motion.p variants={fadeInVariants} className="font-medium text-[20px] leading-[28px] tracking-tight">
            Let us guide you on a journey where every moment is crafted to leave
            you inspired.
          </motion.p>
        </motion.div>

      </div>
    </section >
  );
}
