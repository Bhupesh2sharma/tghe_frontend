"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Loader from "./Loader";

export default function LoaderWrapper() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initial load check
        const handleLoad = () => {
            // Small timeout for the GIF to play a bit
            setTimeout(() => {
                setIsLoading(false);
            }, 2000); // 2 seconds minimum feels premium
        };

        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad);
            // Fallback timeout
            const fallback = setTimeout(handleLoad, 5000);
            return () => {
                window.removeEventListener("load", handleLoad);
                clearTimeout(fallback);
            };
        }
    }, []);

    return (
        <AnimatePresence>
            {isLoading && <Loader key="global-loader" />}
        </AnimatePresence>
    );
}
