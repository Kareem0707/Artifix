"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiType, FiAlignLeft, FiImage, FiDatabase, FiFileText, FiMic, FiMaximize, FiVideo } from "react-icons/fi";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useLanguage } from "@/contexts/LanguageContext";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const navItemsKeys = [
    { nameKey: "nav.dashboard", href: "/", icon: FiHome },
    { nameKey: "nav.fontFixer", href: "/font-fixer", icon: FiType },
    { nameKey: "nav.contentArchitect", href: "/content-architect", icon: FiAlignLeft },
    { nameKey: "nav.visualTransformer", href: "/visual-transformer", icon: FiImage },
    { nameKey: "nav.promptVault", href: "/prompt-vault", icon: FiDatabase },
    { nameKey: "nav.articleForge", href: "/article-forge", icon: FiFileText },
    { nameKey: "nav.audioDenoise", href: "/audio-denoise", icon: FiMic },
    { nameKey: "nav.imageUpscale", href: "/image-upscaler", icon: FiMaximize },
    { nameKey: "nav.videoUpscale", href: "/video-upscaler", icon: FiVideo },
];

export default function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const { t } = useLanguage();

    return (
        <aside
            className={cn(
                "group bg-[#0e1020]/95 backdrop-blur-2xl border-r border-card-border h-screen sticky top-0 flex flex-col p-4 overflow-x-hidden transition-all duration-500 z-50",
                className
            )}
        >
            <Link href="/" 
                onClick={(e) => {
                    if (pathname === "/") {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                }}
                className="flex items-center gap-4 mb-10 mt-2 px-2 group/logo cursor-pointer"
            >
                <div className="min-w-[40px] w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center glow-effect border border-accent/40 shadow-[0_0_20px_rgba(0,240,255,0.2)] bg-gradient-to-br from-accent/20 to-transparent transition-transform duration-300 group-hover/logo:scale-110">
                    <svg className="w-5 h-5 text-accent fill-current drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 20h20L12 2z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-black tracking-widest text-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-100 whitespace-nowrap group-hover/logo:text-accent">ArtiFix</h1>
            </Link>

            <nav className="flex-1 flex flex-col gap-3 mt-4">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#8a9ab0] mb-2 font-bold px-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {t("sidebar.toolkit")}
                </h3>
                {navItemsKeys.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group/item",
                                isActive
                                    ? "bg-accent/10 text-accent border border-accent/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                                    : "text-[#8a9ab0] hover:bg-card-bg hover:text-foreground hover:border-card-border border border-transparent"
                            )}
                        >
                            {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full shadow-[0_0_10px_rgba(0,240,255,0.8)]" />}
                            <div className="min-w-[24px] flex items-center justify-center ml-1 z-10">
                                <item.icon className={cn("text-xl transition-transform duration-300 group-hover/item:scale-110", isActive && "text-accent")} />
                            </div>
                            <span className="font-semibold tracking-wide whitespace-nowrap opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10">{t(item.nameKey)}</span>
                        </Link>
                    );
                })}
            </nav>

        </aside>
    );
}
