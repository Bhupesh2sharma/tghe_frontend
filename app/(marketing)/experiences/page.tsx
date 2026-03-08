"use client";

import Image from "next/image";
import Link from "next/link";
import NewsletterSection from "../../components/NewsletterSection";
import { useGetPackagesQuery } from "../../../store/api";



const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1544735716-e421e4284f1b?auto=format&fit=crop&q=80&w=800";

export default function ExperiencesPage() {
    const { data: packagesResponse, isLoading } = useGetPackagesQuery();
    const experiences = packagesResponse?.data ?? [];

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#ff4106] flex items-center justify-center">
                <p className="text-xl font-medium text-white/80 animate-pulse">Loading amazing experiences...</p>
            </main>
        );
    }
    return (
        <main className="min-h-screen bg-[#ff4106]">
            <div className="pt-[100px] pb-20 px-6 sm:px-12 md:px-20 lg:px-24">

                <div className="mx-auto max-w-[1000px]">
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
                            style={{ fontFamily: '"Lexend Deca", sans-serif' }}
                        >
                            <span className="text-base">←</span>
                            <span>Back to Home</span>
                        </Link>
                    </div>
                    <h1
                        className="mt-12 mb-16 text-center font-semibold tracking-tight text-white md:mt-16 md:mb-20"
                        style={{
                            fontFamily: '"Lexend Deca", sans-serif',
                            fontSize: "clamp(40px, 8vw, 92px)",
                            lineHeight: "1",
                        }}
                    >
                        Experiences.
                    </h1>

                    <div className="flex flex-col gap-8 lg:gap-10">
                        {experiences.map((exp) => (
                            <div
                                key={exp._id}
                                className="group flex flex-col overflow-hidden rounded-[48px] bg-white p-4 shadow-xl md:flex-row md:items-stretch lg:rounded-[64px] lg:p-5"
                            >
                                {/* Image Section */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] md:aspect-auto md:w-[32%] md:rounded-[32px] lg:w-[35%] lg:rounded-[32px]">
                                    <Image
                                        src={exp.images?.[0] || exp.image || PLACEHOLDER_IMAGE}
                                        alt={exp.title || exp.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>

                                {/* Content Section (Green Card) */}
                                <div className="mt-4 flex flex-1 flex-col justify-between rounded-[32px] bg-[#00843d] p-5 text-white md:ml-5 md:mt-0 lg:ml-6 lg:rounded-[32px] lg:p-6">
                                    <div className="flex flex-col">
                                        <h2
                                            className="font-bold tracking-widest text-white"
                                            style={{
                                                fontFamily: '"Lexend Deca", sans-serif',
                                                fontSize: "20px",
                                                lineHeight: "30px",
                                            }}
                                        >
                                            {exp.title || exp.name}
                                        </h2>
                                        <p
                                            className="mt-0.5 font-light text-white opacity-95"
                                            style={{
                                                fontFamily: '"Lexend Deca", sans-serif',
                                                fontSize: "20px",
                                                lineHeight: "30px",
                                            }}
                                        >
                                            {exp.destinations?.map(d => d.name).join(" - ") || "Various Locations"}
                                        </p>

                                        <div className="mt-3 space-y-1 opacity-90">
                                            <p
                                                className="font-light text-white"
                                                style={{
                                                    fontFamily: '"Lexend Deca", sans-serif',
                                                    fontSize: "16px",
                                                    lineHeight: "24px",
                                                }}
                                            >
                                                {exp.duration}
                                                {exp.durationDescription ? (
                                                    <span className="block mt-0.5 opacity-90">{exp.durationDescription}</span>
                                                ) : null}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <div className="mb-4 h-[1px] w-full bg-white/20" aria-hidden />
                                        <div className="flex justify-end">
                                            <Link
                                                href={`/experiences/${exp._id}`}
                                                className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-white px-6 py-2 text-xs font-black uppercase tracking-widest text-[#00843d] transition-all hover:bg-neutral-100 hover:scale-105 active:scale-95 md:text-sm"
                                            >
                                                VIEW DETAILS
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <NewsletterSection />
        </main >
    );
}
