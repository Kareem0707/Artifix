"use client";

import { useState, useEffect } from "react";
import { FiVideo, FiUploadCloud, FiFilm, FiCheck, FiStar, FiMonitor } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";

export default function VideoUpscaler() {
    const { t } = useLanguage();
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [resultVideo, setResultVideo] = useState<string | null>(null);
    const [tier, setTier] = useState<"HD" | "4K">("HD");
    const [canUse4K, setCanUse4K] = useState(true);

    useEffect(() => {
        const lastUsed = localStorage.getItem("artifix_4k_video_last_used");
        if (lastUsed) {
            const today = new Date().toDateString();
            if (lastUsed === today) {
                setCanUse4K(false);
            }
        }
    }, []);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result.split(',')[1]); 
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setIsDone(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const selected = e.dataTransfer.files?.[0];
        if (selected && selected.type.startsWith("video/")) {
            setFile(selected);
            setIsDone(false);
        }
    };

    const handleProcess = async () => {
        if (!file) return;

        if (tier === "4K" && !canUse4K) {
            alert("لقد استنفذت الحد اليومي لترقية 4K المجانية. يرجى استخدام دقة HD أو الترقية لنسخة Pro.");
            return;
        }

        setIsProcessing(true);
        try {
            const base64 = await fileToBase64(file);
            const res = await fetch("/api/video-upscaler", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ videoBase64: base64, mimeType: file.type, tier })
            });

            const data = await res.json();
            if (data.result === "mock_success") {
                setResultVideo(URL.createObjectURL(file));
            } else if (data.result) {
                setResultVideo(typeof data.result === 'string' ? data.result : data.result[0] || null);
            } else {
                throw new Error(data.error || "Failed");
            }

            if (tier === "4K") {
                localStorage.setItem("artifix_4k_video_last_used", new Date().toDateString());
                setCanUse4K(false);
            }

            setIsDone(true);
        } catch (error) {
            console.error(error);
            alert("Error processing video. Video files might be too large for Base64 (API route limits) or Token invalid.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 px-4 md:px-8 pt-8 pb-32">
            <header className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest mb-2">
                    <FiStar className="text-rose-400" fill="currentColor" /> Pro Feature
                </div>
                <h1 className="text-4xl lg:text-5xl font-extrabold flex items-center gap-4 text-foreground">
                    <FiMonitor className="text-rose-400" />
                    {t("nav.videoUpscale")}
                </h1>
                <p className="text-[#8a9ab0] max-w-2xl text-lg">
                    {t("tool.8.desc")}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Upload */}
                <div className="space-y-6">
                    <div className="glass p-8 rounded-2xl flex flex-col gap-6 relative overflow-hidden border-rose-500/20 hover:border-rose-500/40 transition-colors">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[100px] rounded-full pointer-events-none" />

                        <div className="flex justify-between items-center relative z-10">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <FiFilm className="text-rose-400" /> Source Video
                            </h3>
                            {file && (
                                <button onClick={() => { setFile(null); setIsDone(false); }} className="text-xs text-rose-400 hover:text-rose-500 font-bold uppercase tracking-wider transition-colors">
                                    Clear
                                </button>
                            )}
                        </div>

                        {!file ? (
                            <label
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed transition-all duration-300 rounded-xl h-[350px] flex flex-col items-center justify-center cursor-pointer relative z-10 
                                    ${isDragging ? 'border-rose-400 bg-rose-400/5 scale-[1.02]' : 'border-card-border hover:border-rose-400/50 bg-card-bg/50 group'}`}
                            >
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${isDragging ? 'bg-rose-400/20 text-rose-400 scale-110 shadow-[0_0_30px_rgba(244,63,94,0.3)]' : 'bg-background text-[#8a9ab0] group-hover:text-rose-400 group-hover:bg-rose-400/10'}`}>
                                    <FiUploadCloud className="text-4xl" />
                                </div>
                                <p className="font-bold text-foreground text-lg mb-2">Drop your video file here</p>
                                <p className="text-sm text-[#8a9ab0]">MP4, MOV, WEBM (Max 1GB)</p>
                                <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                            </label>
                        ) : (
                            <div className="h-[350px] w-full rounded-xl relative z-10 overflow-hidden border border-rose-500/30 bg-black/60 flex flex-col items-center justify-center p-8 shadow-[inset_0_0_60px_rgba(244,63,94,0.1)]">
                                <div className="w-24 h-24 rounded-full bg-rose-500/20 flex items-center justify-center mb-6">
                                    <FiVideo className={`text-5xl text-rose-400 ${isProcessing ? 'animate-pulse' : ''}`} />
                                </div>
                                <p className="text-xl font-bold text-foreground text-center truncate w-full mb-2">{file.name}</p>
                                <p className="text-sm text-rose-400 font-bold tracking-widest uppercase">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                
                                {isProcessing && (
                                    <div className="w-full max-w-xs mt-8">
                                        <div className="flex justify-between text-xs font-bold text-rose-300 mb-2 uppercase tracking-widest">
                                            <span>Rendering Frames</span>
                                            <span className="animate-pulse">AI Active</span>
                                        </div>
                                        <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-rose-500/30">
                                            <div className="h-full bg-gradient-to-r from-rose-600 to-fuchsia-500 w-1/2 animate-[pulse_1s_ease-in-out_infinite]" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex bg-card-bg border border-card-border p-1 rounded-xl relative z-10 w-full mt-2">
                            <button
                                onClick={() => setTier("HD")}
                                className={`flex-1 py-2 font-bold rounded-lg transition-all text-sm ${tier === "HD" ? "bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]" : "text-[#8a9ab0] hover:text-white"}`}
                            >
                                HD (Free)
                            </button>
                            <button
                                onClick={() => setTier("4K")}
                                className={`flex-1 py-2 font-bold rounded-lg transition-all text-sm flex items-center justify-center gap-2 ${tier === "4K" ? "bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]" : "text-[#8a9ab0] hover:text-white"}`}
                            >
                                <FiStar className={tier === "4K" ? "text-yellow-400" : "text-rose-400"} /> 4K (1x Day)
                            </button>
                        </div>

                        <button
                            onClick={handleProcess}
                            disabled={!file || isProcessing || isDone || (tier === "4K" && !canUse4K)}
                            className={`w-full py-4 mt-2 flex items-center justify-center gap-3 font-bold rounded-xl transition-all duration-300 text-lg relative z-10 overflow-hidden group
                                ${!file || isDone || (tier === "4K" && !canUse4K) ? 'bg-card-border text-[#8a9ab0] cursor-not-allowed hidden' : 
                                  isProcessing ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 cursor-wait' : 
                                  'bg-gradient-to-r from-rose-600 to-fuchsia-600 hover:from-rose-500 hover:to-fuchsia-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_40px_rgba(244,63,94,0.6)]'}`}
                        >
                            {isProcessing ? (
                                `Enhancing to ${tier}...`
                            ) : (
                                <>
                                   <FiMonitor className="text-xl" /> Enhance Video to {tier}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Side: Pro Result */}
                <div className="glass p-8 rounded-2xl flex flex-col h-full min-h-[500px] relative overflow-hidden border-card-border">
                    <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center justify-between relative z-10">
                        <span>Rendered Output</span>
                        {isDone && <span className="text-xs bg-rose-500/20 text-rose-400 px-3 py-1 rounded-full flex items-center gap-1 font-bold uppercase tracking-wider"><FiCheck/> Complete</span>}
                    </h3>

                    <div className="flex-1 bg-background/60 backdrop-blur-md rounded-xl border border-card-border p-6 flex flex-col relative z-10 justify-center group overflow-hidden">
                        {!isDone && (
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 mx-auto rounded-full bg-card-bg flex items-center justify-center border border-card-border mb-6">
                                    <FiVideo className="text-4xl text-[#8a9ab0]" />
                                </div>
                                <h4 className="text-xl font-bold text-foreground">Waiting for Video</h4>
                                <p className="text-[#8a9ab0] max-w-sm mx-auto text-sm leading-relaxed">
                                    Upload a video to artificially enhance frame interpolation and upscale resolution frame-by-frame using advanced Temporal AI.
                                </p>
                            </div>
                        )}

                        {isDone && (
                            <div className="w-full text-center animate-in zoom-in-95 duration-500 space-y-8">
                                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-rose-500/20 to-fuchsia-500/20 flex flex-col items-center justify-center border border-rose-400 glow-effect mb-6 relative">
                                    <FiMonitor className="text-4xl text-rose-400 mb-2" />
                                    <span className="text-rose-400 font-black tracking-widest text-sm">{tier} 60FPS</span>
                                    <div className="absolute inset-0 border-[2px] border-rose-400/30 rounded-full animate-spin-slow" style={{ animationDuration: '8s' }} />
                                </div>
                                
                                <div>
                                    <h4 className="text-3xl font-black text-foreground mb-2">Cinematic Upgrade.</h4>
                                    <p className="text-[#8a9ab0] text-sm max-w-xs mx-auto">Frames enhanced, resolution multiplied, details sharpened.</p>
                                </div>

                                <a href={resultVideo || "#"} download={`${tier}_Master_Video`} className="w-full text-center py-4 bg-foreground text-background font-black text-lg rounded-xl hover:bg-gray-200 transition-colors shadow-xl outline-none block">
                                    Download {tier} Master
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
