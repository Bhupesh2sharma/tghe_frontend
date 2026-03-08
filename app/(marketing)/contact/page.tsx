"use client";

import { useState } from "react";
import Link from "next/link";
import { useCreateContactMutation } from "../../../store/api";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import NewsletterSection from "../../components/NewsletterSection";

const contactCards = [
  {
    title: "Our office",
    icon: MapPin,
    lines: [
      "The Great Himalayan Escape Deorali",
      "Girls School Road, Deorali, Gangtok -",
      "737101",
    ],
  },
  {
    title: "Call Us",
    icon: Phone,
    lines: ["+91-86706-98781", "+91-73785-34390"],
  },
  {
    title: "Mail Us",
    icon: Mail,
    lines: ["info@tghe.com"],
  },
  {
    title: "Social Media",
    icon: null,
    social: [
      { name: "Facebook", href: "https://www.facebook.com/people/The-Great-Himalayan-Escape/61560444660318/", Icon: Facebook },
      { name: "Instagram", href: "https://www.instagram.com/thegreathimalayanescape/", Icon: Instagram },
      { name: "LinkedIn", href: "https://www.linkedin.com/in/the-great-himalayan-escape-521ab1311/", Icon: Linkedin },
      { name: "YouTube", href: "https://www.youtube.com/@thegreathimalayanescape", Icon: Youtube },
    ],
  },
];

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [createContact, { isLoading }] = useCreateContactMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("idle");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const mobile = String(formData.get("mobile") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    if (!name || !mobile) {
      setStatus("error");
      return;
    }
    try {
      await createContact({
        name,
        phone: mobile,
        email: email || undefined,
        message: message || undefined,
      }).unwrap();
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#ff4106] pt-24 pb-20 sm:pt-28 md:pt-32">
      <div className="px-6 sm:px-10 md:px-16 lg:px-24">
        <div className="mx-auto max-w-5xl">
          {/* Breadcrumb / back */}
          <div className="mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white"
            >
              <span>←</span> Home
            </Link>
          </div>

          {/* Four contact cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl bg-white p-6 shadow-lg"
              >
                <p className="text-sm font-bold uppercase tracking-wider text-[#ff4106]">
                  {card.title}
                </p>
                {card.social ? (
                  <div className="mt-4 flex flex-nowrap items-center gap-4">
                    {card.social.map(({ name, href, Icon }) => (
                      <a
                        key={name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4106]/15 text-[#ff4106] transition hover:bg-[#ff4106] hover:text-white"
                        aria-label={name}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 space-y-1 text-sm font-medium text-gray-800">
                    {card.lines?.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Leave a message heading */}
          <h1 className="mt-16 text-center text-4xl font-black tracking-tight text-white sm:text-5xl md:mt-20 md:text-6xl">
            Leave a message.
          </h1>

          {/* Contact form */}
          <div className="mx-auto mt-10 max-w-2xl rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="contact-name" className="mb-1 block text-sm font-semibold text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#ff4106]"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1 block text-sm font-semibold text-gray-700">
                  Email address (Optional)
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#ff4106]"
                />
              </div>
              <div>
                <label htmlFor="contact-mobile" className="mb-1 block text-sm font-semibold text-gray-700">
                  Mobile number <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-mobile"
                  name="mobile"
                  type="tel"
                  required
                  placeholder="Your mobile number"
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#ff4106]"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1 block text-sm font-semibold text-gray-700">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Your message"
                  className="w-full resize-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#ff4106]"
                />
              </div>
              {status === "success" && (
                <p className="text-sm font-medium text-[#00843d]">
                  Thank you. We&apos;ll get back to you soon.
                </p>
              )}
              {status === "error" && (
                <p className="text-sm font-medium text-red-600">
                  Please check required fields and try again.
                </p>
              )}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-[180px] rounded-xl bg-[#ff4106] px-8 py-4 text-base font-bold uppercase tracking-wide text-white shadow-lg transition hover:bg-[#e63906] disabled:opacity-70"
                >
                  {isLoading ? "Sending…" : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Find Us - Map section */}
      <section className="bg-[#ff4106] px-6 py-16 sm:px-10 md:px-16 lg:px-24 lg:py-20" id="find-us">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            Find Us.
          </h2>
          <div className="mt-10 overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl">
            <div className="relative aspect-[16/10] w-full bg-gray-200 sm:aspect-[2/1]">
              <iframe
                title="Find us on the map - The Great Himalayan Escape, Deorali, Gangtok"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d65369183.36050215!2d1e-7!3d1e-7!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6a77eedaadbf5fe1%3A0xdf5107108943a317!2sThe%20Great%20Himalayan%20Escape!5e0!3m2!1sen!2sin!4v1772811573981!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 left-0 top-0 h-full w-full"
              />
            </div>
            <div className="flex justify-end border-t border-white/10 bg-white/5 px-4 py-3">
              <a
                href="https://www.google.com/maps/search/Girls+School+Road+Deorali+Gangtok+Sikkim+737101"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
              >
                Open in Maps
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSection />

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-lg transition hover:scale-110 hover:shadow-xl"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </main>
  );
}
