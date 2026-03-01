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

import AgentPage from "./pages/AgentPage/App";
import MapPage from "./pages/MapPage";
import UploadPage from "./pages/UploadPage";

import FlightTrackerPage from "./pages/FlightTrackerPage";
import ItineraryPlanner from "./pages/ItineraryPlanner";
import PreTripChecklist from './components/PreTripChecklist';
import DocumentVault from './pages/DocumentVault';
import TourPage360 from './pages/TourPage360';
import SocialPage from './pages/SocialPage';

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
  vault: "/vault",
  "360view": "/360view",
  social: "/social",
};

// Page titles for SEO
const PAGE_TITLES = {
  "/": "Safar360 - Explore the World",
  "/360tour": "VR Previews - Safar360",
  "/itinerary": "Trip Planning - Safar360",
  "/gems": "Hidden Gems - Safar360",
  "/chat": "SafarX Agent - Safar360",
  "/map": "Local Insights - Safar360",
  "/checklist": "🎒 Pre-trip Checklist - Safar360",
  "/upload": "Upload Hidden Gem - Safar360",
  "/tracker": "Flight Tracker - Safar360",
  "/vault": "Document Vault - Safar360",
  "/360view": "360° View - Safar360",
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
    document.title = PAGE_TITLES[location.pathname] || "Safar360 - Discover The World";
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
  const hideHeaderFooter = currentPage === "chat";

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
          className="min-h-screen bg-[#0B0E14]"
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
              <Route path="/chat" element={<AgentPage {...pageProps} />} />
              <Route path="/map" element={<MapPage {...pageProps} />} />
              <Route path="/checklist" element={<PreTripChecklist />} />
              <Route path="/upload" element={<UploadPage {...pageProps} />} />
              <Route path="/tracker" element={<FlightTrackerPage />} />
              <Route path="/vault" element={<DocumentVault {...pageProps} />} />
              <Route path="/360view" element={<TourPage360 onPageChange={handlePageChange} />} />
              <Route path="/social" element={<SocialPage onBack={() => handlePageChange("home")} />} />
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
            <Footer onPageChange={handlePageChange} />
          )}


          <style>{`
            .font-cinzel { font-family: 'Cinzel', serif; }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
