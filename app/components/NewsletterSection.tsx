"use client";

import { useState } from "react";
import { useSubscribeNewsletterMutation } from "../../store/api";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [subscribe, { isLoading }] = useSubscribeNewsletterMutation();

  return (
    <section className="w-full bg-[#ff4106] px-4 py-12 sm:px-6 sm:py-14 md:px-12 md:py-16 lg:px-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row md:justify-between md:gap-10">
        <div className="text-center md:text-left">
          <p className="text-sm font-medium text-white/90 sm:text-base">
            Get the latest news and offers
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl md:mt-2">
            Subscribe to our newsletter
          </h2>
        </div>

        <form
          className="flex w-full max-w-md overflow-hidden rounded-full shadow-md sm:max-w-lg"
          onSubmit={async (e) => {
            e.preventDefault();
            setSuccessMessage(null);
            setErrorMessage(null);
            try {
              if (!email) return;
              const result = await subscribe({ email }).unwrap();
              setSuccessMessage(`Subscribed with ${result.data.email}`);
              setEmail("");
            } catch (err: any) {
              const msg =
                err?.data?.message ||
                err?.error ||
                "Unable to subscribe. Please try again.";
              setErrorMessage(msg);
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
        </form>

        {successMessage && (
          <p className="mt-3 text-sm font-medium text-white/90">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="mt-3 text-sm font-medium text-yellow-100">
            {errorMessage}
          </p>
        )}
      </div>
    </section>
  );
}
