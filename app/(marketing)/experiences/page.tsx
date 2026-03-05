import Image from "next/image";
import Link from "next/link";

const experiences = [

    {
        id: 1,
        title: "HIMALAYAN DELIGHT",
        location: "Sikkim - Darjeeling",
        duration: "6 Days / 5 Nights",
        itinerary: "Gangtok 3N + Darjeeling 2N",
        image: "https://images.unsplash.com/photo-1584351583369-6baf055b51a7?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 2,
        title: "HIMALAYAN BLISS",
        location: "Sikkim",
        duration: "6 Days / 5 Nights",
        itinerary: "Gangtok 4N + Lachung 1N",
        image: "https://images.unsplash.com/photo-1544735716-e421e4284f1b?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 3,
        title: "EASTERN SPLENDOR",
        location: "Sikkim - North Sikkim",
        duration: "8 Days / 7 Nights",
        itinerary: "Gangtok 3N + Lachen 1N + Lachung 1N + Pelling 2N",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800",
    },
];

export default function ExperiencesPage() {
    return (
        <main className="min-h-screen bg-[#ff4106]">
            <div className="pt-[100px] pb-20 px-6 sm:px-12 md:px-20 lg:px-24">

                <div className="mx-auto max-w-[1400px]">
                    <h1 className="mb-16 text-center text-6xl font-black tracking-tight text-white sm:text-7xl md:mb-20 md:text-8xl lg:text-[100px]">
                        Experiences.
                    </h1>

                    <div className="flex flex-col gap-14 lg:gap-20">
                        {experiences.map((exp) => (
                            <div
                                key={exp.id}
                                className="group flex flex-col overflow-hidden rounded-[40px] bg-white p-6 shadow-2xl md:flex-row md:items-stretch lg:p-10"
                            >
                                {/* Image Section */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[40px] md:aspect-auto md:w-[35%] lg:w-[40%]">
                                    <Image
                                        src={exp.image}
                                        alt={exp.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>

                                {/* Content Section (Green Card) */}
                                <div className="mt-6 flex flex-1 flex-col justify-between rounded-[40px] bg-[#00843d] p-8 text-white md:ml-8 md:mt-0 lg:ml-10 lg:p-12">
                                    <div className="flex flex-col">
                                        <h2 className="text-xl font-black tracking-widest md:text-2xl lg:text-3xl">
                                            {exp.title}
                                        </h2>
                                        <p className="mt-1 text-lg font-bold opacity-95 lg:text-2xl">
                                            {exp.location}
                                        </p>

                                        <div className="mt-4 space-y-1.5 opacity-90">
                                            <p className="text-sm font-bold md:text-base lg:text-lg">
                                                {exp.duration}
                                            </p>
                                            <p className="text-sm font-medium md:text-base lg:text-lg">
                                                {exp.itinerary}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <div className="mb-6 h-[1.5px] w-full bg-white/20" aria-hidden />
                                        <div className="flex justify-end">
                                            <Link
                                                href={`/experiences/${String(exp.id)}`}
                                                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-10 py-2.5 text-sm font-black uppercase tracking-widest text-[#00843d] transition-all hover:bg-neutral-100 hover:scale-105 active:scale-95 lg:text-base"
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

        </main>
    );
}
