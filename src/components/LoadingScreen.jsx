import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingMessages = [
    "⌛ Discovering destinations...",
    "⌛ Checking weather patterns...",
    "⌛ Analyzing local culture...",
    "⌛ Building travel insights...",
    "⌛ Preparing immersive VR...",
];

const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                const diff = Math.random() * 8;
                return Math.min(oldProgress + diff, 100);
            });
        }, 100);

        const messageTimer = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 1500);

        return () => {
            clearInterval(timer);
            clearInterval(messageTimer);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                y: -100,
                filter: "blur(20px)",
                transition: { duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }
            }}
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#000000] text-white overflow-hidden"
        >
            {/* Background Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full"
                    initial={{
                        x: Math.random() * 2000 - 1000,
                        y: Math.random() * 2000 - 1000,
                        opacity: 0.1,
                        scale: Math.random() * 2
                    }}
                    animate={{
                        y: [null, Math.random() * -500],
                        opacity: [0.1, 0.5, 0.1],
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}

            {/* Cinematic Radial Light Glow */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute w-[800px] h-[800px] bg-gradient-radial from-blue-600/20 via-sky-500/5 to-transparent blur-[120px] rounded-full"
            />

            <div className="relative z-10 flex flex-col items-center">
                {/* Main Logo Text with Shimmer/Glow */}
                <motion.div
                    initial={{ opacity: 0, letterSpacing: "1em", filter: "blur(20px)" }}
                    animate={{ opacity: 1, letterSpacing: "0.2em", filter: "blur(0px)" }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="mb-12 relative"
                >
                    <h1 className="text-6xl md:text-9xl font-cinzel font-bold text-white relative z-20">
                        SAFAR <span className="text-sky-400">360</span>
                    </h1>
                    {/* Duplicate for Glow Effect */}
                    <h1 className="absolute inset-0 text-6xl md:text-9xl font-cinzel font-bold text-sky-500/30 blur-2xl -z-10 animate-pulse">
                        SAFAR 360
                    </h1>
                </motion.div>

                {/* Loading Bar Container */}
                <div className="w-72 md:w-[600px] h-[1px] bg-white/5 relative overflow-hidden backdrop-blur-sm border-x border-white/20">
                    {/* Progress Fill */}
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_25px_rgba(56,189,248,0.8)]"
                    />
                </div>

                {/* Progress Percentage & Messages */}
                <div className="mt-8 flex flex-col items-center gap-4">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={messageIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className="font-inter text-[11px] tracking-[0.4em] text-white/50 uppercase font-light h-4 flex items-center justify-center text-center"
                        >
                            {loadingMessages[messageIndex]}
                        </motion.span>
                    </AnimatePresence>

                    <div className="flex items-center gap-3">
                        <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-sky-500/50" />
                        <span className="font-jetbrains text-lg font-extralight text-sky-100/80 tabular-nums tracking-widest">
                            {Math.round(progress)}%
                        </span>
                        <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-sky-500/50" />
                    </div>
                </div>
            </div>

            {/* Aesthetic Border Glow */}
            <div className="absolute inset-0 border border-white/5 pointer-events-none shadow-[inset_0_0_100px_rgba(255,255,255,0.02)]"></div>

            <style>{`
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-from), var(--tw-gradient-to));
        }
      `}</style>
        </motion.div>
    );
};

export default LoadingScreen;
