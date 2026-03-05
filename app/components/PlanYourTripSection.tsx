"use client";

import { useState } from "react";
import { useCreateContactMutation } from "../../store/api";

export default function PlanYourTripSection() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(
    null
  );
  const [createContact, { isLoading }] = useCreateContactMutation();

  return (
    <section className="relative w-full bg-[#ff4106] px-6 py-20 sm:px-12 sm:py-28 md:px-20 md:py-32 lg:px-24">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="mb-16 text-center text-6xl font-black tracking-tight text-white sm:text-7xl md:mb-20 md:text-8xl lg:text-[100px]">
          Plan Your Trip.
        </h2>

        <div className="mx-auto max-w-4xl">
          <form
            className="overflow-hidden rounded-[40px] bg-white p-8 shadow-2xl sm:p-12 md:p-16"
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
              } catch (err: any) {
                const msg =
                  err?.data?.message ||
                  err?.error ||
                  "Unable to submit your enquiry. Please try again.";
                setStatusMessage(msg);
                setStatusType("error");
              }
            }}
          >
            <div className="flex flex-col gap-6 sm:gap-8">
              {/* Name field - Full Width */}
              <div>
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
              <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                <div>
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
                <div>
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
              <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                <div>
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
                <div>
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
              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Message"
                  className="w-full resize-none rounded-[32px] border-2 border-dashed border-neutral-200 bg-white px-8 py-6 text-lg text-neutral-700 placeholder-neutral-400 outline-none transition-all focus:border-[#00843d] focus:border-solid lg:text-xl"
                />
              </div>
            </div>

              <div className="mt-12 flex justify-center sm:mt-16">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex min-h-[60px] min-w-[240px] items-center justify-center rounded-full bg-[#00843d] px-12 py-4 text-xl font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-[#006b31] hover:scale-105 active:scale-95"
              >
                {isLoading ? "Submitting..." : "SUBMIT"}
              </button>
            </div>
            {statusMessage && (
              <p
                className={`mt-4 text-center text-sm font-medium ${
                  statusType === "success"
                    ? "text-[#00843d]"
                    : "text-red-600"
                }`}
              >
                {statusMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
