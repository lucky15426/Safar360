import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Scroll } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "./components/LoadingScreen";

// ✅ IMPORT ANONYMOUS SUPABASE CLIENT (NO Clerk interference)
import { supabase } from "./lib/supabaseClient";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import GlobalMusicPlayer from "./components/GlobalMusicPlayer";


// Components

// Pages
import HomePage from "./pages/HomePage";
import WorldToursPage from "./pages/WorldToursPage";

import HiddenGemsPage from "./pages/HiddenGemsPage";

import ChatPage from "./pages/ChatPage";
import MapPage from "./pages/MapPage";
import UploadPage from "./pages/UploadPage";

import FlightTrackerPage from "./pages/FlightTrackerPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ItineraryPlanner from "./pages/ItineraryPlanner";
import PreTripChecklist from './components/PreTripChecklist';
import DocumentVault from './pages/DocumentVault';

import { createOrUpdateUser } from "./services/userService";

// Route configuration for easy management
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
  salahkar: "/salahkar",
  "ask-safar": "/salahkar", // Alias for salahkar
  vault: "/vault",
};

// Page titles for SEO
const PAGE_TITLES = {
  "/": "Safar360 - Discover India's Heritage",
  "/360tour": "VR Previews - Safar360",
  "/itinerary": "Trip Planning - Safar360",
  "/gems": "Hidden Gems - Safar360",
  "/chat": "Real-time Support - Safar360",
  "/map": "Local Insights - Safar360",
  "/checklist": "🎒 Pre-trip Checklist - Safar360",
  "/upload": "Upload Hidden Gem - Safar360",
  "/tracker": "Flight Tracker - Safar360",
  "/salahkar": "Ask Salahkar - Safar360",
  "/vault": "Document Vault - Safar360",
};

// Helper function to get current page ID from path
function getPageIdFromPath(pathname) {
  if (pathname === "/") return "home";
  // Remove leading slash and return
  return pathname.slice(1);
}

// Inner app component
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMainLoading, setIsMainLoading] = useState(true);

  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();

  // Get current page ID from URL path
  const currentPage = getPageIdFromPath(location.pathname);

  // ✅ FIXED: Only sync user data (NO auth token mixing)
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      createOrUpdateUser(clerkUser)
        .then(() => {
          console.log("✅ Clerk user profile synced (data only)");
        })
        .catch((err) => {
          console.warn("⚠️ User sync failed (non-critical):", err.message);
        });
    }
  }, [isLoaded, isSignedIn, clerkUser]);

  // ✅ FIXED: NO Supabase auth sync - Uploads use ANONYMOUS client
  useEffect(() => {
    if (isSignedIn) {
      console.log(
        "👤 Clerk signed in:",
        clerkUser?.emailAddresses[0]?.emailAddress
      );
      console.log(
        "📤 Hidden gems uploads remain 100% ANONYMOUS (separate client)"
      );
    } else {
      console.log("👤 Clerk signed out - Uploads still work anonymously");
    }
  }, [isSignedIn, clerkUser]);

  // Update document title based on current route
  useEffect(() => {
    document.title = PAGE_TITLES[location.pathname] || "Safar360 - Discover India's Heritage";
  }, [location.pathname]);

  // Navigation handler - now uses router
  const handlePageChange = (page, item = null) => {
    const path = ROUTES[page] || "/";
    setSelectedItem(item);
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Common props for pages
  const pageProps = {
    user: clerkUser,
    isSignedIn,
    searchQuery,
    onSearchChange: setSearchQuery,
    onPageChange: handlePageChange,
    selectedItem,
  };

  useEffect(() => {
    if (isLoaded) {
      // Minimum loading time for the premium animation feel
      const timer = setTimeout(() => {
        setIsMainLoading(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  // Hide header/footer on certain pages
  const hideHeaderFooter = currentPage === "salahkar" || currentPage === "storytelling";

  return (
    <AnimatePresence mode="wait">
      {isMainLoading ? (
        <LoadingScreen key="loader" />
      ) : (
        <motion.div
          key="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen bg-slate-50"
        >
          <GlobalMusicPlayer />
          {/* Hide Header on Salahkar & Story pages */}
          {!hideHeaderFooter && (
            <Header
              currentPage={currentPage}
              onPageChange={handlePageChange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}
          {/* Adjust main padding based on current page */}
          <main
            className={
              hideHeaderFooter || currentPage === "home" || currentPage === "tracker"
                ? "min-h-screen"
                : "min-h-screen pt-20"
            }
          >
            <Routes>
              <Route path="/" element={<HomePage {...pageProps} />} />
              <Route path="/360tour" element={<WorldToursPage {...pageProps} />} />
              <Route path="/gems" element={<HiddenGemsPage {...pageProps} />} />
              <Route path="/itinerary" element={<ItineraryPlanner {...pageProps} />} />
              <Route path="/chat" element={<ChatPage {...pageProps} />} />
              <Route path="/map" element={<MapPage {...pageProps} />} />
              <Route path="/checklist" element={<PreTripChecklist />} />
              <Route path="/upload" element={<UploadPage {...pageProps} />} />
              <Route path="/tracker" element={<FlightTrackerPage />} />
              <Route path="/salahkar" element={<RecommendationsPage />} />
              <Route path="/vault" element={<DocumentVault {...pageProps} />} />
              {/* Fallback to home for unknown routes */}
              <Route path="*" element={<HomePage {...pageProps} />} />
            </Routes>
          </main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                color: "#374151",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                borderRadius: "12px",
                padding: "16px",
              },
            }}
          />
          {!hideHeaderFooter && (
            <Footer />
          )}

          {/* ✨ DIVINE SKY-BLUE SAFAR BUTTON - The Click Magnet ✨ */}
          {currentPage !== "salahkar" && (
            <button
              onClick={() => handlePageChange("salahkar")}
              className="salahkar-trigger group"
              title="Ask Safar - AI Travel Assistant"
            >
              {/* Contextual Glow */}
              <div className="absolute inset-0 rounded-full bg-sky-400 blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000 animate-pulse-slow"></div>

              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Rotating Rune Ring */}
                <div className="absolute inset-0 border border-sky-300/30 rounded-full w-full h-full animate-spin-slow-reverse"></div>

                {/* Outer Cyan Ripple */}
                <div className="absolute inset-0 rounded-full border border-sky-400/50 w-full h-full animate-ripple"></div>

                {/* The Gem Body */}
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-sky-600 via-blue-500 to-cyan-300 shadow-2xl border-2 border-sky-200/50 flex flex-col items-center justify-center transform group-hover:scale-105 transition-all duration-500 ease-out overflow-hidden z-10">
                  {/* Shine effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/30 to-transparent opacity-60"></div>

                  {/* Inner Glow */}
                  <div className="absolute inset-0 bg-radial-glow opacity-80 animate-breathe"></div>

                  {/* Sparkling Particles */}
                  <div className="sparkle s1"></div>
                  <div className="sparkle s2"></div>
                  <div className="sparkle s3"></div>

                  {/* Content */}
                  <span className="relative z-20 font-cinzel font-black text-xs text-white tracking-[0.2em] mb-0.5 drop-shadow-sm text-center">
                    ASK
                  </span>
                  <span className="relative z-20 font-cinzel font-bold text-[10px] text-cyan-100 tracking-widest drop-shadow-md text-center">
                    SAFAR
                  </span>
                </div>

                {/* Orbiting Firefly */}
                <div className="absolute inset-[-8px] animate-spin-slow pointer-events-none">
                  <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_15px_4px_rgba(56,189,248,0.8)] absolute top-0 left-1/2 transform -translate-x-1/2 blur-[1px]"></div>
                </div>
              </div>
            </button>
          )}

          <style>{`
            .font-cinzel { font-family: 'Cinzel', serif; }
            
            .salahkar-trigger {
              position: fixed;
              bottom: 40px;
              right: 40px;
              z-index: 1000;
              cursor: pointer;
              transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            .salahkar-trigger:hover {
              transform: translateY(-5px);
            }
            
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            
            @keyframes spin-slow-reverse {
              from { transform: rotate(360deg); }
              to { transform: rotate(0deg); }
            }

            .animate-spin-slow {
              animation: spin-slow 8s linear infinite;
            }
            
            .animate-spin-slow-reverse {
              animation: spin-slow-reverse 12s linear infinite;
            }

            @keyframes ripple {
              0% { transform: scale(1); opacity: 0.8; border-color: rgba(251, 146, 60, 0.6); }
              100% { transform: scale(1.6); opacity: 0; border-color: rgba(251, 146, 60, 0); }
            }

            .animate-ripple {
              animation: ripple 2.5s cubic-bezier(0, 0.2, 0.8, 1) infinite;
            }

            @keyframes breathe {
              0%, 100% { transform: scale(1); opacity: 0.6; }
              50% { transform: scale(1.1); opacity: 0.9; }
            }
            
            .animate-breathe {
              animation: breathe 4s ease-in-out infinite;
            }
            
            .bg-radial-glow {
              background: radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, rgba(251, 191, 36, 0.4) 40%, transparent 70%);
            }

            /* Sparkles */
            .sparkle {
              position: absolute;
              width: 4px;
              height: 4px;
              background: white;
              border-radius: 50%;
              opacity: 0;
              box-shadow: 0 0 5px white;
              animation: sparkle-anim 3s infinite ease-in-out;
            }
            
            .s1 { top: 30%; left: 20%; animation-delay: 0.5s; }
            .s2 { top: 60%; left: 80%; animation-delay: 1.2s; }
            .s3 { top: 20%; left: 70%; animation-delay: 2.1s; }

            @keyframes sparkle-anim {
              0%, 100% { opacity: 0; transform: scale(0); }
              50% { opacity: 1; transform: scale(1); }
            }
            
            .animate-pulse-slow {
              animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


