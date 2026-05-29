"use client";

import { useState } from "react";
import { FiFileText, FiLoader, FiCopy, FiCheck, FiHash, FiEdit2, FiCpu } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";

const dictionaries = {
    EN: {
        title: "Article Forge",
        subtitle: "Generate massive, SEO-optimized 2,000+ word articles strictly designed to bypass AI detectors and sound 100% human.",
        topicBox: "1. Main Topic / Title",
        topicPlaceholder: "e.g., The Future of Artificial Intelligence in Healthcare",
        keywordsBox: "2. SEO Keywords (Optional)",
        keywordsPlaceholder: "e.g., machine learning, diagnostics, future trends",
        toneBox: "3. Narrative Tone",
        generateBtn: "Forge Masterpiece",
        generating: "Forging 2,000+ Words (Takes up to 60s)...",
        resultBox: "4. Your Humanized Article",
        copy: "Copy Markdown",
        copied: "Copied!",
        error: "Please enter a main topic to write about.",
        tones: [
            { id: "T_expert", label: "Expert & Authoritative" },
            { id: "T_storytelling", label: "Storytelling / Narrative" },
            { id: "T_conversational", label: "Conversational & Engaging" },
            { id: "T_academic", label: "Academic / Research-Oriented" }
        ],
        warning: "Warning: High compute processing. Using Gemini 2.5 Flash."
    },
    AR: {
        title: "صائغ المقالات",
        subtitle: "اصنع مقالات عملاقة تتجاوز ٢٠٠٠ كلمة بأسلوب آدمي ١٠٠٪ يتخطى أجهزة كشف الذكاء الاصطناعي بكل سهولة.",
        topicBox: "1. عنوان أو موضوع المقالة",
        topicPlaceholder: "مثال: مستقبل الذكاء الاصطناعي في الطب الحديث",
        keywordsBox: "2. كلمات مفتاحية للسيو (اختياري)",
        keywordsPlaceholder: "مثال: الطب البديل، تحليل البيانات، التكنولوجيا",
        toneBox: "3. نبرة ووتيرة السرد",
        generateBtn: "صياغة التحفة الفنية",
        generating: "جاري كتابة +٢٠٠٠ كلمة (قد يستغرق ٦٠ ثانية)...",
        resultBox: "4. المقال الآدمي الشامل",
        copy: "نسخ المقال",
        copied: "تم النسخ!",
        error: "الرجاء كتابة الفكرة الرئيسية للمقال أولاً.",
        tones: [
            { id: "T_expert", label: "خبير وموثوق" },
            { id: "T_storytelling", label: "روائي وقصصي" },
            { id: "T_conversational", label: "حواري جذاب للمدونات" },
            { id: "T_academic", label: "أكاديمي / بحثي" }
        ],
        warning: "تنبيه: يتم استهلاك قدرة حوسبة عالية (موديل Gemini 2.5 Flash)."
    },
    FR: {
        title: "Forgeron d'Articles",
        subtitle: "Générez des articles massifs de plus de 2000 mots conçus pour contourner les détecteurs IA.",
        topicBox: "1. Sujet Principal",
        topicPlaceholder: "Ex: L'avenir de l'IA en santé",
        keywordsBox: "2. Mots-clés SEO (Optionnel)",
        keywordsPlaceholder: "Ex: machine learning, santé, tendances",
        toneBox: "3. Ton Narratif",
        generateBtn: "Forger l'Article",
        generating: "Génération de 2000+ mots en cours...",
        resultBox: "4. Votre Article Humanisé",
        copy: "Copier le Texte",
        copied: "Copié !",
        error: "Veuillez entrer un sujet principal.",
        tones: [
            { id: "T_expert", label: "Expert & Autoritaire" },
            { id: "T_storytelling", label: "Narratif" },
            { id: "T_conversational", label: "Conversationnel" },
            { id: "T_academic", label: "Académique" }
        ],
        warning: "Avertissement : Puissance de calcul élevée (Gemini 2.5 Flash)."
    },
    DE: {
        title: "Artikel-Schmiede",
        subtitle: "Erstellen Sie massive, SEO-optimierte 2.000+ Wörter Artikel, die 100% menschlich klingen.",
        topicBox: "1. Hauptthema",
        topicPlaceholder: "z.B. Die Zukunft der KI im Gesundheitswesen",
        keywordsBox: "2. SEO-Schlüsselwörter (Optional)",
        keywordsPlaceholder: "z.B. maschinelles Lernen, Diagnose",
        toneBox: "3. Erzählton",
        generateBtn: "Artikel Schmieden",
        generating: "Erstelle 2.000+ Wörter (Kann 60s dauern)...",
        resultBox: "4. Ihr humanisierter Artikel",
        copy: "Kopieren",
        copied: "Kopiert!",
        error: "Bitte geben Sie ein Hauptthema ein.",
        tones: [
            { id: "T_expert", label: "Experte & Maßgeblich" },
            { id: "T_storytelling", label: "Storytelling / Narrativ" },
            { id: "T_conversational", label: "Konversativ & Einnehmend" },
            { id: "T_academic", label: "Akademisch / Forschung" }
        ],
        warning: "Warnung: Hohe Rechenleistung (Gemini 2.5 Flash)."
    }
};

export default function ArticleForge() {
    const { lang } = useLanguage();
    // Use fallback to "EN" in case lang isn't matched
    const t = dictionaries[lang as keyof typeof dictionaries] || dictionaries["EN"];
    
    const [topic, setTopic] = useState("");
    const [keywords, setKeywords] = useState("");
    const [selectedTone, setSelectedTone] = useState<string>(t.tones[0].label);
    
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setErrorMsg(t.error);
            return;
        }

        setErrorMsg("");
        setLoading(true);
        setResult("");

        try {
            const reqUrl = "/api/article-forge";
            const response = await fetch(reqUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    topic,
                    keywords,
                    tone: selectedTone,
                    language: lang
                }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Failed to forge article");
            }

            setResult(data.result);

        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 px-4 md:px-8 pt-8 pb-32">
            <header className="space-y-4">
                <h1 className="text-4xl font-extrabold flex items-center gap-4 text-foreground">
                    <FiFileText className="text-yellow-400" />
                    {t.title}
                </h1>
                <p className="text-[#8a9ab0] max-w-2xl text-lg">
                    {t.subtitle}
                </p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Side: Parameters (Width 4 columns) */}
                <div className="xl:col-span-4 space-y-6">
                    
                    <div className="glass p-6 rounded-2xl border border-card-border overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 rounded-l-2xl"></div>
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            <FiEdit2 className="text-yellow-400" />
                            {t.topicBox}
                        </h3>
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full h-32 bg-background/50 border border-card-border rounded-xl p-4 text-foreground outline-none focus:border-yellow-500 transition-colors resize-none leading-relaxed shadow-inner"
                            placeholder={t.topicPlaceholder}
                        />
                    </div>

                    <div className="glass p-6 rounded-2xl border border-card-border group">
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            <FiHash className="text-yellow-400" />
                            {t.keywordsBox}
                        </h3>
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            className="w-full bg-background border border-card-border p-4 rounded-xl text-foreground outline-none focus:border-yellow-500 transition-colors shadow-inner"
                            placeholder={t.keywordsPlaceholder}
                        />
                    </div>

                    <div className="glass p-6 rounded-2xl border border-card-border group">
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            <FiCpu className="text-yellow-400" />
                            {t.toneBox}
                        </h3>
                        <select 
                            value={selectedTone}
                            onChange={(e) => setSelectedTone(e.target.value)}
                            className="w-full bg-background border border-card-border p-4 rounded-xl text-foreground outline-none focus:border-yellow-500 transition-colors cursor-pointer font-medium"
                        >
                            {t.tones.map(tOption => (
                                <option key={tOption.id} value={tOption.label}>{tOption.label}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full py-5 flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-extrabold rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl shadow-[0_0_30px_rgba(234,179,8,0.3)] disabled:shadow-none"
                    >
                        {loading ? (
                            <>
                                <FiLoader className="animate-spin text-2xl" />
                                {t.generating}
                            </>
                        ) : (
                            t.generateBtn
                        )}
                    </button>
                    {errorMsg && <p className="text-rose-400 text-sm text-center font-bold mt-2">{errorMsg}</p>}

                    <div className="mt-6 flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                        <FiCheck className="text-yellow-500 text-xl shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-500/80 font-medium leading-relaxed">
                            {t.warning}
                        </p>
                    </div>

                </div>

                {/* Right Side: The Output (Width 8 columns) */}
                <div className="xl:col-span-8 glass p-6 sm:p-8 rounded-2xl flex flex-col h-[800px] border border-card-border relative overflow-hidden group">
                     {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />
                    
                    <div className="flex justify-between items-center mb-6 z-10 shrink-0">
                        <h3 className="text-2xl font-bold text-foreground">
                            {t.resultBox}
                        </h3>
                        {result && (
                            <button 
                                onClick={handleCopy}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black border border-yellow-500/50'}`}
                            >
                                {copied ? <FiCheck className="text-lg" /> : <FiCopy className="text-lg" />}
                                {copied ? t.copied : t.copy}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 bg-background/60 rounded-xl border border-card-border p-8 relative overflow-y-auto z-10 custom-scrollbar shadow-inner">
                        {!result && !loading && (
                            <div className="absolute inset-0 flex items-center justify-center p-8 text-center pointer-events-none">
                                <p className="text-[#8a9ab0]/50 font-medium text-lg max-w-sm">
                                    Configure your topic on the left. AI will craft a massive, deeply researched, and highly engaging article right here.
                                </p>
                            </div>
                        )}

                        {loading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-20 gap-6">
                                <div className="relative">
                                    <div className="w-24 h-24 border-8 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
                                    <FiFileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-yellow-500 animate-pulse" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-yellow-400 font-black tracking-widest uppercase animate-pulse">{t.generating}</p>
                                    <p className="text-[#8a9ab0] text-xs font-bold max-w-xs mx-auto text-balance">
                                        We are injecting high burstiness and perplexity to bypass AI detection and sound perfectly human...
                                    </p>
                                </div>
                            </div>
                        )}

                        {result && !loading && (
                            <div className="prose prose-invert prose-yellow max-w-none text-foreground/90 font-medium leading-[2] md:text-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
                                {/* Normally we'd use a Markdown parser component here like ReactMarkdown. For simplicity based on previous pattern, we render whitespace */}
                                <div className="whitespace-pre-wrap">{result}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
