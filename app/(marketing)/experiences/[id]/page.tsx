"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock3,
  Bus,
  BedDouble,
  Coffee,
  ChevronDown,
} from "lucide-react";
import { useCreateEnquiryMutation } from "../../../../store/api";

const itineraryDays: Record<string, { title: string; body?: string }[]> = {
  "1": [
    { title: "Day 1: ARRIVAL IN GANGTOK", body: "Arrive at Bagdogra/NJP. Transfer to Gangtok. Check in at hotel. Rest of the day at leisure." },
    { title: "Day 2: GANGTOK - CHANGU LAKE - BABA MANDIR (Nathula Optional)", body: "Excursion to Tsomgo Lake and Baba Mandir. Optional visit to Nathula Pass (subject to permit)." },
    { title: "Day 3: GANGTOK FULL DAY SIGHTSEEING", body: "Visit Ganesh Tok, Hanuman Tok, Tashi Viewpoint, Rumtek Monastery, and other highlights." },
    { title: "Day 4: GANGTOK - DARJEELING", body: "Drive to Darjeeling. En route visit tea gardens. Check in at hotel. Evening at leisure." },
    { title: "Day 5: DARJEELING SIGHTSEEING", body: "Early morning visit to Tiger Hill for sunrise and Mt. Kanchenjunga view. Batasia Loop, Peace Pagoda, Himalayan Mountaineering Institute." },
    { title: "Day 6: DEPARTURE", body: "Transfer to Bagdogra/NJP for onward journey." },
  ],
  "2": [
    { title: "Day 1: ARRIVAL IN GANGTOK", body: "Arrive and transfer to Gangtok. Check in. Rest at leisure." },
    { title: "Day 2: GANGTOK LOCAL SIGHTSEEING", body: "Full day exploring Gangtok attractions." },
    { title: "Day 3: GANGTOK - LACHUNG", body: "Drive to Lachung. En route stop at viewpoints. Overnight at Lachung." },
    { title: "Day 4: LACHUNG - YUMTHANG - GANGTOK", body: "Visit Yumthang Valley. Return to Gangtok." },
    { title: "Day 5: DEPARTURE", body: "Transfer to airport/railway." },
  ],
  "3": [
    { title: "Day 1: ARRIVAL IN GANGTOK", body: "Arrive and transfer. Check in. Rest." },
    { title: "Day 2–3: GANGTOK & EXCURSIONS", body: "Local sightseeing and optional day trips." },
    { title: "Day 4: LACHEN", body: "Drive to Lachen. Overnight." },
    { title: "Day 5: LACHUNG & YUMTHANG", body: "Explore Lachung and Yumthang Valley." },
    { title: "Day 6–7: PELLING", body: "Transfer to Pelling. Sightseeing." },
    { title: "Day 8: DEPARTURE", body: "Transfer to exit point." },
  ],
};

const highlightsText: Record<string, string> = {
  "1": "This 5-day Gangtok and Darjeeling Retreat package takes you through the heart of Sikkim and the Queen of the Hills. Explore Gangtok, Tsomgo Lake, Baba Mandir, and Nathula Pass (optional), then head to Darjeeling for stunning views of Mt. Kanchenjunga and Tiger Hill. The package includes comfortable accommodations, seamless transfers, and captivating sightseeing tours.",
  "2": "Discover Sikkim with a blend of Gangtok and the high-altitude beauty of Lachung and Yumthang Valley. Comfortable stays, scenic drives, and key sightseeing included.",
  "3": "An extended journey covering Gangtok, Lachen, Lachung, and Pelling. Experience diverse landscapes, monasteries, and mountain views with hassle-free transport and accommodation.",
};

const experiences = [
  {
    id: "1",
    title: "HIMALAYAN DELIGHT",
    location: "Sikkim - Darjeeling",
    duration: "6 Days / 5 Nights",
    itinerary: "Gangtok 3N + Darjeeling 2N",
    image:
      "https://images.unsplash.com/photo-1584351583369-6baf055b51a7?auto=format&fit=crop&q=80&w=1200",
    heroCaption: "Sevok Road - Siliguri",
  },
  {
    id: "2",
    title: "HIMALAYAN BLISS",
    location: "Sikkim",
    duration: "6 Days / 5 Nights",
    itinerary: "Gangtok 4N + Lachung 1N",
    image:
      "https://images.unsplash.com/photo-1544735716-e421e4284f1b?auto=format&fit=crop&q=80&w=1200",
    heroCaption: "Lachung Valley - Sikkim",
  },
  {
    id: "3",
    title: "EASTERN SPLENDOR",
    location: "Sikkim - North Sikkim",
    duration: "8 Days / 7 Nights",
    itinerary: "Gangtok 3N + Lachen 1N + Lachung 1N + Pelling 2N",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1200",
    heroCaption: "Teesta River - North Sikkim",
  },
];

interface ExperienceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { id } = use(params);
  const exp = experiences.find((e) => e.id === id);
  const [openDayIndex, setOpenDayIndex] = useState<number | null>(0);
  const [enquiryStatus, setEnquiryStatus] = useState<"idle" | "success" | "error">("idle");
  const [createEnquiry, { isLoading: isEnquirySubmitting }] = useCreateEnquiryMutation();

  const highlights = highlightsText[id] ?? highlightsText["1"];
  const days = itineraryDays[id] ?? itineraryDays["1"];

  const handleEnquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnquiryStatus("idle");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("mobile") ?? "").trim();
    const pax = formData.get("travelers");
    const message = String(formData.get("message") ?? "").trim();
    if (!name || !email || !phone) {
      setEnquiryStatus("error");
      return;
    }
    try {
      await createEnquiry({
        name,
        email,
        phone,
        pax: pax ? Number(pax) : undefined,
        message: message || undefined,
        packageName: exp?.title,
      }).unwrap();
      form.reset();
      setEnquiryStatus("success");
    } catch {
      setEnquiryStatus("error");
    }
  };

  if (!exp) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#ff4106]">
      <section className="px-6 pb-16 pt-28 sm:px-10 md:px-16 lg:px-24 lg:pb-20 lg:pt-32">
        <div className="mx-auto max-w-6xl">
          {/* Back link */}
          <div className="mb-8 flex items-center justify-between gap-4 text-sm font-medium text-white/80">
            <Link
              href="/experiences"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1.5 text-xs uppercase tracking-[0.18em] hover:bg-white/10"
            >
              <span className="text-base">←</span>
              <span>Back to experiences</span>
            </Link>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch">
            {/* Left: Image hero */}
            <article className="relative w-full overflow-hidden rounded-[40px] bg-black/10 shadow-[0_30px_80px_rgba(0,0,0,0.4)] lg:w-[55%]">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Simple slider arrows (non-functional for now) */}
              <button
                type="button"
                className="absolute left-5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm hover:bg-black/80"
                aria-label="Previous image"
              >
                <span className="-mt-0.5 text-lg">‹</span>
              </button>
              <button
                type="button"
                className="absolute right-5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm hover:bg-black/80"
                aria-label="Next image"
              >
                <span className="-mt-0.5 text-lg">›</span>
              </button>

              {/* Bottom caption bar */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-6 pb-4 pt-16 text-[11px] font-medium text-white/90">
                <span>{exp.heroCaption}</span>
                <span className="opacity-80">@thegreatmountainescape</span>
              </div>
            </article>

            {/* Right: Package summary */}
            <aside className="flex flex-1 flex-col justify-between rounded-[40px] bg-white text-[#101010] shadow-[0_30px_80px_rgba(0,0,0,0.35)] lg:px-10 lg:py-10 px-7 py-8">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff4106]">
                  curated escape
                </p>
                <h1 className="text-2xl font-black uppercase leading-tight tracking-tight sm:text-3xl md:text-4xl">
                  {exp.title}
                </h1>

                <div className="mt-3 space-y-3 text-sm sm:text-base">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-4 w-4 text-[#ff4106]" />
                    <span className="font-semibold">{exp.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock3 className="h-4 w-4 text-[#ff4106]" />
                    <span className="font-semibold">{exp.duration}</span>
                  </div>
                  <div className="h-px w-full bg-gray-200" />
                  <p className="text-sm font-medium text-gray-800 sm:text-base">
                    {exp.itinerary}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                  Limited seats • Guaranteed departures
                </p>
                <button
                  type="button"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#00843d] px-10 text-xs font-black uppercase tracking-[0.22em] text-white shadow-[0_14px_40px_rgba(0,0,0,0.35)] transition-transform hover:scale-[1.03] active:scale-95"
                >
                  Enquire now
                </button>
              </div>
            </aside>
          </div>

          {/* Facilities strip */}
          <div className="mt-10 flex flex-wrap items-center gap-10 border-t border-white/20 pt-6 text-sm font-semibold text-white">
            <div className="inline-flex items-center gap-2">
              <Bus className="h-4 w-4" />
              <span>Transport</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <BedDouble className="h-4 w-4" />
              <span>Accommodation</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              <span>Breakfast</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trip Highlights + Itinerary + Enquiry form */}
      <section className="bg-[#ff4106] px-6 py-16 sm:px-10 md:px-16 lg:px-24 lg:py-20" id="highlights">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1fr,400px] lg:gap-14">
            {/* Left: Trip Highlights + Itinerary */}
            <div className="space-y-10">
              <div>
                <h2 className="text-xl font-bold text-white sm:text-2xl">Trip Highlights</h2>
                <p className="mt-4 leading-relaxed text-white/95">
                  {highlights}
                </p>
              </div>
              <div className="h-px w-full bg-white/25" />
              <div>
                <h2 className="text-xl font-bold text-white sm:text-2xl">Itinerary</h2>
                <div className="mt-4 space-y-3">
                  {days.map((day, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-2xl border-2 border-[#00843d] bg-white"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenDayIndex(openDayIndex === index ? null : index)}
                        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-semibold text-[#00843d] transition-colors hover:bg-gray-50"
                      >
                        <span className="text-sm sm:text-base">{day.title}</span>
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 transition-transform ${openDayIndex === index ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openDayIndex === index && day.body && (
                        <div className="border-t border-[#00843d]/30 px-5 py-4 text-sm text-gray-700">
                          {day.body}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Enquiry form card */}
            <div className="lg:sticky lg:top-28">
              <div className="rounded-3xl border-2 border-[#00843d] bg-white p-6 shadow-xl sm:p-8">
                <h3 className="text-lg font-bold text-[#00843d] sm:text-xl">
                  {exp.title.replace(/\s+/g, " ")}
                </h3>
                <form onSubmit={handleEnquirySubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="enq-name" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="enq-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full rounded-xl border-2 border-[#00843d]/40 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#00843d]"
                    />
                  </div>
                  <div>
                    <label htmlFor="enq-email" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Email address
                    </label>
                    <input
                      id="enq-email"
                      name="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      className="w-full rounded-xl border-2 border-[#00843d]/40 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#00843d]"
                    />
                  </div>
                  <div>
                    <label htmlFor="enq-mobile" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Mobile no <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="enq-mobile"
                      name="mobile"
                      type="tel"
                      required
                      placeholder="Phone number"
                      className="w-full rounded-xl border-2 border-[#00843d]/40 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#00843d]"
                    />
                  </div>
                  <div>
                    <label htmlFor="enq-travelers" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                      No of Travelers
                    </label>
                    <input
                      id="enq-travelers"
                      name="travelers"
                      type="number"
                      min={1}
                      placeholder="Number of travelers"
                      className="w-full rounded-xl border-2 border-[#00843d]/40 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#00843d]"
                    />
                  </div>
                  <div>
                    <label htmlFor="enq-message" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Message
                    </label>
                    <textarea
                      id="enq-message"
                      name="message"
                      rows={4}
                      placeholder="Your message or questions"
                      className="w-full resize-none rounded-xl border-2 border-[#00843d]/40 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#00843d]"
                    />
                  </div>
                  {enquiryStatus === "success" && (
                    <p className="text-sm font-medium text-[#00843d]">Thank you. We&apos;ll get back to you soon.</p>
                  )}
                  {enquiryStatus === "error" && (
                    <p className="text-sm font-medium text-red-600">Something went wrong. Please try again.</p>
                  )}
                  <button
                    type="submit"
                    disabled={isEnquirySubmitting}
                    className="w-full rounded-xl bg-[#00843d] py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-[#006b31] disabled:opacity-70"
                  >
                    {isEnquirySubmitting ? "Sending…" : "Enquire now"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inclusions & Exclusions */}
      <section className="relative bg-[#ff4106] px-6 py-16 sm:px-10 md:px-16 lg:px-24 lg:py-20" id="inclusions">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-[32px] bg-white shadow-2xl">
            <div className="grid min-h-[320px] md:grid-cols-2">
              {/* Inclusions - green */}
              <div className="rounded-t-[32px] bg-[#00843d] p-8 md:rounded-tr-none md:rounded-l-[32px]">
                <h2 className="text-xl font-bold text-white sm:text-2xl">Inclusions</h2>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/95 sm:text-base">
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    Accommodation on Deluxe Rooms
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    Breakfast at all locations
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    Transfers from Bagdogra Airport/NJP Rail Station to destinations and vice versa
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    Private sightseeing tours in designated vehicles on point to point basis
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    All applicable taxes, including hotel and transportation taxes
                  </li>
                </ul>
              </div>
              {/* Exclusions - orange */}
              <div className="rounded-b-[32px] bg-[#ff4106] p-8 md:rounded-bl-none md:rounded-r-[32px]">
                <h2 className="text-xl font-bold text-white sm:text-2xl">Exclusions</h2>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/95 sm:text-base">
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    Meals not specified in inclusions, including alcoholic and non-alcoholic beverages
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    Personal expenses such as room service, tips, and laundry
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    Permit for Nathula
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    Entry fees, guide fees, porter charges, travel insurance, and medical expenses
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    Expenses incurred during emergency situations or evacuations
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    Anything not explicitly mentioned under the included items
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    Any increase in government taxes and state taxes
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp floating button - bottom right */}
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
      </section>

      {/* Terms and Conditions & Cancellation Policy */}
      <section className="bg-[#ff4106] px-6 py-16 sm:px-10 md:px-16 lg:px-24 lg:py-20" id="terms">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Terms and Conditions */}
            <div className="rounded-2xl border-2 border-[#00843d] bg-white p-8 shadow-lg">
              <h2 className="text-xl font-bold text-[#00843d] sm:text-2xl">Terms and Conditions</h2>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-gray-700 sm:text-base">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00843d]" />
                  Pricing varies based on group size.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00843d]" />
                  A 40% advance is required to confirm booking; the balance is due before the tour.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00843d]" />
                  Payments accepted via Cash, Bank Transfer, or G-Pay/UPI.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00843d]" />
                  The tour will follow the confirmed itinerary once it begins.
                </li>
              </ul>
            </div>

            {/* Cancellation & Refund Policy */}
            <div className="rounded-2xl border-2 border-[#00843d] bg-white p-8 shadow-lg">
              <h2 className="text-xl font-bold text-[#00843d] sm:text-2xl">Cancellation & Refund Policy</h2>
              <p className="mt-5 text-sm leading-relaxed text-gray-700 sm:text-base">
                If you need to cancel tour/travel services for any reason, written notification must be provided. Cancellation charges are as follows:
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-gray-700 sm:text-base">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00843d]" />
                  30 days & prior to arrival - 10% of the tour/service cost.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00843d]" />
                  20 days to 18 days prior to arrival - 20% of the tour/service cost.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00843d]" />
                  14 days to 16 days prior to arrival - 25% of the tour/service cost.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00843d]" />
                  10 days to 08 days prior to arrival - 50% of the tour/service cost.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00843d]" />
                  07 days & less, prior to arrival or no show - NO REFUND
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

