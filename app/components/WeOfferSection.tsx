import Image from "next/image";

const services = [
  { label: "transport", img: "/img/1.png" },
  { label: "sight seeing", img: "/img/2.png" },
  { label: "accomodation", img: "/img/3.png" },
  { label: "travel guide", img: "/img/4.png" },
  { label: "adventures", img: "/img/5.png" },
  { label: "permits", img: "/img/6.png" },
];

export default function WeOfferSection() {
  return (
    <section className="relative w-full bg-[#ff4106] px-6 py-16 sm:px-12 sm:py-24 md:px-20 md:py-28 lg:px-24">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="mb-14 text-center text-6xl font-extrabold tracking-tight text-white sm:text-7xl md:mb-16 md:text-8xl lg:text-[100px]">
          We offer.
        </h2>

        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 sm:gap-4 md:gap-6">
          {services.map(({ label, img }) => (
            <div
              key={label}
              className="group flex flex-1 flex-col items-center text-center transition-transform hover:scale-105"
            >
              <div className="relative h-14 w-14 shrink-0 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-32 lg:w-32">
                <Image
                  src={img}
                  alt={label}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Decorative line at the bottom */}
        <div className="mx-auto mt-20 h-[1.5px] w-[95%] bg-white/30 md:mt-24" />
      </div>
    </section>
  );
}
