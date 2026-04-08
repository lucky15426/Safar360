import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import useSoundEffect from "../hooks/useSoundEffect";
import {
  Play,
  ArrowRight,
  Star,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  TrendingUp,
  Globe as GlobeIcon,
  Shield,
  Cpu,
  MessageCircle,
  Camera,
  RotateCcw,
  CheckCircle,
  Heart,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import PanoViewer from "../components/PanoViewer";
import SearchWidget from "../components/SearchWidget";


// 3D Components
import Globe from "../components/3d/Globe";
import Aurora from "../components/animations/Aurora";
import CurvedLoop from "../components/animations/CurvedLoop";
import MagicBento from "../components/animations/MagicBento";
import ChromaGrid from "../components/animations/ChromaGrid";
import vrToursData from "../data/vrTours.json";


const HomePage = ({ onPageChange, user, bookmarks, addBookmark }) => {
  const location = useLocation();
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState({
    destinations: 0,
    users: 0,
    support: 0,
    trips: 0,
  });

  const videos = [
    {
      id: 1,
      title: "EXPLORE THE.",
      subtitle: "WORLD",
      description: "Your complete travel companion—plan with certainty, travel with confidence.",

    },
    {
      id: 2,
      title: "EXTREME.",
      subtitle: "PEAKS",
      description: "Conquer the highest summits and witness the world from above.",
      url: "https://res.cloudinary.com/dnmhqosoa/video/upload/v1775633394/done_fy2tix.mp4",
    },
    {
      id: 3,
      title: "COASTAL.",
      subtitle: "ESCAPE",
      description: "Where golden sands meet azure waves—your perfect beach getaway.",
      url: "https://res.cloudinary.com/dnmhqosoa/video/upload/v1775633150/ocean_fe7jkv.mp4",
    },
    {
      id: 4,
      title: "VIBRANT.",
      subtitle: "CITIES",
      description: "Experience the pulse of modern metropolises and urban wonders.",
      url: "https://res.cloudinary.com/dnmhqosoa/video/upload/v1775633136/vibrantcities_na8xqe.mp4",
    },
    {
      id: 5,
      title: "SERENE.",
      subtitle: "FORESTS",
      description: "Get lost in the peaceful emerald canopies and nature's embrace.",
      url: "https://res.cloudinary.com/dnmhqosoa/video/upload/v1775633434/lastpage_hv47ap.mp4"
    },
  ];

  // 360 degree viewer state
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const panoramaRef = useRef(null);
  const heroRef = useRef(null);

  // Sound Effects
  const playHoverSound = useSoundEffect("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", 0.15);
  const playClickSound = useSoundEffect("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3", 0.2);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const globeY = useTransform(scrollYProgress, [0, 1], ["0px", "300px"]);
  const videoY = useTransform(scrollYProgress, [0, 1], ["0px", "200px"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0px", "500px"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const featuredDestinations = [
    {
      id: 1,
      title: "Bali, Indonesia",
      region: "Southeast Asia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
      rating: 4.9,
      visitors: "6M+ travelers",
      description: "Tropical paradise with pristine beaches and rich culture.",
      category: "Beach Destination",
      highlights: ["Beaches", "Temples", "Water Sports"],
      bestTime: "April-October",
      avgCost: "$50-100/day",
      vrTourId: "bali"
    },
    {
      id: 2,
      title: "Paris, France",
      region: "Europe",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
      rating: 4.9,
      visitors: "8M+ travelers",
      description: "The city of light - romance, art, and world-class cuisine.",
      category: "City & Culture",
      highlights: ["Museums", "Dining", "Architecture"],
      bestTime: "April-June",
      avgCost: "$100-150/day",
      vrTourId: "paris"
    },
    {
      id: 3,
      title: "Tokyo, Japan",
      region: "Asia",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
      rating: 4.8,
      visitors: "5M+ travelers",
      description: "Modern metropolis blending ancient tradition with cutting-edge innovation.",
      category: "Urban Adventure",
      highlights: ["Tech", "Culture", "Food"],
      bestTime: "March-May",
      avgCost: "$60-120/day",
      vrTourId: "tokyo"
    },
  ];

  // Travel Support Features (Instead of Heritage Topics)
  const travelFeatures = [
    {
      id: "360view",
      icon: GlobeIcon,
      name: "360° Previews",
      count: "2.5K destinations",
      color: "text-blue-600",
    },
    {
      id: "itinerary",
      icon: Calendar,
      name: "Trip Planning",
      count: "1.8K itineraries",
      color: "text-purple-600",
    },
    {
      id: "chat",
      icon: MessageCircle,
      name: "24/7 Support",
      count: "5K+ queries solved",
      color: "text-green-600",
    },
    {
      id: "map",
      icon: MapPin,
      name: "Local Insights",
      count: "3.2K places",
      color: "text-orange-600",
    },
    {
      id: "checklist",
      icon: CheckCircle,
      name: "Checklists",
      count: "4.5K travelers",
      color: "text-cyan-600",
    },
    {
      id: "social",
      icon: Users,
      name: "Community",
      count: "10K+ members",
      color: "text-pink-600",
    },
  ];



  // 360 degree viewer handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setRotation((prev) => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5,
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;
    setRotation((prev) => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5,
    }));
    setDragStart({ x: touch.clientX, y: touch.clientY });
  };

  // Animate stats on mount
  useEffect(() => {
    const animateValue = (start, end, duration, setter) => {
      let startTime = null;
      const step = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        setter(value);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    };

    setTimeout(() => {
      animateValue(0, 250, 2000, (val) =>
        setStats((prev) => ({ ...prev, destinations: val }))
      );
      animateValue(0, 50000, 2200, (val) =>
        setStats((prev) => ({ ...prev, users: val }))
      );
      animateValue(0, 360, 2400, (val) =>
        setStats((prev) => ({ ...prev, support: val }))
      );
      animateValue(0, 100000, 2600, (val) =>
        setStats((prev) => ({ ...prev, trips: val }))
      );
    }, 500);
  }, []);

  // Handle hash-based scrolling (e.g., from Header "Explore More")
  useEffect(() => {
    if (location.hash === '#explore-more-section') {
      const timer = setTimeout(() => {
        const element = document.getElementById('explore-more-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          // Optional: Clear hash after scroll if desired
          // window.history.replaceState(null, '', window.location.pathname);
        }
      }, 500); // Small delay to ensure page is rendered
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  const handleSearch = (query) => {
    setIsSearching(true);
    setTimeout(() => {
      onPageChange("gems");
      setIsSearching(false);
    }, 1000);
  };

  const handleHotspotClick = (hotspot) => {
    console.log("Hotspot clicked:", hotspot);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Cinematic Hero Section */}
      <section ref={heroRef} className="relative h-screen overflow-hidden flex items-center bg-black">

        {/* Background Video Slider - Cinematic Reveal */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeVideoIndex}
              initial={{ clipPath: "circle(0% at 0px 50%)" }}
              animate={{ clipPath: "circle(150% at 0px 50%)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              style={{ y: videoY }}
              className="absolute inset-0"
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover brightness-[0.85]"
                src={videos[activeVideoIndex].url}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Ambient 3D Globe Parallax - Only on Slide 0 */}
        <AnimatePresence>
          {activeVideoIndex === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{ y: globeY }}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              <Globe
                autoRotate={true}
                rotationSpeed={0.005}
                showStars={false}
                cameraPosition={[0, 0, 4]}
                markers={[]}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 z-20 pointer-events-none" />

        {/* Main Content Area */}
        <div className="relative z-30 container mx-auto px-10 md:px-20 h-full flex flex-col justify-center">
          <motion.div
            key={activeVideoIndex}
            className="max-w-2xl"
          >
            {/* Quick VR Access Bar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex items-center space-x-6 mb-12"
            >
              {[
                { name: "Beach", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100" },
                { name: "Forest", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100" },
                { name: "Peaks", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100" },
              ].map((vr, i) => (
                <button
                  key={i}
                  onClick={() => onPageChange("360tour")}
                  onMouseEnter={playHoverSound}
                  className="group relative"
                >
                  <div className="w-16 h-16 rounded-full border-2 border-white/20 overflow-hidden transition-all duration-500 group-hover:border-sky-400 group-hover:scale-110 shadow-lg">
                    <img src={vr.img} alt={vr.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/40 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    {vr.name}
                  </span>
                </button>
              ))}
              <div className="h-10 w-[1px] bg-white/10 mx-4" />
              <div className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">
                Home VR Views
              </div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="text-white/80 text-xl md:text-3xl font-heritage tracking-[0.4em] uppercase mb-2"
            >
              {videos[activeVideoIndex].title}
            </motion.h2>

            <motion.h1
              initial={{ opacity: 0, x: -150 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="text-white text-7xl md:text-9xl font-bold tracking-tighter mb-8 italic"
            >
              {videos[activeVideoIndex].subtitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="text-white/60 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-lg"
            >
              {videos[activeVideoIndex].description}
            </motion.p>
          </motion.div>
        </div>

        {/* Social Bar (Right) */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center space-y-10">
          <div className="w-[1px] h-20 bg-white/20" />
          <div className="flex flex-col space-y-8">
            <a
              href="#"
              onMouseEnter={playHoverSound}
              className="text-white/40 hover:text-white transition-colors duration-300 transform hover:scale-125"
            >
              <Instagram size={22} />
            </a>
            <a
              href="#"
              onMouseEnter={playHoverSound}
              className="text-white/40 hover:text-white transition-colors duration-300 transform hover:scale-125"
            >
              <Facebook size={22} />
            </a>
            <a
              href="#"
              onMouseEnter={playHoverSound}
              className="text-white/40 hover:text-white transition-colors duration-300 transform hover:scale-125"
            >
              <Twitter size={22} />
            </a>
          </div>
          <div className="w-[1px] h-20 bg-white/20" />
        </div>

        {/* Bottom Branding (Left) */}
        <div className="absolute bottom-12 left-10 md:left-20 z-40">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-[1px] bg-sky-500" />
            <span className="text-white/40 text-xs font-bold tracking-[0.8em] uppercase">
              Safar 360
            </span>
          </div>
        </div>

        {/* Navigation Dots (Bottom Center) */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center space-x-6">
          {videos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveVideoIndex(idx);
                playClickSound();
              }}
              onMouseEnter={playHoverSound}
              className="group relative p-2"
            >
              <div className={`w-3 h-3 rounded-full border-2 transition-all duration-700 ${activeVideoIndex === idx ? "bg-sky-400 border-sky-400 scale-150 shadow-[0_0_20px_rgba(56,189,248,1)]" : "border-white/40 group-hover:border-white"}`} />
            </button>
          ))}
        </div>

        {/* Scroll Hint - Moved lower to avoid overlap */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none">
          <span className="text-[7px] text-white/20 uppercase tracking-[0.6em] mb-3">Scroll to Discover</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-sky-400/50 to-transparent" />
        </div>

      </section>

      {/* NEW: Explore More Section Wrapper */}
      <div id="explore-more-section" className="bg-white">
        <div className="py-20 bg-slate-50 border-b border-slate-100">
          <div className="container mx-auto px-10">
            <div className="flex flex-col items-center text-center mb-16">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-8 h-[1px] bg-sky-500" />
                <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-slate-400">Features Hub</h2>
              </div>
              <h3 className="text-4xl font-bold text-slate-900 font-heritage italic">
                Explore More
              </h3>
            </div>


            <MagicBento
              className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              glowColor="56, 189, 248" // Sky-400 equivalent
              cardData={[
                {
                  id: "social",
                  title: "Safar Groups",
                  desc: "Connect with fellow travelers",
                  icon: Users,
                  color: "rgba(15, 23, 42, 0.5)",
                  iconColor: "text-white",
                  image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80",
                  action: () => onPageChange("social")
                },
                {
                  id: "map",
                  title: "Local Insights",
                  desc: "Navigate like a local",
                  icon: GlobeIcon,
                  color: "rgba(29, 78, 216, 0.6)",
                  iconColor: "text-blue-200",
                  image: "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?w=800&auto=format&fit=crop&q=80",
                  action: () => onPageChange("map")
                },
                {
                  id: "checklist",
                  title: "Trip Checklist",
                  desc: "Never leave essentials behind",
                  icon: CheckCircle,
                  color: "rgba(255, 255, 255, 0.1)",
                  iconColor: "text-white",
                  image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80",
                  action: () => onPageChange("checklist")
                },
                {
                  id: "upload",
                  title: "Share a Gem",
                  desc: "Contribute to the community",
                  icon: Play,
                  color: "rgba(30, 41, 59, 0.6)",
                  iconColor: "text-sky-300",
                  image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80",
                  action: () => onPageChange("upload")
                },
              ].map(feat => ({
                ...feat,
                content: (
                  <div className="group h-full w-full">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={feat.image}
                        alt={feat.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 z-10 p-8 flex flex-col justify-between h-full border border-white/5 rounded-3xl">
                      {/* Top Section: Icon */}
                      <div className="flex justify-start">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${feat.color.includes('rgba') ? '' : feat.color} ${feat.iconColor} backdrop-blur-xl border border-white/10 shadow-lg transform group-hover:rotate-6 transition-all duration-500`} style={feat.color.includes('rgba') ? { background: feat.color } : {}}>
                          <feat.icon size={26} strokeWidth={1.5} />
                        </div>
                      </div>

                      {/* Bottom Section: Text */}
                      <div className="flex flex-col items-start text-left">
                        <h4 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-sky-300 transition-colors">
                          {feat.title}
                        </h4>
                        <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2 group-hover:text-white/90 transition-colors">
                          {feat.desc}
                        </p>

                        <div className="flex items-center text-sky-400 font-bold text-xs tracking-widest uppercase transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                          <span>Explore</span>
                          <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }))}
            />
          </div>
        </div>

        {/* Virtual Destination Preview Section - 360° VR */}
        <section className="relative py-20 overflow-hidden">
          {/* Aurora Background Effect */}
          <div className="absolute inset-0 z-0">
            <Aurora
              colorStops={["#0ea5e9", "#6366f1", "#0284c7"]}
              amplitude={1.2}
              blend={0.6}
            />
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 flex items-center justify-center">
                <RotateCcw className="mr-4 text-sky-600 animate-spin-slow" size={48} />
                360° VR Destination Previews
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 font-medium">
                Explore hotels, landmarks, and neighborhoods in immersive VR before you book. Make confident travel decisions with high-fidelity previews.
              </p>
            </div>

            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg mx-auto max-w-7xl">
              <iframe
                src="https://www.airpano.com/embed.php?3D=paris-france"
                title="360° Destination Preview"
                width="100%"
                height="600"

                scrolling="no"
                allowFullScreen
              />
            </div>

            <div className="flex justify-center my-12">
              <button
                onClick={() => onPageChange("360view")}
                className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 inline-flex items-center"
              >
                <span>Explore More Destinations</span>
                <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* Three Core Pillars */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Your Complete Travel Companion
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need before, during, and at your destination
              </p>
            </div>

            <div className="min-h-[600px] mt-12 relative">
              <ChromaGrid
                radius={350}
                items={[
                  {
                    image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800",
                    title: "VR Previews",
                    subtitle: "Explore destinations in high-fidelity 360° VR before booking. Reduce travel uncertainty.",
                    handle: "Immersive",
                    borderColor: "#0ea5e9",
                    gradient: "linear-gradient(145deg, #122831, #1e3c4a)",
                    url: "#",
                    action: () => onPageChange("360tour")
                  },
                  {
                    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
                    title: "Smart Planning",
                    subtitle: "AI-powered itineraries tailored to your travel style. Discover hidden gems and local insights.",
                    handle: "AI Powered",
                    borderColor: "#9333ea",
                    gradient: "linear-gradient(180deg, #2d1b4d, #3c2a5c)",
                    url: "#",
                    action: () => onPageChange("itinerary")
                  },
                  {
                    image: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800",
                    title: "24/7 Support",
                    subtitle: "Real-time assistance. Our AI Copilot provides on-ground help and instant answers anytime.",
                    handle: "Real-time",
                    borderColor: "#16a34a",
                    gradient: "linear-gradient(210deg, #0f2e1b, #1a3d28)",
                    url: "#",
                    action: () => onPageChange("chat")
                  }
                ]}
              />
            </div>

            {/* Pre-Trip Checklist CTA */}
            <div className="text-center mt-12 bg-gradient-to-r from-sky-50 to-blue-50 py-8 rounded-2xl border border-sky-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">🎒 Pre-Trip Checklist</h3>
              <p className="text-gray-600 mb-4">Never forget essentials. Organize your packing like a pro</p>
              <button
                onClick={() => onPageChange("checklist")}
                className="bg-gradient-to-r from-sky-500 to-blue-600 text-white text-lg px-8 py-4 rounded-xl font-semibold flex items-center space-x-2 mx-auto hover:shadow-lg transition-all"
              >
                <span>Open Checklist</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* Trending Travel Topics */}
        <section className="py-20 bg-gradient-to-br from-sky-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 flex items-center justify-center">
                <TrendingUp className="mr-4 text-sky-600" size={48} />
                Trending Travel Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Popular travel tools and features used by thousands
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
              {travelFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-sky-400 hover:shadow-lg transition-all text-center group cursor-pointer"
                    onClick={() => onPageChange(feature.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Explore ${feature.name}`}
                  >
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent
                        size={36}
                        className={`mx-auto ${feature.color}`}
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm group-hover:text-sky-600 transition-colors">
                      {feature.name}
                    </h3>
                    <p className="text-xs text-gray-600">{feature.count}</p>
                  </div>
                );
              })}
            </div>


          </div>
        </section>

        {/* Trending Ticker */}
        <div className="bg-slate-900 text-sky-400 py-2 border-y border-white/5">
          <CurvedLoop
            marqueeText="PARIS • TOKYO • BALI • LONDON • NEW YORK • DUBAI • ROME • SYDNEY • SINGAPORE • "
            speed={1.5}
            curveAmount={30}
            className="text-2xl opacity-50 font-black tracking-widest"
          />
        </div>

        {/* Featured Destinations */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Popular Destinations
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore trending destinations loved by travelers worldwide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredDestinations.map((dest, index) => (
                <div
                  key={index}
                  onClick={() => {
                    const tour = vrToursData.find(t => t.id === dest.vrTourId);
                    onPageChange("360tour", tour);
                  }}
                  className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                >
                  <div className="relative h-80">
                    <img
                      src={dest.image}
                      alt={dest.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-900 flex items-center space-x-1">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span>{dest.rating}</span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="text-sm font-medium text-sky-300 mb-2">{dest.category}</div>
                      <h3 className="text-2xl font-bold mb-2">{dest.title}</h3>
                      <div className="flex items-center text-sm text-gray-200 mb-2">
                        <Users size={14} className="mr-1" />
                        <span>{dest.visitors}</span>
                      </div>
                      <div className="text-xs text-gray-300">
                        💵 {dest.avgCost} | 🗓️ {dest.bestTime}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action with Video Background */}
        <section className="relative py-20 text-white overflow-hidden z-10">
          {/* Video Background */}
          <div className="absolute inset-0 -z-10 w-full h-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover brightness-70"
              draggable="false"
            >
              <source src="https://res.cloudinary.com/dnmhqosoa/video/upload/v1775633171/neeche_ef76ax.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Decorative Circles */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full animate-spin-slow"></div>
            <div
              className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white rounded-full animate-spin-slow"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-white rounded-full animate-spin-slow"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Start Your Journey Today
            </h2>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto opacity-90 leading-relaxed">
              Join thousands of confident travelers planning and experiencing their best trips with Safar360.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <button
                onClick={() => onPageChange("itinerary")}
                className="bg-white text-sky-600 px-10 py-5 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center space-x-3 shadow-xl"
              >
                <Calendar size={24} />
                <span>Plan Your Trip</span>
              </button>
              <button
                onClick={() => onPageChange("360tour")}
                className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 flex items-center space-x-3"
              >
                <Camera size={24} />
                <span>Explore in VR</span>
              </button>
            </div>

            {/* Testimonial */}
            <blockquote className="max-w-3xl mx-auto italic opacity-90 mb-4 text-lg">
              "Safar360 made planning my trips so easy! The VR previews helped me choose the perfect destination."
            </blockquote>
            <cite className="text-sm opacity-80">
              — Alex M., Travel Enthusiast
            </cite>
          </div>
        </section>




      </div> {/* End explore-more-section */}
    </div >
  );
};

export default HomePage;
