"use client";

import { signIn } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
    const { t, lang } = useLanguage();

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-card-bg/50 backdrop-blur-2xl border border-card-border p-8 rounded-[2.5rem] shadow-2xl z-10 text-center"
            >
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6 glow-effect border border-accent/30 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                    <svg className="w-8 h-8 text-accent fill-current" viewBox="0 0 24 24">
                        <path d="M12 2L2 20h20L12 2z" />
                    </svg>
                </div>

                <h1 className="text-3xl font-black mb-2 text-foreground tracking-tight">
                    ArtiFix<span className="text-accent">.</span>
                </h1>
                <p className="text-[#8a9ab0] mb-8 text-sm leading-relaxed">
                    {t("auth.loginDesc")}
                </p>

                <button
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                    className="w-full flex items-center justify-center gap-4 bg-white hover:bg-white/90 text-black font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl"
                >
                    <FcGoogle className="text-2xl" />
                    <span>{t("auth.login")} with Google</span>
                </button>

                <p className="mt-8 text-[10px] text-[#8a9ab0] uppercase tracking-widest font-bold opacity-50">
                    Secure Cloud Infrastructure & Credits Powered by Supabase
                </p>
            </motion.div>
        </div>
    );
}
