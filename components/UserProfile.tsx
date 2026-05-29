"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { FiLogOut, FiLogIn, FiUser, FiZap } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function UserProfile({ isCollapsed, variant = "sidebar" }: { isCollapsed?: boolean, variant?: "sidebar" | "header" }) {
    const { data: session, status } = useSession();
    const { t } = useLanguage();

    if (status === "loading") {
        return (
            <div className={variant === "header" ? "h-10 w-24 rounded-full bg-card-bg/50 animate-pulse" : "w-full h-12 rounded-xl bg-card-bg/50 animate-pulse flex items-center px-4"}>
                <div className="w-8 h-8 rounded-full bg-accent/20" />
            </div>
        );
    }

    if (!session) {
        return (
            <button
                onClick={() => signIn("google")}
                className={variant === "header" 
                    ? "flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 hover:bg-accent/20 transition-all duration-300 group/auth"
                    : "w-full flex items-center gap-4 px-3 py-3 rounded-xl bg-accent/10 border border-accent/30 hover:bg-accent/20 transition-all duration-300 group/auth overflow-hidden"
                }
            >
                <FiLogIn className="text-lg text-accent" />
                {(variant === "header" || !isCollapsed) && (
                    <span className="font-bold text-sm text-accent tracking-wide whitespace-nowrap">
                        {t("auth.login")}
                    </span>
                )}
            </button>
        );
    }

    if (variant === "header") {
        return (
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-card-bg/50 border border-card-border">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden border border-accent/20">
                        {session.user.image ? (
                            <Image src={session.user.image} alt={session.user.name || "User"} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                                <FiUser className="text-accent text-xs" />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <FiZap className="text-[10px] text-accent fill-accent/20" />
                        <span className="text-[11px] font-black text-accent">
                            {session.user.credits}
                        </span>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="ml-1 p-1 rounded-md hover:bg-red-500/10 text-[#8a9ab0] hover:text-red-400 transition-colors"
                        title={t("auth.logout")}
                    >
                        <FiLogOut className="text-xs" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            {/* User Info Card */}
            <div className="flex items-center gap-3 p-2 rounded-2xl bg-card-bg/50 border border-card-border group/user relative overflow-hidden">
                <div className="relative w-10 h-10 min-w-[40px] rounded-xl overflow-hidden border border-accent/20">
                    {session.user.image ? (
                        <Image src={session.user.image} alt={session.user.name || "User"} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                            <FiUser className="text-accent" />
                        </div>
                    )}
                </div>

                {!isCollapsed && (
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-bold text-foreground truncate">{session.user.name}</span>
                        <div className="flex items-center gap-1.5">
                            <FiZap className="text-xs text-accent fill-accent/20" />
                            <span className="text-[10px] uppercase tracking-wider font-black text-accent">
                                {session.user.credits} {t("auth.credits")}
                            </span>
                        </div>
                    </div>
                )}

                {!isCollapsed && (
                    <button
                        onClick={() => signOut()}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-[#8a9ab0] hover:text-red-400 transition-colors"
                        title={t("auth.logout")}
                    >
                        <FiLogOut />
                    </button>
                )}
            </div>

            {/* Collapsed Credits Badge */}
            {isCollapsed && (
              <div className="w-10 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                <span className="text-[10px] font-black text-accent">{session.user.credits}</span>
              </div>
            )}
        </div>
    );
}
