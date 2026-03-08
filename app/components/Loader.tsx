"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Loader() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                transition: { duration: 0.8, ease: "easeInOut" }
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#00843d]"
        >
            <div className="relative h-32 w-32 md:h-48 md:w-48">
                <Image
                    src="/Final_Loader.gif"
                    alt="Loading..."
                    fill
                    className="object-contain"
                    priority
                    unoptimized
                />
            </div>
        </motion.div>
    );
}
