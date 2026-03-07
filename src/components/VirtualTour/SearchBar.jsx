import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Navigation2, Loader2, Globe } from "lucide-react";
import { placesService } from "../../services/placesService";

/* ── Ambient particles ───────────────────────────────────── */
const Particles = () => {
    const pts = React.useMemo(() => Array.from({ length: 20 }, (_, i) => ({
        id: i, x: Math.random() * 100, y: Math.random() * 100,
        s: Math.random() * 2.5 + 0.5, d: Math.random() * 22 + 14, dl: Math.random() * 8,
    })), []);
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {pts.map((p) => (
                <motion.div key={p.id} className="absolute rounded-full"
                    style={{
                        width: p.s, height: p.s, left: `${p.x}%`, top: `${p.y}%`,
                        background: p.id % 3 === 0 ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.06)",
                    }}
                    animate={{ y: [0, -35, 0], opacity: [0.05, 0.3, 0.05] }}
                    transition={{ duration: p.d, delay: p.dl, repeat: Infinity, ease: "easeInOut" }} />
            ))}
        </div>
    );
};

/* ── Main SearchBar ─────────────────────────────────────── */
export const SearchBar = ({ onSearch, isLoading }) => {
    const [q, setQ] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [focused, setFocused] = useState(false);
    const ref = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => { const t = setTimeout(() => ref.current?.focus(), 600); return () => clearTimeout(t); }, []);

    // Debounced autocomplete
    useEffect(() => {
        if (!q.trim() || q.trim().length < 2) { setSuggestions([]); return; }
        const debounce = setTimeout(() => {
            placesService.getPredictions(q).then((preds) => {
                setSuggestions(preds || []);
            });
        }, 250);
        return () => clearTimeout(debounce);
    }, [q]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const go = (e) => { e.preventDefault(); if (q.trim() && !isLoading) { setSuggestions([]); onSearch(q.trim()); } };
    const selectSuggestion = (desc) => {
        setQ(desc);
        setSuggestions([]);
        if (!isLoading) onSearch(desc);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[#0B0E14]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,_rgba(6,182,212,0.04)_0%,_transparent_60%)]" />
                <Particles />
            </div>

            {/* Decorative ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <motion.div className="w-[500px] h-[500px] rounded-full border border-white/[0.015]"
                    animate={{ rotate: 360 }} transition={{ duration: 180, repeat: Infinity, ease: "linear" }} />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 max-w-2xl mx-auto w-full">
                {/* Hero Section */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                    {/* Badge */}
                    <div className="flex items-center justify-center gap-2 mb-5">
                        <Globe className="w-3.5 h-3.5 text-cyan-500/50" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-500/50">Safar360 Virtual Tours</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-3 leading-[1.05]">
                        <span className="text-white/95">Travel the World</span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-cyan-300">in 360°</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-base text-white/35 max-w-md mx-auto mb-10 leading-relaxed">
                        Search any destination and step into an immersive street-level experience with VR support.
                    </p>
                </motion.div>

                {/* Search Input */}
                <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative max-w-lg mx-auto"
                >
                    <form onSubmit={go} className="relative">
                        {/* Subtle glow */}
                        <div className={`absolute -inset-[1px] rounded-2xl transition-all duration-500 ${focused
                                ? "bg-gradient-to-r from-cyan-500/20 via-cyan-400/10 to-cyan-500/20"
                                : "bg-white/[0.04]"
                            }`} />
                        {/* Input container */}
                        <div className="relative flex items-center bg-[#0f1219] rounded-2xl overflow-visible">
                            <div className="pl-4 pr-1.5 flex-shrink-0">
                                {isLoading
                                    ? <Loader2 className="w-[18px] h-[18px] animate-spin text-cyan-400" />
                                    : <Search className={`w-[18px] h-[18px] transition-colors duration-300 ${focused ? "text-cyan-400" : "text-white/20"}`} />
                                }
                            </div>
                            <input
                                ref={ref}
                                type="text"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setTimeout(() => setFocused(false), 200)}
                                placeholder="Where do you want to go?"
                                disabled={isLoading}
                                autoComplete="off"
                                className="flex-1 bg-transparent py-4 px-2 text-white text-[14px] placeholder-white/20 outline-none focus:outline-none focus:ring-0 border-none disabled:opacity-50 font-medium"
                                style={{ boxShadow: "none", WebkitAppearance: "none" }}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !q.trim()}
                                className="mr-2 px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl transition-all duration-200 disabled:opacity-15 disabled:cursor-not-allowed flex items-center gap-1.5 active:scale-95 uppercase tracking-wider"
                            >
                                <Navigation2 className="w-3.5 h-3.5" /><span>Go</span>
                            </button>
                        </div>
                    </form>

                    {/* Auto-suggestions dropdown */}
                    <AnimatePresence>
                        {suggestions.length > 0 && !isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15 }}
                                className="absolute w-full mt-1.5 bg-[#12151c] border border-white/[0.06] rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50 text-left"
                            >
                                {suggestions.map((s, i) => (
                                    <button
                                        key={s.place_id || i}
                                        onClick={() => selectSuggestion(s.description)}
                                        className={`w-full text-left px-4 py-3 hover:bg-white/[0.04] flex items-center gap-3 transition-colors duration-150 ${i !== suggestions.length - 1 ? 'border-b border-white/[0.03]' : ''
                                            }`}
                                    >
                                        <MapPin className="w-3.5 h-3.5 text-cyan-500/60 flex-shrink-0" />
                                        <div className="truncate min-w-0">
                                            <p className="text-sm font-medium text-white/90 truncate">{s.structured_formatting?.main_text || s.description}</p>
                                            {s.structured_formatting?.secondary_text && (
                                                <p className="text-[11px] text-white/30 truncate">{s.structured_formatting.secondary_text}</p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Hint text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-[11px] text-white/15 mt-6"
                >
                    Try "Eiffel Tower", "Times Square", or "Taj Mahal"
                </motion.p>
            </div>
        </div>
    );
};
