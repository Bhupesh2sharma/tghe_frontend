"use client";

import { useState } from "react";
import { useAdminRegisterMutation } from "../../../store/api";
import { UserPlus, Shield, Info, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import FormStatusOverlay from "../../components/FormStatusOverlay";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function SettingsPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [statusType, setStatusType] = useState<"success" | "error" | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const [register, { isLoading }] = useAdminRegisterMutation();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowStatus(false);

        if (!email || !password) {
            setStatusType("error");
            setStatusMessage("Email and password are required.");
            setShowStatus(true);
            return;
        }

        try {
            await register({ email, password }).unwrap();
            setEmail("");
            setPassword("");
            setStatusType("success");
            setStatusMessage("New admin registered successfully!");
            setShowStatus(true);
        } catch (err: any) {
            setStatusType("error");
            setStatusMessage(
                err?.data?.message || err?.error || "Unable to register admin."
            );
            setShowStatus(true);
        }
    };

    return (
        <div className="mx-auto max-w-[1400px] space-y-10 p-4 lg:p-8">
            {/* Header Section */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="flex flex-col gap-2"
            >
                <h1
                    className="text-4xl font-black tracking-tight text-gray-900 dark:text-white"
                    style={{ fontFamily: '"Lexend Deca", sans-serif' }}
                >
                    Admin Settings
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                    Configure administrative settings and manage your team access.
                </p>
            </motion.div>

            <div className="grid gap-10 lg:grid-cols-12">
                {/* Left Column - Main Form */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="lg:col-span-8"
                >
                    <div className="overflow-hidden rounded-[32px] bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-gray-100 dark:ring-gray-800">
                        <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30 px-10 py-8">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff4106] text-white shadow-lg shadow-[#ff4106]/20">
                                    <UserPlus size={28} />
                                </div>
                                <div>
                                    <h2
                                        className="text-2xl font-bold text-gray-900 dark:text-white"
                                        style={{ fontFamily: '"Lexend Deca", sans-serif' }}
                                    >
                                        Register New Admin
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Grant administrative privileges to a new team member.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleRegister} className="p-10">
                            <div className="grid gap-8 sm:grid-cols-2">
                                <div className="space-y-3">
                                    <label
                                        htmlFor="reg-email"
                                        className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 ml-1"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        id="reg-email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@tghe.com"
                                        className="block w-full rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-5 py-4 text-base text-gray-900 dark:text-gray-100 shadow-inner outline-none transition-all focus:border-[#ff4106] focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-[#ff4106]/10"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label
                                        htmlFor="reg-password"
                                        className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 ml-1"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="reg-password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="block w-full rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-5 py-4 text-base text-gray-900 dark:text-gray-100 shadow-inner outline-none transition-all focus:border-[#ff4106] focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-[#ff4106]/10 pr-14"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#ff4106] dark:hover:text-[#ff4106]"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-6 w-6" />
                                            ) : (
                                                <Eye className="h-6 w-6" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-400 ml-1">
                                        At least 8 characters with numbers & symbols.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-100 dark:border-gray-800 pt-10">
                                <div className="flex items-center gap-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 px-4 py-2 text-amber-700 dark:text-amber-400">
                                    <Shield size={18} className="shrink-0" />
                                    <span className="text-sm font-medium">New admin will have full control.</span>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-2xl bg-[#ff4106] px-10 py-4 text-base font-black uppercase tracking-widest text-white shadow-xl shadow-[#ff4106]/20 transition-all hover:bg-[#e33904] hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {isLoading ? "Processing..." : "Register Now"}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>

                {/* Right Column - Secondary Info */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0, x: 20 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
                    }}
                    className="lg:col-span-4"
                >
                    <div className="sticky top-28 flex flex-col gap-6">
                        {/* Password Policy Box */}
                        <div className="rounded-[32px] border-2 border-blue-50 bg-blue-50/30 p-8 dark:border-blue-900/20 dark:bg-blue-900/5">
                            <div className="flex gap-4 mb-6">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <Info size={24} />
                                </div>
                                <div>
                                    <h4
                                        className="text-lg font-bold text-blue-900 dark:text-blue-200"
                                        style={{ fontFamily: '"Lexend Deca", sans-serif' }}
                                    >
                                        Password Policy
                                    </h4>
                                    <p className="text-xs text-blue-700/60 dark:text-blue-400/60">Guidelines for secure access</p>
                                </div>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm leading-relaxed text-blue-800 dark:text-blue-300">
                                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                                    Use at least 8 characters for stronger security.
                                </li>
                                <li className="flex gap-3 text-sm leading-relaxed text-blue-800 dark:text-blue-300">
                                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                                    Include a mix of upper/lower case letters and numbers.
                                </li>
                                <li className="flex gap-3 text-sm leading-relaxed text-blue-800 dark:text-blue-300">
                                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                                    Admins have full access to enquiry and contact details.
                                </li>
                            </ul>
                        </div>

                        {/* Help/Tips Box */}
                        <div className="rounded-[32px] border-2 border-gray-50 bg-gray-50/50 p-8 dark:border-gray-800 dark:bg-gray-800/30">
                            <h4
                                className="text-lg font-bold text-gray-900 dark:text-white mb-4"
                                style={{ fontFamily: '"Lexend Deca", sans-serif' }}
                            >
                                Management Tips
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                You can register multiple administrators to distribute the workload. Ensure each manager uses their own unique credentials.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <FormStatusOverlay
                isOpen={showStatus}
                onClose={() => setShowStatus(false)}
                type={statusType}
                message={statusMessage}
            />
        </div>
    );
}
