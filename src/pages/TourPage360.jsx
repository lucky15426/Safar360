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

  // 360° Tour locations data
  const locations = [
    {
      id: 1,
      name: "Paris",
      subtitle: "The City of Light",
      description:
        "Experience the romantic allure of Paris from above, featuring the majestic Eiffel Tower and the historic banks of the Seine in immersive 360°.",
      embedUrl: "https://www.airpano.com/embed.php?3D=paris-france",
      icon: Crown,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
      category: "Global Landmark",
      highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame"],
      bestTime: "April - October",
      titleFont: "font-serif text-6xl",
    },
    {
      id: 2,
      name: "New York City",
      subtitle: "The Concrete Jungle",
      description:
        "Soar over the iconic Manhattan skyline, witnessing Central Park, the Empire State Building, and the bustling energy of NYC in stunning detail.",
      embedUrl: "https://www.airpano.com/embed.php?3D=manhattan-new-york-usa",
      icon: Building,
      color: "from-slate-600 to-gray-800",
      textColor: "text-slate-700",
      bgColor: "bg-slate-50",
      category: "Urban Mega-city",
      highlights: ["Times Square", "Central Park", "Statue of Liberty"],
      bestTime: "May - June / Sept - Oct",
      titleFont: "font-sans text-5xl tracking-tight font-black",
    },
    {
      id: 3,
      name: "Andaman Islands",
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
      id: 4,
      name: "Angkor Wat",
      subtitle: "The Sacred Temple of Cambodia",
      description:
        "Explore the world's largest religious monument, a majestic masterpiece of Khmer architecture and a profound center of spiritual heritage.",
      embedUrl: "https://www.airpano.com/embed.php?3D=angkor-wat-cambodia",
      icon: Sparkles,
      color: "from-amber-500 to-orange-700",
      textColor: "text-amber-800",
      bgColor: "bg-amber-50",
      category: "Religious Heritage",
      highlights: ["Central Tower", "Galleries of Bas-Reliefs", "Reflecting Pools"],
      bestTime: "November - February",
      titleFont: "font-mono text-5xl font-black tracking-wider",
    },
    {
      id: 5,
      name: "Rome",
      subtitle: "The Eternal City",
      description:
        "Step through time in Rome, uncovering 3,000 years of history through the Colosseum, Vatican City, and winding cobblestone paths.",
      embedUrl: "https://www.airpano.com/embed.php?3D=rome-italy",
      icon: Building,
      color: "from-orange-500 to-red-700",
      textColor: "text-red-800",
      bgColor: "bg-orange-50",
      category: "Ancient History",
      highlights: ["The Colosseum", "Roman Forum", "Vatican Museum"],
      bestTime: "April - June / Sept - Oct",
      titleFont: "font-serif text-6xl italic font-light",
    },
    {
      id: 6,
      name: "Rio de Janeiro",
      subtitle: "Between the Ocean and the Hills",
      description:
        "Experience the vibrant spirit of Rio, from the iconic Christ the Redeemer to the golden sands of Copacabana and Ipanema.",
      embedUrl: "https://www.airpano.com/embed.php?3D=rio-de-janeiro-brazil",
      icon: Waves,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
      category: "Coastal Beauty",
      highlights: ["Christ the Redeemer", "Sugarloaf Mountain", "Ipanema"],
      bestTime: "December - March",
      titleFont: "font-sans text-4xl font-extrabold uppercase tracking-widest",
    },
    {
      id: 7,
      name: "Taj Mahal",
      subtitle: "The Epitome of Love",
      description:
        "Gaze upon the world's most famous monument to love, a white marble masterpiece that stands as a symbol of India's rich architectural history.",
      embedUrl: "https://www.airpano.com/embed.php?3D=taj-mahal-india-2",
      icon: Crown,
      color: "from-amber-100 to-amber-200",
      textColor: "text-amber-900",
      bgColor: "bg-amber-50",
      category: "World Wonder",
      highlights: ["Main Mausoleum", "Reflecting Pool", "Mughal Gardens"],
      bestTime: "October - March",
      titleFont: "font-heritage text-5xl font-black",
    },
    {
      id: 8,
      name: "Varanasi",
      subtitle: "The Spiritual Heart of India",
      description:
        "Witness the eternal city on the banks of Ganges, where spirituality, tradition, and life converge in timeless harmony along the sacred ghats.",
      embedUrl: "https://www.airpano.com/embed.php?3D=india_varanasi",
      icon: Sparkles,
      color: "from-orange-400 to-red-500",
      textColor: "text-orange-900",
      bgColor: "bg-orange-50",
      category: "Sacred City",
      highlights: ["Ganges Ghats", "Kashi Vishwanath Temple", "Ganga Aarti"],
      bestTime: "October - March",
      titleFont: "font-serif text-6xl italic",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden min-h-screen flex items-center justify-center">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://res.cloudinary.com/bharatverse/video/upload/v1766498471/zfs7izglmckzknou6jvl.mp4" controls />
        </video>

        {/* Darkened overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/10 z-[5]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10 "></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-8">
              <h1 className="text-6xl md:text-8xl font-heritage font-bold bg-gradient-to-r from-white via-sky-100 to-blue-200 bg-clip-text text-transparent tracking-tight drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                VIRTUAL REALITY DESTINATIONS
              </h1>
            </div>

            <p className="text-2xl md:text-3xl max-w-5xl mx-auto text-white/90 leading-relaxed mb-12 drop-shadow-lg font-medium">
              Your travel companion lets you explore every corner before you go—plan smarter, travel better.
            </p>

            {/* Live Stats with Glassmorphism */}
            <div className="bg-black/20 backdrop-blur-sm p-8 rounded-[40px] border border-white/10 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 shadow-2xl">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-300 mb-2 flex items-center justify-center drop-shadow-md">
                  <Eye className="mr-2" size={32} />
                  {viewStats.totalViews.toLocaleString()}
                </div>
                <div className="text-sm text-white font-bold uppercase tracking-widest opacity-80">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-300 mb-2 flex items-center justify-center drop-shadow-md">
                  <Users className="mr-2" size={32} />
                  {viewStats.activeViewers}
                </div>
                <div className="text-sm text-white font-bold uppercase tracking-widest opacity-80">Live Viewers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-300 mb-2 flex items-center justify-center drop-shadow-md">
                  <MapPin className="mr-2" size={32} />
                  {locations.length}
                </div>
                <div className="text-sm text-white font-bold uppercase tracking-widest opacity-80">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-300 mb-2 flex items-center justify-center drop-shadow-md">
                  <Award className="mr-2" size={32} />
                  4K
                </div>
                <div className="text-sm text-white font-bold uppercase tracking-widest opacity-80">Ultra HD</div>
              </div>
            </div>

            {/* Scroll indicator pointing below */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-12 flex flex-col items-center pointer-events-none"
            >
              <span className="text-[10px] text-white/40 uppercase tracking-[0.6em] mb-4 font-bold">Explore Destinations Below</span>
              <div className="w-[1px] h-20 bg-gradient-to-b from-sky-400 to-transparent animate-pulse" />
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
              className="flex items-center space-x-2 text-gray-600 hover:text-saffron-600 transition-colors"
            >
              <ChevronLeft size={20} />
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
                            <Star className="mr-2 text-saffron-500" size={18} />
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
                                  className="mr-2 text-saffron-500"
                                />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                            <Clock
                              className="mr-2 text-saffron-500"
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
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                        <div className="text-center">
                          <RotateCcw
                            className="animate-spin text-saffron-500 mx-auto mb-4"
                            size={48}
                          />
                          <p className="text-gray-600">
                            Loading 360° experience...
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
            className="px-6 py-3 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Previous Destination
          </button>

          <button
            onClick={() =>
              setActiveLocation(
                Math.min(locations.length - 1, activeLocation + 1)
              )
            }
            disabled={activeLocation === locations.length - 1}
            className="px-6 py-3 bg-gradient-to-r from-saffron-500 to-heritage-red-500 text-white rounded-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Next Destination
          </button>
        </div>
      </div>

      {/* Call to Action */}
      <section className="relative py-24 text-white overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://res.cloudinary.com/bharatverse/video/upload/v1769340120/287388_medium_ql0b3r.mp4" type="video/mp4" />
        </video>

        {/* Darkened overlays for better text contrast */}
        <div className="absolute inset-0 bg-slate-900/60 z-[1]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-transparent to-black/30 z-[2]"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-heritage font-bold mb-8 drop-shadow-2xl">
              Ready for More Adventures?
            </h2>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-white/90 drop-shadow-lg font-medium">
              Explore the world's incredible heritage through our
              comprehensive global travel platform
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => onPageChange("gems")}
                className="bg-sky-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-sky-400 transition-all duration-300 flex items-center space-x-3 justify-center shadow-2xl hover:scale-105"
              >
                <Globe size={24} />
                <span>Explore Global Gems</span>
              </button>

              <button
                onClick={() => onPageChange("home")}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-3 justify-center shadow-2xl hover:scale-105"
              >
                <ArrowRight size={24} />
                <span>Back to Features</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TourPage360;
