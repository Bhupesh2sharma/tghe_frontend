"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/experiences", label: "Experiences" },
  { href: "#about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

const navLinkStyle = {
  fontFamily: "var(--font-lexend-deca), sans-serif",
  fontStyle: "normal" as const,
  fontWeight: 700,
  color: "rgb(255, 255, 255)",
  fontSize: "17px",
  lineHeight: "28px",
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 flex w-full flex-col bg-[#ff4106]/95 backdrop-blur-md md:flex-row md:items-center md:justify-between md:px-12 md:py-0 lg:px-20"
      style={{ fontFamily: "var(--font-lexend-deca), sans-serif" }}
    >
      {/* Top bar: logo + brand + hamburger */}
      <div className="flex min-h-[64px] min-w-0 items-center justify-between gap-2 px-4 py-3 sm:min-h-[72px] sm:px-6 md:min-h-[84px] md:flex-1 md:justify-start md:gap-4 md:py-0 md:px-0">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
          <Image
            src="/logohimalaya.png"
            alt="The Great Himalayan Escape"
            width={72}
            height={72}
            className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12 md:h-[72px] md:w-[72px]"
          />
          <span
            className="truncate uppercase"
            style={{
              fontFamily: "var(--font-lexend-deca), sans-serif",
              fontStyle: "normal",
              fontWeight: 700,
              color: "rgb(255, 255, 255)",
              fontSize: "clamp(14px, 3.5vw, 18px)",
              lineHeight: "26px",
            }}
          >
            THE GREAT HIMALAYAN ESCAPE
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="transition-colors hover:opacity-90"
              style={navLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded md:hidden"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span className="flex h-5 w-6 flex-col justify-center gap-1">
            <span
              className={`block h-0.5 w-full bg-white transition-transform ${mobileMenuOpen ? "translate-y-1.5 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-full bg-white transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-full bg-white transition-transform ${mobileMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-200 ease-out md:hidden ${mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <nav className="flex flex-col border-t border-white/20 px-4 py-3 sm:px-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="min-h-[48px] py-3 text-[17px] transition-colors hover:opacity-90 active:opacity-80"
              style={navLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
