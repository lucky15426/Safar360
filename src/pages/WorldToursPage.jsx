import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
    Play, X, MapPin, Globe as GlobeIcon, ArrowLeft, Star, Compass, RotateCcw,
    Monitor, Glasses, Eye, Users, Award, ChevronLeft, ChevronRight, Sparkles,
    Volume2, VolumeX, Maximize2, ArrowRight
} from "lucide-react";
import Globe from "../components/3d/Globe";
import vrToursData from "../data/vrTours.json";

// Premium VR Tours Data - Loaded from JSON
const vrTours = vrToursData;

const categories = ["All", "City", "Nature", "Heritage"];

// Custom Player Modal with "Dual-Stream" In-App VR & Master-Slave Sync
const PlayerModal = ({ tour, onClose }) => {
    const [isVRMode, setIsVRMode] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBuffering, setIsBuffering] = useState(true);
    const [showSyncOverlay, setShowSyncOverlay] = useState(false);

    // Player Instances
    const standardPlayerRef = useRef(null);
    const leftPlayerRef = useRef(null);
    const rightPlayerRef = useRef(null);

    // Animation Frame ID for Sync Loop
    const syncRef = useRef(null);

    // Initialize YouTube API
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
        }

        // Polling for API ready
        const initPlayers = () => {
            if (!window.YT || !window.YT.Player) {
                setTimeout(initPlayers, 100);
                return;
            }

            const playerConfig = (id, isMuted = false, isLeft = false) => ({
                videoId: tour.videoId,
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    iv_load_policy: 3,
                    playsinline: 1,
                    enablejsapi: 1,
                    start: tour.start || 0,
                    loop: 1,
                    playlist: tour.videoId,
                    vq: 'hd1080'
                },
                events: {
                    onReady: (event) => {
                        setIsBuffering(false);
                        if (isLeft || isMuted) {
                            // VR players: start paused & muted until VR mode is activated
                            event.target.mute();
                            event.target.pauseVideo();
                        } else {
                            // Standard player: autoplay
                            event.target.playVideo();
                        }
                    },
                    onStateChange: (event) => {
                        // Keep our React state in sync with actual YouTube state
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            event.target.setPlaybackQuality('hd1080');
                            setIsPlaying(true);
                            setIsBuffering(false);

                            // Cross-player sync when master plays
                            if (id === 'player-left' && rightPlayerRef.current && typeof rightPlayerRef.current.getPlayerState === 'function') {
                                if (rightPlayerRef.current.getPlayerState() !== window.YT.PlayerState.PLAYING) {
                                    rightPlayerRef.current.playVideo();
                                }
                            }
                        } else if (event.data === window.YT.PlayerState.PAUSED) {
                            setIsPlaying(false);
                            // Cross-player sync when master pauses
                            if (id === 'player-left' && rightPlayerRef.current && typeof rightPlayerRef.current.pauseVideo === 'function') {
                                if (rightPlayerRef.current.getPlayerState() !== window.YT.PlayerState.PAUSED) {
                                    rightPlayerRef.current.pauseVideo();
                                }
                            }
                        } else if (event.data === window.YT.PlayerState.ENDED) {
                            setIsPlaying(false);
                            setIsBuffering(false);
                            event.target.playVideo();
                        } else if (event.data === window.YT.PlayerState.BUFFERING) {
                            setIsBuffering(true);
                        }
                    }
                }
            });

            // Init Standard Player
            if (!standardPlayerRef.current) {
                standardPlayerRef.current = new window.YT.Player('player-standard', playerConfig('player-standard'));
            }

            // Init VR Players
            if (!leftPlayerRef.current) {
                leftPlayerRef.current = new window.YT.Player('player-left', playerConfig('player-left', false, true));
            }
            if (!rightPlayerRef.current) {
                rightPlayerRef.current = new window.YT.Player('player-right', playerConfig('player-right', true)); // Muted Slave
            }
        };

        initPlayers();

        return () => {
            if (syncRef.current) cancelAnimationFrame(syncRef.current);
            if (standardPlayerRef.current) standardPlayerRef.current.destroy();
            if (leftPlayerRef.current) leftPlayerRef.current.destroy();
            if (rightPlayerRef.current) rightPlayerRef.current.destroy();
            standardPlayerRef.current = null;
            leftPlayerRef.current = null;
            rightPlayerRef.current = null;
        };
    }, [tour.videoId]); // Re-init if video changes

    // Master-Slave Sync Loop
    useEffect(() => {
        const syncLoop = () => {
            if (isVRMode && leftPlayerRef.current && rightPlayerRef.current &&
                leftPlayerRef.current.getSphericalProperties && rightPlayerRef.current.setSphericalProperties) {

                // Get master properties (Yaw/Pitch/Roll/Fov)
                const props = leftPlayerRef.current.getSphericalProperties();

                // Set slave properties (Force sync)
                // We add enableOrientationSensor: false to the SLAVE to prevent double-gyro effect
                if (props) {
                    rightPlayerRef.current.setSphericalProperties({
                        yaw: props.yaw,
                        pitch: props.pitch,
                        roll: props.roll,
                        fov: props.fov,
                        enableOrientationSensor: false
                    });
                }
            }
            syncRef.current = requestAnimationFrame(syncLoop);
        };

        if (isVRMode) {
            syncRef.current = requestAnimationFrame(syncLoop);
        } else {
            if (syncRef.current) cancelAnimationFrame(syncRef.current);
        }

        return () => {
            if (syncRef.current) cancelAnimationFrame(syncRef.current);
        };
    }, [isVRMode]);


    const togglePlay = () => {
        if (!isPlaying) {
            // Play only active mode's players
            if (isVRMode) {
                leftPlayerRef.current?.unMute();
                leftPlayerRef.current?.playVideo();
                rightPlayerRef.current?.playVideo();
                // Hide sync overlay once playback starts
                setShowSyncOverlay(false);
            } else {
                standardPlayerRef.current?.playVideo();
            }
        } else {
            // Pause ALL players to prevent audio bleed
            standardPlayerRef.current?.pauseVideo();
            leftPlayerRef.current?.pauseVideo();
            rightPlayerRef.current?.pauseVideo();
        }
    };

    const toggleVRMode = () => {
        const newMode = !isVRMode;
        setIsVRMode(newMode);
        setIsPlaying(false);

        // Pause ALL players first to prevent audio bleed
        standardPlayerRef.current?.pauseVideo();
        leftPlayerRef.current?.pauseVideo();
        rightPlayerRef.current?.pauseVideo();

        if (newMode) { // Enter VR
            setShowSyncOverlay(true);
            // Sync VR players to standard player's current time
            const time = standardPlayerRef.current?.getCurrentTime?.() || 0;
            if (time > 0) {
                leftPlayerRef.current?.seekTo(time, true);
                rightPlayerRef.current?.seekTo(time, true);
            }
            // Unmute left (master) for VR audio
            leftPlayerRef.current?.unMute();
            // Ensure right stays muted
            rightPlayerRef.current?.mute();
            // Mute standard player
            standardPlayerRef.current?.mute();
        } else { // Exit VR
            setShowSyncOverlay(false);
            // Mute VR players, unmute standard
            leftPlayerRef.current?.mute();
            rightPlayerRef.current?.mute();
            standardPlayerRef.current?.unMute();
        }
    };

    // Auto-sync start for VR
    useEffect(() => {
        let timeout;
        if (isVRMode && !isPlaying) {
            timeout = setTimeout(() => {
                togglePlay();
            }, 2000);
        }
        return () => clearTimeout(timeout);
    }, [isVRMode]);

    return (
        <div className="relative w-full h-full bg-black overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* STANDARD PLAYER CONTAINER */}
            <div className={`absolute inset-0 transition-opacity duration-500 overflow-hidden ${isVRMode ? 'opacity-0 pointer-events-none' : 'opacity-100 z-10'}`}>
                <div className="absolute inset-0 transform scale-[1.50]">
                    <div id="player-standard" className="w-full h-full pointer-events-auto" />
                </div>
                {/* Bottom mask to hide YT progress bar & recommendations on pause */}
                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent via-black/70 to-black z-10 pointer-events-none" />
            </div>

            {/* VR PLAYER CONTAINER */}
            <div className={`absolute inset-0 flex transition-opacity duration-500 bg-black ${isVRMode ? 'opacity-100 z-20' : 'opacity-0 pointer-events-none invisible'}`}>
                {/* Left Eye (Master) - Pointer Events AUTO only in VR Mode */}
                <div className="w-1/2 h-full border-r-2 border-black overflow-hidden relative" style={{ pointerEvents: isVRMode ? 'auto' : 'none' }}>
                    <div className="absolute inset-0 transform scale-[1.55]">
                        <div id="player-left" className="w-full h-full" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/50 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference z-10" />
                </div>

                {/* Right Eye (Slave) - Pointer Events NONE */}
                <div className="w-1/2 h-full border-l-2 border-black overflow-hidden relative" style={{ pointerEvents: 'none' }}>
                    <div className="absolute inset-0 transform scale-[1.55]">
                        <div id="player-right" className="w-full h-full" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/50 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference z-10" />
                </div>

                {/* VR TAP TO PLAY OVERLAY */}
                {isVRMode && showSyncOverlay && (
                    <div
                        className="absolute inset-0 flex items-center justify-center z-50 pointer-events-auto bg-black cursor-pointer"
                        onClick={togglePlay}
                    >
                        {/* Opaque Split Thumbnails */}
                        <div className="absolute inset-0 flex pointer-events-none">
                            <div className="w-1/2 h-full border-r-2 border-black overflow-hidden relative">
                                <img src={tour.thumbnail} alt="VR Tour" className="absolute inset-0 w-full h-full object-cover blur-sm opacity-80" />
                            </div>
                            <div className="w-1/2 h-full border-l-2 border-black overflow-hidden relative">
                                <img src={tour.thumbnail} alt="VR Tour" className="absolute inset-0 w-full h-full object-cover blur-sm opacity-80" />
                            </div>
                        </div>

                        {!isPlaying ? (
                            <div className="bg-black/60 backdrop-blur-md px-8 py-4 rounded-full border border-white/20 animate-pulse cursor-pointer z-10 transition-transform hover:scale-105">
                                <p className="text-white font-bold tracking-widest">TAP SCREEN TO SYNC</p>
                            </div>
                        ) : (
                            <div className="bg-black/80 backdrop-blur-md px-8 py-4 rounded-full border border-cyan-500/30 z-10 flex items-center space-x-4 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                                <div className="w-5 h-5 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
                                <p className="text-white font-bold tracking-widest text-sm">SYNCHRONIZING...</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* THUMBNAIL OVERLAY (Hides YouTube Initial State) */}
            {isBuffering && !isPlaying && !isVRMode && (
                <div className="absolute inset-0 z-30 pointer-events-none select-none bg-black">
                    <img src={tour.thumbnail} alt={tour.name} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-slate-950/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 border-4 border-white/20 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_30px_rgba(6,182,212,0.3)]" />
                    </div>
                </div>
            )}

            {/* UI OVERLAY */}
            <AnimatePresence>
                {!isVRMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[60] pointer-events-none"
                    >
                        {/* Top Bar */}
                        <div className="absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-auto flex justify-between items-start">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/10 transition-colors z-50"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                                <div>
                                    <h2 className="text-2xl font-bold text-white drop-shadow-md">{tour.name}</h2>
                                    <p className="text-sm text-white/70 font-medium tracking-wide">{tour.country} • {tour.category}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={toggleVRMode}
                                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-full shadow-lg shadow-purple-500/20 border border-white/10 transition-all hover:scale-105 group"
                                >
                                    <Glasses className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    <span className="font-bold tracking-wide text-sm">HEADSET MODE</span>
                                </button>
                            </div>
                        </div>

                        {/* Center Play Button Removed to Support Autoplay */}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* EXIT VR BUTTON */}
            {isVRMode && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                    <button
                        onClick={() => {
                            toggleVRMode();
                            onClose();
                        }}
                        className="bg-red-600/80 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold backdrop-blur-md border border-white/20 shadow-lg text-sm flex items-center space-x-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>EXIT VR</span>
                    </button>
                </div>
            )}
        </div>
    );
};

const WorldToursPage = ({ onPageChange, setIsImmersiveMode }) => {
    const [activeTour, setActiveTour] = useState(null);
    const [activeCategory, setActiveCategory] = useState("All");
    const heroRef = useRef(null);
    const modalRef = useRef(null);

    // Call setIsImmersiveMode when activeTour changes
    useEffect(() => {
        if (setIsImmersiveMode) {
            setIsImmersiveMode(!!activeTour);
        }
    }, [activeTour, setIsImmersiveMode]);

    const filteredTours = activeCategory === "All"
        ? vrTours
        : vrTours.filter(t => t.category === activeCategory);

    // Stats animation
    const [stats, setStats] = useState({ tours: 0, countries: 0, hours: 0 });

    useEffect(() => {
        const timer = setTimeout(() => {
            setStats({ tours: vrTours.length, countries: 12, hours: 150 });
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">

            {/* ═══════════════════════════════════════════════════════════════════════════
                 PREMIUM HERO SECTION - Cinematic & Immersive
            ═══════════════════════════════════════════════════════════════════════════ */}
            <section
                ref={heroRef}
                className="relative h-screen flex items-center justify-center overflow-hidden"
            >
                {/* Cloudinary Background Video */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none w-screen h-screen bg-black">
                    {/* Lightweight thumbnail so hero isn't blank before video boots */}
                    <img
                        src={vrTours[0]?.thumbnail}
                        alt="VR Tours Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                        loading="eager"
                        decoding="async"
                    />

                    {/* Cloudinary Background Video */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute top-1/2 left-1/2 w-[180vw] h-[180vh] md:w-[150vw] md:h-[150vh] max-w-none max-h-none -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none filter brightness-[1.25] saturate-[1.3] contrast-[1.05]"
                    >
                        <source src="https://res.cloudinary.com/dnmhqosoa/video/upload/v1772206804/bg7-optimized-4k_blfunq.mp4" type="video/mp4" />
                    </video>

                    {/* TOP MASK (HIDES TITLE BAR) - Lightened */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950/60 to-transparent z-10" />
                    {/* BOTTOM MASK */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950/60 to-transparent z-10" />
                </div>

                {/* Lightened Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/60 z-[2]" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 via-transparent to-slate-950/20 z-[2]" />

                {/* Main Hero Content */}
                <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-8 backdrop-blur-md"
                    >
                        <Glasses className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium text-slate-200 tracking-wide uppercase">VR Headset Compatible</span>
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-white to-blue-500 font-heritage">
                            VR Tours
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-xl md:text-2xl text-white font-medium tracking-wide max-w-3xl mx-auto leading-relaxed mb-12 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]"
                    >
                        Immersive 360° virtual reality experiences.
                        <span className="text-cyan-400 font-bold"> Connect your VR headset</span> and explore the world like never before.
                    </motion.p>

                    {/* Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="flex flex-wrap justify-center gap-8 mb-12"
                    >
                        {[
                            { label: "VR Tours", value: stats.tours + "+", icon: GlobeIcon, color: "text-cyan-400" },
                            { label: "Countries", value: stats.countries + "+", icon: MapPin, color: "text-blue-400" },
                            { label: "Hours of VR", value: stats.hours + "+", icon: Eye, color: "text-sky-300" },
                        ].map((stat, idx) => (
                            <div key={idx} className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-sm">
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                <div className="text-left">
                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                    <div className="text-xs text-slate-400 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <button
                            onClick={() => document.getElementById('tours-grid')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 rounded-2xl font-bold text-lg flex items-center space-x-3 hover:scale-105 transition-transform shadow-lg shadow-blue-500/25"
                        >
                            <Play className="w-5 h-5" />
                            <span>Start Exploring</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => onPageChange("home")}
                            className="bg-white/5 border border-white/20 px-8 py-4 rounded-2xl font-medium text-lg flex items-center space-x-3 hover:bg-white/10 transition-colors backdrop-blur-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Home</span>
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════════════
                 CATEGORY FILTER BAR
            ═══════════════════════════════════════════════════════════════════════════ */}
            <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat
                                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="hidden md:flex items-center space-x-4 text-sm text-slate-400">
                        <span>{filteredTours.length} experiences</span>
                        <div className="w-[1px] h-4 bg-white/10" />
                        <span className="flex items-center space-x-2">
                            <Glasses className="w-4 h-4 text-cyan-400" />
                            <span>WebVR Ready</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════════════
                 TOURS GRID - Premium Cards with Thumbnails
            ═══════════════════════════════════════════════════════════════════════════ */}
            <section id="tours-grid" className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredTours.map((tour, index) => (
                                <motion.div
                                    key={tour.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    onClick={() => setActiveTour(tour)}
                                    className="group relative rounded-3xl overflow-hidden cursor-pointer bg-slate-900/50 border border-white/5 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_60px_rgba(6,182,212,0.15)] hover:-translate-y-2"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={tour.thumbnail}
                                            alt={tour.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                e.target.src = `https://img.youtube.com/vi/${tour.videoId}/hqdefault.jpg`;
                                            }}
                                        />
                                        {/* Gradient Overlay */}
                                        <div className={`absolute inset-0 bg-gradient-to-t ${tour.gradient} opacity-30 group-hover:opacity-50 transition-opacity`} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                                        {/* Play Button */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform scale-75 group-hover:scale-100 transition-transform">
                                                <Play className="w-8 h-8 text-white fill-white ml-1" />
                                            </div>
                                        </div>

                                        {/* Duration Badge */}
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                                            {tour.duration}
                                        </div>

                                        {/* VR Badge */}
                                        <div className="absolute top-4 left-4 bg-blue-600/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                                            <Glasses className="w-3 h-3" />
                                            <span>360° VR</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Category & Country */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="w-3 h-3 text-cyan-400" />
                                                <span className="text-xs text-cyan-300 uppercase tracking-wider font-medium">{tour.country}</span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors font-heritage">
                                            {tour.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-slate-400 text-sm line-clamp-2 mb-4 group-hover:text-slate-300 transition-colors">
                                            {tour.description}
                                        </p>

                                        {/* Highlights */}
                                        <div className="flex flex-wrap gap-2">
                                            {tour.highlights.slice(0, 3).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-slate-400"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════════════
                 IMMERSIVE VR PLAYER MODAL - WebVR/WebXR Ready
            ═══════════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {activeTour && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black"
                        onClick={() => setActiveTour(null)}
                    >
                        <PlayerModal tour={activeTour} onClose={() => setActiveTour(null)} />
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default WorldToursPage;
