"use client";

import { useState, useRef } from "react";
import { FiImage, FiDownloadCloud, FiZap, FiUploadCloud } from "react-icons/fi";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

const dictionaries = {
    EN: {
        title: "Visual Transformer",
        subtitle: "Zero-server cost image format swap and local manipulation right in your browser.",
        dropAreaTitle: "Drop Image Here or Click",
        dropAreaDesc: "Supports PNG, JPG, WEBP, ICO, BMP, TIFF, GIF, AVIF",
        replaceImage: "Replace Image",
        targetFormat: "Target Format",
        converting: "Converting...",
        downloadNow: "Download Now",
        upscalerTitle: "Run AI 4K Upscaler",
        upscalerDesc: "Enhance quality to 4K Ultra HD",
        proTag: "Pro",
        errorAlert: "Error converting image."
    },
    AR: {
        title: "المُحوّل البصري",
        subtitle: "تبديل فوري لتنسيقات الصور ومعالجة محلية داخل متصفحك بدون الحاجة لسيرفر.",
        dropAreaTitle: "اسحب الصورة هنا أو اضغط",
        dropAreaDesc: "يدعم PNG, JPG, WEBP, ICO, BMP, TIFF, GIF, AVIF",
        replaceImage: "استبدال الصورة",
        targetFormat: "الصيغة المستهدفة",
        converting: "جاري التحويل...",
        downloadNow: "تحميل الآن",
        upscalerTitle: "ترقية الصورة لـ 4K ذكاء اصطناعي",
        upscalerDesc: "تحسين الجودة إلى 4K فائقة الدقة",
        proTag: "مدفوع",
        errorAlert: "حدث خطأ أثناء تحويل الصورة."
    },
    FR: {
        title: "Transformateur Visuel",
        subtitle: "Échange gratuit de formats d'image sans serveur et manipulation locale dans le navigateur.",
        dropAreaTitle: "Glissez l'image ici ou cliquez",
        dropAreaDesc: "Supporte PNG, JPG, WEBP, ICO, BMP, TIFF, GIF, AVIF",
        replaceImage: "Remplacer l'image",
        targetFormat: "Format cible",
        converting: "Conversion en cours...",
        downloadNow: "Télécharger maintenant",
        upscalerTitle: "Lancer l'Upscaler IA 4K",
        upscalerDesc: "Améliorer la qualité 4K Ultra HD",
        proTag: "Pro",
        errorAlert: "Erreur lors de la conversion de l'image."
    },
    DE: {
        title: "Visueller Transformator",
        subtitle: "Kostenloser Bildformatwechsel ohne Server und lokale Bearbeitung im Browser.",
        dropAreaTitle: "Bild hier ablegen oder klicken",
        dropAreaDesc: "Unterstützt PNG, JPG, WEBP, ICO, BMP, TIFF, GIF, AVIF",
        replaceImage: "Bild ersetzen",
        targetFormat: "Zielformat",
        converting: "Konvertierung...",
        downloadNow: "Jetzt Herunterladen",
        upscalerTitle: "KI 4K Upscaler starten",
        upscalerDesc: "Qualität auf 4K Ultra HD verbessern",
        proTag: "Pro",
        errorAlert: "Fehler beim Konvertieren des Bildes."
    }
};

export default function VisualTransformer() {
    const { lang } = useLanguage();
    const t = dictionaries[lang as keyof typeof dictionaries] || dictionaries["EN"];
    
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [format, setFormat] = useState<"webp" | "png" | "jpeg" | "ico" | "bmp" | "tiff" | "gif" | "avif">("webp");
    const [isConverting, setIsConverting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile && droppedFile.type.startsWith("image/")) {
            processFile(droppedFile);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            processFile(selectedFile);
        }
    };

    const processFile = (selectedFile: File) => {
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(selectedFile);
    };

    const convertImage = async () => {
        if (!file || !preview) return;
        setIsConverting(true);
        
        try {
            const img = document.createElement("img");
            img.src = preview;
            await new Promise((resolve) => { img.onload = resolve; });

            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Could not get canvas context");
            
            ctx.drawImage(img, 0, 0);
            
            // Convert to the target format
            const dataUrl = canvas.toDataURL(`image/${format}`, 1.0);
            
            // Trigger download
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `converted_image.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error(err);
            alert(t.errorAlert);
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 px-4 pt-8">
            <header className="space-y-4 text-center md:text-left">
                <h1 className="text-4xl font-extrabold flex items-center justify-center md:justify-start gap-4 text-foreground">
                    <FiImage className="text-emerald-400" />
                    {t.title}
                </h1>
                <p className="text-[#8a9ab0] max-w-2xl text-lg mx-auto md:mx-0">
                    {t.subtitle}
                </p>
            </header>

            <div className="glass p-8 rounded-2xl flex flex-col gap-6 items-center text-center">
                {!preview ? (
                    <label 
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="w-full h-80 border-2 border-dashed border-card-border hover:border-emerald-400/50 transition-all duration-300 rounded-xl flex flex-col items-center justify-center bg-card-bg/50 cursor-pointer group"
                    >
                        <FiUploadCloud className="text-6xl mb-4 text-[#8a9ab0] group-hover:text-emerald-400 group-hover:scale-110 transition-all" />
                        <h3 className="text-xl font-bold mb-2 text-foreground">{t.dropAreaTitle}</h3>
                        <p className="text-[#8a9ab0] font-medium mb-4">{t.dropAreaDesc}</p>
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                    </label>
                ) : (
                    <div className="w-full space-y-6">
                        <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-2xl border border-card-border group">
                            <Image src={preview} alt="Preview" fill className="object-contain bg-black/40" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <button 
                                    onClick={() => { setFile(null); setPreview(null); }}
                                    className="px-6 py-2 bg-rose-500/20 text-rose-400 font-bold border border-rose-500/50 rounded-lg hover:bg-rose-500/40 transition-colors shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                                >
                                    {t.replaceImage}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="glass p-4 rounded-xl flex flex-col gap-3 justify-center text-left rtl:text-right">
                                <label className="text-sm font-bold text-[#8a9ab0] uppercase tracking-wider">{t.targetFormat}</label>
                                <select 
                                    value={format} 
                                    onChange={(e) => setFormat(e.target.value as any)}
                                    className="bg-background border border-card-border p-3 rounded-lg text-foreground font-semibold outline-none focus:border-emerald-400 transition-colors cursor-pointer"
                                >
                                    <option value="png">PNG (Lossless)</option>
                                    <option value="jpeg">JPG (Standard)</option>
                                    <option value="webp">WEBP (Modern Web)</option>
                                    <option value="ico">ICO (Website Icon)</option>
                                    <option value="bmp">BMP (Windows Bitmap)</option>
                                    <option value="tiff">TIFF (Print Quality)</option>
                                    <option value="gif">GIF (Static Image)</option>
                                    <option value="avif">AVIF (Next-Gen Format)</option>
                                </select>
                            </div>

                            <button 
                                onClick={convertImage}
                                disabled={isConverting}
                                className="w-full h-full py-4 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-400 border border-emerald-500/40 rounded-xl transition-all shadow-[0_0_20px_rgba(52,211,153,0.15)] flex flex-col items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                <FiDownloadCloud className="text-3xl transition-transform group-hover:-translate-y-1" />
                                <span className="font-bold text-lg">{isConverting ? t.converting : t.downloadNow}</span>
                            </button>
                        </div>
                    </div>
                )}

                <div className="w-full flex pt-8 mt-4 border-t border-card-border/50 justify-center">
                    <button className="flex-1 max-w-sm py-4 glass hover:bg-card-border transition-colors rounded-xl border border-emerald-500/30 glow-effect flex flex-col items-center gap-2 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 rtl:translate-x-full -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
                        <FiZap className="text-2xl text-emerald-400" />
                        <span className="font-semibold text-foreground flex items-center gap-2">
                            {t.upscalerTitle}
                            <span className="bg-emerald-400/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider shadow-[0_0_10px_rgba(52,211,153,0.5)]">{t.proTag}</span>
                        </span>
                        <span className="text-xs text-[#8a9ab0]">{t.upscalerDesc}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
