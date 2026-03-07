import React, { useState, useCallback, useEffect, useRef } from "react";
import { Loader2, ArrowLeft, Maximize, Minimize, AlertCircle } from "lucide-react";

/* ─── Google Maps Street View embed (free, no API key) ──── */
const streetViewUrl = (lat, lng) =>
    `https://maps.google.com/maps?q=${lat},${lng}&layer=c&cbll=${lat},${lng}&cbp=12,0,0,0,0&output=svembed`;

/* ═══════════════════════════════════════════════════════════ */
/*  VRScene — Interactive 360° Street View                    */
/* ═══════════════════════════════════════════════════════════ */

export const VRScene = ({ place, onBack }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const containerRef = useRef(null);

    /* ── Fullscreen ──────────────────────────────────────── */
    const toggleFullscreen = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;
        if (!document.fullscreenElement) el.requestFullscreen?.() || el.webkitRequestFullscreen?.();
        else document.exitFullscreen?.() || document.webkitExitFullscreen?.();
    }, []);

    useEffect(() => {
        const h = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", h);
        return () => document.removeEventListener("fullscreenchange", h);
    }, []);

    /* ── Timeout fallback ────────────────────────────────── */
    useEffect(() => {
        const t = setTimeout(() => {
            if (!iframeLoaded) setIframeLoaded(true); // Force show after 8s
        }, 8000);
        return () => clearTimeout(t);
    }, [iframeLoaded]);

    /* ═══ RENDER ═════════════════════════════════════════════ */
    return (
        <div ref={containerRef} className="relative w-full h-screen bg-black select-none overflow-hidden">

            {/* Loading overlay */}
            {!iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0B0E14] z-30">
                    <div className="text-center">
                        <div className="relative w-14 h-14 mx-auto mb-4">
                            <div className="absolute inset-0 rounded-full border border-cyan-500/15 animate-ping" />
                            <Loader2 className="absolute inset-0 m-auto w-5 h-5 text-cyan-400 animate-spin" />
                        </div>
                        <p className="text-white/70 text-sm font-medium">Loading 360° Street View</p>
                        <p className="text-white/30 text-[10px] mt-1">{place.name?.split(",").slice(0, 2).join(",").trim()}</p>
                    </div>
                </div>
            )}

            {/* Google Street View iframe */}
            <iframe
                src={streetViewUrl(place.lat, place.lng)}
                className="w-full h-full border-0"
                allowFullScreen
                referrerPolicy="no-referrer"
                loading="eager"
                allow="accelerometer; gyroscope"
                onLoad={() => setIframeLoaded(true)}
                onError={() => setHasError(true)}
                title="360° Street View"
            />

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0B0E14] z-30">
                    <div className="text-center max-w-[300px]">
                        <AlertCircle className="w-10 h-10 text-red-400/70 mx-auto mb-3" />
                        <p className="text-white/80 text-sm font-semibold mb-1">Street View Unavailable</p>
                        <p className="text-white/40 text-xs">No Street View coverage at this location.</p>
                        <button onClick={onBack}
                            className="mt-4 px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/60 text-xs font-medium hover:bg-white/[0.1] transition-all">
                            Go Back
                        </button>
                    </div>
                </div>
            )}

            {/* Location badge */}
            {iframeLoaded && (
                <div className="absolute top-4 right-4 z-[60]">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/[0.05]">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[10px] font-medium text-white/50 truncate max-w-[200px]">
                            {place.name?.split(",").slice(0, 2).join(",").trim()}
                        </span>
                    </div>
                </div>
            )}

            {/* Controls */}
            {iframeLoaded && (
                <>
                    {/* Back button */}
                    <div className="absolute top-4 left-4 z-[60]">
                        <button onClick={onBack}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/[0.06] hover:bg-black/80 transition-all">
                            <ArrowLeft className="w-3.5 h-3.5 text-white/70" />
                            <span className="text-[11px] font-medium text-white/50">Back</span>
                        </button>
                    </div>

                    {/* Bottom controls */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[60]">
                        <div className="flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/[0.06]">
                            <CtrlBtn
                                icon={isFullscreen ? Minimize : Maximize}
                                label={isFullscreen ? "Exit" : "Fullscreen"}
                                onClick={toggleFullscreen}
                            />
                        </div>
                    </div>

                    {/* Onboarding toast */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 animate-[fadeOut_4s_forwards]">
                        <div className="bg-black/50 backdrop-blur-md rounded-lg px-4 py-2.5 border border-white/[0.05] text-center">
                            <p className="text-white/60 text-xs font-medium">Drag to explore in 360°</p>
                            <p className="text-white/25 text-[10px] mt-0.5">Click arrows to walk around</p>
                        </div>
                    </div>
                </>
            )}

            <style>{`@keyframes fadeOut{0%{opacity:1}70%{opacity:1}100%{opacity:0;pointer-events:none}}`}</style>
        </div>
    );
};

/* ── Button Component ───────────────────────────────────── */
const CtrlBtn = ({ icon: Icon, label, onClick }) => (
    <button onClick={onClick}
        className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all cursor-pointer hover:bg-white/[0.04] active:scale-95">
        <Icon className="w-4 h-4 text-white/50" />
        <span className="text-[8px] font-semibold uppercase tracking-wider text-white/25">{label}</span>
    </button>
);
