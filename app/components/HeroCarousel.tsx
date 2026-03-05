"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
    { id: 1, src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200", title: "KALIMPONG", subtitle: "Haven of Art & Culture" },
    { id: 2, src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200", title: "DARJEELING", subtitle: "Queen of the Hills" },
    { id: 3, src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200", title: "GANGTOK", subtitle: "Gateway to Sikkim" },
    { id: 4, src: "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?auto=format&fit=crop&q=80&w=1200", title: "PELLING", subtitle: "Mist-covered Peaks" },
    { id: 5, src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80&w=1200", title: "NAMCHI", subtitle: "Sky High Spiritualism" },
    { id: 6, src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1200", title: "LACHUNG", subtitle: "Valley of Flowers" },
    { id: 7, src: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=1200", title: "KURSEONG", subtitle: "Tea Estates & Tranquility" },
    { id: 8, src: "https://images.unsplash.com/photo-1589136142550-c2d438e76a6d?auto=format&fit=crop&q=80&w=1200", title: "RAVANGLA", subtitle: "Buddha Park & Beyond" },
    { id: 9, src: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200", title: "TSONGO", subtitle: "Sacred Glacial Lake" },
    { id: 10, src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200", title: "YUMTHANG", subtitle: "Alpine Flower Valley" },
];

export default function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => {
            window.removeEventListener("resize", handleResize);
            clearInterval(timer);
        };
    }, []);

    const getCardStyle = (index: number) => {
        const total = images.length;
        let diff = (index - currentIndex + total) % total;
        if (diff > total / 2) diff -= total;

        const isActive = diff === 0;
        const isVisible = Math.abs(diff) <= 4; // Increased visibility range for more cards

        if (!isVisible) return { opacity: 0, scale: 0.5, x: diff * 400, rotateY: 0, zIndex: 0 };

        // Slightly increased xBase for a "small distance" between cards
        const xBase = diff * (isMobile ? 120 : 330);

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
        <div className="relative flex h-[580px] w-full items-center justify-center overflow-hidden pt-2 pb-0 md:h-[680px]">
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
                                className="absolute h-[500px] w-[300px] cursor-pointer overflow-hidden rounded-[24px] shadow-none md:h-[550px] md:w-[320px] md:shadow-2xl"
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
                                        unoptimized
                                        sizes="(max-width: 768px) 300px, 320px"
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
                            className="absolute bottom-[10%] left-[8%] flex flex-col items-start text-left text-white md:bottom-[20%] md:left-[12%]"
                        >
                            <h2 className="text-3xl font-black tracking-tight drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] md:text-6xl">
                                {images[currentIndex].title}
                            </h2>
                            <div className="mt-2 h-[2px] w-8 bg-white/90 md:mt-3 md:h-[3px] md:w-16" />
                            <p className="mt-2 text-sm font-bold drop-shadow-[0_5px_12px_rgba(0,0,0,0.6)] md:mt-4 md:text-xl">
                                {images[currentIndex].subtitle}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
