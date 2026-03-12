"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const legalLinks = [
  { label: "Terms and Conditions", href: "/terms" },
  { label: "Cancellation & Refund Policy", href: "/cancellation-refund" },
];

const importantLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#about" },
  { label: "Experiences", href: "/experiences" },
];

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeInVariants} className="flex flex-col">
      <h3 className="text-[16px] font-medium uppercase leading-[19px] text-white">
        {title}
      </h3>
      <div className="mt-3 mb-6 h-[1px] w-full bg-white/30" aria-hidden />
      {children}
    </motion.div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white transition-opacity hover:opacity-80"
      aria-label={label}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="relative w-full pt-12">
      <div className="mx-3 rounded-t-[40px] bg-[#00843d] px-8 py-20 sm:mx-6 sm:px-12 md:mx-10 md:px-16 lg:mx-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ staggerChildren: 0.1 }}
            className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12"
          >
            {/* Column 1 - Branding */}
            <motion.div variants={fadeInVariants} className="flex flex-col sm:col-span-2 lg:col-span-3">
              <Link href="/" className="flex flex-col items-start gap-4 text-white">
                <div className="relative h-24 w-full max-w-[280px]">
                  <Image
                    src="/logo1.png"
                    alt="The Great Himalayan Escape Logo"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
                <p className="whitespace-nowrap text-[11px] font-medium leading-relaxed tracking-wider text-white opacity-90">
                  Your Gateway to Himalayas and Beyond
                </p>
              </Link>
            </motion.div>

            {/* Column 2 - Legal */}
            <div className="lg:col-span-2">
              <FooterColumn title="LEGAL">
                <ul className="flex flex-col gap-4">
                  {legalLinks.map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-[14px] font-medium text-white transition-opacity hover:opacity-80"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            </div>

            {/* Column 3 - Important Links */}
            <div className="lg:col-span-2">
              <FooterColumn title="IMPORTANT LINKS">
                <ul className="flex flex-col gap-4">
                  {importantLinks.map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-[14px] font-medium text-white transition-opacity hover:opacity-80"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            </div>

            {/* Column 4 - Contact Us */}
            <div className="lg:col-span-3">
              <FooterColumn title="CONTACT US">
                <ul className="flex flex-col gap-4 text-[14px] font-medium text-white">
                  <li>
                    <a href="tel:+918670698781" className="hover:opacity-80">+91-86706-98781</a>
                  </li>
                  <li>
                    <a href="tel:+917378534390" className="hover:opacity-80">+91-73785-34390</a>
                  </li>
                  <li>
                    <a href="mailto:info@tghe.com" className="hover:opacity-80">info@tghe.com</a>
                  </li>
                  <li className="max-w-[280px] leading-relaxed">
                    The Great Himalayan Escape, Deorali Girls School Road, Deorali, Gangtok - 737101
                  </li>
                </ul>
              </FooterColumn>
            </div>

            {/* Column 5 - Follow Us On */}
            <div className="lg:col-span-2">
              <FooterColumn title="FOLLOW US ON">
                <div className="mt-2 flex items-center gap-4">
                  <SocialIcon href="https://www.facebook.com/people/The-Great-Himalayan-Escape/61560444660318/" label="Facebook">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </SocialIcon>
                  <SocialIcon href="https://www.instagram.com/thegreathimalayanescape/" label="Instagram">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </SocialIcon>
                  <SocialIcon href="https://www.linkedin.com/in/the-great-himalayan-escape-521ab1311/" label="LinkedIn">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </SocialIcon>
                  <SocialIcon href="https://www.youtube.com/@thegreathimalayanescape" label="YouTube">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </SocialIcon>
                </div>
              </FooterColumn>
            </div>
          </motion.div>

          {/* Copyright Area */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 flex flex-col items-center justify-center border-t border-white/10 pt-10 text-center"
          >
            <p className="max-w-4xl text-[14px] font-medium tracking-wide text-white/90">
              Copyright © 2024 All Rights Reserved The Great Himalayan Escape Private Limited.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://api.whatsapp.com/send?phone=+919339212653&text=Hello,%20I%20am%20interested%20in%20your%20services"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-10 right-10 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all hover:scale-110 active:scale-90 md:h-16 md:w-16"
        aria-label="Contact us on WhatsApp"
      >
        <svg
          className="h-8 w-8 sm:h-10 sm:w-10"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </footer>
  );
}
