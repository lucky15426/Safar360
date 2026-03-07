import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Navigation2, Glasses } from "lucide-react";
import { geocode } from "../utils/mapHelpers";
import { SearchBar } from "../components/VirtualTour/SearchBar";
import { VRScene } from "../components/VirtualTour/VRScene";
import GoogleEarthExplorer from "../components/GoogleEarthExplorer";

const WorldToursPage = ({ onPageChange, setIsImmersiveMode }) => {
    const [step, setStep] = useState(1);
    const [place, setPlace] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("streetview"); // "streetview" or "earth"

    useEffect(() => {
        if (setIsImmersiveMode) setIsImmersiveMode(step > 1 && activeTab === "streetview");
    }, [step, activeTab, setIsImmersiveMode]);

    const handleSearch = useCallback(async (q) => {
        setIsLoading(true); setError(null);
        try {
            const r = await geocode(q);
            if (r) {
                setPlace(r);
                setStep(2);
            } else {
                setError("Location not found. Try another search.");
            }
        } catch { setError("Search failed. Check connection."); }
        finally { setIsLoading(false); }
    }, []);

    const reset = useCallback(() => { setStep(1); setPlace(null); }, []);

    return (
        <div className="min-h-screen bg-[#0B0E14] text-white font-sans overflow-hidden">
            {/* ── Tab Switcher Bar ──────────────────────────────────── */}
            {(step === 1 || activeTab === "earth") && (
                <div className="sticky top-0 z-50 bg-[#0B0E14]/90 backdrop-blur-xl border-b border-white/5">
                    <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-center">
                        <div className="flex items-center bg-white/[0.04] rounded-full p-1 border border-white/[0.06]">
                            <button
                                onClick={() => { setActiveTab("streetview"); setStep(1); setPlace(null); }}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center space-x-2 ${activeTab === "streetview"
                                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20"
                                        : "text-slate-400 hover:text-white"
                                    }`}
                            >
                                <Navigation2 className="w-4 h-4" />
                                <span>Street View 360°</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("earth")}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center space-x-2 ${activeTab === "earth"
                                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
                                        : "text-slate-400 hover:text-white"
                                    }`}
                            >
                                <Globe className="w-4 h-4" />
                                <span>Google Earth</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Error Toast ──────────────────────────────────────── */}
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-red-500/10 border border-red-500/30 backdrop-blur-xl rounded-2xl px-5 py-3 flex items-center space-x-3">
                        <X className="w-4 h-4 text-red-400" />
                        <p className="text-sm text-red-300">{error}</p>
                        <button onClick={() => setError(null)}><X className="w-3 h-3 text-white/50 hover:text-white transition-colors" /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Tab Content ──────────────────────────────────────── */}
            {activeTab === "streetview" ? (
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.4 }} className="absolute inset-0 z-10 pt-16">
                            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                        </motion.div>
                    )}
                    {step === 2 && place && (
                        <motion.div key="immersive" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 z-10">
                            <VRScene place={place} onBack={reset} />
                        </motion.div>
                    )}
                </AnimatePresence>
            ) : (
                <motion.div
                    key="earth-tab"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
                >
                    <GoogleEarthExplorer />
                </motion.div>
            )}
        </div>
    );
};

export default WorldToursPage;
