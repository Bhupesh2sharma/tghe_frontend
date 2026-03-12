"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/experiences", label: "Experiences" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHomePage = pathname === "/";
  const showSolidHeader = scrolled || !isHomePage;
  const isRedHeader = showSolidHeader;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-500 ${showSolidHeader ? "top-0 px-0" : "top-4 px-4 md:top-6 md:px-8"
        }`}
    >
      <header
        className={`pointer-events-auto w-full flex flex-col transition-all duration-500 ${
          showSolidHeader
            ? "max-w-full bg-[#ff4106] shadow-[0_1px_0_rgba(0,0,0,0.06)] border-b border-transparent"
            : "max-w-[1280px] bg-transparent"
        }`}
      >
        {/* Main row */}
        <div className="flex h-[74px] items-center justify-between px-5 md:px-8">
          {/* Logo + Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="relative h-11 w-11 shrink-0 sm:h-12 sm:w-12">
              <Image
                src="/logohimalaya.png"
                alt="The Great Himalayan Escape"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span
              className="hidden sm:block uppercase transition-colors duration-300"
              style={{
                fontFamily: "var(--font-lexend-deca), sans-serif",
                fontWeight: 900,
                fontSize: "clamp(11px, 2vw, 16px)",
                color: isRedHeader ? "white" : showSolidHeader ? "#1e293b" : "white",
                letterSpacing: "0.1em",
              }}
            >
              THE GREAT{" "}
              <span style={{ color: isRedHeader ? "rgba(255,255,255,0.95)" : showSolidHeader ? "#00843d" : "rgba(255,255,255,0.95)" }}>HIMALAYAN ESCAPE</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-9 lg:gap-12">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`group relative py-2 transition-colors duration-300 ${isRedHeader ? "text-white hover:text-white/80" : showSolidHeader ? "text-[#475569] hover:text-[#00843d]" : "text-white hover:text-white/80"}`}
                style={{
                  fontFamily: "var(--font-lexend-deca), sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
                <span className={`absolute bottom-0 left-0 h-[2px] w-0 rounded-full transition-all duration-300 group-hover:w-full ${isRedHeader ? "bg-white" : showSolidHeader ? "bg-[#00843d]" : "bg-white"}`} />
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center md:hidden"
            onClick={() => setMobileMenuOpen((p) => !p)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <span className="flex h-5 w-6 flex-col justify-center gap-[5px]">
              <span
                className={`block h-[2px] w-6 rounded-full transition-all duration-300 ${isRedHeader ? "bg-white" : showSolidHeader ? "bg-[#1e293b]" : "bg-white"} ${mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
              />
              <span
                className={`block h-[2px] w-6 rounded-full transition-all duration-300 ${isRedHeader ? "bg-white" : showSolidHeader ? "bg-[#1e293b]" : "bg-white"} ${mobileMenuOpen ? "opacity-0" : ""
                  }`}
              />
              <span
                className={`block h-[2px] w-6 rounded-full transition-all duration-300 ${isRedHeader ? "bg-white" : showSolidHeader ? "bg-[#1e293b]" : "bg-white"} ${mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
              />
            </span>
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${mobileMenuOpen ? "max-h-[280px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <nav className={`flex flex-col border-t px-6 py-4 ${isRedHeader ? "border-white/20" : showSolidHeader ? "border-slate-100" : "border-white/20"}`}>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`group flex min-h-[48px] items-center transition-colors duration-300 ${isRedHeader ? "text-white hover:text-white/80" : showSolidHeader ? "text-[#475569] hover:text-[#00843d]" : "text-white hover:text-white/80"}`}
                style={{
                  fontFamily: "var(--font-lexend-deca), sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative py-1">
                  {label}
                  <span className={`absolute bottom-0 left-0 h-[2px] w-0 rounded-full transition-all duration-300 group-hover:w-full ${isRedHeader ? "bg-white" : showSolidHeader ? "bg-[#00843d]" : "bg-white"}`} />
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </div>
  );
}
