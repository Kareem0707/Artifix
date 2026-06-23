"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "EN" | "AR" | "FR" | "DE";

interface TranslationDictionary {
    [key: string]: string;
}

const translations: Record<Language, TranslationDictionary> = {
    EN: {
        "nav.dashboard": "Home",
        "nav.fontFixer": "AI Font Fixer",
        "nav.contentArchitect": "Content Architect",
        "nav.visualTransformer": "Visual Transformer",
        "nav.promptVault": "The Prompt Vault",
        "nav.articleForge": "Article Forge",
        "nav.audioDenoise": "Audio Denoise",
        "nav.imageUpscale": "4K Image Upscaler",
        "nav.videoUpscale": "4K Video Upscaler",
        "sidebar.toolkit": "Tool-Kit",
        "sidebar.proPlan": "Pro Plan",
        "sidebar.proDesc": "Unlimited API usage & 4K AI upscaling.",
        "sidebar.upgrade": "Upgrade Now",
        "hero.subtitle": "Digital Studio Tool-Kit",
        "hero.title1": "Creative",
        "hero.title2": "Intelligence.",
        "hero.desc": "The Ultimate AI Tool-kit for Designers & Creators. Streamline your workflow with high-end utilities and precision models.",
        "hero.scroll": "Scroll to Explore Pages",
        "tool.1.tagline": "Intelligent Type Matcher",
        "tool.1.desc": "Upload an image and text. Let Gemini Vision analyze the visual style to suggest the perfect matching Google Fonts for your next big project.",
        "tool.2.tagline": "Smart Spacing & Formalize",
        "tool.2.desc": "Refine your copy. Smart emoji mapping, numeral conversion (١٢٣ to 123), and AI-driven slang-to-business-language translation.",
        "tool.3.tagline": "Zero-Server Cost Tools",
        "tool.3.desc": "Instant local format swap (PNG ↔ WEBP ↔ JPG) and AI-powered 4K upscaling. Enhance your assets right in the browser.",
        "tool.4.tagline": "Curated AI Library",
        "tool.4.desc": "A premium, curated library of high-converting, highly-detailed prompts for Midjourney, DALL-E, ChatGPT, and Gemini with 1-click copy.",
        "tool.5.tagline": "Humanized Long-Form Articles",
        "tool.5.desc": "Generate SEO, 2000+ word articles designed to completely bypass AI detection and read 100% human.",
        "tool.6.tagline": "Studio Quality Sound",
        "tool.6.desc": "Instantly isolate and remove background noise, wind, and echo from your videos. Get crystal clear, studio-quality sound with AI denoising.",
        "tool.7.tagline": "Ultra HD Clarity (Pro)",
        "tool.7.desc": "Upscale your low-resolution images to crystal clear HD and 4K quality using advanced AI models. Exclusive for Pro users.",
        "tool.8.tagline": "Cinematic 4K Videos (Pro)",
        "tool.8.desc": "Enhance and upscale your video footage to stunning HD and 4K resolutions with AI. Exclusive for Pro users.",
        "tool.openBtn": "Open Page",
        "ff.title": "AI Font Fixer",
        "ff.desc": "Upload an image and some text. Gemini Vision will analyze the visual style, find the matching Google Fonts, and predict the best color and placement for your text natively.",
        "ff.step1": "1. Upload Image",
        "ff.clear": "Clear",
        "ff.clickDrag": "Click or Drag & Drop",
        "ff.allowed": "JPG, PNG, WEBP allowed.",
        "ff.aiPositioned": "AI Positioned",
        "ff.step2": "2. Enter Text to Overlay",
        "ff.placeholder": "Type the text you want the font to match and preview on the image...",
        "ff.btnAnalyze": "Suggest Fonts & Layout",
        "ff.btnLoading": "Analyzing Visuals...",
        "ff.errorEmpty": "Please upload an image first.",
        "ff.step3": "3. AI Analysis & Suggestions",
        "ff.evaluated": "Evaluated",
        "ff.emptyState": "Upload an image and run the analysis to discover the perfect Google Fonts, colors, and layout placement.",
        "ff.runningEngine": "Running Gemini Vision Engine...",
        "ff.visualAnalysis": "Visual Analysis",
        "ff.recColor": "Recommended Color",
        "ff.placement": "Best Placement & Size",
        "ff.topMatch": "Top 3 Font Matches",
        "ff.activePreview": "Active Preview",
        "ff.viewGoogle": "View on Google",
        "auth.login": "Sign In",
        "auth.logout": "Sign Out",
        "auth.welcome": "Welcome back",
        "auth.credits": "Credits",
        "auth.needLogin": "Login to Use",
        "auth.loginDesc": "Sign in to access premium AI tools and manage your credits.",
        "footer.managedBy": "This website is managed by"
    },
    AR: {
        "nav.dashboard": "الرئيسية",
        "nav.fontFixer": "مصحح الخطوط الذكي",
        "nav.contentArchitect": "مهندس المحتوى",
        "nav.visualTransformer": "المُحوّل البصري",
        "nav.promptVault": "بنك الـ Prompt",
        "nav.articleForge": "صائغ المقالات",
        "nav.audioDenoise": "تنقية وعزل الصوت",
        "nav.imageUpscale": "مُحسّن الصور 4K",
        "nav.videoUpscale": "مُحسّن الفيديوهات 4K",
        "sidebar.toolkit": "مجموعة الأدوات",
        "sidebar.proPlan": "الخطة الاحترافية",
        "sidebar.proDesc": "استخدام مفتوح للذكاء الاصطناعي مع ترقية دقة الصور لـ 4K.",
        "sidebar.upgrade": "رَقِّ حسابك الآن",
        "hero.subtitle": "أدوات الاستوديو الرقمي",
        "hero.title1": "الذكــاء",
        "hero.title2": "الإبداعي.",
        "hero.desc": "مجموعة أدوات الذكاء الاصطناعي النهائية للمصممين وصناع المحتوى. بسّط عملك بنماذج عالية الدقة.",
        "hero.scroll": "مرر للأسفل لاكتشاف الصفحات",
        "tool.1.tagline": "المُطابق الذكي للخطوط",
        "tool.1.desc": "ارفع صورة مع نص، ودع نموذج جيمناي يحلل النمط المرئي ليقترح لك خطوط جوجل المثالية لمشروعك القادم.",
        "tool.2.tagline": "تنسيق متطور للنصوص",
        "tool.2.desc": "نقّح نصوصك. توزيع ذكي للإيموجي، تحويل الأرقام (١٢٣ إلى 123)، وترجمة بالذكاء الاصطناعي من اللهجة الدارجة إلى لغة الأعمال.",
        "tool.3.tagline": "أدوات بدون تكلفة سيرفر",
        "tool.3.desc": "تبديل فوري وعملي للصيغ (PNG ↔ WEBP) وترقية لدقة 4K. حسّن ملفاتك من المتصفح مباشرة.",
        "tool.4.tagline": "مكتبة ذكية منتقاة",
        "tool.4.desc": "مكتبة متميزة من الأوامر الاحترافية والجاهزة للنسخ بضغطة زر لمنصات ميدجورني، دال-إي، شات جي بي تي، وجيمناي.",
        "tool.5.tagline": "مقالات آدمية طويلة",
        "tool.5.desc": "توليد مقالات احترافية تتجاوز ٢٠٠٠ كلمة ومكتوبة بأسلوب بشري ١٠٠٪ يتخطى أجهزة كشف الذكاء الاصطناعي (Humanize).",
        "tool.6.tagline": "جودة صوت استوديو",
        "tool.6.desc": "اعزل الأصوات المزعجة والضجيج والصدى من فيديوهاتك بضغطة زر. احصل على صوت نقي وواضح كأنك في غرفة معزولة بأعلى جودة.",
        "tool.7.tagline": "وضوح فائق الدقة (Pro)",
        "tool.7.desc": "ارفع جودة صورك الباهتة إلى دقة HD و 4K فائقة الوضوح باستخدام أحدث نماذج الذكاء الاصطناعي. حصري لأصحاب اشتراك الـ Pro.",
        "tool.8.tagline": "فيديوهات سينمائية (Pro)",
        "tool.8.desc": "ارفع جودة فيديوهاتك إلى دقة HD و 4K مذهلة باستخدام الذكاء الاصطناعي. حصري لأصحاب اشتراك الـ Pro.",
        "tool.openBtn": "افتح الأداة",
        "ff.title": "مصحح الخطوط الذكي",
        "ff.desc": "قم برفع صورة وإدخال بعض النص. سيقوم نموذج Gemini Vision بتحليل النمط المرئي، إيجاد خطوط Google المناسبة، وتوقع أفضل لون وتمركز للنص بشكل تلقائي.",
        "ff.step1": "١. ارفع الصورة",
        "ff.clear": "مسح",
        "ff.clickDrag": "اضغط او قم بسحب وافلات الصورة",
        "ff.allowed": "مسموح بصيغ JPG, PNG, WEBP.",
        "ff.aiPositioned": "موقع بالذكاء الاصطناعي",
        "ff.step2": "٢. أدخل النص",
        "ff.placeholder": "اكتب النص الذي تريد معاينته بالخط المناسب على الصورة...",
        "ff.btnAnalyze": "اقترح الخطوط والتصميم",
        "ff.btnLoading": "جاري التحليل البصري...",
        "ff.errorEmpty": "رجاءً قم برفع صورة أولاً.",
        "ff.step3": "٣. تحليل واقتراحات الذكاء الاصطناعي",
        "ff.evaluated": "تم التقييم",
        "ff.emptyState": "ارفع صورة وشغل التحليل لاستكشاف الخطوط المثالية والألوان وأفضل تمركز للنص.",
        "ff.runningEngine": "جاري تشغيل محرك Gemini Vision...",
        "ff.visualAnalysis": "التحليل البصري",
        "ff.recColor": "اللون المقترح",
        "ff.placement": "أفضل تمركز وحجم",
        "ff.topMatch": "أفضل ٣ خطوط مطابقة",
        "ff.activePreview": "المعاينة الحالية",
        "ff.viewGoogle": "عرض في Google",
        "auth.login": "تسجيل الدخول",
        "auth.logout": "تسجيل الخروج",
        "auth.welcome": "أهلاً بك مجدداً",
        "auth.credits": "الرصيد",
        "auth.needLogin": "سجل دخول للاستخدام",
        "auth.loginDesc": "قم بتسجيل الدخول للوصول إلى أدوات الذكاء الاصطناعي وإدارة رصيدك.",
        "footer.managedBy": "تتم ادارة هذا الموقع بواسطة"
    },
    FR: {
        "nav.dashboard": "Accueil",
        "nav.fontFixer": "Correcteur IA de Polices",
        "nav.contentArchitect": "Architecte de Contenu",
        "nav.visualTransformer": "Transformateur Visuel",
        "nav.promptVault": "Coffre aux Prompts",
        "nav.articleForge": "Forgeron d'Articles",
        "nav.audioDenoise": "Désabruitage Audio",
        "nav.imageUpscale": "Améliorateur d'Images 4K",
        "nav.videoUpscale": "Améliorateur de Vidéos 4K",
        "sidebar.toolkit": "Boîte à Outils",
        "sidebar.proPlan": "Plan Pro",
        "sidebar.proDesc": "Utilisation illimitée de l'API & upscaling 4K IA.",
        "sidebar.upgrade": "Mettre à Niveau",
        "hero.subtitle": "Boîte à Outils Numérique",
        "hero.title1": "Créative",
        "hero.title2": "Intelligence.",
        "hero.desc": "L'outil IA ultime pour les designers et créateurs. Optimisez votre flux de travail avec des utilitaires haut de gamme.",
        "hero.scroll": "Défilez pour Explorer",
        "tool.1.tagline": "Sélection Intelligente",
        "tool.1.desc": "Téléchargez une image et du texte. Laissez Gemini Vision analyser le style pour suggérer des Google Fonts parfaites.",
        "tool.2.tagline": "Espacement & Formalisation",
        "tool.2.desc": "Affinez votre copie. Mappage intelligent des émojis et traduction IA du langage familier au langage professionnel.",
        "tool.3.tagline": "Utilitaires Sans Serveur",
        "tool.3.desc": "Échange local instantané de formats (PNG ↔ WEBP) et upscaling 4K. Améliorez vos ressources dans le navigateur.",
        "tool.4.tagline": "Bibliothèque IA Soigneusement Sélectionnée",
        "tool.4.desc": "Une bibliothèque premium de prompts détaillés pour Midjourney, DALL-E, ChatGPT, et Gemini.",
        "tool.5.tagline": "Articles SEO Humanisés",
        "tool.5.desc": "Générez des articles de plus de 2000 mots conçus pour contourner la détection IA.",
        "tool.6.tagline": "Son Qualité Studio",
        "tool.6.desc": "Isolez et supprimez instantanément les bruits de fond de vos vidéos pour un son clair et pur.",
        "tool.7.tagline": "Clarté Ultra HD (Pro)",
        "tool.7.desc": "Améliorez vos images vers une qualité HD et 4K exceptionnelle grâce à l'IA. Exclusif aux utilisateurs Pro.",
        "tool.8.tagline": "Vidéos 4K Cinématographiques (Pro)",
        "tool.8.desc": "Améliorez la résolution de vos vidéos vers la HD et la 4K. Exclusif aux utilisateurs Pro.",
        "tool.openBtn": "Ouvrir la Page",
        "ff.title": "Correcteur IA de Polices",
        "ff.desc": "Téléchargez une image et du texte. Gemini Vision analysera le style, trouvera les polices Google correspondantes et prédira la meilleure couleur et le meilleur placement.",
        "ff.step1": "1. Télécharger l'image",
        "ff.clear": "Effacer",
        "ff.clickDrag": "Cliquez ou Glissez-Déposez",
        "ff.allowed": "JPG, PNG, WEBP autorisés.",
        "ff.aiPositioned": "Positionné par l'IA",
        "ff.step2": "2. Entrer le texte",
        "ff.placeholder": "Tapez le texte que vous souhaitez prévisualiser sur l'image...",
        "ff.btnAnalyze": "Suggérer des polices",
        "ff.btnLoading": "Analyse Visuelle...",
        "ff.errorEmpty": "Veuillez d'abord télécharger une image.",
        "ff.step3": "3. Analyse IA & Suggestions",
        "ff.evaluated": "Évalué",
        "ff.emptyState": "Téléchargez une image et lancez l'analyse pour découvrir les Google Fonts parfaites.",
        "ff.runningEngine": "Exécution de Gemini Vision...",
        "ff.visualAnalysis": "Analyse Visuelle",
        "ff.recColor": "Couleur Recommandée",
        "ff.placement": "Meilleur Placement",
        "ff.activePreview": "Aperçu Actif",
        "ff.viewGoogle": "Voir sur Google",
        "footer.managedBy": "Ce site web est géré par"
    },
    DE: {
        "nav.dashboard": "Startseite",
        "nav.fontFixer": "KI Schrift-Fixierer",
        "nav.contentArchitect": "Inhaltsarchitekt",
        "nav.visualTransformer": "Visueller Transformator",
        "nav.promptVault": "Der Prompt-Tresor",
        "nav.articleForge": "Artikel-Schmiede",
        "nav.audioDenoise": "Audio-Rauschunterdrückung",
        "nav.imageUpscale": "4K Bild-Upscaler",
        "nav.videoUpscale": "4K Video-Upscaler",
        "sidebar.toolkit": "Werkzeugkasten",
        "sidebar.proPlan": "Pro-Plan",
        "sidebar.proDesc": "Unbegrenzte API-Nutzung & 4K KI-Skalierung.",
        "sidebar.upgrade": "Jetzt Upgraden",
        "hero.subtitle": "Digitales Studio-Toolkit",
        "hero.title1": "Kreative",
        "hero.title2": "Intelligenz.",
        "hero.desc": "Das ultimative KI-Toolkit für Designer & Ersteller. Optimieren Sie Ihren Workflow mit High-End-Modellen.",
        "hero.scroll": "Scrollen Zum Erkunden",
        "tool.1.tagline": "Intelligenter Typ-Matcher",
        "tool.1.desc": "Laden Sie ein Bild und Text hoch. Lassen Sie Gemini Vision den Stil analysieren, um perfekt passende Google Fonts vorzuschlagen.",
        "tool.2.tagline": "Intelligenter Abstand & Formalisieren",
        "tool.2.desc": "Verfeinern Sie Ihren Text. Intelligentes Emoji-Mapping, Umwandlung von Zahlen und KI-gesteuerte Übersetzung.",
        "tool.3.tagline": "Zero-Server Kostenpflichtige Tools",
        "tool.3.desc": "Sofortiger lokaler Formatwechsel (PNG ↔ WEBP) und KI-gestützte 4K-Hochskalierung direkt im Browser.",
        "tool.4.tagline": "Kuratierte KI-Bibliothek",
        "tool.4.desc": "Eine Premium-Bibliothek hochkonvertierender Prompts für Midjourney, DALL-E, ChatGPT und Gemini mit 1-Klick-Kopie.",
        "tool.5.tagline": "Humanisierte SEO-Artikel",
        "tool.5.desc": "Erstellen Sie über 2000 Wörter lange Artikel, die KI-Erkennungen umgehen und menschlich klingen.",
        "tool.6.tagline": "Studioqualität Sound",
        "tool.6.desc": "Isolieren und entfernen Sie sofort Hintergrundgeräusche aus Ihren Videos für klaren Studio-Sound.",
        "tool.7.tagline": "Ultra HD Klarheit (Pro)",
        "tool.7.desc": "Skalieren Sie Ihre Bilder mit KI in brillante HD- und 4K-Qualität hoch. Exklusiv für Pro-Benutzer.",
        "tool.8.tagline": "Filmische 4K-Videos (Pro)",
        "tool.8.desc": "Verbessern Sie Ihre Videos auf atemberaubende HD- und 4K-Auflösungen. Exklusiv für Pro-Benutzer.",
        "tool.openBtn": "Seite Öffnen",
        "ff.title": "KI Schrift-Fixierer",
        "ff.desc": "Laden Sie ein Bild und Text hoch. Gemini Vision analysiert den Stil, findet passende Google Fonts und sagt die beste Farbe und Platzierung voraus.",
        "ff.step1": "1. Bild hochladen",
        "ff.clear": "Löschen",
        "ff.clickDrag": "Klicken oder Ziehen & Ablegen",
        "ff.allowed": "JPG, PNG, WEBP erlaubt.",
        "ff.aiPositioned": "KI-Positioniert",
        "ff.step2": "2. Text eingeben",
        "ff.placeholder": "Geben Sie den Text ein, den Sie auf dem Bild anzeigen möchten...",
        "ff.btnAnalyze": "Schriftarten vorschlagen",
        "ff.btnLoading": "Visuelle Analyse...",
        "ff.errorEmpty": "Bitte laden Sie zuerst ein Bild hoch.",
        "ff.step3": "3. KI-Analyse & Vorschläge",
        "ff.evaluated": "Ausgewertet",
        "ff.emptyState": "Laden Sie ein Bild hoch, um die perfekten Google Fonts zu entdecken.",
        "ff.runningEngine": "Gemini Vision läuft...",
        "ff.visualAnalysis": "Visuelle Analyse",
        "ff.recColor": "Empfohlene Farbe",
        "ff.placement": "Beste Platzierung",
        "ff.activePreview": "Aktive Vorschau",
        "ff.viewGoogle": "Auf Google ansehen",
        "footer.managedBy": "Diese Website wird verwaltet von"
    }
};

interface LanguageContextType {
    lang: Language;
    setLang: (l: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
    lang: "EN",
    setLang: () => { },
    t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Language>("EN");

    // Load saved preference
    useEffect(() => {
        const saved = localStorage.getItem("artifix_lang") as Language;
        if (saved && ["EN", "AR", "FR", "DE"].includes(saved)) {
            setLang(saved);
        }
    }, []);

    // Sync dir to HTML depending on language
    useEffect(() => {
        localStorage.setItem("artifix_lang", lang);
        const html = document.querySelector("html");
        const body = document.querySelector("body");
        if (html && body) {
            if (lang === "AR") {
                html.setAttribute("dir", "rtl");
                html.setAttribute("lang", "ar");
                // Set the font on body where the next/font variables actually exist
                body.style.setProperty("--font-sans", "var(--font-lalezar)");
            } else {
                html.setAttribute("dir", "ltr");
                html.setAttribute("lang", lang.toLowerCase());
                body.style.setProperty("--font-sans", "var(--font-geist-sans)");
            }
        }
    }, [lang]);

    const t = (key: string) => {
        return translations[lang][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}
