import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    MapPin,
    Loader2,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import { placesService } from "../../services/placesService";

/* ── Ambient floating elements ───────────────────────────────────── */
const FloatingShapes = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
            className="absolute top-[10%] left-[15%] w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]"
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"
            animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
    </div>
);

/* ── Main SearchBar ─────────────────────────────────────── */
export const SearchBar = ({ onSearch, isLoading }) => {
    const [q, setQ] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [focused, setFocused] = useState(false);
    const ref = useRef(null);
    const dropdownRef = useRef(null);

    const BG_VIDEO_URL =
        "https://res.cloudinary.com/dnmhqosoa/video/upload/v1772206804/bg7-optimized-4k_blfunq.mp4";

    useEffect(() => {
        const t = setTimeout(() => ref.current?.focus(), 600);
        return () => clearTimeout(t);
    }, []);

    /* Debounced autocomplete — Photon logic retained */
    useEffect(() => {
        if (!q.trim() || q.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        const debounce = setTimeout(() => {
            placesService.getPredictions(q).then((preds) => {
                setSuggestions(preds || []);
            });
        }, 300);

        return () => clearTimeout(debounce);
    }, [q]);

    /* Close dropdown when clicking outside */
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const go = (e) => {
        e.preventDefault();

        if (q.trim() && !isLoading) {
            setSuggestions([]);
            onSearch(q.trim(), null);
        }
    };

    /* Suggestion selection with Photon coordinates */
    const selectSuggestion = (suggestion) => {
        const displayText = suggestion.description;

        setQ(displayText);
        setSuggestions([]);

        if (!isLoading) {
            onSearch(displayText, suggestion._coords || null);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center font-sans">

            {/* ── Background Layer ── */}
            <div className="absolute inset-0 bg-[#020617] overflow-hidden">

                {/* Video Background */}
                {BG_VIDEO_URL && (
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="absolute inset-0 w-full h-full object-cover opacity-90 brightness-[1.5] transition-opacity duration-1000"
                        src={BG_VIDEO_URL}
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-transparent to-[#020617]/80" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]" />

                <FloatingShapes />

                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `radial-gradient(at 0% 0%, hsla(199,100%,33%,1) 0, transparent 50%),
                        radial-gradient(at 50% 0%, hsla(187,100%,42%,1) 0, transparent 50%),
                        radial-gradient(at 100% 0%, hsla(242,100%,70%,1) 0, transparent 50%)`,
                    }}
                />
            </div>

            {/* ── Foreground Content ── */}
            <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full text-center"
                >

                    {/* Premium Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                            Safar360 Immersive™ — Step Inside Any Destination
                        </span>
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-heritage font-bold tracking-tighter text-white mb-6 leading-[0.9] drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
                        Discover the <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 animate-gradient-x">
                            Unseen World
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto mb-10 font-medium leading-relaxed">
                        Teleport to any destination instantly. High-fidelity street views
                        and virtual tours powered by global imagery.
                    </p>

                </motion.div>

                {/* ── Search Container ── */}
                <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative w-full max-w-2xl group"
                >

                    <form onSubmit={go} className="relative z-20">

                        <div
                            className={`absolute inset-0 rounded-[22px] transition-all duration-700 pointer-events-none
                                    ${focused
                                    ? "opacity-100 shadow-[0_0_60px_rgba(6,182,212,0.35)]"
                                    : "opacity-0 group-hover:opacity-60 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]"
                                }`}
                        />

                        <div
                            className={`relative flex items-center p-2 rounded-[22px] transition-all duration-500 backdrop-blur-2xl border 
                            ${focused
                                    ? "bg-white/10 border-white/20 shadow-2xl"
                                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                }`}
                        >

                            <div className="pl-4 pr-2">
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                                ) : (
                                    <Search className={`w-5 h-5 ${focused ? "text-cyan-400" : "text-white/30"}`} />
                                )}
                            </div>

                            <input
                                ref={ref}
                                type="text"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setTimeout(() => setFocused(false), 200)}
                                placeholder="Explore a landmark, city, or address..."
                                disabled={isLoading}
                                autoComplete="off"
                                className="flex-1 bg-transparent py-4 px-3 text-white text-lg placeholder-white/20 outline-none border-none font-medium"
                            />

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading || !q.trim()}
                                className="bg-white text-black px-8 py-3.5 rounded-[16px] font-bold text-sm tracking-wide disabled:opacity-20 flex items-center gap-2"
                            >
                                <span>{isLoading ? "Loading..." : "Launch View"}</span>
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>

                        </div>

                    </form>

                    {/* Suggestions Dropdown */}
                    <AnimatePresence>
                        {suggestions.length > 0 && !isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute w-full mt-3 bg-[#0d1117]/90 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden z-50 p-2"
                            >
                                {suggestions.map((s, i) => (
                                    <button
                                        key={s.place_id || i}
                                        onClick={() => selectSuggestion(s)}
                                        className="w-full text-left px-5 py-4 hover:bg-white/5 rounded-2xl flex items-center gap-4 transition-all duration-200 group/item"
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${s._source === "landmark_db"
                                            ? "bg-amber-500/10 border-amber-500/20 group-hover/item:bg-amber-500/15"
                                            : "bg-white/5 border-white/5 group-hover/item:bg-cyan-500/10 group-hover/item:border-cyan-500/20"
                                            }`}>
                                            {s._source === "landmark_db" ? (
                                                <Sparkles className="w-4 h-4 text-amber-400" />
                                            ) : (
                                                <MapPin className="w-4 h-4 text-white/40 group-hover/item:text-cyan-400 group-hover/item:scale-110 transition-all" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-white/90 truncate group-hover/item:text-white">
                                                    {s.structured_formatting?.main_text || s.description}
                                                </p>
                                                {s._source === "landmark_db" && (
                                                    <span className="shrink-0 text-[8px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded-md border border-amber-500/20">
                                                        Best View
                                                    </span>
                                                )}
                                                {s._quality >= 8 && s._source !== "landmark_db" && (
                                                    <span className="shrink-0 text-[8px] font-black uppercase tracking-wider bg-cyan-500/15 text-cyan-400 px-1.5 py-0.5 rounded-md border border-cyan-500/20">
                                                        HD
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-white/30 truncate font-medium">
                                                {s.structured_formatting?.secondary_text || "Explore location"}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-3.5 h-3.5 ml-auto text-white/0 group-hover/item:text-white/20 transition-all" />
                                    </button>
                                ))}

                                {/* Attribution */}
                                <div className="px-5 py-2 border-t border-white/5">
                                    <p className="text-[9px] text-white/15 text-center">
                                        Powered by OpenStreetMap • Landmark coordinates hand-verified
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.div>

                {/* Quick Shortcuts */}

            </div>
        </div>
    );
};
