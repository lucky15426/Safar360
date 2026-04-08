import React, { useState, useEffect } from "react";
import {
  Globe,
  MapPin,
  Eye,
  Navigation,
  Camera,
  Compass,
  Mountain,
  Waves,
  Building,
  Crown,
  Sparkles,
  ArrowRight,
  Play,
  RotateCcw,
  Maximize,
  Award,
  Star,
  Users,
  Clock,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


const TourPage360 = ({ onPageChange }) => {
  const [activeLocation, setActiveLocation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [viewStats, setViewStats] = useState({
    totalViews: 0,
    activeViewers: 0,
  });

  // 360° Tour locations data - International Destinations
  const locations = [
    {
      id: 1,
      name: "Paris, France",
      subtitle: "City of Lights",
      description:
        "Experience the romance and grandeur of Paris with stunning 360° views of the Eiffel Tower, Champs-Élysées, and iconic Parisian architecture.",
      embedUrl: "https://www.airpano.com/embed.php?3D=paris-france",
      icon: Building,
      color: "from-rose-500 to-pink-600",
      textColor: "text-rose-700",
      bgColor: "bg-rose-50",
      category: "European Capital",
      highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame"],
      bestTime: "April - June",
      titleFont: "font-serif text-6xl",
    },
    {
      id: 2,
      name: "Varanasi, India",
      subtitle: "The Spiritual Heart of India",
      description:
        "Witness the eternal city on the banks of Ganges, where spirituality, tradition, and life converge in timeless harmony.",
      embedUrl: "https://www.airpano.com/embed.php?3D=india_varanasi",
      icon: Sparkles,
      color: "from-purple-500 to-indigo-600",
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
      category: "Sacred City",
      highlights: ["Ganges Ghats", "Ancient Temples", "Spiritual Rituals"],
      bestTime: "October - March",
      titleFont: "font-serif text-5xl tracking-wide",
    },
    {
      id: 3,
      name: "Dubai, UAE",
      subtitle: "Futuristic Desert Marvel",
      description:
        "Witness the stunning modern architecture of Dubai, from the world's tallest building to man-made islands in breathtaking 360°.",
      embedUrl: "https://www.airpano.com/embed.php?3D=dubai-uae",
      icon: Building,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      category: "Modern Wonder",
      highlights: ["Burj Khalifa", "Palm Jumeirah", "Dubai Marina"],
      bestTime: "November - March",
      titleFont: "font-heritage text-4xl font-bold",
    },
    {
      id: 4,
      name: "Andaman & Nicobar",
      subtitle: "Paradise of Crystal Waters",
      description:
        "Discover the pristine beauty of India's tropical paradise with turquoise waters, coral reefs, and untouched beaches in stunning 360°.",
      embedUrl: "https://www.airpano.com/embed.php?3D=andaman_islands",
      icon: Waves,
      color: "from-cyan-500 to-blue-600",
      textColor: "text-cyan-700",
      bgColor: "bg-cyan-50",
      category: "Natural Wonder",
      highlights: ["Pristine Beaches", "Coral Reefs", "Marine Life"],
      bestTime: "October - March",
      titleFont: "font-serif text-6xl",
    },
    {
      id: 5,
      name: "Santorini, Greece",
      subtitle: "Aegean Sea Paradise",
      description:
        "Immerse yourself in the stunning blue domes and white-washed buildings of this iconic Greek island overlooking the caldera.",
      embedUrl: "https://www.airpano.com/embed.php?3D=santorini-greece",
      icon: Waves,
      color: "from-cyan-500 to-blue-600",
      textColor: "text-cyan-700",
      bgColor: "bg-cyan-50",
      category: "Island Paradise",
      highlights: ["Oia Sunset", "Blue Domes", "Volcanic Beaches"],
      bestTime: "April - October",
      titleFont: "font-serif text-6xl italic font-light",
    },
    {
      id: 6,
      name: "Jaipur, India",
      subtitle: "The Pink City of Rajasthan",
      description:
        "Explore the royal grandeur of Rajasthan's capital, with its magnificent palaces, forts, and vibrant bazaars in stunning 360°.",
      embedUrl: "https://www.airpano.com/embed.php?3D=jaipur-india",
      icon: Crown,
      color: "from-pink-500 to-rose-600",
      textColor: "text-pink-700",
      bgColor: "bg-pink-50",
      category: "Royal Heritage",
      highlights: ["Amber Palace", "City Palace", "Hawa Mahal"],
      bestTime: "October - March",
      titleFont: "font-sans text-4xl font-extrabold uppercase tracking-widest",
    },
    {
      id: 7,
      name: "Sydney, Australia",
      subtitle: "Harbor City Down Under",
      description:
        "Experience Australia's most iconic city with panoramic views of the Opera House, Harbour Bridge, and stunning coastal landscapes.",
      embedUrl: "https://www.airpano.com/embed.php?3D=sydney-australia",
      icon: Waves,
      color: "from-sky-500 to-blue-600",
      textColor: "text-sky-700",
      bgColor: "bg-sky-50",
      category: "Harbor City",
      highlights: ["Sydney Opera House", "Harbour Bridge", "Bondi Beach"],
      bestTime: "September - November",
      titleFont: "font-sans text-7xl font-thin tracking-tight",
    },
  ];

  // Stats animation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewStats({
        totalViews: Math.floor(Math.random() * 1000) + 15000,
        activeViewers: Math.floor(Math.random() * 50) + 120,
      });
    }, 3000);

    setTimeout(() => setIsLoading(false), 1000);

    return () => clearInterval(interval);
  }, []);

  const currentLocation = locations[activeLocation];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cyan-50/50 to-slate-50">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/10 z-10"></div>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://res.cloudinary.com/dnmhqosoa/video/upload/v1775633706/homepage_fxyylp.mp4" type="video/mp4" />
          </video>
          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-slate-50 via-slate-50/40 to-transparent z-20"></div>
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-30 text-center px-4 max-w-5xl mx-auto pt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heritage font-bold mb-8 text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] leading-tight tracking-tight uppercase">
              Beyond The <br /> Horizon
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed tracking-wide drop-shadow-md italic">
              "Witness world's most breathtaking landmarks in
              <span className="font-semibold text-cyan-300 ml-1">stunning 360° clarity.</span>
              Step into the view."
            </p>

            {/* Scroll Down Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 10, 0] }}
              transition={{ delay: 1, repeat: Infinity, duration: 2 }}
              className="mt-20 text-white/60 flex flex-col items-center gap-3"
            >
              <p className="text-[10px] uppercase tracking-[0.4em] font-black">Scroll to Explore</p>
              <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onPageChange("home")}
              className="flex items-center space-x-2 text-slate-600 hover:text-cyan-600 transition-colors font-bold tracking-widest text-[10px] uppercase"
            >
              <ChevronLeft size={16} />
              <span>Back to Home</span>
            </button>

            <div className="flex items-center space-x-4 overflow-x-auto">
              {locations.map((location, index) => {
                const IconComponent = location.icon;
                return (
                  <button
                    key={location.id}
                    onClick={() => setActiveLocation(index)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${activeLocation === index
                      ? `bg-gradient-to-r ${location.color} text-white shadow-lg scale-105`
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      }`}
                  >
                    <IconComponent size={16} />
                    <span className="text-sm">{location.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 360° Tour Sections */}
      <div className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {locations.map((location, index) => {
            const IconComponent = location.icon;

            if (index !== activeLocation) return null;

            return (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6 }}
                className="mb-20"
              >
                {/* Location Header */}
                <div
                  className={`${location.bgColor} rounded-3xl p-12 mb-12 shadow-2xl`}
                >
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="flex items-center space-x-4 mb-6">
                        <div
                          className={`w-16 h-16 bg-gradient-to-r ${location.color} rounded-2xl flex items-center justify-center shadow-lg`}
                        >
                          <IconComponent className="text-white" size={32} />
                        </div>
                        <div>
                          <span
                            className={`${location.textColor} text-sm font-bold uppercase tracking-wider`}
                          >
                            {location.category}
                          </span>
                        </div>
                      </div>

                      <h2
                        className={`${location.titleFont} ${location.textColor} mb-4 leading-tight`}
                      >
                        {location.name}
                      </h2>

                      <h3 className="text-2xl font-medium text-gray-600 mb-6">
                        {location.subtitle}
                      </h3>

                      <p className="text-gray-700 text-lg leading-relaxed mb-8">
                        {location.description}
                      </p>

                      {/* Location Details */}
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                            <Star className="mr-2 text-cyan-500" size={18} />
                            Highlights
                          </h4>
                          <ul className="space-y-2">
                            {location.highlights.map((highlight, idx) => (
                              <li
                                key={idx}
                                className="text-gray-600 flex items-center"
                              >
                                <ArrowRight
                                  size={14}
                                  className="mr-2 text-cyan-500"
                                />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                            <Clock
                              className="mr-2 text-cyan-500"
                              size={18}
                            />
                            Best Time to Visit
                          </h4>
                          <p className="text-gray-600">{location.bestTime}</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div
                        className={`w-48 h-48 bg-gradient-to-r ${location.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse`}
                      >
                        <Globe className="text-white" size={80} />
                      </div>
                      <p className="text-gray-600">
                        Ready for 360° exploration
                      </p>
                    </div>
                  </div>
                </div>

                {/* 360° Viewer */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <div className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <RotateCcw className="text-white" size={20} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">
                            360° Virtual Experience
                          </h3>
                          <p className="text-gray-600">
                            Click and drag to explore • Full screen available
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Live</span>
                        </div>
                        <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                          <Maximize size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    {isLoading && (
                      <div className="absolute inset-0 bg-slate-50 flex items-center justify-center z-10">
                        <div className="text-center">
                          <RotateCcw
                            className="animate-spin text-cyan-500 mx-auto mb-4"
                            size={48}
                          />
                          <p className="text-slate-600 font-medium italic">
                            Initialising immersive environment...
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={location.embedUrl}
                        title={`360° ${location.name} Virtual Tour`}
                        width="100%"
                        height="600"
                        frameBorder="0"
                        marginHeight="0"
                        marginWidth="0"
                        scrolling="no"
                        allowFullScreen
                        className="rounded-b-3xl"
                        onLoad={() => setIsLoading(false)}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex justify-center space-x-4 mt-12">
          <button
            onClick={() => setActiveLocation(Math.max(0, activeLocation - 1))}
            disabled={activeLocation === 0}
            className="px-6 py-3 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold uppercase tracking-widest text-xs"
          >
            Previous Stop
          </button>

          <button
            onClick={() =>
              setActiveLocation(
                Math.min(locations.length - 1, activeLocation + 1)
              )
            }
            disabled={activeLocation === locations.length - 1}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold uppercase tracking-widest text-xs shadow-lg shadow-cyan-900/20"
          >
            Next Stop
          </button>
        </div>
      </div>

      {/* Call to Action with Video Background */}
      <section className="relative py-24 text-white overflow-hidden">
        {/* Video Background Layer */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60 z-10"></div>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://res.cloudinary.com/dnmhqosoa/video/upload/v1772875114/cl_wa7x6o.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent z-20"></div>
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl z-10"></div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl z-10"></div>

        <div className="container mx-auto px-4 text-center relative z-30">
          <h2 className="text-5xl md:text-6xl font-heritage font-bold mb-8 uppercase tracking-tight drop-shadow-2xl">
            The World is Your Gallery
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90 font-light leading-relaxed drop-shadow-md">
            Your journey doesn't end here. Step into more immersive environments,
            discover cultural landmarks, and experience global travel in full 360° perspective.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => onPageChange("gems")}
              className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300 flex items-center space-x-3 justify-center shadow-xl"
            >
              <Building size={24} />
              <span>Explore Destinations</span>
            </button>

            <button
              onClick={() => onPageChange("itinerary")}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-3 justify-center"
            >
              <Award size={24} />
              <span>Plan Your Trip</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TourPage360;
