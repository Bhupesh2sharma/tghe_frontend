"use client";

import { use, useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react";
import { useCreateEnquiryMutation, useGetPackageQuery } from "../../../../store/api";
import NewsletterSection from "../../../components/NewsletterSection";
import FormStatusOverlay from "../../../components/FormStatusOverlay";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1544735716-e421e4284f1b?auto=format&fit=crop&q=80&w=1200";

interface ExperienceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { id } = use(params);
  const { data: packageResponse, isLoading } = useGetPackageQuery(id);
  const exp = packageResponse?.data;

  const [openDayIndex, setOpenDayIndex] = useState<number | null>(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [showStatus, setShowStatus] = useState(false);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [createEnquiry, { isLoading: isEnquirySubmitting }] = useCreateEnquiryMutation();

  const heroImages: { src: string; caption: string }[] =
    exp?.images && exp.images.length > 0
      ? exp.images.map((src) => ({
        src,
        caption: exp?.title || exp?.name || "Experience",
      }))
      : [
        {
          src: exp?.image || PLACEHOLDER_IMAGE,
          caption: exp?.title || exp?.name || "Experience",
        },
      ];
  const heroTotal = heroImages.length;
  const goPrev = () => setHeroIndex((i) => (i <= 0 ? heroTotal - 1 : i - 1));
  const goNext = () => setHeroIndex((i) => (i >= heroTotal - 1 ? 0 : i + 1));

  useEffect(() => {
    setHeroIndex(0);
  }, [id]);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (heroTotal <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((i) => (i >= heroTotal - 1 ? 0 : i + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [heroTotal]);

  const itineraryDays = exp?.itinerary ?? [];
  const inclusionsList = exp?.inclusions ?? [];
  const exclusionsList = exp?.exclusions ?? [];
  const paymentRefundContent = exp?.paymentRefundPolicy?.content ?? "";
  const termsContent = exp?.termsCondition?.content ?? "";

  const handleShare = async () => {
    const shareData = {
      title: exp?.title || exp?.name || "The Great Himalayan Escape",
      text: `Check out this amazing experience: ${exp?.title || exp?.name}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Error copying to clipboard:", err);
      }
    }
  };

  const handleEnquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowStatus(false);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("mobile") ?? "").trim();
    const tourDate = String(formData.get("tourDate") ?? "").trim();
    const pax = formData.get("travelers");
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !phone || !tourDate) {
      setStatusType("error");
      setStatusMessage("Please fill in all required fields.");
      setShowStatus(true);
      return;
    }

    try {
      await createEnquiry({
        name,
        email,
        phone,
        tourDate,
        pax: pax ? Number(pax) : undefined,
        message: message || undefined,
        packageName: exp?.title || exp?.name,
      }).unwrap();
      form.reset();
      setStatusType("success");
      setStatusMessage("Your enquiry has been sent successfully. We will contact you soon!");
      setShowStatus(true);
    } catch (err: any) {
      setStatusType("error");
      setStatusMessage(err?.data?.message || "Something went wrong. Please try again.");
      setShowStatus(true);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#ff4106] flex items-center justify-center">
        <p className="text-xl font-medium text-white/80 animate-pulse">Loading experience details...</p>
      </main>
    );
  }

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
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1.5 text-xs uppercase tracking-[0.18em] transition hover:bg-white/10"
              style={{ fontFamily: '"Lexend Deca", sans-serif' }}
            >
              <span className="text-base">←</span>
              <span>Back to experiences</span>
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1.5 text-xs uppercase tracking-[0.18em] transition hover:bg-white/10"
              style={{ fontFamily: '"Lexend Deca", sans-serif' }}
            >
              <Share2 size={14} className={isCopied ? "text-green-400" : ""} />
              <span>{isCopied ? "Copied!" : "Share"}</span>
            </button>
          </div>

          <div className="flex flex-col gap-0 lg:flex-row lg:items-stretch lg:gap-10">
            {/* Left: Image hero carousel + facilities strip */}
            <div className="w-full lg:w-[55%]">
              <article className="relative overflow-hidden rounded-[40px] bg-black/10">
                <div className="relative aspect-[4/3] w-full">
                  {heroImages.map((slide: { src: string; caption: string }, idx: number) => (
                    <div
                      key={idx}
                      className={`absolute inset-0 transition-opacity duration-300 ${idx === heroIndex ? "z-10 opacity-100" : "z-0 opacity-0"}`}
                      aria-hidden={idx !== heroIndex}
                    >
                      <Image
                        src={slide.src || PLACEHOLDER_IMAGE}
                        alt={`${exp.title || exp.name} – ${slide.caption}`}
                        fill
                        priority={idx === 0}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                {heroTotal > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/90 bg-white/95 text-[#101010] shadow-xl backdrop-blur-sm transition hover:bg-white hover:scale-110 active:scale-95"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/90 bg-white/95 text-[#101010] shadow-xl backdrop-blur-sm transition hover:bg-white hover:scale-110 active:scale-95"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" strokeWidth={2.5} />
                    </button>
                  </>
                )}

                {/* Bottom caption bar */}
                <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-6 pb-4 pt-16 text-[11px] font-medium text-white/90">
                  <span>{heroImages[heroIndex]?.caption}</span>
                  <span className="opacity-80">@thegreatmountainescape</span>
                  {heroTotal > 1 && (
                    <span className="opacity-80">
                      {heroIndex + 1} / {heroTotal}
                    </span>
                  )}
                </div>

                {/* Dot indicators */}
                {heroTotal > 1 && (
                  <div className="absolute bottom-12 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                    {heroImages.map((_: any, idx: number) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setHeroIndex(idx)}
                        className={`h-1.5 w-1.5 rounded-full transition-colors ${idx === heroIndex ? "bg-white" : "bg-white/50 hover:bg-white/70"}`}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </article>

              {/* Facilities strip - just below image, above the line */}
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-4 border-b border-white pb-4 pt-6 text-[11px] font-semibold text-white sm:gap-x-16 sm:pb-6 sm:text-xl lg:gap-x-20">
                <div className="inline-flex items-center gap-1.5 sm:gap-3">
                  <Bus className="h-4 w-4 shrink-0 sm:h-6 sm:w-6" />
                  <span>Transport</span>
                </div>
                <div className="inline-flex items-center gap-1.5 sm:gap-3">
                  <BedDouble className="h-4 w-4 shrink-0 sm:h-6 sm:w-6" />
                  <span>Accommodation</span>
                </div>
                <div className="inline-flex items-center gap-1.5 sm:gap-3">
                  <Coffee className="h-4 w-4 shrink-0 sm:h-6 sm:w-6" />
                  <span>Breakfast</span>
                </div>
              </div>
            </div>

            {/* Right: Package summary - orange block with white text */}
            <aside className="flex flex-1 flex-col rounded-[40px] bg-[#ff4106] px-7 py-4 text-white sm:py-8 lg:mt-14 lg:px-10 lg:py-10">
              <div className="flex flex-col gap-6">
                <h1
                  className="font-semibold uppercase tracking-tight text-white"
                  style={{
                    fontFamily: '"Lexend Deca", sans-serif',
                    fontSize: "clamp(24px, 7vw, 35px)",
                    lineHeight: "1.1",
                  }}
                >
                  {exp.title}
                </h1>

                <div className="flex items-center gap-2 text-white">
                  <MapPin className="h-5 w-5 shrink-0" />
                  <span
                    className="font-semibold text-white"
                    style={{
                      fontFamily: '"Lexend Deca", sans-serif',
                      fontSize: "clamp(16px, 4vw, 19px)",
                      lineHeight: "1.3",
                    }}
                  >
                    {exp.destinations?.map(d => d.name).join(" - ") || "Various Locations"}
                  </span>
                </div>

                <div className="h-px w-full bg-white/40" aria-hidden />

                <div className="flex items-start gap-2">
                  <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                  <div className="space-y-0.5">
                    <p
                      className="font-semibold text-white"
                      style={{
                        fontFamily: '"Lexend Deca", sans-serif',
                        fontSize: "clamp(16px, 4vw, 19px)",
                        lineHeight: "1.3",
                      }}
                    >
                      {exp.duration}
                      {exp.durationDescription ? (
                        <span className="block mt-1 font-normal opacity-90" style={{ fontSize: "clamp(14px, 3.5vw, 17px)" }}>{exp.durationDescription}</span>
                      ) : null}
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-white/40" aria-hidden />

                <a
                  href="#enquiry-form"
                  className="flex min-h-[50px] w-full items-center justify-center rounded-full bg-[#00843d] px-8 py-3 text-[22px] font-semibold uppercase leading-[33px] tracking-widest text-white shadow-xl transition-all hover:scale-105 hover:bg-[#006b31] active:scale-95"
                >
                  Enquire now
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Trip Highlights + Itinerary (left) | Enquiry form (right) - exact layout as design */}
      <section className="overflow-visible bg-[#ff4106] -mt-6 px-6 pb-16 pt-0 sm:px-10 md:px-16 lg:px-24 lg:pb-20 lg:-mt-8" id="highlights" style={{ overflow: "visible" }}>
        <div className="mx-auto max-w-6xl overflow-visible" style={{ overflow: "visible" }}>
          <div className="flex flex-col gap-10 overflow-visible sm:flex-row sm:items-start sm:gap-8 md:gap-12 lg:gap-14" style={{ overflow: "visible" }}>
            {/* Left: Trip Highlights section (includes Itinerary in same section) */}
            <div className="min-w-0 flex-1 space-y-6">
              <h2 className="text-xl font-bold text-white sm:text-2xl">Trip Highlights</h2>
              <p className="max-w-xl leading-relaxed text-white/95">
                {exp.description || "Explore this experience with comfortable stays and curated sightseeing."}
              </p>
              <div className="h-px w-full max-w-xl bg-white" aria-hidden />
              <div className="max-w-xl">
                <h3 className="text-lg font-bold text-white sm:text-xl">Itinerary</h3>
                <div className="mt-3 space-y-3">
                  {itineraryDays.length === 0 ? (
                    <p className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-500">
                      No itinerary added yet.
                    </p>
                  ) : (
                    itineraryDays.map((day, index) => (
                      <div
                        key={day._id}
                        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenDayIndex(openDayIndex === index ? null : index)}
                          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-semibold text-gray-800 transition-colors hover:bg-gray-50"
                        >
                          <span className="text-sm sm:text-base">
                            Day {day.dayNumber}: {day.title}
                          </span>
                          <ChevronDown
                            className={`h-5 w-5 shrink-0 text-gray-600 transition-transform ${openDayIndex === index ? "rotate-180" : ""}`}
                          />
                        </button>
                        {openDayIndex === index && day.description && (
                          <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-700">
                            {day.description}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right: Enquiry form - scrolls with page (no sticky) */}
            <div id="enquiry-form" className="relative z-30 w-full shrink-0 scroll-mt-28 sm:sticky sm:top-28 sm:w-[360px] md:w-[400px] lg:w-[460px]">
              <div className="rounded-[2rem] bg-white p-6 shadow-xl sm:p-8">
                <h3 className="text-xl font-bold text-[#00843d] sm:text-2xl">
                  {(exp.title || exp.name || "").replace(/\s+/g, " ")}
                </h3>
                <form onSubmit={handleEnquirySubmit} className="mt-6 space-y-4">
                  <input
                    id="enq-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Name*"
                    className="w-full rounded-2xl border-2 border-[#00843d] bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#006b31] focus:ring-2 focus:ring-[#00843d]/20"
                  />
                  <input
                    id="enq-email"
                    name="email"
                    type="email"
                    required
                    placeholder="Email address"
                    className="w-full rounded-2xl border-2 border-[#00843d] bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#006b31] focus:ring-2 focus:ring-[#00843d]/20"
                  />
                  <input
                    id="enq-mobile"
                    name="mobile"
                    type="tel"
                    required
                    placeholder="Mobile no*"
                    className="w-full rounded-2xl border-2 border-[#00843d] bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#006b31] focus:ring-2 focus:ring-[#00843d]/20"
                  />
                  <input
                    id="enq-travelers"
                    name="travelers"
                    type="number"
                    min={1}
                    placeholder="No of Travelers"
                    className="w-full rounded-2xl border-2 border-[#00843d] bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#006b31] focus:ring-2 focus:ring-[#00843d]/20"
                  />
                  <input
                    id="enq-date"
                    name="tourDate"
                    type="date"
                    required
                    className="w-full rounded-2xl border-2 border-[#00843d] bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#006b31] focus:ring-2 focus:ring-[#00843d]/20"
                  />
                  <textarea
                    id="enq-message"
                    name="message"
                    rows={4}
                    placeholder="Message"
                    className="w-full resize-y rounded-2xl border-2 border-[#00843d] bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#006b31] focus:ring-2 focus:ring-[#00843d]/20"
                  />

                  <button
                    type="submit"
                    disabled={isEnquirySubmitting}
                    className="w-full rounded-2xl bg-[#00843d] py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-[#006b31] disabled:opacity-70"
                  >
                    {isEnquirySubmitting ? "Sending…" : "ENQUIRE NOW"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inclusions & Exclusions - two boxes with white borders, no gap */}
      <section className="relative bg-[#ff4106] px-6 pb-16 pt-6 sm:px-10 sm:pt-8 md:px-16 lg:px-24 lg:pb-20 lg:pt-10" id="inclusions">
        <div className="mx-auto max-w-6xl">
          <div className="h-px w-full bg-white" aria-hidden />
          <div className="mt-6 grid min-h-[320px] grid-cols-1 md:grid-cols-2 lg:mt-8">
            {/* Inclusions - green, white border, rounded left only */}
            <div className="rounded-t-[24px] border-2 border-white border-b-0 border-r-0 bg-[#00843d] p-8 md:rounded-l-[24px] md:rounded-tr-none md:rounded-br-none md:border-b-2 md:border-r-0">
              <h2 className="text-xl font-bold text-white sm:text-2xl">Inclusions</h2>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white sm:text-base">
                {inclusionsList.length === 0 ? (
                  <li className="text-white/80">No inclusions added yet.</li>
                ) : (
                  inclusionsList.map((item) => (
                    <li key={item._id} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                      {item.text}
                    </li>
                  ))
                )}
              </ul>
            </div>
            {/* Exclusions - orange, white border, rounded right only */}
            <div className="rounded-b-[24px] border-2 border-white border-t-0 border-l-0 bg-[#ff4106] p-8 md:rounded-r-[24px] md:rounded-tl-none md:rounded-bl-none md:border-t-2 md:border-l-0">
              <h2 className="text-xl font-bold text-white sm:text-2xl">Exclusions</h2>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white sm:text-base">
                {exclusionsList.length === 0 ? (
                  <li className="text-white/80">No exclusions added yet.</li>
                ) : (
                  exclusionsList.map((item) => (
                    <li key={item._id} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                      {item.text}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Terms and Conditions & Cancellation Policy - green outer container, white inner panels */}
      <section className="bg-[#ff4106] px-6 pb-16 pt-6 sm:px-10 sm:pt-8 md:px-16 lg:px-24 lg:pb-20 lg:pt-10" id="terms">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[20px] bg-[#00843d] p-6 sm:p-8 lg:p-10">
            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
              {/* Terms and Conditions - white panel */}
              <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
                <h2 className="text-xl font-bold text-[#00843d] sm:text-2xl">Terms and Conditions</h2>
                <div className="mt-5 text-sm leading-relaxed text-gray-800 sm:text-base whitespace-pre-wrap">
                  {termsContent || "No terms and conditions added yet."}
                </div>
              </div>

              {/* Cancellation & Refund Policy - white panel */}
              <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
                <h2 className="text-xl font-bold text-[#00843d] sm:text-2xl">Cancellation & Refund Policy</h2>
                <div className="mt-5 text-sm leading-relaxed text-gray-800 sm:text-base whitespace-pre-wrap">
                  {paymentRefundContent || "No cancellation and refund policy added yet."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSection />
      <FormStatusOverlay
        isOpen={showStatus}
        onClose={() => setShowStatus(false)}
        type={statusType}
        message={statusMessage}
      />
    </main>
  );
}

