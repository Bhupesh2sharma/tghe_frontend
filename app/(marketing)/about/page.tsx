import Image from "next/image";
import Link from "next/link";
import { Headphones, CreditCard, Star, Percent } from "lucide-react";

const tourTypes = [
  "Adventure Tours",
  "City Tours",
  "Eco Tourism",
  "Tea Tourism",
  "Educational Tours",
  "Wellness Tours",
  "Honeymoon Tours",
  "Religious Tours",
];

const featureCards = [
  {
    title: "Best services",
    description:
      "Discover a world of exceptional service with our travel agency's dedicated team, ready to assist you 24/7.",
    Icon: Headphones,
  },
  {
    title: "Trusted payment",
    description:
      "From credit card transactions to online transfers, our travel agency offers a range of trusted payment options tailored to your preferences.",
    Icon: CreditCard,
  },
  {
    title: "Top facility",
    description:
      "From lavish accommodations to VIP transportation, our travel agency's top facilities redefine the meaning of luxury travel.",
    Icon: Star,
  },
  {
    title: "Awesome deals",
    description:
      "Discover the world without draining your wallet. Our travel agency's awesome deals make budget-friendly travel a breeze.",
    Icon: Percent,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#ff4106]">
      <div className="px-6 pt-24 pb-20 sm:px-10 sm:pt-28 md:px-16 md:pt-32 lg:px-24 lg:pb-24">
        <div className="mx-auto max-w-6xl">
          {/* Back to Home */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
            >
              <span className="text-base">←</span>
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Title */}
          <h1 className="mb-12 text-center text-4xl font-bold text-white sm:text-5xl md:mb-16 md:text-6xl">
            About Us
          </h1>

          {/* Two-column layout */}
          <div className="grid gap-10 lg:grid-cols-[1fr,1fr] lg:gap-14 lg:items-start">
            {/* Left column - content */}
            <div className="space-y-8 text-white">
              <section>
                <h2 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">
                  Explore Sikkim & Darjeeling with The Great Himalayan Escape
                </h2>
                <p className="mt-4 leading-relaxed text-white/95 sm:text-lg">
                  Discover the enigmatic splendour of the Himalayas with Us! Start your extraordinary journey into the heart of the Himalayas, where adventure meets serenity. With over 1 year of experience, 50+ local travel partners, and 1,000+ travel packages delivered, we&apos;re your trusted guides to these mesmerizing regions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">
                  Tailor-Made Adventures Packages
                </h2>
                <p className="mt-4 leading-relaxed text-white/95 sm:text-lg">
                  Explore our diverse range of customized travel packages, designed for every type of traveller. Whether you crave eco escapades, cultural immersions, or thrilling treks, we&apos;ve got your dream vacation covered:
                </p>
                <ul className="mt-6 space-y-3">
                  {tourTypes.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/95 sm:text-lg">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Right column - image */}
            <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl">
              <div className="relative aspect-[4/3] w-full lg:aspect-square">
                <Image
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800"
                  alt="The Great Himalayan Escape - Travel and adventure in the Himalayas"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Scenic images + feature cards section */}
          <div className="mt-16 space-y-12 sm:mt-20 md:mt-24 lg:space-y-16">
            {/* Two scenic images */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800"
                  alt="Scenic cable car and hillside town in the mountains"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800"
                  alt="Glacial lake and snow-capped peaks"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Four feature cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featureCards.map(({ title, description, Icon }) => (
                <div
                  key={title}
                  className="rounded-2xl bg-white p-6 shadow-lg sm:p-7"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-800">
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                    {description}
                  </p>
                </div>
              ))}
            </div>

            {/* Destinations Unveiled / Our Story / Why Trust Us */}
            <div className="mt-16 space-y-14 sm:mt-20 md:mt-24 lg:space-y-20">
              {/* Destinations Unveiled */}
              <section>
                <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                  Destinations Unveiled.
                </h2>
                <p className="mt-4 max-w-3xl leading-relaxed text-white/95 sm:text-lg">
                  Dive deep into the mesmerizing landscapes of Darjeeling and Sikkim, the hidden gems, vibrant towns, and serene havens that await your exploration:
                </p>
                <ul className="mt-5 space-y-2">
                  {["SIKKIM", "DARJEELING", "KALIMPONG"].map((name) => (
                    <li key={name} className="flex items-center gap-3 text-lg font-semibold text-white">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
                      {name}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Our Story, Your Adventure */}
              <section>
                <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                  Our Story, Your Adventure.
                </h2>
                <p className="mt-4 max-w-3xl leading-relaxed text-white/95 sm:text-lg">
                  Welcome to The Great Himalayan Escape, your gateway to the Himalayas and beyond. Specializing in crafting bespoke adventures, we excel in navigating the majestic landscapes of destinations like Sikkim, Darjeeling and Kalimpong. Our expertise ensures that every itinerary is tailored to offer both adventure and environmental responsibility. Our journey began with a simple yet profound belief - that travel has the power to transform, educate, and inspire. Since our inception, we&apos;ve been on a mission to connect travelers with the magic of these Himalayan regions, fostering a deep appreciation for their natural beauty, rich culture, and awe-inspiring experiences. Join us to experience the magic of the Himalayas and explore the wonders of these enchanting destinations.
                </p>
              </section>

              {/* Why Trust Us */}
              <section>
                <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                  Why Trust Us.
                </h2>
                <ul className="mt-6 space-y-6">
                  <li>
                    <h3 className="text-lg font-bold text-white sm:text-xl">Authentic Experiences</h3>
                    <p className="mt-2 max-w-3xl leading-relaxed text-white/95 sm:text-base">
                      We specialize in curating authentic, off-the-beaten-path experiences that allow you to immerse yourself in the culture, nature, and spirit of the region. Our itineraries are carefully designed to showcase the true essence of Darjeeling and Sikkim.
                    </p>
                  </li>
                  <li>
                    <h3 className="text-lg font-bold text-white sm:text-xl">Local Experts</h3>
                    <p className="mt-2 max-w-3xl leading-relaxed text-white/95 sm:text-base">
                      Our team comprises passionate local experts who have an intimate knowledge of Darjeeling and Sikkim. Their deep-rooted connections with the region enable us to offer you unparalleled insights and access to hidden gems, creating a more enriching and immersive travel experience.
                    </p>
                  </li>
                  <li>
                    <h3 className="text-lg font-bold text-white sm:text-xl">Exclusive Offers</h3>
                    <p className="mt-2 max-w-3xl leading-relaxed text-white/95 sm:text-base">
                      Benefit from our partnerships with top hotels, airlines, and tour operators to get the best deal and packages.
                    </p>
                  </li>
                  <li>
                    <h3 className="text-lg font-bold text-white sm:text-xl">24/7 Support</h3>
                    <p className="mt-2 max-w-3xl leading-relaxed text-white/95 sm:text-base">
                      Our dedicated customer service team is available around the clock to assist you before, during, and after your trip.
                    </p>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
