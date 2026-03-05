export default function WeAreSection() {
  return (
    <section className="relative w-full bg-[#ff4106] px-6 pb-16 pt-4 sm:px-12 sm:pb-24 sm:pt-6 md:px-20 md:pb-32 md:pt-8 lg:px-24">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="mb-10 text-center text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:mb-12 md:text-7xl lg:text-[100px]">
          We Are.
        </h2>

        <div className="mx-auto flex max-w-5xl flex-col items-center space-y-8 text-center text-white sm:space-y-10 md:space-y-12">
          <p className="text-lg font-medium leading-[1.6] tracking-tight sm:text-xl md:text-2xl lg:text-[24px]">
            We are The Great Himalayan Escape, your trusted travel partner for
            exploring the breathtaking beauty of Sikkim and the Himalayas.
            Dedicated to creating unforgettable journeys, we specialize in
            customized travel packages that cater to adventure enthusiasts,
            nature lovers, and cultural explorers alike.
          </p>

          <p className="text-lg font-medium leading-[1.6] tracking-tight sm:text-xl md:text-2xl lg:text-[24px]">
            Our offerings range from serene retreats and thrilling treks to
            immersive cultural tours and family getaways, all tailored to provide
            authentic and memorable experiences. With a strong focus on
            sustainability, we aim to promote local communities and preserve the
            natural and cultural heritage of the region.
          </p>

          <p className="text-lg font-medium leading-[1.6] tracking-tight sm:text-xl md:text-2xl lg:text-[24px]">
            At The Great Himalayan Escape, we believe every journey should be
            unique and transformative. Whether it&apos;s uncovering hidden gems or
            experiencing the grandeur of the Himalayas, we ensure your escape is
            nothing short of extraordinary.
          </p>

          <p className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl lg:text-[32px]">
            Let us guide you on a journey where every moment is crafted to leave
            you inspired.
          </p>
        </div>

        {/* Decorative line at the bottom */}
        <div className="mt-20 h-[1.5px] w-full bg-white/30 md:mt-28" />
      </div>
    </section>
  );
}
