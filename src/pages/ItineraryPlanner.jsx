import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles, ArrowRight, RotateCcw, Zap } from "lucide-react";
import GeminiItineraryForm from "../components/GeminiItineraryForm";
import GeminiItineraryDisplay from "../components/GeminiItineraryDisplay";
import SimpleMarkdownDisplay from "../components/SimpleMarkdownDisplay";


// New optimized component for video suggestion - REMOVED per user request

const ItineraryPlanner = ({ selectedItem }) => {
  const [itinerary, setItinerary] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = React.useRef(null);

  const handleItineraryGenerated = (result, form) => {
    setIsLoading(true);
    setTimeout(() => {
      setItinerary(result);
      setFormData(form);
      setIsLoading(false);

      // Auto-scroll to top of results
      setTimeout(() => {
        if (resultsRef.current) {
          const yOffset = -100; // Offset for header/padding
          const y = resultsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }, 500);
  };

  const handleNewItinerary = () => {
    setItinerary(null);
    setFormData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Check for incoming AI-generated itinerary data from selectedItem prop
  React.useEffect(() => {
    // Prop handling logic
  }, []);

  React.useEffect(() => {
    if (selectedItem && selectedItem.generatedItinerary) {
      setItinerary(selectedItem.generatedItinerary);
      setFormData({
        startDate: "Flexible",
        endDate: "Flexible",
        startTime: "Morning",
        endTime: "Evening"
      });
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 500);
    }
  }, [selectedItem]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30">

      {/* 🌌 HERO SECTION - FULL SCREEN VIDEO HERO */}
      <div className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center">

        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-slate-950/10 z-10 transition-opacity duration-300 hover:bg-slate-950/10"></div>
          {/* Cloudinary Background Video – replace YOUR_VIDEO_ID with your Cloudinary public ID */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 w-[177.77%] h-[150%] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none filter brightness-[1.25] saturate-[1.35] contrast-[1.05]"
          >
            <source src="https://res.cloudinary.com/dnmhqosoa/video/upload/v1772188196/itenary_oajmr2.mp4" type="video/mp4" />
          </video>
          {/* Custom Video Suggestion Overlay - REMOVED */}
          {/* Gradient fade at bottom to blend into next section */}
          {/* Lighter Gradient fade at bottom for better visibility */}
          <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent z-20"></div>
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-30 text-center px-4 max-w-5xl mx-auto pt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heritage font-bold mb-6 text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] leading-tight filter">
              {itinerary ? "Your Curated Journey" : "Explore the Unseen"}
            </h1>

            {/* Subheading */}
            {itinerary ? (
              <p className="text-lg md:text-2xl text-slate-100 max-w-4xl mx-auto font-light leading-relaxed tracking-wide drop-shadow-md animate-in fade-in slide-in-from-bottom-3 duration-700">
                "An exclusive, tailored experience through the heart of <span className="font-semibold text-cyan-300">{itinerary.selectedState}</span>. Prepare for an unforgettable adventure."
              </p>
            ) : (
              <p className="text-lg md:text-2xl text-slate-100 max-w-3xl mx-auto font-light leading-relaxed tracking-wide drop-shadow-md">
                "To travel is to live. Embark on a journey that transcends boundaries and creates <span className="font-semibold text-cyan-300">timeless memories</span>."
              </p>
            )}

            {/* Scroll Down Indicator */}
            {!itinerary && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1, repeat: Infinity, duration: 2 }}
                className="mt-16 text-slate-400 flex flex-col items-center gap-2"
              >
                <p className="text-sm uppercase tracking-widest font-medium">Scroll to Plan</p>
                <ArrowRight className="rotate-90 text-cyan-400" size={24} />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* 📜 MAIN FORM & CONTENT SECTION - BELOW HERO */}
      <div className="relative z-10 -mt-20 pb-20 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Form Section - Glassmorphism Card */}
          {!itinerary && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mb-20"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-[2rem] blur-2xl opacity-50"></div>

              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 border border-white/10 shadow-2xl ring-1 ring-white/5">
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 border-b border-white/5 pb-8 gap-6 md:gap-0">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.1)] group-hover:scale-105 transition-transform duration-500">
                      <MapPin className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" size={32} />
                    </div>
                    <div>
                      {/* New Creative Header */}
                      <h2 className="text-4xl md:text-5xl font-heritage text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 mb-1 drop-shadow-sm">Design Your Journey</h2>
                      <p className="text-sm text-slate-400 tracking-[0.2em] uppercase font-medium">Tailor every detail</p>
                    </div>
                  </div>
                </div>

                <div className="form-dark-mode-override">
                  <GeminiItineraryForm onItineraryGenerated={handleItineraryGenerated} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Section */}
          <AnimatePresence>
            {itinerary && formData && (
              <motion.div
                ref={resultsRef}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.6 }}
              >
                {isLoading ? (
                  <div className="text-center py-20 bg-slate-900/50 rounded-[2rem] border border-white/5">
                    <Zap className="text-yellow-300 animate-pulse mx-auto mb-6" size={48} />
                    <h3 className="text-3xl font-bold text-white mb-2">Crafting your itinerary...</h3>
                    <p className="text-slate-400">Our AI engine is analyzing thousands of data points.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-8 text-center">
                      <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-green-500/10 text-green-300 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                        <Sparkles size={14} />
                        <span className="font-semibold tracking-wide">Itinerary Ready</span>
                      </span>
                    </div>
                    {typeof itinerary === 'string' ? (
                      <SimpleMarkdownDisplay markdown={itinerary} />
                    ) : (
                      <GeminiItineraryDisplay itinerary={itinerary} formData={formData} />
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNewItinerary}
                      className="mt-16 mx-auto flex items-center space-x-3 bg-white text-slate-900 font-bold py-4 px-10 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-cyan-500/40 transition-all"
                    >
                      <RotateCcw size={20} />
                      <span>Plan Another Trip</span>
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPlanner;
