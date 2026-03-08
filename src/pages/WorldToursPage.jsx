import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Navigation2, ArrowLeft } from "lucide-react";
import { geocode } from "../utils/mapHelpers";
import { SearchBar } from "../components/VirtualTour/SearchBar";
import { VRScene } from "../components/VirtualTour/VRScene";
import GoogleEarthExplorer from "../components/GoogleEarthExplorer";

const WorldToursPage = ({ onPageChange, setIsImmersiveMode }) => {
    const [step, setStep] = useState(1);
    const [place, setPlace] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("streetview");

    useEffect(() => {
        if (setIsImmersiveMode) {
            setIsImmersiveMode(activeTab === "streetview" && step > 1);
        }
    }, [step, activeTab, setIsImmersiveMode]);

    /**
     * handleSearch
     * supports Photon coordinates optimization
     */
    const handleSearch = useCallback(async (q, directCoords = null) => {
        setIsLoading(true);
        setError(null);

        try {
            let result;

            if (directCoords && directCoords.lat && directCoords.lng) {
                result = {
                    lat: directCoords.lat,
                    lng: directCoords.lng,
                    name: q,
                    displayName: q,
                };
            } else {
                result = await geocode(q);
            }

            if (result) {
                setPlace(result);
                setStep(2);
            } else {
                setError("Location not found. Try a different search.");
            }
        } catch (err) {
            console.error("Search error:", err);
            setError("Search failed. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setStep(1);
        setPlace(null);
    }, []);

    // ─────────────────────────────────────────────────────────────────
    // FULLSCREEN STREET VIEW
    // ─────────────────────────────────────────────────────────────────
    if (activeTab === "streetview" && step === 2 && place) {
        return (
            <motion.div
                key="immersive"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-[999] bg-black"
            >
                {/* Floating Back Button */}
                <div className="absolute top-4 left-4 z-[1001] pointer-events-auto">
                    <button
                        onClick={reset}
                        className="flex items-center gap-2 bg-black/60 hover:bg-black/85 backdrop-blur-md text-white px-4 py-2.5 rounded-full border border-white/20 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-semibold tracking-wide">
                            Back to Search
                        </span>
                    </button>
                </div>

                <VRScene place={place} onBack={reset} />
            </motion.div>
        );
    }

    // ─────────────────────────────────────────────────────────────────
    // MAIN PAGE
    // ─────────────────────────────────────────────────────────────────
    return (
        <div className="bg-[#0B0E14] text-white font-sans w-full min-h-screen">

            {/* ── Tab Switcher ── */}
            <div className="fixed top-32 inset-x-0 z-[80] flex justify-center pointer-events-none">
                <div className="pointer-events-auto inline-flex items-center bg-white/10 backdrop-blur-md rounded-full p-1.5 border border-white/20 shadow-xl gap-1">

                    {/* Street View */}
                    <button
                        onClick={() => {
                            setActiveTab("streetview");
                            setStep(1);
                            setPlace(null);
                        }}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${activeTab === "streetview"
                            ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <Navigation2 className="w-4 h-4 shrink-0" />
                        SAFAR360 IMMERSIVE™
                    </button>

                    {/* Google Earth */}
                    <button
                        onClick={() => setActiveTab("earth")}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${activeTab === "earth"
                            ? "bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <Globe className="w-4 h-4 shrink-0" />
                        SAFAR360 ORBITAL™
                    </button>

                </div>
            </div>

            {/* ── Error Toast ── */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="fixed top-40 left-1/2 -translate-x-1/2 z-[200] bg-red-500/10 border border-red-500/30 backdrop-blur-xl rounded-2xl px-5 py-3 flex items-center gap-3 shadow-lg"
                    >
                        <X className="w-4 h-4 text-red-400 shrink-0" />
                        <p className="text-sm text-red-300 whitespace-nowrap">{error}</p>
                        <button onClick={() => setError(null)}>
                            <X className="w-3 h-3 text-white/40 hover:text-white transition-colors" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Tab Content ── */}
            <AnimatePresence mode="wait">
                {activeTab === "streetview" ? (
                    <motion.div
                        key="search"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="w-full min-h-screen"
                    >
                        <SearchBar
                            onSearch={handleSearch}
                            isLoading={isLoading}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="earth"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.35 }}
                        className="w-full min-h-screen"
                    >
                        <GoogleEarthExplorer
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            onBack={() => setActiveTab("streetview")}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default WorldToursPage;