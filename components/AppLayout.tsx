"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import UserProfile from "./UserProfile";
import { FiMenu, FiX, FiGlobe } from "react-icons/fi";
import { useLanguage, Language } from "@/contexts/LanguageContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
    const { lang, setLang } = useLanguage();
    const pathname = usePathname();

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const languages = [
        { code: "EN", name: "English" },
        { code: "AR", name: "العربية" },
        { code: "FR", name: "Français" },
        { code: "DE", name: "Deutsch" },
    ];

    return (
        <div className="flex w-full min-h-screen relative">
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 w-full z-[60] glass border-b border-card-border p-4 flex items-center justify-between">
                <Link href="/" 
                    onClick={(e) => {
                        if (pathname === "/") {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                    }}
                    className="flex items-center gap-2 group/mobile-logo cursor-pointer"
                >
                    <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/40 bg-gradient-to-br from-accent/20 to-transparent transition-transform duration-300 group-hover/mobile-logo:scale-110 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                        <svg className="w-4 h-4 text-accent fill-current drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 20h20L12 2z" />
                        </svg>
                    </div>
                    <span className="font-bold tracking-widest text-foreground group-hover/mobile-logo:text-accent transition-colors duration-300">ArtiFix</span>
                </Link>

                <div className="flex items-center gap-3">
                    {/* User Profile (Mobile) */}
                    <UserProfile variant="header" />

                    {/* Language Selector */}
                    <div className="relative z-[70]">
                        <button
                            onClick={() => setIsMobileLangOpen(!isMobileLangOpen)}
                            className="flex items-center gap-2 text-[#8a9ab0] hover:text-foreground transition-colors text-sm font-semibold tracking-wider"
                        >
                            <FiGlobe className="text-lg" />
                            {lang}
                        </button>
                        {isMobileLangOpen && (
                            <div
                                className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
                                onClick={() => setIsMobileLangOpen(false)}
                            >
                                <div
                                    className="glass rounded-2xl border border-card-border p-4 w-64 max-w-[80vw] shadow-2xl transition-all"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <h3 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[#8a9ab0] mb-4">Select Language</h3>
                                    <div className="flex flex-col gap-2">
                                        {languages.map(l => (
                                            <button
                                                key={l.code}
                                                onClick={() => {
                                                    setLang(l.code as Language);
                                                    setIsMobileLangOpen(false);
                                                }}
                                                className={`text-center px-4 py-3 rounded-xl transition-all ${lang === l.code
                                                        ? 'bg-accent/10 border border-accent/40 text-accent font-bold shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                                                        : 'text-[#8a9ab0] hover:bg-card-bg hover:text-foreground border border-transparent hover:border-card-border'
                                                    }`}
                                            >
                                                {l.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
 
                    {/* Menu Toggle */}
                    <button onClick={toggleMenu} className="text-2xl text-foreground">
                        {isMobileMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </header>

            {/* Language Selector (Desktop) - Top Right Fixed */}
            <div className="hidden md:flex fixed top-8 right-12 z-[60] items-center gap-4">
                <UserProfile variant="header" />
                
                <div className="group relative">
                    <button className="flex items-center gap-2 text-[#8a9ab0] hover:text-foreground transition-colors text-sm font-semibold tracking-wider px-4 py-2 rounded-full glass border border-card-border hover:border-accent/40">
                        <FiGlobe className="text-lg text-accent" />
                        {lang}
                    </button>
                    <div className="absolute top-full right-0 hidden group-hover:block pt-2">
                        <div className="glass rounded-xl border border-card-border p-2">
                            <div className="flex flex-col gap-1 w-32">
                                {languages.map(l => (
                                    <button
                                        key={l.code}
                                        onClick={() => setLang(l.code as Language)}
                                        className={`text-left px-3 py-2 text-sm rounded-lg transition-colors ${lang === l.code ? 'bg-accent/10 text-accent font-bold' : 'text-[#8a9ab0] hover:bg-card-bg hover:text-foreground'}`}
                                    >
                                        {l.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Overlay for Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-[45]"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <Sidebar
                className={`fixed z-50 transition-transform duration-500 flex-shrink-0 md:translate-x-0 
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                    w-64 md:w-24 md:hover:w-64 top-0 left-0 pt-20 md:pt-4`}
            />

            {/* Main Content Area */}
            <main className="flex-1 w-full md:w-[calc(100%-6rem)] md:ml-24 min-h-screen relative pt-20 md:pt-0 pb-12 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
