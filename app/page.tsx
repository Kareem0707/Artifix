"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { motion, useScroll, useTransform } from "framer-motion";

import { useLanguage } from "@/contexts/LanguageContext";

// Reusable animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

export default function Home() {
  const { t } = useLanguage();

  const tools = [
    {
      name: t("nav.fontFixer"),
      tagline: t("tool.1.tagline"),
      desc: t("tool.1.desc"),
      href: "/font-fixer",
      color: "from-blue-400 to-accent",
      image: "/images/font-fixer.png",
    },
    {
      name: t("nav.contentArchitect"),
      tagline: t("tool.2.tagline"),
      desc: t("tool.2.desc"),
      href: "/content-architect",
      color: "from-purple-400 to-pink-500",
      image: "/images/content-architect.png",
    },
    {
      name: t("nav.visualTransformer"),
      tagline: t("tool.3.tagline"),
      desc: t("tool.3.desc"),
      href: "/visual-transformer",
      color: "from-emerald-400 to-teal-500",
      image: "/images/visual-transformer.png",
    },
    {
      name: t("nav.promptVault"),
      tagline: t("tool.4.tagline"),
      desc: t("tool.4.desc"),
      href: "/prompt-vault",
      color: "from-orange-400 to-rose-500",
      image: "/images/prompt-vault.png",
    },
    {
      name: t("nav.articleForge"),
      tagline: t("tool.5.tagline"),
      desc: t("tool.5.desc"),
      href: "/article-forge",
      color: "from-yellow-400 to-amber-600",
      image: "/images/article-forge-v2.png",
    },
    {
      name: t("nav.audioDenoise"),
      tagline: t("tool.6.tagline"),
      desc: t("tool.6.desc"),
      href: "/audio-denoise",
      color: "from-cyan-400 to-blue-600",
      image: "/images/audio-denoise.png",
    },
    {
      name: t("nav.imageUpscale"),
      tagline: t("tool.7.tagline"),
      desc: t("tool.7.desc"),
      href: "/image-upscaler",
      color: "from-indigo-400 to-violet-600",
      image: "/images/image-upscaler.png",
    },
    {
      name: t("nav.videoUpscale"),
      tagline: t("tool.8.tagline"),
      desc: t("tool.8.desc"),
      href: "/video-upscaler",
      color: "from-fuchsia-400 to-rose-600",
      image: "/images/video-upscaler.png",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ArtiFix",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web",
    "description": "The ultimate AI toolkit for creators. Write SEO articles, fix Arabic fonts, upscale images and videos, and denoise audio.",
    "url": "https://artifix.tech",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="snap-container bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 1. Hero Section */}
      <section className="snap-section flex flex-col justify-center items-center text-center px-12 lg:px-24 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="max-w-5xl z-10 flex flex-col items-center"
        >
          <motion.h4 variants={fadeUp} className="text-accent uppercase tracking-[0.3em] font-bold text-sm mb-6 flex items-center justify-center gap-4">
            <span className="w-8 h-[2px] bg-accent/50" />
            {t("hero.subtitle")}
            <span className="w-8 h-[2px] bg-accent/50" />
          </motion.h4>

          <motion.h1 variants={fadeUp} className="text-7xl md:text-9xl lg:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-[#8a9ab0] tracking-tighter leading-none mb-2 drop-shadow-2xl">
            ArtiFix<span className="text-accent">.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-2xl md:text-4xl text-foreground font-light tracking-[0.4em] uppercase mb-12 opacity-80">
            Artificial Fix
          </motion.p>

          <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tighter leading-[0.9] mb-8">
            {t("hero.title1")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#4a5568] ml-3">{t("hero.title2")}</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-xl md:text-2xl text-[#8a9ab0] max-w-3xl font-light leading-relaxed mb-16">
            {t("hero.desc")}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col gap-4 items-center mt-8">
            <div className="w-16 h-16 rounded-full border border-card-border flex items-center justify-center animate-bounce text-[#8a9ab0] glow-effect">
              ↓
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#8a9ab0] font-bold opacity-70">{t("hero.scroll")}</span>
          </motion.div>
        </motion.div>

        {/* Floating Background Element */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent blur-[150px] rounded-full pointer-events-none"
        />
      </section>

      {/* 2. Individual Tool Pages (Case Study approach) */}
      {tools.map((tool, idx) => (
        <section key={tool.name} className="snap-section px-6 md:px-12 lg:px-24 py-20 lg:py-0 overflow-hidden relative group">
          <Link href={tool.href} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-32 w-full max-w-7xl mx-auto z-10 cursor-pointer group/link`}>

            {/* Typography / Storytelling Side */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.4 }}
              variants={staggerContainer}
              className="flex-1 space-y-8"
            >
              <motion.h4 variants={fadeUp} className={`uppercase tracking-[0.2em] font-bold text-sm flex items-center gap-4 text-transparent bg-clip-text bg-gradient-to-r ${tool.color}`}>
                <span className={`w-8 h-[2px] bg-gradient-to-r ${tool.color}`} />
                0{idx + 1} // {tool.tagline}
              </motion.h4>

              <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-tight group-hover/link:text-accent transition-colors duration-500">
                {tool.name}
              </motion.h2>

              <motion.p variants={fadeUp} className="text-lg md:text-xl text-[#8a9ab0] font-light leading-relaxed max-w-lg">
                {tool.desc}
              </motion.p>
            </motion.div>

            {/* Interactive Image Showcase Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex-1 w-full flex justify-center items-center perspective-1000"
            >
              <div className={`relative w-[280px] sm:w-[350px] lg:w-full max-w-lg aspect-square rounded-[2rem] lg:rounded-[3rem] overflow-hidden bg-card-bg border border-card-border shadow-2xl transition-all duration-700 ease-out group-hover:scale-105 group-hover:-rotate-2 group-hover:shadow-[0_0_60px_rgba(255,255,255,0.05)]`}>
                <Image
                  src={tool.image}
                  alt={tool.name}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 mix-blend-lighten pointer-events-none"
                  priority={idx < 2}
                />
                {/* Internal Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 pointer-events-none" />
              </div>
            </motion.div>

          </Link>
        </section>
      ))}
    </div>
  );
}
