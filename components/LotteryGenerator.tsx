"use client";


import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generatePowerballNumbers, LotteryResult } from "../lib/lotteryUtils";
import { Sparkles, Play, Copy, Download, Share2 } from "lucide-react";
import { useSlotMachineSound } from "../lib/useSound";
import { toPng } from "html-to-image";

export default function LotteryGenerator() {
    const [result, setResult] = useState<LotteryResult | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    // Display numbers state for the rolling effect
    const [displayNumbers, setDisplayNumbers] = useState<number[]>([0, 0, 0, 0, 0, 0]);
    const [history, setHistory] = useState<LotteryResult[]>([]);
    const [showResetPopup, setShowResetPopup] = useState(false);
    const { playRoll, stopRoll, playLock, playWin } = useSlotMachineSound();

    // Ref for saving image
    const generatorRef = useRef<HTMLDivElement>(null);
    const historyRef = useRef<HTMLDivElement>(null);

    const handleCopyAll = () => {
        if (history.length === 0) return;

        const allText = history.map((record, idx) =>
            `#${history.length - idx}: [ ${record.whiteBalls.join(", ")} + ${record.powerBall} ] (${record.timestamp.toLocaleTimeString()})`
        ).join("\n");

        const finalText = `🍀 Lucky History 🍀\n${allText}`;

        navigator.clipboard.writeText(finalText).then(() => {
            alert("History copied to clipboard! 🍀");
        });
    };

    const handleSaveHistory = async () => {
        if (!historyRef.current) return;
        try {
            const dataUrl = await toPng(historyRef.current, {
                cacheBust: true,
                backgroundColor: '#0a0a0f',
                style: { padding: '20px' }
            });
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `lucky-history-${Date.now()}.png`;
            link.click();
        } catch (err) {
            console.error("Save failed", err);
        }
    };

    const handleGenerate = async () => {
        // ... (existing generation logic) ...
        if (isGenerating) return;

        setIsGenerating(true);
        setResult(null);
        playRoll();

        // 1. Generate final numbers immediately
        const finalResult = generatePowerballNumbers();
        // Construct array including Powerball for easier loop handling
        const finalNumbers = [...finalResult.whiteBalls, finalResult.powerBall];

        const duration = 4600; // Just under 5 seconds total
        const interval = 50;   // rapid updates
        const startTime = Date.now();

        // Reveal timings (in milliseconds from start)
        const stopTimes = [800, 1500, 2200, 2900, 3600, 4400];
        // Track which balls have played the lock sound
        const lockedStatus = [false, false, false, false, false, false];

        const spinInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;

            setDisplayNumbers(prev => {
                const nextNumbers = [...prev];

                // For each ball (0 to 5)
                for (let i = 0; i < 6; i++) {
                    if (elapsed < stopTimes[i]) {
                        // Keep spinning: Random number
                        const max = i === 5 ? 26 : 69;
                        nextNumbers[i] = Math.floor(Math.random() * max) + 1;
                    } else {
                        // Time passed: Lock to final result
                        nextNumbers[i] = finalNumbers[i];

                        // Play lock sound logic
                        if (!lockedStatus[i]) {
                            playLock();
                            lockedStatus[i] = true;
                        }
                    }
                }
                return nextNumbers;
            });

            if (elapsed > duration) {
                clearInterval(spinInterval);
                setResult(finalResult); // Store final result officially
                setIsGenerating(false);
                stopRoll();
                playWin();

                // History & Reset Logic
                setHistory(prev => {
                    const newHistory = [finalResult, ...prev];
                    if (newHistory.length > 5) {
                        setShowResetPopup(true);
                        // Hide popup after 3 seconds
                        setTimeout(() => setShowResetPopup(false), 3000);
                        return [finalResult]; // Reset checking: Keep only the new one
                    }
                    return newHistory;
                });
            }
        }, interval);
    };

    return (
        <>
            {/* GLOBAL BACKGROUND (Added per user request "맨뒤에") */}
            <div className="fixed inset-0 z-[-1]">
                <img
                    src="/heaven_bg.webp"
                    alt="Global Background"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-black/70" /> {/* Scrim for readability */}
            </div>

            <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-8">

                {/* Hero / Visual Section (User Requested "Window above") */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full aspect-[21/9] md:aspect-[2/1] relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-[0_0_30px_rgba(212,175,55,0.3)] bg-black"
                >
                    {/* ... (Hero content same as before) ... */}
                    {/* BACKGROUND LAYER: Heaven Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/heaven_bg.webp"
                            alt="Heaven Background"
                            className="w-full h-full object-cover opacity-90"
                        />
                        {/* Gradient Overlay for blending */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172ap]/30 to-transparent mix-blend-multiply" />
                    </div>

                    {/* FOREGROUND LAYER: Goddess Video Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        {/* Video with Screen/Lighten blend to handle "no background" if it's black-backed */}
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="h-[120%] w-full object-cover mix-blend-normal opacity-90"
                            style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
                        >
                            <source src="/goddess_overlay.webm" type="video/webm" />
                        </video>
                    </div>

                    {/* COMPOSITE CONTENT & TEXT */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        {/* Flashy Foreground Effects Layer */}
                        <div className="absolute inset-0 pointer-events-none mix-blend-screen">
                            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                        </div>

                        {/* Text Overlay */}
                        <div className="relative text-center space-y-4 p-6 mt-16 md:mt-0">
                            <motion.div
                                animate={{ scale: [1, 1.02, 1] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="inline-block px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-[#D4AF37]/30 text-yellow-400/90 uppercase tracking-[0.2em] text-xs md:text-sm font-semibold shadow-lg"
                            >
                                The Goddess Smiles Upon You
                            </motion.div>

                            <div className="relative">
                                <div className="absolute -inset-4 bg-black/40 blur-xl rounded-full" />
                                <h1 className="relative bg-gradient-to-r from-[#D4AF37] via-[#FFF8DC] to-[#D4AF37] bg-clip-text text-transparent text-5xl md:text-7xl font-black drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-serif tracking-tight">
                                    SUPERBALL
                                </h1>
                            </div>
                        </div>
                    </div>
                </motion.div>


                {/* Main Generator Interface - Wrapped for HTML2Canvas capture */}
                <motion.div
                    ref={generatorRef}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full bg-[#0a0a0f]/80 backdrop-blur-xl border border-[#D4AF37]/30 rounded-3xl p-4 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden"
                >
                    {/* Gold Border Glow */}
                    <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_20px_rgba(212,175,55,0.1)] pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center text-center space-y-10">

                        {/* Lucky Numbers Display - Slot Style */}
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 w-full justify-items-center" role="group" aria-label="Generated Lottery Numbers">
                            {displayNumbers.map((num, idx) => (
                                <SlotBall
                                    key={idx}
                                    number={num}
                                    type={idx === 5 ? 'red' : 'white'}
                                    isSpinning={isGenerating}
                                    delay={idx}
                                />
                            ))}
                        </div>

                        {/* Actions Area */}
                        <div className="relative pt-4 flex flex-col items-center gap-4 w-full">
                            {/* Generate Button */}
                            <motion.button
                                whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="group relative px-12 py-5 bg-gradient-to-b from-[#D4AF37] to-[#8B4513] rounded-full font-bold text-white shadow-[0_10px_20px_rgba(0,0,0,0.5),0_0_20px_rgba(212,175,55,0.4)] border-t border-yellow-200 transaction-all disabled:opacity-80 disabled:cursor-not-allowed w-full md:w-auto"
                            >
                                <div className="flex items-center justify-center gap-3 text-xl md:text-2xl font-serif tracking-wide text-shadow">
                                    <span className="drop-shadow-md text-[#3e2723]">{isGenerating ? "ROLLING..." : "GENERATE NUMBERS"}</span>
                                </div>
                            </motion.button>


                        </div>
                    </div>
                </motion.div>

                {/* History Section */}
                {history.length > 0 && (
                    <motion.section
                        ref={historyRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-4xl mx-auto"
                        aria-label="History Section"
                    >
                        <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4">
                                <div className="flex-1" />
                                <h2 className="text-[#D4AF37] font-serif text-xl text-center uppercase tracking-widest flex-1">History</h2>
                                <div className="flex-1 flex justify-end gap-2">
                                    <button
                                        onClick={handleCopyAll}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs transition-colors text-[#D4AF37]/80 hover:text-[#D4AF37]"
                                    >
                                        <Copy className="w-3 h-3" /> Copy All
                                    </button>
                                    <button
                                        onClick={handleSaveHistory}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs transition-colors text-[#D4AF37]/80 hover:text-[#D4AF37]"
                                    >
                                        <Download className="w-3 h-3" /> Save List
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {history.map((record, idx) => {
                                    const rowId = `history-row-${idx}`;
                                    return (
                                        <motion.div
                                            id={rowId}
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-center justify-between bg-white/5 rounded-lg p-3 px-4 hover:bg-white/10 transition-colors gap-3"
                                        >
                                            <div className="flex items-center gap-2 md:gap-4">
                                                <span className="text-gray-400 font-mono text-sm min-w-[20px]">#{history.length - idx}</span>
                                                <div className="flex gap-2">
                                                    {record.whiteBalls.map((num, i) => (
                                                        <span key={i} className="w-8 h-8 rounded-full bg-slate-800 border border-[#D4AF37]/50 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                                                            {num}
                                                        </span>
                                                    ))}
                                                    <span className="w-8 h-8 rounded-full bg-red-900 border border-red-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                                                        {record.powerBall}
                                                    </span>
                                                </div>
                                            </div>

                                            <time className="hidden md:block text-xs text-gray-500" dateTime={record.timestamp.toISOString()}>
                                                {record.timestamp.toLocaleTimeString()}
                                            </time>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.section>
                )}
            </div>

            {/* Reset Popup */}
            <AnimatePresence>
                {
                    showResetPopup && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                        >
                            <div className="bg-black/90 border border-[#D4AF37] text-[#D4AF37] px-8 py-4 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.5)] backdrop-blur-xl">
                                <h2 className="text-2xl font-bold uppercase tracking-widest text-center">List Reset</h2>
                                <p className="text-sm text-gray-400 text-center mt-1">History cleared explicitly.</p>
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence >
        </>
    );
}

function SlotBall({ number, type, isSpinning, delay }: { number: number; type: 'white' | 'red'; isSpinning: boolean; delay: number }) {
    const isRed = type === 'red';

    return (
        <div className="relative group">
            {/* Outer Gold Ring */}
            <div className={`absolute -inset-1 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#8B4513] blur-[1px] ${isRed ? 'opacity-100' : 'opacity-70'}`} />

            {/* The Ball */}
            <div className={`
                relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full
                bg-gradient-to-b ${isRed ? 'from-[#b91c1c] to-[#7f1d1d]' : 'from-[#1e293b] to-[#0f172a]'}
                border-2 ${isRed ? 'border-red-400' : 'border-[#D4AF37]'}
                shadow-[inset_0_4px_8px_rgba(0,0,0,0.5)]
                overflow-hidden
            `}>
                {/* Rolling Number Effect */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={number}
                            initial={isSpinning ? { y: 50, opacity: 0, filter: "blur(5px)" } : { scale: 0.5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
                            exit={isSpinning ? { y: -50, opacity: 0, filter: "blur(5px)" } : { opacity: 0 }}
                            transition={{ duration: isSpinning ? 0.1 : 0.4, type: "spring" }}
                            className={`text-3xl md:text-4xl font-bold font-mono ${isRed ? 'text-white' : 'text-[#D4AF37]'}`}
                        >
                            {number > 0 ? number : "?"}
                        </motion.span>
                    </AnimatePresence>
                </div>

                {/* Gloss */}
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none" />
            </div>
        </div>
    );
}
