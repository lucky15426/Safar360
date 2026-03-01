import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useSoundEffect from "../hooks/useSoundEffect";
import { Menu, X, User, Globe, MapPin, Backpack, FolderOpen, Users, MoreVertical, Sparkles, Plane, Camera, Play, CheckCircle } from "lucide-react";
import {
  useUser,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { createOrUpdateUser } from "../services/userService";

// Route configuration matching App.jsx
const ROUTES = {
  home: "/",
  "360tour": "/360tour",
  gems: "/gems",
  itinerary: "/itinerary",
  chat: "/chat",
  map: "/map",
  checklist: "/checklist",
  upload: "/upload",
  tracker: "/tracker",
  vault: "/vault",
  "360view": "/360view",
  social: "/social",
};

// Helper to get page id from pathname
function getPageIdFromPath(pathname) {
  if (pathname === "/") return "home";
  return pathname.slice(1);
}

const Header = ({ searchQuery, onSearchChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();

  // Get current page from URL
  const currentPage = getPageIdFromPath(location.pathname);

  // Navigation handler using router
  const handleNavigation = (pageId) => {
    const path = ROUTES[pageId] || "/";
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Sound Effects
  const playHoverSound = useSoundEffect("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", 0.15);
  const playClickSound = useSoundEffect("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3", 0.2);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      createOrUpdateUser(clerkUser);
    }
  }, [isLoaded, isSignedIn, clerkUser]);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "360tour", label: "VR Tours" },
    { id: "itinerary", label: "Trip Planning", icon: "MapPin" },
    { id: "gems", label: "Hidden Gems" },
    // { id: "chat", label: "Support" },
    { id: "tracker", label: "Flight Tracker", icon: "Plane" },
    { id: "checklist", label: "Checklist", icon: "Backpack" },
    { id: "vault", label: "Document Vault", icon: "FolderOpen" },
    { id: "social", label: "Safar Groups", icon: "Users" },
    { id: "360view", label: "360° View", icon: "Globe" },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-[50] transition-all duration-500 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between h-24 px-10 relative">

          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => {
                handleNavigation("home");
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 group"
              aria-label="Safar360 Home"
            >
              <Globe className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-500" />
              <h1 className="text-lg font-heritage font-bold text-white tracking-widest uppercase">
                Safar 360
              </h1>
            </button>
          </div>

          {/* Desktop Navigation Links - Restored & Prominent */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation("home")}
              onMouseEnter={playHoverSound}
              className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${currentPage === 'home' ? 'text-sky-400' : 'text-white/70 hover:text-white'}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation("360tour")}
              onMouseEnter={playHoverSound}
              className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${currentPage === '360tour' ? 'text-sky-400' : 'text-white/70 hover:text-white'}`}
            >
              VR Tours
            </button>
            <button
              onClick={() => handleNavigation("gems")}
              onMouseEnter={playHoverSound}
              className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${currentPage === 'gems' ? 'text-sky-400' : 'text-white/70 hover:text-white'}`}
            >
              Hidden Gems
            </button>
            <button
              onClick={() => handleNavigation("itinerary")}
              onMouseEnter={playHoverSound}
              className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${currentPage === 'itinerary' ? 'text-sky-400' : 'text-white/70 hover:text-white'}`}
            >
              Itinerary
            </button>
            <button
              onClick={() => handleNavigation("tracker")}
              onMouseEnter={playHoverSound}
              className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${currentPage === 'tracker' ? 'text-sky-400' : 'text-white/70 hover:text-white'}`}
            >
              Flights
            </button>
            <button
              onClick={() => handleNavigation("chat")}
              onMouseEnter={playHoverSound}
              className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${currentPage === 'chat' ? 'text-sky-400' : 'text-white/70 hover:text-white'}`}
            >
              SafarX Agent
            </button>
            <button
              onClick={() => handleNavigation("360view")}
              onMouseEnter={playHoverSound}
              className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${currentPage === '360view' ? 'text-sky-400' : 'text-white/70 hover:text-white'}`}
            >
              360° View
            </button>
            <button
              onClick={() => handleNavigation("vault")}
              onMouseEnter={playHoverSound}
              className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${currentPage === 'vault' ? 'text-sky-400' : 'text-white/70 hover:text-white'}`}
            >
              Vault
            </button>

            {/* Explore More Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowMoreDropdown(!showMoreDropdown);
                  playClickSound();
                }}
                onMouseEnter={playHoverSound}
                className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${showMoreDropdown ? 'text-sky-300' : 'text-sky-400/80 hover:text-sky-300'}`}
              >
                Explore More
              </button>

              <AnimatePresence>
                {showMoreDropdown && (
                  <>
                    {/* Transparent backdrop for hover closure */}
                    <div
                      className="fixed inset-0 z-[-1]"
                      onMouseEnter={() => setShowMoreDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      onMouseLeave={() => setShowMoreDropdown(false)}
                      className="absolute right-0 top-full mt-4 w-72 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[60] p-4"
                    >
                      <div className="space-y-1">
                        {[
                          { id: "social", label: "Safar Groups", icon: Users, desc: "Connect with travelers" },

                          { id: "map", label: "Local Insights", icon: MapPin, desc: "Navigate like a native" },
                          { id: "upload", label: "Share a Gem", icon: Play, desc: "Contribute to Safar" },
                          { id: "checklist", label: "Trip Checklist", icon: CheckCircle, desc: "Essential travel items" },
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              handleNavigation(item.id);
                              setShowMoreDropdown(false);
                              playClickSound();
                            }}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all text-left group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-sky-500/10 transition-colors">
                              <item.icon size={18} className="text-white group-hover:text-sky-400 transition-colors" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white tracking-widest uppercase mb-0.5">{item.label}</p>
                              <p className="text-[10px] text-white/40 uppercase tracking-tighter">{item.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/5 flex flex-col items-center">
                        <button
                          onClick={() => {
                            if (location.pathname === '/' || location.pathname === '') {
                              const galleryEl = document.getElementById('explore-more-section');
                              if (galleryEl) galleryEl.scrollIntoView({ behavior: 'smooth' });
                            } else {
                              navigate('/#explore-more-section');
                              setTimeout(() => {
                                const el = document.getElementById('explore-more-section');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }, 500);
                            }
                            setShowMoreDropdown(false);
                          }}
                          className="text-[9px] font-black tracking-[0.3em] uppercase text-white/30 hover:text-sky-400 transition-colors py-2"
                        >
                          View all tools
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="flex items-center space-x-6">

            {/* Auth / Account Section */}
            <div className="hidden md:flex items-center space-x-6 border-l border-white/10 pl-8 h-10">
              {isSignedIn && clerkUser ? (
                <div className="flex items-center space-x-4">

                  <User size={24} />

                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <div className="flex items-center space-x-6">
                  {isLoaded && (
                    <>
                      <SignInButton>
                        <button className="text-white text-sm font-bold tracking-[0.2em] uppercase hover:text-sky-300 transition-colors">
                          Login
                        </button>
                      </SignInButton>
                      <SignUpButton>
                        <button className="px-6 py-2 border border-white/40 rounded-full text-white text-sm font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all">
                          Sign Up
                        </button>
                      </SignUpButton>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cinematic Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 top-[96px] bg-black/95 backdrop-blur-2xl z-40 overflow-y-auto"
            >
              <div className="max-w-6xl mx-auto px-10 py-20 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
                  {navLinks.map((link, idx) => (
                    <motion.button
                      key={link.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => {
                        if (link.id === 'social' && location.pathname === '/social') {
                          navigate('/social', { replace: true, state: { resetSocialPage: Date.now() } });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                          handleNavigation(link.id);
                        }
                        setIsMenuOpen(false);
                        playClickSound();
                      }}
                      onMouseEnter={playHoverSound}
                      className="group flex flex-col items-center text-center p-8 rounded-3xl border border-white/5 hover:bg-white/5 hover:border-white/20 transition-all duration-500"
                    >
                      <span className="text-white/40 text-[10px] tracking-[0.5em] uppercase mb-4 group-hover:text-sky-400 transition-colors">
                        Discover
                      </span>
                      <h3 className="text-2xl font-bold text-white tracking-widest uppercase transition-transform group-hover:scale-110">
                        {link.label}
                      </h3>
                      <div className="mt-6 w-12 h-[1px] bg-white/20 group-hover:w-24 group-hover:bg-sky-400 transition-all duration-500" />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Bottom Decoration */}
              <div className="absolute bottom-10 left-10 text-white/20 text-xs tracking-[1em] uppercase">
                Explore Your World
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
