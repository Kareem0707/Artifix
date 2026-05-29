"use client";

import { useState, useRef, useEffect } from "react";
import { FiDatabase, FiSend, FiLoader, FiCopy, FiCheck, FiUser, FiCpu, FiMessageSquare, FiImage, FiVideo, FiPenTool, FiType, FiCode } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";

const dictionaries = {
    EN: {
        title: "The Prompt Vault Wizard",
        subtitle: "Don't know how to prompt? Tell me your idea, I'll ask 5-7 expert questions, and craft the ultimate cinematic prompt for you.",
        inputPlaceholder: "Type your raw idea here (e.g. A flying futuristic car)...",
        sendBtn: "Send",
        generating: "Thinking...",
        copied: "Copied!",
        categories: {
            images: "Images & AI Art",
            videos: "AI Videos (Sora)",
            logos: "Logos & Branding",
            copywriting: "Copywriting",
            code: "Code & Dev"
        },
        greetings: "Hello! I am your personal Prompt Architect. Give me a brief, simple idea of what you want to create, and I will help you turn it into a master prompt by asking a few detailed questions. What's on your mind?",
    },
    AR: {
        title: "خبير بنك الأوامر (Prompt Wizard)",
        subtitle: "لا تعرف كيف تكتب أوامر احترافية؟ أعطني فكرتك البسيطة، سأسألك من 5 لـ 7 أسئلة دقيقة لأستخلص الفكرة، ثم أصنع لك أقوى أمر سينمائي جاهز للنسخ.",
        inputPlaceholder: "اكتب فكرتك العشوائية هنا (مثال: سيارة طائرة في المستقبل)...",
        sendBtn: "إرسال",
        generating: "يُفكر...",
        copied: "تم النسخ!",
        categories: {
            images: "صور وتصاميم فنية",
            videos: "فيديوهات ذكاء اصطناعي",
            logos: "شعارات وهويات تجارية",
            copywriting: "كتابة محتوى وتسويق",
            code: "برمجة وأكواد"
        },
        greetings: "أهلاً بك! أنا خبير الأوامر الشخصي الخاص بك. أعطني نبذة بسيطة عن ما تريد تصميمه أو كتابته، وسأطرح عليك عدة أسئلة دقيقة لنخرج بأقوى أمر (Prompt) احترافي. ما الذي يدور في ذهنك؟",
    },
    FR: {
        title: "Le Magicien des Prompts",
        subtitle: "Vous ne savez pas comment prompter? Donnez-moi votre idée, je poserai 5-7 questions et fabriquerai le prompt ultime.",
        inputPlaceholder: "Tapez votre idée brute ici...",
        sendBtn: "Envoyer",
        generating: "Réflexion...",
        copied: "Copié !",
        categories: {
            images: "Images et Art IA",
            videos: "Vidéos IA (Sora)",
            logos: "Logos et Marques",
            copywriting: "Rédaction",
            code: "Code et Dév"
        },
        greetings: "Bonjour ! Je suis votre Architecte de Prompts. Donnez-moi une idée simple de ce que vous voulez, et nous en ferons un chef-d'œuvre en quelques questions. À quoi pensez-vous ?",
    },
    DE: {
        title: "Der Prompt-Zauberer",
        subtitle: "Sie wissen nicht, wie man promptet? Nennen Sie mir Ihre Idee, ich stelle 5-7 Fragen und erstelle den ultimativen Prompt.",
        inputPlaceholder: "Tippen Sie Ihre rohe Idee hier ein...",
        sendBtn: "Senden",
        generating: "Denkt nach...",
        copied: "Kopiert!",
        categories: {
            images: "Bilder & KI-Kunst",
            videos: "KI-Videos (Sora)",
            logos: "Logos & Marken",
            copywriting: "Copywriting",
            code: "Code & Dev"
        },
        greetings: "Hallo! Ich bin Ihr persönlicher Prompt-Architekt. Geben Sie mir eine einfache Idee, und wir machen daraus mit ein paar Fragen den perfekten Prompt. Was haben Sie vor?",
    }
};

type Message = {
    role: "user" | "model";
    text: string;
};

export default function PromptVaultWizard() {
    const { lang } = useLanguage();
    const t = dictionaries[lang as keyof typeof dictionaries] || dictionaries["EN"];
    
    type CategoryKey = "images" | "videos" | "logos" | "copywriting" | "code";
    
    const [category, setCategory] = useState<CategoryKey>("images");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [copiedContent, setCopiedContent] = useState<string | null>(null);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    const categories = [
        { id: "images", label: t.categories.images, icon: FiImage },
        { id: "videos", label: t.categories.videos, icon: FiVideo },
        { id: "logos", label: t.categories.logos, icon: FiPenTool },
        { id: "copywriting", label: t.categories.copywriting, icon: FiType },
        { id: "code", label: t.categories.code, icon: FiCode },
    ];

    useEffect(() => {
        // Reset chat when category or language changes
        setMessages([
            { role: "model", text: t.greetings }
        ]);
    }, [category, lang, t.greetings]);

    useEffect(() => {
        // Scroll to bottom when messages change
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userText = input.trim();
        setInput("");
        
        const newHistory = [...messages, { role: "user" as const, text: userText }];
        setMessages(newHistory);
        setLoading(true);

        try {
            const reqUrl = "/api/prompt-vault";
            const response = await fetch(reqUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    category,
                    history: newHistory.filter(m => m.text !== t.greetings), // Send all except greeting to save tokens/confusion
                    lang
                }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Failed to generate response");
            }

            setMessages((prev) => [...prev, { role: "model", text: data.result }]);

        } catch (err: any) {
            console.error(err);
            setMessages((prev) => [...prev, { role: "model", text: "Sorry, an error occurred. " + (err.message || "") }]);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedContent(text);
        setTimeout(() => setCopiedContent(null), 2500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Helper to render AI messages. If it contains a markdown prompt block (```prompt ... ```), render a special card.
    const renderMessageText = (text: string) => {
        const promptBlockRegex = /```prompt\n([\s\S]*?)```/gi;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = promptBlockRegex.exec(text)) !== null) {
            // Text before the block
            if (match.index > lastIndex) {
                parts.push({ type: "text", content: text.substring(lastIndex, match.index) });
            }
            // The prompt block
            parts.push({ type: "prompt", content: match[1].trim() });
            lastIndex = match.index + match[0].length;
        }

        // Remaining text
        if (lastIndex < text.length) {
            parts.push({ type: "text", content: text.substring(lastIndex) });
        }

        // If no prompt block was found, just return normal text
        if (parts.length === 0) return <p className="whitespace-pre-wrap leading-relaxed">{text}</p>;

        return (
            <div className="space-y-4">
                {parts.map((p, i) => {
                    if (p.type === "text") {
                        return <p key={i} className="whitespace-pre-wrap leading-relaxed">{p.content}</p>;
                    }
                    if (p.type === "prompt") {
                        const isCopied = copiedContent === p.content;
                        return (
                            <div key={i} className="my-6 p-1 rounded-2xl bg-gradient-to-br from-orange-500/50 to-rose-500/50 p-[2px] shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                                <div className="bg-background rounded-xl overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-2 bg-card-bg border-b border-card-border">
                                        <div className="flex items-center gap-2">
                                            <FiDatabase className="text-orange-400" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-[#8a9ab0]">Final Master Prompt</span>
                                        </div>
                                        <button 
                                            onClick={() => handleCopy(p.content.toString())}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isCopied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-background hover:bg-card-border text-foreground border border-card-border hover:border-orange-400/50'}`}
                                        >
                                            {isCopied ? <FiCheck /> : <FiCopy />}
                                            {isCopied ? t.copied : "Copy Prompt"}
                                        </button>
                                    </div>
                                    <div className="p-6 bg-background/50">
                                        <p className="font-mono text-sm leading-loose text-orange-200 select-all">
                                            {p.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 px-4 md:px-8 pt-8 pb-16 flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-6rem)]">
            <header className="space-y-4 shrink-0">
                <h1 className="text-4xl font-extrabold flex items-center gap-4 text-foreground">
                    <FiMessageSquare className="text-orange-400" />
                    {t.title}
                </h1>
                <p className="text-[#8a9ab0] max-w-2xl text-lg">
                    {t.subtitle}
                </p>
            </header>

            {/* Category Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar shrink-0">
                {categories.map((c) => (
                    <button 
                        key={c.id} 
                        onClick={() => setCategory(c.id as CategoryKey)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all whitespace-nowrap font-bold text-sm ${
                            category === c.id 
                            ? "bg-gradient-to-br from-orange-500/20 to-rose-500/20 text-orange-400 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]" 
                            : "bg-background text-[#8a9ab0] border-card-border hover:border-orange-400/30 hover:text-foreground hover:bg-card-bg"
                        }`}
                    >
                        <c.icon className={category === c.id ? "text-lg" : "text-lg opacity-70"} />
                        {c.label}
                    </button>
                ))}
            </div>

            {/* Chat Interface Container */}
            <div className="flex-1 glass rounded-3xl border border-card-border flex flex-col overflow-hidden relative shadow-2xl min-h-[500px]">
                {/* Glow Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

                {/* Messages Area */}
                <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 z-10 custom-scrollbar scroll-smooth"
                >
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`max-w-[85%] md:max-w-[75%] rounded-3xl p-5 ${
                                msg.role === 'user' 
                                ? 'bg-gradient-to-br from-orange-500 to-rose-500 text-white rounded-tr-sm shadow-lg' 
                                : 'bg-card-bg border border-card-border text-foreground rounded-tl-sm shadow-md'
                            }`}>
                                <div className="flex items-center gap-3 mb-3 shrink-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-white/20' : 'bg-orange-500/20 text-orange-400'}`}>
                                        {msg.role === 'user' ? <FiUser /> : <FiCpu />}
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-wider ${msg.role === 'user' ? 'text-white/80' : 'text-[#8a9ab0]'}`}>
                                        {msg.role === 'user' ? 'You' : 'Prompt Architect'}
                                    </span>
                                </div>
                                <div className="pl-11">
                                    {renderMessageText(msg.text)}
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start animate-in fade-in duration-300">
                             <div className="max-w-[75%] rounded-3xl rounded-tl-sm p-6 bg-card-bg border border-card-border text-foreground flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 border-t-2 border-orange-400 animate-spin">
                                    <div className="w-4 h-4 rounded-full bg-orange-400" />
                                </div>
                                <span className="text-[#8a9ab0] font-bold animate-pulse">{t.generating}</span>
                             </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-background/80 backdrop-blur-md z-10 border-t border-card-border shrink-0">
                    <div className="flex gap-3 items-end relative max-w-4xl mx-auto">
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t.inputPlaceholder}
                            className="flex-1 max-h-40 min-h-[60px] bg-card-bg border border-card-border rounded-2xl p-4 text-foreground font-medium outline-none focus:border-orange-500 transition-colors custom-scrollbar resize-none shadow-inner"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="h-[60px] w-[60px] shrink-0 bg-orange-500 hover:bg-orange-400 text-white rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(249,115,22,0.3)] disabled:shadow-none group"
                        >
                            {loading ? <FiLoader className="animate-spin text-xl" /> : <FiSend className="text-xl group-hover:scale-110 transition-transform rtl:rotate-180" />}
                        </button>
                    </div>
                    <div className="text-center mt-3">
                        <p className="text-[10px] uppercase tracking-widest text-[#8a9ab0] font-bold">Press Enter to send, Shift+Enter for new line</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
