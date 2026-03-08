"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";

interface FormStatusOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    type: "success" | "error" | null;
    message: string | null;
}

export default function FormStatusOverlay({
    isOpen,
    onClose,
    type,
    message,
}: FormStatusOverlayProps) {
    if (!type || !message) return null;

    const isSuccess = type === "success";

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-6 top-6 text-neutral-400 transition-colors hover:text-neutral-600"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.1,
                                }}
                                className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${isSuccess ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                    }`}
                            >
                                {isSuccess ? (
                                    <CheckCircle2 className="h-12 w-12" />
                                ) : (
                                    <XCircle className="h-12 w-12" />
                                )}
                            </motion.div>

                            <h3
                                className="mb-2 text-2xl font-bold text-neutral-900"
                                style={{ fontFamily: '"Lexend Deca", sans-serif' }}
                            >
                                {isSuccess ? "Thank You!" : "Oops!"}
                            </h3>
                            <p className="text-neutral-600" style={{ fontFamily: '"Lexend Deca", sans-serif' }}>
                                {message}
                            </p>

                            <button
                                onClick={onClose}
                                className={`mt-8 w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white transition-transform active:scale-95 ${isSuccess ? "bg-[#00843d] hover:bg-[#006b31]" : "bg-[#ff4106] hover:bg-[#e33904]"
                                    }`}
                                style={{ fontFamily: '"Lexend Deca", sans-serif' }}
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
