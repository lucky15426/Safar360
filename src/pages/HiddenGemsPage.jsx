import React, { useState, useEffect } from "react";
import {
  MapPin,
  Heart,
  Share2,
  Navigation,
  Globe,
  Compass,
  Search,
  ArrowRight,
  Info,
  Map
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Force update v2.2
console.log("Hidden Gems Page Loaded - v2.2 (Descriptions Updated)");

// Engine Imports
import { getHiddenGems } from "../services/recommendationEngine";
import destinations from "../data/destinations.json";
import { useBookmarks } from "../hooks/useBookmarks";
import OsrmDistance from "../components/OsrmDistance";

const HiddenGemsPage = ({ onPageChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [userLocation, setUserLocation] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [detectedCity, setDetectedCity] = useState(null);

  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  const handleBookmarkToggle = (e, gem) => {
    e.stopPropagation(); // prevent parent clicks if any
    const gemId = `gem-${gem.id}`;
    if (isBookmarked(gemId, 'hidden_gem')) {
      removeBookmark(gemId, 'hidden_gem');
    } else {
      addBookmark({
        id: gemId,
        type: 'hidden_gem',
        title: gem.city,
        description: gem.why_hidden,
        state: gem.country,
        images: [gem.image],
        rating: gem.safety_index,
        originalGem: gem
      });
    }
  };

  // Dynamic Countries List from Dataset - Sorted Alphabetically
  const countries = ["All", ...new Set(destinations.map(d => d.country))].sort();

  // 1. Get User Location Function (Robust with Fallback)
  const getUserLocation = () => {
    setLoadingLocation(true);
    setDetectedCity(null);

    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      // Fallback to default immediately
      setUserLocation({ lat: 41.9028, lon: 12.4964 });
      setLoadingLocation(false);
      return;
    }

    const successHandler = async (position) => {
      const { latitude, longitude } = position.coords;
      console.log("📍 Location found:", latitude, longitude);
      setUserLocation({ lat: latitude, lon: longitude });
      setLoadingLocation(false);

      // Reverse Geocode
      try {
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        const data = await response.json();
        if (data.city || data.locality) {
          setDetectedCity(data.city || data.locality);
        }
      } catch (e) {
        console.warn("Geocode failed:", e);
      }
    };

    const errorHandler = (error) => {
      console.warn("High accuracy location failed/denied:", error.message);

      // Try Low Accuracy if it wasn't a PERMISSION_DENIED (code 1)
      if (error.code !== 1) {
        console.log("Trying low accuracy...");
        navigator.geolocation.getCurrentPosition(
          successHandler,
          (finalError) => {
            console.warn("Low accuracy also failed:", finalError);
            // CRITICAL: Set default location so app doesn't break
            setUserLocation({ lat: 41.9028, lon: 12.4964 }); // Default Rome
            setLoadingLocation(false);
          },
          { enableHighAccuracy: false, timeout: 10000 }
        );
      } else {
        // Permission Denied - Strict Fallback
        // Do NOT alert the user repeatedly, just fallback.
        setUserLocation({ lat: 41.9028, lon: 12.4964 }); // Default Rome
        setLoadingLocation(false);
      }
    };

    // First Try: High Accuracy
    navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  // 2. Fetch Recommendations & Sort
  useEffect(() => {
    if (userLocation) {
      // Always get ALL gems first to allow global searching/sorting
      // We process the "ranking" relative to the user's location here
      const result = getHiddenGems({
        userLat: userLocation.lat,
        userLon: userLocation.lon,
        selectedCountry: "All", // Fetch globally first
        preference: null,
        destinations: destinations
      });
      setRecommendations(result.hidden_gems);
    }
  }, [userLocation]);

  // 3. Filter for Display (Search + Country Filter)
  const displayGems = recommendations.filter(gem => {
    const matchesSearch = searchTerm === "" ||
      gem.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gem.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gem.travel_theme.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCountry = selectedCountry === "All" || gem.country === selectedCountry;

    // If user is searching specific text, we allow searching globally (ignoring country filter) 
    // unless they strictly want to filter within a country. 
    // UX Decision: Search overrides country filter if user types something specific? 
    // Let's keep it strict: Must match BOTH if both are set, 
    // BUT usually users expect Search to find the known city regardless of the dropdown.
    // For now: Strictly match both filters.
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="min-h-screen bg-slate-950 pb-20">

      {/* 🌍 HERO SECTION */}
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Cinematic Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none w-full h-full bg-slate-900">
          {/* Cloudinary Background Video – replace YOUR_VIDEO_ID with your Cloudinary public ID */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 w-[177.77vh] min-w-full min-h-[56.25vw] -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none opacity-100 filter brightness-[1.25] saturate-[1.45] contrast-[1.05]"
          >
            <source src="https://res.cloudinary.com/dnmhqosoa/video/upload/v1772206428/hidden_gems_z6iwmc.mp4" type="video/mp4" />
          </video>
          {/* Subtle cinematic vignette instead of heavy wash */}
          {/* Lighter cinematic vignette for more visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold tracking-[0.2em] mb-6 backdrop-blur-md shadow-lg shadow-cyan-500/20">
              AI-POWERED DISCOVERY
            </span>
            <h1 className="text-6xl md:text-8xl font-heritage font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-200 mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] filter">
              Hidden Gems of the World
            </h1>
            <p className="text-xl md:text-2xl text-white font-medium tracking-wide max-w-3xl mx-auto mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
              Unearth the most breathtaking secret spots beyond the ordinary path.
            </p>

            {/* Status Text & Country Selector Helper */}
            {userLocation && (
              <div className="flex flex-col items-center gap-2 mt-4">
                <p className="text-sm md:text-base text-cyan-400 font-bold font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">
                  — FOUND {displayGems.length} DESTINATIONS {selectedCountry !== 'All' ? `IN ${selectedCountry.toUpperCase()}` : 'WORLDWIDE'} —
                </p>

                {/* Location Status Line */}
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  {detectedCity && (
                    <span className="text-emerald-400">
                      📍 Calculated from <strong>{detectedCity}</strong>
                    </span>
                  )}
                  {loadingLocation ? (
                    <span className="text-yellow-400 animate-pulse">Detecting...</span>
                  ) : (
                    <button
                      onClick={getUserLocation}
                      className="text-cyan-300 underline hover:text-white transition-colors ml-2"
                    >
                      Update Location
                    </button>
                  )}
                </div>
              </div>
            )}

          </motion.div>
        </div>
      </div>

      {/* 🔍 SEARCH & FILTER BAR (Premium Floating Glass) */}
      <div className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full opacity-30 group-hover:opacity-60 transition duration-500 blur-lg"></div>

            <div className="relative bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl flex items-center p-2 pr-6 transition-all duration-300 focus-within:ring-2 focus-within:ring-cyan-500/50 focus-within:border-cyan-400/50">

              <div className="p-3 bg-cyan-500/10 rounded-full mr-4 text-cyan-400">
                <Search className="w-6 h-6" />
              </div>

              {/* Country Dropdown - FIXED CSS: Removed focus:ring and outline */}
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-transparent text-cyan-300 font-mono text-sm border-r border-white/10 pr-4 mr-4 outline-none focus:outline-none focus:ring-0 no-outline cursor-pointer hover:text-cyan-200 transition-colors"
                style={{ maxWidth: '120px', outline: 'none', boxShadow: 'none' }}
              >
                {countries.map(c => (
                  <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Search by city, vibe, or adventure..."
                className="flex-1 bg-transparent text-lg text-white placeholder-slate-300 outline-none border-none ring-0 focus:ring-0 focus:border-none font-light tracking-wide"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Optional Right Icon/Clear if needed, currently empty/clean */}
              <div className="hidden sm:block text-xs text-slate-500 font-mono border-l border-white/10 pl-4 ml-2">
                CMD+K
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🏙️ WORLDWIDE CARDS GRID */}
      <div className="container mx-auto px-6 mt-16">
        {displayGems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayGems.map((gem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-slate-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 transition-all duration-500 border border-slate-800 flex flex-col h-full"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={gem.image}
                    alt={gem.city}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      console.warn("Image failed to load:", gem.image);
                      // Keep the fallback, but the referrerPolicy should fix the primary load
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />

                  {/* Actions Overlay */}
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
                    <button
                      onClick={(e) => handleBookmarkToggle(e, gem)}
                      className={`p-2 backdrop-blur-md rounded-full transition-colors border ${isBookmarked(`gem-${gem.id}`, 'hidden_gem')
                        ? 'bg-red-500/80 text-white border-red-500/50'
                        : 'bg-black/40 text-white hover:bg-red-500 hover:text-white border-white/10'
                        }`}
                    >
                      <Heart className={`w-4 h-4 ${isBookmarked(`gem-${gem.id}`, 'hidden_gem') ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-cyan-500 transition-colors border border-white/10">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {gem.destination_type}
                    </h3>
                    <div className="flex items-center text-slate-400 text-xs font-mono whitespace-nowrap overflow-hidden text-ellipsis">
                      <Navigation className="w-3 h-3 mr-1 flex-shrink-0" />
                      <OsrmDistance
                        userLat={userLocation?.lat}
                        userLon={userLocation?.lon}
                        destLat={gem.coordinates?.lat}
                        destLon={gem.coordinates?.lon}
                        fallbackKm={gem.distance_km}
                        type={gem.destination_type}
                      />
                    </div>
                  </div>

                  <h2 className="text-2xl font-heritage font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {gem.city}, {gem.country}
                  </h2>

                  {/* Why Hidden Section */}
                  <div className="mb-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    <p className="text-cyan-200 text-xs italic flex items-start gap-2">
                      "{gem.why_hidden}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
                    <span className="flex items-center gap-1">
                      Running Cost: <span className="text-white font-bold">${gem.avg_budget_per_day}/day</span>
                    </span>
                    <span className="flex items-center gap-1">
                      Safety: <span className={`font-bold ${gem.safety_index >= 9 ? 'text-green-400' : 'text-amber-400'}`}>{gem.safety_index}/10</span>
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-4">
                    <span className="text-xs text-slate-500 font-medium capitalize">
                      {gem.travel_theme} Experience
                    </span>

                    <button
                      className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors group/btn"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 mx-auto max-w-2xl">
            <Compass className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-200 mb-2">No hidden gems found in {selectedCountry}</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Our AI couldn't match any low-crowd destinations for this filter. Try selecting another country or clearing your search.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default HiddenGemsPage;
