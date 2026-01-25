import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSoundEffect from "../hooks/useSoundEffect";
import { Menu, X, User, Globe, MapPin, Backpack } from "lucide-react";
import {
  useUser,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { createOrUpdateUser } from "../services/userService";

const Header = ({ currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();

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
    { id: "360tour", label: "VR Previews" },
    { id: "itinerary", label: "Trip Planning", icon: "MapPin" },
    { id: "gems", label: "Hidden Gems" },
    { id: "chat", label: "Real-time Support" },
    { id: "map", label: "Local Insights" },
    { id: "checklist", label: "Pre-trip Checklist", icon: "Backpack" },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-50 transition-all duration-500 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between h-24 px-10 relative">

          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => {
                onPageChange("home");
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
              onClick={() => onPageChange("home")}
              onMouseEnter={playHoverSound}
              className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${currentPage === 'home' ? 'text-sky-400' : 'text-white/70 hover:text-white'}`}
            >
              Home
            </button>
            <button
              onClick={() => onPageChange("360tour")}
              onMouseEnter={playHoverSound}
              className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${currentPage === '360tour' ? 'text-sky-400' : 'text-white/70 hover:text-white'}`}
            >
              VR Views
            </button>
            <button
              onClick={() => onPageChange("gems")}
              onMouseEnter={playHoverSound}
              className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${currentPage === 'gems' ? 'text-sky-400' : 'text-white/70 hover:text-white'}`}
            >
              Hidden Gems
            </button>
            <button
              onClick={() => onPageChange("itinerary")}
              onMouseEnter={playHoverSound}
              className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${currentPage === 'itinerary' ? 'text-sky-400' : 'text-white/70 hover:text-white'}`}
            >
              Itinerary
            </button>
            <button
              onClick={() => onPageChange("chat")}
              onMouseEnter={playHoverSound}
              className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${currentPage === 'chat' ? 'text-sky-400' : 'text-white/70 hover:text-white'}`}
            >
              Support
            </button>
            <button
              onClick={() => {
                const galleryEl = document.getElementById('explore-more-section');
                if (galleryEl) galleryEl.scrollIntoView({ behavior: 'smooth' });
              }}
              onMouseEnter={playHoverSound}
              className="text-[10px] font-bold tracking-[0.2em] uppercase text-sky-400/80 hover:text-sky-300 transition-all duration-300"
            >
              Explore More
            </button>
          </nav>

          <div className="flex items-center space-x-6">

            {/* Auth / Account Section */}
            <div className="hidden md:flex items-center space-x-6 border-l border-white/10 pl-8 h-10">
              {isSignedIn && clerkUser ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onPageChange("account")}
                    className="text-white hover:text-sky-300 transition-colors"
                    title="Account"
                  >
                    <User size={24} />
                  </button>
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
                        onPageChange(link.id);
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
