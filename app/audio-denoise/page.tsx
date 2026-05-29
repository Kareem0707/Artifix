"use client";

import { useState, useRef } from "react";
import { FiMic, FiUploadCloud, FiVolumeX, FiLoader, FiPlay, FiSettings, FiCheck } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AudioDenoise() {
    const { t } = useLanguage();
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [resultAudio, setResultAudio] = useState<string | null>(null);
    const [isVideoOut, setIsVideoOut] = useState(false);
    // Explicitly type the ref to `any` because FFmpeg type isn't fully SSR safe
    const ffmpegRef = useRef<any>(null);

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
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setIsDone(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setIsDone(false);
        }
    };

    const handleProcess = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const { fetchFile } = await import("@ffmpeg/util");
            const isVideo = file.type.startsWith("video/");
            let finalBase64 = "";
            let finalMimeType = file.type;

            if (isVideo) {
                 if (!ffmpegRef.current) {
                     const { FFmpeg } = await import("@ffmpeg/ffmpeg");
                     ffmpegRef.current = new FFmpeg();
                 }
                 const ffmpeg = ffmpegRef.current;
                 
                 if (!ffmpeg.loaded) {
                     await ffmpeg.load({
                        coreURL: "/ffmpeg/ffmpeg-core.js",
                        wasmURL: "/ffmpeg/ffmpeg-core.wasm"
                     });
                 }
                 // 1. Write the video file into FFmpeg memory
                 await ffmpeg.writeFile("input-vid", await fetchFile(file));
                 
                 // 2. Extract Audio
                 await ffmpeg.exec(["-i", "input-vid", "-vn", "-acodec", "libmp3lame", "temp.mp3"]);
                 
                 // 3. Read extracted audio
                 const audioData = await ffmpeg.readFile("temp.mp3");
                 const audioBlob = new Blob([new Uint8Array(audioData as Uint8Array)], { type: "audio/mp3" });
                 
                 finalBase64 = await fileToBase64(new File([audioBlob], "audio.mp3", { type: "audio/mp3" }));
                 finalMimeType = "audio/mp3";
            } else {
                 finalBase64 = await fileToBase64(file);
            }

            const res = await fetch("/api/audio-denoise", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ audioBase64: finalBase64, mimeType: finalMimeType })
            });

            const data = await res.json();
            
            let finalCleanedUrl = "";

            if (data.result === "mock_success") {
                finalCleanedUrl = URL.createObjectURL(file);
                setIsVideoOut(isVideo);
            } else if (data.result) {
                // Return string from Resemble
                const outputAudioUrl = typeof data.result === 'string' ? data.result : data.result[0];
                
                if (isVideo && ffmpegRef.current) {
                   const ffmpeg = ffmpegRef.current;
                   // 4. If originally a video, remix new audio with original video
                   const cleanAudioBlob = await fetch(outputAudioUrl).then(r => r.blob());
                   await ffmpeg.writeFile("clean-audio", await fetchFile(cleanAudioBlob));
                   
                   // Strip old audio and inject new
                   await ffmpeg.exec(["-i", "input-vid", "-i", "clean-audio", "-c:v", "copy", "-map", "0:v:0", "-map", "1:a:0", "-shortest", "output-vid.mp4"]);
                   const outVidData = await ffmpeg.readFile("output-vid.mp4");
                   const outVidBlob = new Blob([new Uint8Array(outVidData as Uint8Array)], { type: "video/mp4" });
                   finalCleanedUrl = URL.createObjectURL(outVidBlob);
                   setIsVideoOut(true);
                } else {
                   finalCleanedUrl = outputAudioUrl;
                   setIsVideoOut(false);
                }
            } else {
                throw new Error(data.error || "Failed");
            }
            
            setResultAudio(finalCleanedUrl);
            setIsDone(true);
        } catch (error) {
            console.error(error);
            alert("Error processing file. Please ensure cross-origin isolation is disabled or FFmpeg libraries loaded properly.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 px-4 md:px-8 pt-8 pb-32">
            <header className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-extrabold flex items-center gap-4 text-foreground">
                    <FiMic className="text-cyan-400" />
                    {t("nav.audioDenoise")}
                </h1>
                <p className="text-[#8a9ab0] max-w-2xl text-lg">
                    {t("tool.6.desc")}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Upload & Control */}
                <div className="space-y-6">
                    <div className="glass p-8 rounded-2xl flex flex-col gap-6 relative overflow-hidden">
                        {/* Decorative Background Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

                        <div className="flex justify-between items-center relative z-10">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <FiUploadCloud className="text-cyan-400" /> Upload Audio/Video
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
                                className={`border-2 border-dashed transition-all duration-300 rounded-xl h-72 flex flex-col items-center justify-center cursor-pointer relative z-10 
                                    ${isDragging ? 'border-cyan-400 bg-cyan-400/5 scale-[1.02]' : 'border-card-border hover:border-cyan-400/50 bg-card-bg/50 group'}`}
                            >
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${isDragging ? 'bg-cyan-400/20 text-cyan-400 scale-110 shadow-[0_0_30px_rgba(34,211,238,0.3)]' : 'bg-background text-[#8a9ab0] group-hover:text-cyan-400 group-hover:bg-cyan-400/10'}`}>
                                    <FiVolumeX className="text-4xl" />
                                </div>
                                <p className="font-bold text-foreground text-lg mb-2">Drop your noisy file here</p>
                                <p className="text-sm text-[#8a9ab0]">Supports MP3, WAV, MP4, MOV (Max 500MB)</p>
                                <input type="file" accept="audio/*,video/*" className="hidden" onChange={handleFileChange} />
                            </label>
                        ) : (
                            <div className="h-72 flex flex-col items-center justify-center bg-background/50 border border-cyan-500/30 rounded-xl relative z-10 p-6 shadow-[inset_0_0_50px_rgba(34,211,238,0.05)]">
                                <div className="w-24 h-24 rounded-full bg-cyan-500/20 flex items-center justify-center mb-6 border border-cyan-500/50">
                                    <FiMic className="text-5xl text-cyan-400" />
                                </div>
                                <p className="text-xl font-bold text-foreground text-center truncate w-full px-4 mb-2">{file.name}</p>
                                <p className="text-sm text-cyan-400 font-bold tracking-widest uppercase">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                        )}

                        <button
                            onClick={handleProcess}
                            disabled={!file || isProcessing || isDone}
                            className={`w-full py-4 mt-2 flex items-center justify-center gap-3 font-bold rounded-xl transition-all duration-300 text-lg relative z-10 overflow-hidden group
                                ${!file || isDone ? 'bg-card-border text-[#8a9ab0] cursor-not-allowed hidden' : 
                                  isProcessing ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 cursor-wait' : 
                                  'bg-cyan-500 hover:bg-cyan-400 text-background shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]'}`}
                        >
                            {isProcessing ? (
                                <>
                                    <FiLoader className="animate-spin text-2xl" />
                                    Isolating Vocals & Removing Noise...
                                    {/* Processing scanline effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                                </>
                            ) : (
                                "Clean Audio Now"
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Side: Visual Output */}
                <div className="glass p-8 rounded-2xl flex flex-col h-full min-h-[500px] relative overflow-hidden">
                    {/* Background visualizer aesthetic */}
                    <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none mix-blend-screen">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <div key={i} className="w-1 bg-cyan-400 mx-[2px] rounded-full animate-pulse" style={{ height: `${Math.random() * 80 + 10}%`, animationDuration: `${Math.random() * 1 + 0.5}s` }} />
                        ))}
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center justify-between relative z-10">
                        <span>Studio Output</span>
                        {isDone && <span className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full flex items-center gap-1 font-bold uppercase tracking-wider"><FiCheck/> Purified</span>}
                    </h3>

                    <div className="flex-1 bg-background/60 backdrop-blur-md rounded-xl border border-card-border p-6 flex flex-col relative z-10 justify-center group overflow-hidden">
                        {!isDone && !isProcessing && (
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 mx-auto rounded-full bg-card-bg flex items-center justify-center border border-card-border mb-6">
                                    <FiSettings className="text-4xl text-[#8a9ab0]" />
                                </div>
                                <h4 className="text-xl font-bold text-foreground">Awaiting Audio</h4>
                                <p className="text-[#8a9ab0] max-w-sm mx-auto text-sm leading-relaxed">
                                    Upload a file to automatically detect and eliminate wind, hums, crowd noise, and echo from your vocal tracks.
                                </p>
                            </div>
                        )}

                        {isProcessing && (
                            <div className="text-center space-y-8 animate-in fade-in duration-500">
                                <div className="relative w-32 h-32 mx-auto">
                                    <div className="absolute inset-0 border-4 border-card-border rounded-full" />
                                    <div className="absolute inset-0 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FiMic className="text-3xl text-cyan-400 animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI Deep Listening...</h4>
                                    <p className="text-cyan-400/60 text-sm tracking-widest uppercase font-bold">Applying Studio Filter</p>
                                </div>
                            </div>
                        )}

                        {isDone && (
                            <div className="w-full text-center animate-in zoom-in-95 duration-500 space-y-8">
                                <div className="w-24 h-24 mx-auto rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-400 glow-effect mb-6 relative">
                                    <FiPlay className="text-4xl text-cyan-400 ml-2" />
                                    <div className="absolute inset-0 border-[3px] border-cyan-400/50 rounded-full animate-ping" />
                                </div>
                                
                                <div>
                                    <h4 className="text-3xl font-black text-foreground mb-2">Crystal Clear.</h4>
                                    <p className="text-[#8a9ab0] text-sm">Background noise successfully removed.</p>
                                </div>

                                <div className="w-full h-16 bg-card-bg rounded-xl border border-card-border flex items-center justify-between px-6 overflow-hidden relative">
                                    {/* Fake visualizer for the clean sound */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-30 gap-1 px-4">
                                        {Array.from({ length: 60 }).map((_, i) => (
                                            <div key={i} className="flex-1 bg-cyan-400 rounded-full" style={{ height: `${Math.random() * 60 + 10}%` }} />
                                        ))}
                                    </div>
                                </div>

                                <a href={resultAudio || "#"} download={isVideoOut ? "Cleaned_Studio_Video.mp4" : "Cleaned_Studio_Audio.mp3"} className="w-full py-4 text-center bg-foreground text-background font-black text-lg rounded-xl hover:bg-gray-200 transition-colors shadow-xl outline-none block">
                                    Download {isVideoOut ? "Studio Video" : "Studio Audio"}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
