import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Globe,
  MapPin,
  Navigation,
  Loader2,
  Sparkles,
  RotateCcw,
  Maximize2,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Camera,
} from "lucide-react";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

// The API key provided by the user
const GOOGLE_MAPS_API_KEY = "AIzaSyD_OqcIbVnaaTJJe5-h2e7lYUc4BTSX2Lg";
const libraries = ["places"];

const SUGGESTED_PLACES = [
  { name: "Eiffel Tower", location: "Paris, France", query: "Eiffel Tower, Paris", wiki: "Eiffel Tower" },
  { name: "Taj Mahal", location: "Agra, India", query: "Taj Mahal, Agra", wiki: "Taj Mahal" },
  { name: "Grand Canyon", location: "Arizona, USA", query: "Grand Canyon, Arizona", wiki: "Grand Canyon" },
  { name: "Great Wall of China", location: "Beijing, China", query: "Great Wall of China", wiki: "Great Wall of China" },
  { name: "Machu Picchu", location: "Cusco, Peru", query: "Machu Picchu, Peru", wiki: "Machu Picchu" },
  { name: "Colosseum", location: "Rome, Italy", query: "Colosseum, Rome", wiki: "Colosseum" },
  { name: "Santorini", location: "Greece", query: "Santorini, Greece", wiki: "Santorini" },
  { name: "Mount Fuji", location: "Japan", query: "Mount Fuji, Japan", wiki: "Mount Fuji" },
  { name: "Petra", location: "Jordan", query: "Petra, Jordan", wiki: "Petra" },
  { name: "Angkor Wat", location: "Cambodia", query: "Angkor Wat, Cambodia", wiki: "Angkor Wat" },
  { name: "Niagara Falls", location: "Canada/USA", query: "Niagara Falls", wiki: "Niagara Falls" },
  { name: "Sydney Opera House", location: "Sydney, Australia", query: "Sydney Opera House", wiki: "Sydney Opera House" },
];

const mapContainerStyle = {
  width: "100%",
  height: "70vh",
  borderRadius: "1.5rem"
};

const defaultCenter = { lat: 20, lng: 0 };

const GoogleEarthExplorer = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  const [activeQuery, setActiveQuery] = useState("");
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [placeImages, setPlaceImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(-1);
  const [cardThumbs, setCardThumbs] = useState({});
  const containerRef = useRef(null);

  // Places Autocomplete Hook
  const {
    ready,
    value: searchQuery,
    suggestions: { status, data: autocompleteData },
    setValue: setSearchQuery,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      // you can restrict by country or types if needed here
    },
    debounce: 300,
    initOnMount: isLoaded,
  });

  // Fetch Wikipedia thumbnails for the preset cards on mount
  useEffect(() => {
    const titles = SUGGESTED_PLACES.map((p) => p.wiki).join("|");
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=pageimages&pithumbsize=400&format=json&origin=*`
    )
      .then((r) => r.json())
      .then((data) => {
        const pages = data?.query?.pages;
        if (!pages) return;
        const thumbMap = {};
        Object.values(pages).forEach((p) => {
          if (p.thumbnail?.source) {
            thumbMap[p.title] = p.thumbnail.source;
          }
        });
        setCardThumbs(thumbMap);
      })
      .catch(() => { });
  }, []);

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim() || !isLoaded) return;
    setActiveQuery(query.trim());
    setSearchQuery(query.trim(), false);
    clearSuggestions();
    fetchPlaceImages(query.trim());

    try {
      // Use original google maps geocoder to find lat/lng of place
      const results = await getGeocode({ address: query });
      if (results && results[0]) {
        const { lat, lng } = await getLatLng(results[0]);
        setMapCenter({ lat, lng });
        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(17);
          map.setMapTypeId("satellite");
          map.setTilt(45); // enabling 3D buildings/tilt
        }
      }
    } catch (error) {
      console.warn("Geocoding failed:", error);
    }
  };

  const handleSelectSuggestion = async ({ description }) => {
    setSearchQuery(description, false);
    clearSuggestions();
    handleSearch(description);
  };

  // Fetch high-quality images from Wikimedia Commons (free, no API key)
  const fetchPlaceImages = async (query) => {
    setIsLoadingImages(true);
    setPlaceImages([]);
    try {
      const res = await fetch(
        `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(
          query
        )}&gsrlimit=20&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=800&format=json&origin=*`
      );
      const data = await res.json();
      const pages = data?.query?.pages;
      if (!pages) {
        setPlaceImages([]);
        setIsLoadingImages(false);
        return;
      }

      const images = Object.values(pages)
        .filter((p) => {
          const mime = p.imageinfo?.[0]?.mime || "";
          return mime.startsWith("image/") && !mime.includes("svg");
        })
        .map((p) => ({
          thumb: p.imageinfo[0]?.thumburl || p.imageinfo[0]?.url,
          full: p.imageinfo[0]?.url,
          title: (p.title || "").replace("File:", "").replace(/\.[^.]+$/, "").replace(/_/g, " "),
          artist:
            p.imageinfo[0]?.extmetadata?.Artist?.value?.replace(/<[^>]*>/g, "") || "Wikimedia Commons",
          width: p.imageinfo[0]?.thumbwidth || 800,
        }))
        .filter((img) => img.thumb && img.width > 200)
        .slice(0, 12);

      setPlaceImages(images);
    } catch (err) {
      console.warn("Wikimedia image fetch error:", err);
      setPlaceImages([]);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const openInGoogleEarth = () => {
    if (activeQuery) {
      window.open(
        `https://earth.google.com/web/search/${encodeURIComponent(activeQuery)}`,
        "_blank"
      );
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const onLoadMap = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmountMap = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6 pb-48">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-8 backdrop-blur-md"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-slate-200 tracking-wide uppercase">
              Google Earth Explorer
            </span>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400">
              Explore Earth in 3D
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto mb-10"
          >
            Search any place on the planet — see immersive 3D imagery and launch the full Google Earth experience.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl mx-auto mb-6"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 rounded-2xl opacity-30 group-hover:opacity-50 blur-lg transition-opacity duration-500" />
              <div className="relative flex items-center bg-slate-900/90 border border-white/10 rounded-2xl backdrop-blur-xl">
                <div className="pl-5 pr-2 text-slate-500">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={!ready}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder="Search any place... (e.g. Eiffel Tower, Taj Mahal)"
                  className="flex-1 py-4 px-3 bg-transparent text-white placeholder-slate-500 outline-none text-lg"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("", false);
                      clearSuggestions();
                    }}
                    className="p-2 text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleSearch()}
                  disabled={!searchQuery.trim()}
                  className="m-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold text-sm tracking-wide flex items-center space-x-2 transition-all hover:scale-105 active:scale-95"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Explore</span>
                </button>
              </div>

              {/* Autocomplete Dropdown - Google Places */}
              <AnimatePresence>
                {status === "OK" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 top-full mt-2 z-50 bg-slate-900/95 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/50"
                    style={{ transformOrigin: "top" }}
                  >
                    {autocompleteData.map((place, idx) => {
                      const {
                        place_id,
                        structured_formatting: { main_text, secondary_text },
                      } = place;
                      return (
                        <button
                          key={place_id}
                          onClick={() => handleSelectSuggestion(place)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-150 text-slate-300 hover:bg-white/5 hover:text-white border-b border-white/5 last:border-0`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center border bg-white/5 border-white/10`}>
                            <MapPin className={`w-4 h-4 text-slate-500`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold truncate">{main_text}</div>
                            {secondary_text && (
                              <div className="text-[11px] text-slate-500 truncate">{secondary_text}</div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Viewer + Google Earth Button */}
      <AnimatePresence>
        {activeQuery && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
            className="px-6 pb-12"
          >
            <div
              ref={containerRef}
              className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900/50 shadow-2xl shadow-black/50"
            >
              {/* Viewer Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-white/5 backdrop-blur-sm relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {activeQuery}
                    </h3>
                    <p className="text-xs text-slate-500">
                      3D Map View
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={openInGoogleEarth}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Open in Google Earth 3D</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleSearch(activeQuery)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                    title="Reload"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveQuery("")}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Google Maps Render Engine */}
              <div className="relative w-full z-0">
                {!isLoaded ? (
                  <div className="h-[70vh] flex items-center justify-center bg-slate-900">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                  </div>
                ) : (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={17}
                    onLoad={onLoadMap}
                    onUnmount={onUnmountMap}
                    options={{
                      mapTypeId: "satellite",
                      tilt: 45, // enables 3D imagery tilt mode
                      disableDefaultUI: false,
                      mapTypeControl: true,
                      streetViewControl: true,
                    }}
                  />
                )}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Image Gallery */}
      <AnimatePresence>
        {activeQuery && (placeImages.length > 0 || isLoadingImages) && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
            className="px-6 pb-12"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center space-x-3 mb-6">
                <Camera className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Photos of {activeQuery}</h3>
                {isLoadingImages && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />}
              </div>

              {isLoadingImages && placeImages.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-[4/3] rounded-2xl bg-slate-800/50 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {placeImages.map((img, idx) => (
                    <motion.div
                      key={img.thumb}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      onClick={() => setLightboxIdx(idx)}
                      className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-cyan-500/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:-translate-y-1"
                    >
                      <img
                        src={img.thumb}
                        alt={img.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-xs font-semibold text-white truncate">{img.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">{img.artist}</p>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
                          <Maximize2 className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx >= 0 && placeImages[lightboxIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setLightboxIdx(-1)}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxIdx(-1)}
              className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Prev */}
            {lightboxIdx > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => i - 1); }}
                className="absolute left-4 md:left-8 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Next */}
            {lightboxIdx < placeImages.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => i + 1); }}
                className="absolute right-4 md:right-8 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-[90vw] max-h-[85vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={placeImages[lightboxIdx].full}
                alt={placeImages[lightboxIdx].title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 rounded-b-lg">
                <p className="text-sm font-bold text-white">{placeImages[lightboxIdx].title}</p>
                <p className="text-xs text-slate-400">📷 {placeImages[lightboxIdx].artist}</p>
              </div>
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-slate-300">
                {lightboxIdx + 1} / {placeImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggested Places Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center space-x-3 mb-8"
          >
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Popular Destinations</h3>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {SUGGESTED_PLACES.map((place, index) => {
              const thumbUrl = cardThumbs[place.wiki];
              return (
                <motion.button
                  key={place.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
                  onClick={() => {
                    handleSearch(place.query);
                  }}
                  className={`group relative rounded-2xl overflow-hidden border transition-all duration-500 text-left ${activeQuery === place.query
                    ? "border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                    : "border-white/5 hover:border-white/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]"
                    } hover:-translate-y-1`}
                >
                  {/* Photo or gradient fallback */}
                  <div className="aspect-square relative overflow-hidden bg-slate-800">
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={place.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-900/50 to-blue-900/50">
                        <Globe className="w-8 h-8 text-cyan-400/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Info */}
                  <div className="p-3 bg-slate-900/90">
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {place.name}
                    </h4>
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      <span className="text-[11px] text-slate-500 truncate">
                        {place.location}
                      </span>
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {activeQuery === place.query && (
                    <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GoogleEarthExplorer;
