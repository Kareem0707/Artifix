"use client";

import { useState } from "react";
import { FiEdit3, FiLoader, FiCopy, FiCheck, FiUsers, FiMessageCircle, FiMonitor, FiSettings, FiMic } from "react-icons/fi";
import { useLanguage, Language } from "@/contexts/LanguageContext";

// Data dictionaries for multi-language support locally
const dictionaries = {
    EN: {
        title: "Content Architect",
        subtitle: "Refine your copy with precision. Select your target audience and let the AI architect your message.",
        inputBox: "1. Raw Content",
        inputPlaceholder: "Paste your unstructured or casual text here...",
        audienceBox: "2. Target Audience (Multi-select)",
        toneBox: "3. Brand Tone",
        platformBox: "4. Target Platform",
        dialectBox: "5. Dialect / Style",
        featuresBox: "6. Smart Features",
        generateBtn: "Architect Content",
        generating: "Drafting Masterpiece...",
        resultBox: "6. Architected Output",
        copy: "Copy Text",
        copied: "Copied!",
        error: "Please enter some text and select at least one audience.",
        audiences: [
            { id: "A_general", label: "General Public" },
            { id: "A_rich", label: "High-Income / VIPs" },
            { id: "A_budget", label: "Budget-Conscious" },
            { id: "A_engineers", label: "Engineers / Tech" },
            { id: "A_workers", label: "Blue-collar Workers" },
            { id: "A_decor", label: "Decor Enthusiasts" },
            { id: "A_mothers", label: "Mothers / Parents" },
            { id: "A_students", label: "Students / Youth" },
            { id: "A_execs", label: "Corporate Executives" },
            { id: "A_investors", label: "Real Estate Investors" },
            { id: "A_doctors", label: "Healthcare Pro" }
        ],
        tones: [
            { id: "T_professional", label: "Highly Professional" },
            { id: "T_casual", label: "Casual & Friendly" },
            { id: "T_persuasive", label: "Persuasive / Sales" },
            { id: "T_urgent", label: "Urgent/FOMO" },
            { id: "T_humorous", label: "Humorous / Witty" },
            { id: "T_empathetic", label: "Empathetic & Caring" }
        ],
        platforms: [
            { id: "P_general", label: "Website / Article" },
            { id: "P_facebook", label: "Facebook Ads" },
            { id: "P_instagram", label: "Instagram Caption" },
            { id: "P_linkedin", label: "LinkedIn Post" },
            { id: "P_twitter", label: "Twitter / X (Short)" },
            { id: "P_tiktok", label: "TikTok Script" },
            { id: "P_email", label: "Cold Email / Newsletter" }
        ],
        dialects: [
            { id: "D_standard", label: "Standard / Neutral" },
            { id: "D_egyptian", label: "Egyptian (if Arabic)" },
            { id: "D_gulf", label: "Khaleeji (if Arabic)" },
            { id: "D_youth", label: "Youth Slang (Gen Z)" },
            { id: "D_levantine", label: "Levantine (if Arabic)" }
        ],
        featureEmojis: "Smart Emojis Placement",
        featureNumbers: "Convert (١٢٣) to (123)"
    },
    AR: {
        title: "مهندس المحتوى",
        subtitle: "نقّح نصوصك بدقة. اختر الشريحة المستهدفة ودع الذكاء الاصطناعي يبني رسالتك التسويقية ببراعة.",
        inputBox: "1. النص الخام (المسودة)",
        inputPlaceholder: "قم بلصق النص العشوائي، الملاحظات، أو الفكرة هنا...",
        audienceBox: "2. الشريحة المستهدفة (يمكن اختيار أكثر من واحدة)",
        toneBox: "3. نبرة العلامة التجارية",
        platformBox: "4. المنصة المستهدفة",
        dialectBox: "5. تخصيص اللهجة والأسلوب",
        featuresBox: "6. مميزات ذكية إضافية",
        generateBtn: "هندسة المحتوى",
        generating: "جاري صياغة التحفة الفنية...",
        resultBox: "6. المحتوى النهائي المنسق",
        copy: "نسخ النص",
        copied: "تم النسخ!",
        error: "الرجاء إدخال نص واختيار شريحة مستهدفة واحدة على الأقل.",
        audiences: [
            { id: "A_general", label: "الجمهور العام" },
            { id: "A_rich", label: "الطبقة الراقية / VIP" },
            { id: "A_budget", label: "الطبقة الاقتصادية" },
            { id: "A_engineers", label: "المهندسين" },
            { id: "A_workers", label: "العمال والحرفيين" },
            { id: "A_decor", label: "المهتمين بالديكور" },
            { id: "A_mothers", label: "الأمهات / العائلات" },
            { id: "A_students", label: "الطلاب / الشباب" },
            { id: "A_execs", label: "أصحاب الشركات والمشاريع" },
            { id: "A_investors", label: "المستثمرين (عقارات/أموال)" },
            { id: "A_doctors", label: "الأطباء" }
        ],
        tones: [
            { id: "T_professional", label: "احترافي ورسمي" },
            { id: "T_casual", label: "ودي وكاجوال" },
            { id: "T_persuasive", label: "إقناعي / بيعي" },
            { id: "T_urgent", label: "عاجل / استعجالي للفورمة" },
            { id: "T_humorous", label: "فكاهي وجذاب" },
            { id: "T_empathetic", label: "عاطفي ومُتَفَهّم" }
        ],
        platforms: [
            { id: "P_general", label: "مقال / موقع إلكتروني" },
            { id: "P_facebook", label: "إعلان فيسبوك" },
            { id: "P_instagram", label: "وصف انستجرام" },
            { id: "P_linkedin", label: "منشور لينكدإن" },
            { id: "P_twitter", label: "تغريدة تويتر / إكس" },
            { id: "P_tiktok", label: "سكريبت تيك توك" },
            { id: "P_email", label: "حملة إيميلات (Newsletter)" }
        ],
        dialects: [
            { id: "D_standard", label: "عربي فصحى / رسمي" },
            { id: "D_egyptian", label: "عامية مصرية جذابة" },
            { id: "D_gulf", label: "لهجة خليجية / سعودية" },
            { id: "D_youth", label: "شبابي معاصر / روش" },
            { id: "D_levantine", label: "لهجة شامية" }
        ],
        featureEmojis: "توزيع إيموجي (Emojis) ذكي",
        featureNumbers: "تحويل الأرقام (١٢٣) إلى (123)"
    },
    FR: {
        title: "Architecte de Contenu",
        subtitle: "Affinez votre copie avec précision. Sélectionnez le public et laissez l'IA créer.",
        inputBox: "1. Contenu Brut",
        inputPlaceholder: "Collez votre texte ici...",
        audienceBox: "2. Public Cible (Choix Multiple)",
        toneBox: "3. Ton de Marque",
        platformBox: "4. Plateforme Cible",
        dialectBox: "5. Dialecte / Style",
        featuresBox: "6. Fonctionnalités",
        generateBtn: "Architecturer le Contenu",
        generating: "Rédaction en cours...",
        resultBox: "6. Résultat",
        copy: "Copier",
        copied: "Copié !",
        error: "Veuillez entrer du texte et sélectionner au moins un public.",
        audiences: [
            { id: "A_general", label: "Grand Public" },
            { id: "A_rich", label: "Haut Revenu/VIP" },
            { id: "A_budget", label: "Économique" },
            { id: "A_engineers", label: "Ingénieurs" },
            { id: "A_workers", label: "Ouvriers" },
            { id: "A_decor", label: "Décoration" },
            { id: "A_mothers", label: "Parents" },
            { id: "A_students", label: "Étudiants" },
            { id: "A_execs", label: "Cadres" },
            { id: "A_investors", label: "Investisseurs Immobiliers" },
            { id: "A_doctors", label: "Professionnels de santé" }
        ],
        tones: [
            { id: "T_professional", label: "Très Professionnel" },
            { id: "T_casual", label: "Amical" },
            { id: "T_persuasive", label: "Persuasif/Vente" },
            { id: "T_urgent", label: "Urgent" },
            { id: "T_humorous", label: "Humoristique" },
            { id: "T_empathetic", label: "Empathique" }
        ],
        platforms: [
            { id: "P_general", label: "Site Web" },
            { id: "P_facebook", label: "Publicités Facebook" },
            { id: "P_instagram", label: "Instagram" },
            { id: "P_linkedin", label: "LinkedIn" },
            { id: "P_twitter", label: "Twitter" },
            { id: "P_tiktok", label: "TikTok" },
            { id: "P_email", label: "Emails" }
        ],
        dialects: [
            { id: "D_standard", label: "Standard / Neutre" },
            { id: "D_egyptian", label: "Égyptien (si arabe)" },
            { id: "D_gulf", label: "Golfe (si arabe)" },
            { id: "D_youth", label: "Argot des jeunes" },
            { id: "D_levantine", label: "Levantin (si arabe)" }
        ],
        featureEmojis: "Emojis intelligents",
        featureNumbers: "Convertir (١٢٣) en (123)"
    },
    DE: {
        title: "Inhaltsarchitekt",
        subtitle: "Verfeinern Sie Ihren Text mit Präzision. Wählen Sie Ihre Zielgruppe.",
        inputBox: "1. Rohentwurf",
        inputPlaceholder: "Geben Sie hier Ihren Text ein...",
        audienceBox: "2. Zielgruppe (Mehrfachauswahl)",
        toneBox: "3. Tonfall",
        platformBox: "4. Zielplattform",
        dialectBox: "5. Dialekt / Stil",
        featuresBox: "6. Intelligente Funktionen",
        generateBtn: "Inhalt generieren",
        generating: "Entwurf wird erstellt...",
        resultBox: "6. Ergebnis",
        copy: "Kopieren",
        copied: "Kopiert!",
        error: "Bitte Text eingeben und mind. eine Zielgruppe wählen.",
        audiences: [
            { id: "A_general", label: "Allgemeines Publikum" },
            { id: "A_rich", label: "Hohes Einkommen / VIPs" },
            { id: "A_budget", label: "Kostenbewusste" },
            { id: "A_engineers", label: "Ingenieure / Technik" },
            { id: "A_workers", label: "Arbeiter" },
            { id: "A_decor", label: "Deko-Interessierte" },
            { id: "A_mothers", label: "Eltern / Mütter" },
            { id: "A_students", label: "Studenten / Jugend" },
            { id: "A_execs", label: "Führungskräfte" },
            { id: "A_investors", label: "Immobilieninvestoren" },
            { id: "A_doctors", label: "Ärzte" }
        ],
        tones: [
            { id: "T_professional", label: "Sehr professionell" },
            { id: "T_casual", label: "Freundlich & Lässig" },
            { id: "T_persuasive", label: "Überzeugend / Verkauf" },
            { id: "T_urgent", label: "Dringend" },
            { id: "T_humorous", label: "Humorvoll" },
            { id: "T_empathetic", label: "Einfühlsam" }
        ],
        platforms: [
            { id: "P_general", label: "Website / Artikel" },
            { id: "P_facebook", label: "Facebook Werbung" },
            { id: "P_instagram", label: "Instagram Beitrag" },
            { id: "P_linkedin", label: "LinkedIn Beitrag" },
            { id: "P_twitter", label: "Twitter / X" },
            { id: "P_tiktok", label: "TikTok Video" },
            { id: "P_email", label: "E-Mails" }
        ],
        dialects: [
            { id: "D_standard", label: "Standard / Neutral" },
            { id: "D_egyptian", label: "Ägyptisch (wenn Arabisch)" },
            { id: "D_gulf", label: "Golf-Arabisch" },
            { id: "D_youth", label: "Jugendsprache" },
            { id: "D_levantine", label: "Levantinisch" }
        ],
        featureEmojis: "Intelligente Emojis",
        featureNumbers: "Zahlen konvertieren (١٢٣ -> 123)"
    }
};

export default function ContentArchitect() {
    const { lang } = useLanguage();
    const t = dictionaries[lang] || dictionaries["EN"];
    
    const [text, setText] = useState("");
    const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);
    const [selectedTone, setSelectedTone] = useState<string>(t.tones[0].label);
    const [selectedPlatform, setSelectedPlatform] = useState<string>(t.platforms[0].label);
    const [selectedDialect, setSelectedDialect] = useState<string>(t.dialects[0].label);
    const [useEmojis, setUseEmojis] = useState(false);
    const [useNumbers, setUseNumbers] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [copied, setCopied] = useState(false);

    const toggleAudience = (label: string) => {
        if (selectedAudiences.includes(label)) {
            setSelectedAudiences(selectedAudiences.filter(a => a !== label));
        } else {
            setSelectedAudiences([...selectedAudiences, label]);
        }
    };

    const handleGenerate = async () => {
        if (!text.trim() || selectedAudiences.length === 0) {
            setErrorMsg(t.error);
            return;
        }

        setErrorMsg("");
        setLoading(true);
        setResult("");

        try {
            const reqUrl = "/api/content-architect";
            const response = await fetch(reqUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    text, 
                    audience: selectedAudiences, 
                    tone: selectedTone,
                    platform: selectedPlatform,
                    dialect: selectedDialect,
                    features: {
                        emojis: useEmojis,
                        numbers: useNumbers
                    },
                    lang 
                }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Failed to architect content");
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
                    <FiEdit3 className="text-blue-400" />
                    {t.title}
                </h1>
                <p className="text-[#8a9ab0] max-w-2xl text-lg">
                    {t.subtitle}
                </p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Left Side: Parameters */}
                <div className="space-y-6">
                    {/* 1. Raw Format Input */}
                    <div className="glass p-6 rounded-2xl border border-card-border overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-2xl"></div>
                        <h3 className="text-lg font-bold text-foreground mb-4">{t.inputBox}</h3>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full h-40 bg-background/50 border border-card-border rounded-xl p-4 text-foreground outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed"
                            placeholder={t.inputPlaceholder}
                        />
                    </div>

                    {/* 2. Target Audience */}
                    <div className="glass p-6 rounded-2xl border border-card-border">
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            <FiUsers className="text-blue-400" />
                            {t.audienceBox}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {t.audiences.map((aud) => {
                                const isSelected = selectedAudiences.includes(aud.label);
                                return (
                                    <button
                                        key={aud.id}
                                        onClick={() => toggleAudience(aud.label)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${isSelected ? 'bg-blue-500/20 text-blue-400 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-transparent text-[#8a9ab0] border-card-border hover:border-blue-400/50'}`}
                                    >
                                        {aud.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. Tone, Platform & Dialect Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="glass p-6 rounded-2xl border border-card-border">
                            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <FiMessageCircle className="text-blue-400" />
                                {t.toneBox}
                            </h3>
                            <select 
                                value={selectedTone}
                                onChange={(e) => setSelectedTone(e.target.value)}
                                className="w-full bg-background border border-card-border p-3 rounded-lg text-foreground outline-none focus:border-blue-400 transition-colors cursor-pointer font-medium"
                            >
                                {t.tones.map(tOption => (
                                    <option key={tOption.id} value={tOption.label}>{tOption.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="glass p-6 rounded-2xl border border-card-border">
                            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <FiMonitor className="text-blue-400" />
                                {t.platformBox}
                            </h3>
                            <select 
                                value={selectedPlatform}
                                onChange={(e) => setSelectedPlatform(e.target.value)}
                                className="w-full bg-background border border-card-border p-3 rounded-lg text-foreground outline-none focus:border-blue-400 transition-colors cursor-pointer font-medium"
                            >
                                {t.platforms.map(pOption => (
                                    <option key={pOption.id} value={pOption.label}>{pOption.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="glass p-6 rounded-2xl border border-card-border">
                            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <FiMic className="text-blue-400" />
                                {t.dialectBox}
                            </h3>
                            <select 
                                value={selectedDialect}
                                onChange={(e) => setSelectedDialect(e.target.value)}
                                className="w-full bg-background border border-card-border p-3 rounded-lg text-foreground outline-none focus:border-blue-400 transition-colors cursor-pointer font-medium"
                            >
                                {t.dialects.map(dOption => (
                                    <option key={dOption.id} value={dOption.label}>{dOption.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 4. Features */}
                    <div className="glass p-6 rounded-2xl border border-card-border">
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            <FiSettings className="text-blue-400" />
                            {t.featuresBox}
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${useEmojis ? 'bg-blue-500 border-blue-500' : 'border-card-border group-hover:border-blue-400'}`}>
                                    {useEmojis && <FiCheck className="text-white text-xs" />}
                                </div>
                                <span className={`font-medium transition-colors ${useEmojis ? 'text-foreground' : 'text-[#8a9ab0]'}`}>{t.featureEmojis}</span>
                                <input type="checkbox" checked={useEmojis} onChange={(e) => setUseEmojis(e.target.checked)} className="hidden" />
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${useNumbers ? 'bg-blue-500 border-blue-500' : 'border-card-border group-hover:border-blue-400'}`}>
                                    {useNumbers && <FiCheck className="text-white text-xs" />}
                                </div>
                                <span className={`font-medium transition-colors ${useNumbers ? 'text-foreground' : 'text-[#8a9ab0]'}`}>{t.featureNumbers}</span>
                                <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} className="hidden" />
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full py-5 flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-500/80 text-white font-bold rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:shadow-none"
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

                </div>

                {/* Right Side: The Output */}
                <div className="glass p-6 sm:p-8 rounded-2xl flex flex-col h-full min-h-[500px] border border-card-border relative overflow-hidden group">
                     {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="flex justify-between items-center mb-6 z-10">
                        <h3 className="text-xl font-bold text-foreground">
                            {t.resultBox}
                        </h3>
                        {result && (
                            <button 
                                onClick={handleCopy}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-card-bg text-[#8a9ab0] hover:text-foreground border border-card-border hover:border-blue-500/50'}`}
                            >
                                {copied ? <FiCheck /> : <FiCopy />}
                                {copied ? t.copied : t.copy}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 bg-background/60 rounded-xl border border-card-border p-6 relative overflow-y-auto z-10 custom-scrollbar shadow-inner">
                        {!result && !loading && (
                            <div className="absolute inset-0 flex items-center justify-center p-8 text-center pointer-events-none">
                                <p className="text-[#8a9ab0]/50 font-medium text-lg max-w-sm">
                                    Configure your target demographics on the left, paste your messy copy, and let the AI architect the perfect message.
                                </p>
                            </div>
                        )}

                        {loading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-20 gap-4">
                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                <p className="text-blue-400 font-bold tracking-widest uppercase text-sm animate-pulse">{t.generating}</p>
                            </div>
                        )}

                        {result && !loading && (
                            <div className="whitespace-pre-wrap text-foreground/90 font-medium leading-loose md:text-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {result}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
