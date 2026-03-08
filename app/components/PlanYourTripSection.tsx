"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCreateContactMutation } from "../../store/api";
import FormStatusOverlay from "./FormStatusOverlay";

const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const }
  }
} as const;

export default function PlanYourTripSection() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(
    null
  );
  const [showStatus, setShowStatus] = useState(false);
  const [createContact, { isLoading }] = useCreateContactMutation();

  return (
    <section className="relative w-full bg-[#ff4106] px-6 py-8 sm:px-12 sm:py-10 md:px-20 md:py-12 lg:px-24">
      <div className="mx-auto max-w-[1400px]">
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
          Plan Your Trip.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-6xl"
        >
          <form
            className="overflow-hidden rounded-[40px] bg-white px-6 py-8 shadow-2xl sm:px-12 sm:py-10 md:px-16 md:py-12"
            onSubmit={async (e) => {
              e.preventDefault();
              setStatusMessage(null);
              setStatusType(null);

              const form = e.currentTarget;
              const formData = new FormData(form);

              const name = String(formData.get("name") ?? "").trim();
              const email = String(formData.get("email") ?? "").trim();
              const mobile = String(formData.get("mobile") ?? "").trim();
              const adultsRaw = String(formData.get("adults") ?? "").trim();
              const childrenRaw = String(formData.get("children") ?? "").trim();
              const message = String(formData.get("message") ?? "").trim() || undefined;

              if (!name || !email || !mobile) {
                setStatusMessage("Name, email, and mobile are required.");
                setStatusType("error");
                return;
              }

              const noOfAdults =
                adultsRaw !== "" && !Number.isNaN(Number(adultsRaw))
                  ? Number(adultsRaw)
                  : undefined;
              const noOfChildren =
                childrenRaw !== "" && !Number.isNaN(Number(childrenRaw))
                  ? Number(childrenRaw)
                  : undefined;

              try {
                await createContact({
                  name,
                  email,
                  phone: mobile,
                  message,
                  noOfAdults,
                  noOfChildren,
                }).unwrap();

                form.reset();
                setStatusMessage("Your enquiry has been submitted. We will contact you soon.");
                setStatusType("success");
                setShowStatus(true);
              } catch (err: any) {
                const msg =
                  err?.data?.message ||
                  err?.error ||
                  "Unable to submit your enquiry. Please try again.";
                setStatusMessage(msg);
                setStatusType("error");
                setShowStatus(true);
              }
            }}
          >
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Name field - Full Width */}
              <div className="overflow-hidden">
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Name*"
                  className="w-full rounded-full border-2 border-dashed border-neutral-200 bg-white px-8 py-4 text-lg text-neutral-700 placeholder-neutral-400 outline-none transition-all focus:border-[#00843d] focus:border-solid lg:text-xl"
                />
              </div>

              {/* Email & Mobile - 2 Columns */}
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div className="overflow-hidden">
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Email address*"
                    className="w-full rounded-full border-2 border-dashed border-neutral-200 bg-white px-8 py-4 text-lg text-neutral-700 placeholder-neutral-400 outline-none transition-all focus:border-[#00843d] focus:border-solid lg:text-xl"
                  />
                </div>
                <div className="overflow-hidden">
                  <label htmlFor="mobile" className="sr-only">Mobile number</label>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    required
                    placeholder="Mobile number*"
                    className="w-full rounded-full border-2 border-dashed border-neutral-200 bg-white px-8 py-4 text-lg text-neutral-700 placeholder-neutral-400 outline-none transition-all focus:border-[#00843d] focus:border-solid lg:text-xl"
                  />
                </div>
              </div>

              {/* Adults & Children - 2 Columns */}
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div className="overflow-hidden">
                  <label htmlFor="adults" className="sr-only">Number of adults</label>
                  <input
                    id="adults"
                    name="adults"
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="No of Adults*"
                    className="w-full rounded-full border-2 border-dashed border-neutral-200 bg-white px-8 py-4 text-lg text-neutral-700 placeholder-neutral-400 outline-none transition-all focus:border-[#00843d] focus:border-solid lg:text-xl"
                  />
                </div>
                <div className="overflow-hidden">
                  <label htmlFor="children" className="sr-only">Number of children</label>
                  <input
                    id="children"
                    name="children"
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="No of Children*"
                    className="w-full rounded-full border-2 border-dashed border-neutral-200 bg-white px-8 py-4 text-lg text-neutral-700 placeholder-neutral-400 outline-none transition-all focus:border-[#00843d] focus:border-solid lg:text-xl"
                  />
                </div>
              </div>

              {/* Message field - Full Width */}
              <div className="overflow-hidden">
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="Message"
                  className="w-full resize-none rounded-[32px] border-2 border-dashed border-neutral-200 bg-white px-8 py-6 text-lg text-neutral-700 placeholder-neutral-400 outline-none transition-all focus:border-[#00843d] focus:border-solid lg:text-xl"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-center sm:mt-10">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex min-h-[50px] min-w-[200px] items-center justify-center rounded-full bg-[#00843d] px-8 py-3 text-lg font-semibold uppercase leading-7 tracking-widest text-white shadow-xl transition-all hover:bg-[#006b31] hover:scale-105 active:scale-95 sm:text-[22px] sm:leading-[33px]"
              >
                {isLoading ? "Submitting..." : "SUBMIT"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      <FormStatusOverlay
        isOpen={showStatus}
        onClose={() => setShowStatus(false)}
        type={statusType}
        message={statusMessage}
      />
    </section>
  );
}
