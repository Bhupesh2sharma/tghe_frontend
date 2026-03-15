"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

// Images from public/img – add or reorder as needed
const images = [
    { id: 1, src: "/img/bliss1.jpg", title: "KALIMPONG", subtitle: "Haven of Art & Culture" },
    { id: 2, src: "/img/bliss2.jpg", title: "DARJEELING", subtitle: "Queen of the Hills" },
    { id: 3, src: "/img/1747135750.mg%20marg%20(2).jpg", title: "GANGTOK", subtitle: "Gateway to Sikkim" },
    { id: 4, src: "/img/1738759733.himalayan-escapade-thumbnail-image.jpg", title: "PELLING", subtitle: "Mist-covered Peaks" },
    { id: 5, src: "/img/destination3.jpg", title: "NAMCHI", subtitle: "Sky High Spiritualism" },
    { id: 6, src: "/img/bliss3.jpg", title: "LACHUNG", subtitle: "Valley of Flowers" },
    { id: 7, src: "/img/escade2.jpg", title: "KURSEONG", subtitle: "Tea Estates & Tranquility" },
    { id: 8, src: "/img/1747116035.buddha park 2.jpg", title: "RAVANGLA", subtitle: "Buddha Park & Beyond" },
    { id: 9, src: "/img/1738674995.himalayan-delight-thumbnail-image.jpg", title: "TSONGO", subtitle: "Sacred Glacial Lake" },
    { id: 10, src: "/img/bliss4.jpg", title: "YUMTHANG", subtitle: "Alpine Flower Valley" },
];

export default function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const touchStartX = useRef<number | null>(null);

    const goNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, []);

    const goPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);

        const timer = setInterval(() => {
            goNext();
        }, 2500);

        return () => {
            window.removeEventListener("resize", handleResize);
            clearInterval(timer);
        };
    }, [goNext]);

    const getCardStyle = (index: number) => {
        const total = images.length;
        let diff = (index - currentIndex + total) % total;
        if (diff > total / 2) diff -= total;

        const isActive = diff === 0;
        const isVisible = isMobile ? isActive : Math.abs(diff) <= 4; // Only active card on mobile, stack visibility on desktop

        if (!isVisible) return { opacity: 0, scale: 0.5, x: diff * 400, rotateY: 0, zIndex: 0 };

        // More tightly packed cards - reduce spacing for overlap effect
        let xBase = diff * (isMobile ? 90 : 200);
        if (diff > 0) xBase += (isMobile ? 20 : 0);
        if (diff < 0) xBase -= (isMobile ? 20 : 0);

        return {
            zIndex: 10 - Math.abs(diff),
            scale: 1.0,
            x: xBase,
            opacity: 1,
            rotateY: diff * (isMobile ? -15 : -25), // Increased rotation for tighter fan
            translateZ: isActive ? 120 : -100,
        };
    };

    return (
        <div
            className="relative flex h-[580px] w-full items-center justify-center overflow-hidden pt-2 pb-0 md:h-[680px]"
            onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
                if (touchStartX.current === null) return;
                const deltaX = e.changedTouches[0].clientX - touchStartX.current;
                const threshold = 40;
                if (deltaX > threshold) {
                    goPrev();
                } else if (deltaX < -threshold) {
                    goNext();
                }
                touchStartX.current = null;
            }}
        >
            {/* 3D Stack Layer */}
            <div
                className="relative flex h-full w-full items-center justify-center"
                style={{ perspective: "2500px", transformStyle: "preserve-3d" }}
            >
                <AnimatePresence initial={false}>
                    {images.map((image, index) => {
                        const style = getCardStyle(index);
                        const isActive = (index - currentIndex + images.length) % images.length === 0;

                        if (style.opacity === 0) return null;

                        return (
                            <motion.div
                                key={image.id}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={style}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 120,
                                    damping: 18,
                                }}
                                className="absolute h-[480px] w-[320px] cursor-pointer overflow-hidden rounded-[24px] shadow-none md:h-[580px] md:w-[320px] md:shadow-2xl"
                                onClick={() => setCurrentIndex(index)}
                                style={{
                                    transformStyle: "preserve-3d",
                                }}
                            >
                                <div className="relative h-full w-full bg-neutral-200">
                                    <Image
                                        src={image.src}
                                        alt={image.title}
                                        fill
                                        className="object-cover"
                                        priority={isActive}
                                        sizes="(max-width: 768px) 360px, 320px"
                                    />

                                    {!isActive && (
                                        <div className="absolute inset-0 bg-black/25 transition-opacity" />
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Global Text Overlay - Optimized for larger mobile impact */}
            <div className="pointer-events-none absolute inset-0 z-[100] flex items-center justify-center">
                <div className="relative h-full w-full max-w-[1200px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bottom-[15%] left-[12%] flex flex-col items-start text-left text-white md:bottom-[22%] md:left-[22%]"
                        >
                            <h2
                                className="font-black tracking-tight drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
                                style={{
                                    fontFamily: '"Lexend Deca", sans-serif',
                                    fontSize: "clamp(28px, 6vw, 56px)",
                                    lineHeight: "1.1"
                                }}
                            >
                                {images[currentIndex].title}
                            </h2>
                            <div className="mt-2 h-[2px] w-8 bg-white/90 md:mt-3 md:h-[3px] md:w-16" />
                            <p
                                className="mt-2 font-bold drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] md:mt-4"
                                style={{
                                    fontFamily: '"Lexend Deca", sans-serif',
                                    fontSize: "clamp(12px, 3vw, 20px)",
                                    opacity: 0.95
                                }}
                            >
                                {images[currentIndex].subtitle}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
