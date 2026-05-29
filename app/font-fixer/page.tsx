"use client";

import { useState } from "react";
import { FiType, FiUploadCloud, FiLoader, FiInfo, FiImage, FiDroplet } from "react-icons/fi";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

interface FontSuggestion {
    name: string;
    category: string;
    reason: string;
}

interface AnalysisData {
    imageAnalysis: string;
    recommendedColor: string;
    colorReason: string;
    placement: {
        xPercentage: number;
        yPercentage: number;
        fontSizePercentage: number;
        align: string;
        justification: string;
    };
    fonts: FontSuggestion[];
}

export default function FontFixer() {
    const { lang, t } = useLanguage();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [error, setError] = useState("");
    const [activeFontIndex, setActiveFontIndex] = useState(0);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setAnalysisData(null); // Reset when new image is uploaded
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setAnalysisData(null); // Reset when new image is uploaded
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!imagePreview) {
            setError(t("ff.errorEmpty"));
            return;
        }

        setLoading(true);
        setError("");
        setAnalysisData(null);
        setActiveFontIndex(0);

        try {
            // Remove the data:image/jpeg;base64, prefix for the API
            const base64Data = imagePreview.split(',')[1];
            
            const reqUrl = "/api/font-fixer";
            const response = await fetch(reqUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageBase64: base64Data, text, lang }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Failed to analyze image");
            }

            if (data.fonts && Array.isArray(data.fonts)) {
                setAnalysisData(data);
            } else {
                throw new Error("Invalid response format from AI");
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 px-4 md:px-8 pt-8 pb-32">
            <header className="space-y-4">
                <h1 className="text-4xl font-extrabold flex items-center gap-4 text-foreground">
                    <FiType className="text-accent" />
                    {t("ff.title")}
                </h1>
                <p className="text-[#8a9ab0] max-w-2xl text-lg">
                    {t("ff.desc")}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Controls & Visual Preview */}
                <div className="space-y-6">
                    {/* Image Box */}
                    <div className="glass p-6 rounded-2xl flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-foreground">{t("ff.step1")}</h3>
                            {imagePreview && (
                                <button onClick={() => { setImageFile(null); setImagePreview(null); setAnalysisData(null); }} className="text-xs text-rose-400 hover:text-rose-500 font-bold uppercase tracking-wider">
                                    {t("ff.clear")}
                                </button>
                            )}
                        </div>

                        {!imagePreview ? (
                            <label
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                className="border-2 border-dashed border-card-border hover:border-accent/50 transition-colors rounded-xl h-64 flex flex-col items-center justify-center text-[#8a9ab0] cursor-pointer bg-card-bg/50 group"
                            >
                                <FiUploadCloud className="text-5xl mb-4 text-accent group-hover:scale-110 transition-transform" />
                                <p className="font-semibold text-foreground">{t("ff.clickDrag")}</p>
                                <p className="text-sm">{t("ff.allowed")}</p>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                        ) : (
                            <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-card-border shadow-lg bg-black/40 flex items-center justify-center" style={{ containerType: 'size' }}>
                                {/* The Base Image */}
                                <Image src={imagePreview} alt="Preview" fill className="object-contain" />
                                
                                {/* Text overlay preview has been moved below */}
                                
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between items-end">
                                    <p className="text-white text-sm font-semibold truncate">{imageFile?.name}</p>
                                    {analysisData && (
                                        <span className="text-[10px] bg-accent/20 text-accent px-2 py-1 rounded-full uppercase tracking-widest font-bold">
                                            {t("ff.aiPositioned")}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Text Box */}
                    <div className="glass p-6 rounded-2xl flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-foreground">{t("ff.step2")}</h3>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full h-32 bg-background border border-card-border rounded-xl p-4 text-foreground outline-none focus:border-accent transition-colors resize-none"
                            placeholder={t("ff.placeholder")}
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !imagePreview}
                            className="w-full py-4 mt-2 flex items-center justify-center gap-3 bg-accent hover:bg-accent/80 text-background font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-[0_0_20px_rgba(0,240,255,0.2)] disabled:shadow-none"
                        >
                            {loading ? (
                                <>
                                    <FiLoader className="animate-spin text-xl" />
                                    {t("ff.btnLoading")}
                                </>
                            ) : (
                                t("ff.btnAnalyze")
                            )}
                        </button>
                        {error && <p className="text-rose-400 text-sm text-center font-semibold mt-2">{error}</p>}
                    </div>
                </div>

                {/* Right Side: Analysis & Results Showcase */}
                <div className="glass p-6 rounded-2xl flex flex-col h-full min-h-[500px]">
                    <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center justify-between">
                        <span>{t("ff.step3")}</span>
                        {analysisData && <span className="text-xs bg-accent/20 text-accent px-3 py-1 rounded-full flex items-center gap-1"><FiImage/> {t("ff.evaluated")}</span>}
                    </h3>
                    
                    <div className="flex-1 bg-background/50 rounded-xl border border-card-border p-6 relative overflow-hidden flex flex-col gap-6">
                        {!analysisData && !loading && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-8 text-center">
                                <p className="text-[#8a9ab0] font-light">
                                    {t("ff.emptyState")}
                                </p>
                            </div>
                        )}

                        {loading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 gap-4">
                                <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                                <p className="text-accent font-semibold tracking-widest uppercase text-sm animate-pulse">{t("ff.runningEngine")}</p>
                            </div>
                        )}

                        {analysisData && (
                            <>
                                {/* Global Analysis Block */}
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="glass p-4 rounded-xl border border-accent/20 bg-accent/5">
                                        <h4 className="flex items-center gap-2 text-accent font-bold mb-2 text-sm uppercase tracking-wider">
                                            <FiInfo /> {t("ff.visualAnalysis")}
                                        </h4>
                                        <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                                            {analysisData.imageAnalysis}
                                        </p>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="glass p-4 rounded-xl border border-card-border flex-1 flex flex-col gap-2">
                                            <h4 className="flex items-center gap-2 text-[#8a9ab0] font-bold text-xs uppercase tracking-wider">
                                                <FiDroplet /> {t("ff.recColor")}
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full border border-card-border shadow-inner" style={{ backgroundColor: analysisData.recommendedColor }} />
                                                <span className="font-mono text-foreground font-bold">{analysisData.recommendedColor}</span>
                                            </div>
                                            <p className="text-xs text-[#8a9ab0]">{analysisData.colorReason}</p>
                                        </div>

                                        <div className="glass p-4 rounded-xl border border-card-border flex-1 flex flex-col gap-2 justify-center text-center sm:text-left">
                                            <h4 className="flex items-center sm:justify-start justify-center gap-2 text-[#8a9ab0] font-bold text-xs uppercase tracking-wider">
                                                <FiImage /> {t("ff.placement")}
                                            </h4>
                                            <p className="text-xs text-foreground font-semibold">
                                                X: {analysisData.placement.xPercentage}% | Y: {analysisData.placement.yPercentage}% | Size: {analysisData.placement.fontSizePercentage}% relative
                                            </p>
                                            <p className="text-xs text-[#8a9ab0]">{analysisData.placement.justification}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Globally inject all 3 AI fonts simultaneously for seamless switching */}
                                <style dangerouslySetInnerHTML={{
                                    __html: analysisData.fonts.map(f => 
                                        `@import url('https://fonts.googleapis.com/css2?family=${f.name.replace(/ /g, '+')}:wght@400;700;900&display=swap');`
                                    ).join('\n')
                                }} />

                                {/* Dedicated Isolated Text Preview */}
                                {text && (
                                    <div className="glass p-8 rounded-xl border border-card-border flex items-center justify-center min-h-[160px] animate-in slide-in-from-bottom-4 fade-in duration-500 relative overflow-hidden bg-black/20">
                                        <div className="absolute inset-0 bg-grid-white/[0.02]" />
                                        
                                        <h2 
                                            key={`preview-font-${activeFontIndex}`}
                                            className="text-4xl md:text-5xl font-bold relative z-10 transition-all duration-500 ease-in-out"
                                            style={{
                                                color: analysisData.recommendedColor,
                                                fontFamily: `"${analysisData.fonts[activeFontIndex].name}", sans-serif`,
                                                wordWrap: "break-word",
                                                textAlign: "center"
                                            }}
                                        >
                                            {text}
                                        </h2>
                                    </div>
                                )}

                                {/* Font Options Map */}
                                <div className="border-t border-card-border pt-4">
                                    <h4 className="text-sm font-bold text-[#8a9ab0] uppercase tracking-wider mb-4">{t("ff.topMatch")}</h4>
                                    <div className="flex flex-col gap-4">
                                        {analysisData.fonts.map((f, i) => {
                                            const fontUrl = `https://fonts.googleapis.com/css2?family=${f.name.replace(/ /g, '+')}:wght@400;700&display=swap`;
                                            const isActive = activeFontIndex === i;
                                            
                                            return (
                                                <div 
                                                    key={i} 
                                                    onClick={() => setActiveFontIndex(i)}
                                                    className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer animate-in slide-in-from-right-8 fade-in group ${isActive ? 'bg-accent/10 border-accent shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'glass border-card-border hover:border-accent/40 hover:bg-card-bg'}`} 
                                                    style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'both' }}
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <h4 className={`text-2xl font-black transition-colors ${isActive ? 'text-accent' : 'text-foreground group-hover:text-accent/80'}`}>{f.name}</h4>
                                                                {isActive && <span className="bg-accent text-background text-[10px] px-2 py-0.5 rounded-full uppercase tracking-bold font-black">{t("ff.activePreview")}</span>}
                                                            </div>
                                                            <p className={`text-xs font-bold tracking-wider uppercase mt-1 ${isActive ? 'text-accent/80' : 'text-[#8a9ab0]'}`}>{f.category}</p>
                                                        </div>
                                                        <a
                                                            href={`https://fonts.google.com/specimen/${f.name.replace(/ /g, '+')}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-xs font-bold text-[#8a9ab0] hover:text-foreground underline underline-offset-4"
                                                        >
                                                            {t("ff.viewGoogle")}
                                                        </a>
                                                    </div>
                                                    <p className={`text-sm leading-relaxed relative pl-4 opacity-90 ${isActive ? 'text-foreground' : 'text-[#8a9ab0]'}`}>
                                                        <span className={`absolute left-0 top-1 w-1 h-full rounded-full transition-colors ${isActive ? 'bg-accent' : 'bg-[#8a9ab0]/30'}`} />
                                                        {f.reason}
                                                    </p>
                                                    
                                                    {text && (
                                                        <div className="mt-4 pt-3 border-t border-card-border/50">
                                                            <p 
                                                                className={`text-xl opacity-90 truncate transition-all ${isActive ? 'text-accent font-bold scale-105 transform origin-left' : 'text-foreground/80'}`} 
                                                                style={{ fontFamily: `"${f.name}", sans-serif` }}
                                                            >
                                                                {text}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
