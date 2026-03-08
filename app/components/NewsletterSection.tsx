"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSubscribeNewsletterMutation } from "../../store/api";
import FormStatusOverlay from "./FormStatusOverlay";

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 }
  }
};

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showStatus, setShowStatus] = useState(false);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);
  const [subscribe, { isLoading }] = useSubscribeNewsletterMutation();

  return (
    <section className="w-full bg-[#ff4106] px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-6 md:px-12 md:pb-8 md:pt-6 lg:px-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ staggerChildren: 0.2 }}
        className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:justify-between md:gap-10"
      >
        <motion.div variants={fadeInVariants} className="text-center md:text-left">
          <p
            className="font-medium text-[16px] leading-[19px] text-white/90"
            style={{ fontFamily: "'Lexend Deca', sans-serif" }}
          >
            Get the latest news and offers
          </p>
          <h2
            className="mt-1 font-medium text-[30px] leading-[40px] text-white md:mt-2"
            style={{ fontFamily: "'Lexend Deca', sans-serif" }}
          >
            Subscribe to our newsletter
          </h2>
        </motion.div>

        <motion.form
          variants={fadeInVariants}
          className="flex w-full max-w-md overflow-hidden rounded-full shadow-md sm:max-w-lg"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              if (!email) return;
              const result = await subscribe({ email }).unwrap();
              const msg = `Subscribed with ${result.data.email}`;
              setSuccessMessage(msg);
              setStatusType("success");
              setShowStatus(true);
              setEmail("");
            } catch (err: any) {
              const msg =
                err?.data?.message ||
                err?.error ||
                "Unable to subscribe. Please try again.";
              setErrorMessage(msg);
              setStatusType("error");
              setShowStatus(true);
            }
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="min-w-0 flex-1 border-0 bg-white px-5 py-3.5 text-neutral-700 placeholder-neutral-500 outline-none focus:ring-0"
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="shrink-0 bg-[#1a5f2a] px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#145023] focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </motion.form>

        <FormStatusOverlay
          isOpen={showStatus}
          onClose={() => setShowStatus(false)}
          type={statusType}
          message={statusType === "success" ? successMessage : errorMessage}
        />
      </motion.div>
    </section>
  );
}
