import React, { useState, useEffect } from 'react'; // Removed unused useRef
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Search, Plane, Clock, Navigation, MapPin, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Ensure CSS is imported

// Fix Leaflet Default Icon Issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Plane Icon
const planeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/7893/7893979.png', // High-quality plane icon
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    className: 'plane-marker' // For rotation if needed
});

// Component to recenter map
const MapRecenter = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.flyTo([lat, lng], 6, { duration: 1.5 });
        }
    }, [lat, lng, map]);
    return null;
};

const FlightTrackerPage = () => {
    const [flightNumber, setFlightNumber] = useState('');
    const [flightData, setFlightData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_KEY = import.meta.env.VITE_AVIATION_STACK_API_KEY;

    const fetchFlightData = async (e) => {
        if (e) e.preventDefault();
        if (!flightNumber.trim()) return;

        setLoading(true);
        setError(null);
        setFlightData(null);

        if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
            setError('Aviation Stack API Key is missing. Please add VITE_AVIATION_STACK_API_KEY to your .env file.');
            setLoading(false);
            return;
        }

        try {
            // Updated to HTTPS for better browser compatibility. 
            // NOTE: If using a free plan that ONLY supports HTTP, this might need a proxy or fallback.
            const response = await fetch(`https://api.aviationstack.com/v1/flights?access_key=${API_KEY}&flight_iata=${flightNumber}`);

            if (response.status === 401) {
                throw new Error('Invalid API Key. Please check your Aviation Stack credentials.');
            }

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}. Please check your API limit or connection.`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message || 'API Error occurred');
            }

            if (data.data && data.data.length > 0) {
                // Find the active flight or the most recent one
                const activeFlight = data.data.find(f => f.flight_status === 'active') || data.data[0];
                setFlightData(activeFlight);
            } else {
                setError('Flight not found. Please check the flight number (e.g., AI101).');
            }
        } catch (err) {
            console.error("Error fetching flight:", err);
            setError(err.message || 'Could not connect to flight server. Ensure API limit is not exceeded.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            {/* 
                HERO / SEARCH SECTION 
                Video Background & Ocean Theme
            */}
            <div className="relative pt-32 pb-32 px-6 shadow-2xl overflow-hidden min-h-[650px] flex flex-col justify-center">

                {/* VIDEO BACKGROUND (User Requested YouTube HD - JiJ0r9Ig74A) */}
                <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
                    <iframe
                        className="absolute top-1/2 left-1/2 w-[177.77vh] h-[100vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover scale-110 pointer-events-none"
                        src="https://www.youtube-nocookie.com/embed/JiJ0r9Ig74A?autoplay=1&mute=1&controls=0&loop=1&playlist=JiJ0r9Ig74A&playsinline=1&start=14&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1"
                        title="Flight Tracker Background"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                    {/* Overlay: Minimal tint for text readability, NO blur */}
                    <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/10" />
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full mb-8 border border-white/20 shadow-lg"
                    >
                        <Plane className="w-4 h-4 text-cyan-300" />
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-50">Live Global Tracking</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-8xl font-heritage font-bold mb-6 tracking-tight drop-shadow-2xl text-white">
                        Track Your Flight
                    </h1>
                    <p className="text-lg md:text-2xl text-blue-100/90 mb-16 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
                        Real-time status, path visualization, and arrival estimates. <br className="hidden md:block" /> Connect with the sky in real-time.
                    </p>

                    <form onSubmit={fetchFlightData} className="relative max-w-xl mx-auto flex items-center justify-center transform hover:scale-[1.01] transition-transform duration-500">
                        {/* Input Field Container */}
                        <div className="relative w-full z-10 group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <Search className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={flightNumber}
                                onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                                placeholder="Enter Flight Number (e.g. AI101)"
                                className="w-full pl-16 pr-40 py-6 rounded-2xl text-slate-800 bg-white/95 backdrop-blur-xl placeholder-slate-400 shadow-[0_20px_40px_rgba(0,0,0,0.2)] focus:shadow-[0_25px_50px_rgba(37,99,235,0.25)] focus:outline-none focus:ring-4 focus:ring-blue-400/30 text-lg font-medium tracking-wide transition-all border border-white/20"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-3 top-2.5 bottom-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 rounded-xl font-bold tracking-wide transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-cyan-400/40"
                            >
                                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><span>TRACK</span><ChevronRight className="w-4 h-4" /></>}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-12 inline-flex items-center space-x-3 text-red-50 bg-red-900/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-red-500/50 shadow-lg"
                        >
                            <AlertCircle className="w-5 h-5" />
                            <span className="font-medium">{error}</span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* 
                FLIGHT STATUS DASHBOARD
            */}
            <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20">
                <AnimatePresence>
                    {flightData && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl shadow-2xl border border-slate-200/60 overflow-hidden backdrop-blur-xl mb-20"
                        >
                            {/* Header: Route Info */}
                            <div className="bg-white/80 border-b border-slate-100 p-8 md:p-10 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                                <div>
                                    <div className="flex items-center justify-center md:justify-start space-x-3 mb-3">
                                        <div className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-sm font-bold tracking-wider">
                                            {flightData.flight?.iata || flightNumber}
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${flightData.flight_status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                                            flightData.flight_status === 'scheduled' ? 'bg-amber-100 text-amber-800' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                            {flightData.flight_status}
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-heritage font-bold text-slate-900">
                                        {flightData.airline?.name}
                                    </h2>
                                    <p className="text-slate-500 font-medium">Operated by {flightData.airline?.name}</p>
                                </div>

                                <div className="flex items-center space-x-12 mt-8 md:mt-0">
                                    <div className="text-center">
                                        <div className="text-4xl font-black text-slate-900 tracking-tight">{flightData.departure?.iata}</div>
                                        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Origin</div>
                                        <div className="text-xl font-bold text-blue-700 mt-2 font-mono">
                                            {new Date(flightData.departure?.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div className="w-32 h-[2px] bg-slate-200 relative mb-3">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 border border-slate-100 rounded-full">
                                                <Plane className="w-5 h-5 text-slate-400 rotate-90" />
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Duration: ~2h 30m</div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-4xl font-black text-slate-900 tracking-tight">{flightData.arrival?.iata}</div>
                                        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Destination</div>
                                        <div className="text-xl font-bold text-blue-700 mt-2 font-mono">
                                            {new Date(flightData.arrival?.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Grid: Map + Details */}
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                {/* Map Section - Spans 2 cols */}
                                <div className="lg:col-span-2 h-[600px] bg-slate-100 relative z-0">
                                    {/* MAP CONTAINER */}
                                    {(flightData.live || (flightData.departure?.latitude)) ? (
                                        <MapContainer
                                            center={[
                                                flightData.live?.latitude || flightData.departure.latitude || 20,
                                                flightData.live?.longitude || flightData.departure.longitude || 0
                                            ]}
                                            zoom={5}
                                            className="w-full h-full z-0 grayscale-[20%] contrast-[1.1]"
                                            scrollWheelZoom={false}
                                            attributionControl={false}
                                        >
                                            <TileLayer
                                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                            />

                                            {/* Live Plane Marker */}
                                            {flightData.live && (
                                                <Marker position={[flightData.live.latitude, flightData.live.longitude]} icon={planeIcon}>
                                                    <Popup>
                                                        <div className="font-bold">{flightData.flight?.iata}</div>
                                                        <div>Alt: {flightData.live.altitude}m</div>
                                                        <div>Spd: {flightData.live.speed_horizontal}km/h</div>
                                                    </Popup>
                                                </Marker>
                                            )}

                                            {/* Origin Marker */}
                                            {flightData.departure?.latitude && (
                                                <Marker position={[Number(flightData.departure.latitude), Number(flightData.departure.longitude)]}>
                                                    <Popup>Origin: {flightData.departure.airport}</Popup>
                                                </Marker>
                                            )}

                                            {/* Destination Marker */}
                                            {flightData.arrival?.latitude && (
                                                <Marker position={[Number(flightData.arrival.latitude), Number(flightData.arrival.longitude)]}>
                                                    <Popup>Destination: {flightData.arrival.airport}</Popup>
                                                </Marker>
                                            )}

                                            {/* Path Line */}
                                            {flightData.departure?.latitude && flightData.arrival?.latitude && (
                                                <Polyline
                                                    positions={[
                                                        [Number(flightData.departure.latitude), Number(flightData.departure.longitude)],
                                                        // If live exists, add it to path? Or just straight line for now
                                                        // [flightData.live?.latitude, flightData.live?.longitude], 
                                                        [Number(flightData.arrival.latitude), Number(flightData.arrival.longitude)]
                                                    ]}
                                                    color="#1e40af"
                                                    weight={3}
                                                    dashArray="10, 10"
                                                    opacity={0.7}
                                                />
                                            )}

                                            <MapRecenter lat={flightData.live?.latitude || flightData.departure?.latitude} lng={flightData.live?.longitude || flightData.departure?.longitude} />
                                        </MapContainer>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                                            <div className="text-center">
                                                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-500" />
                                                <p className="font-medium">Map data unavailable for this flight.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Details Panel */}
                                <div className="bg-white p-8 border-l border-slate-100">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Live Telemetry</h3>

                                    <div className="space-y-10">
                                        <div className="flex items-start space-x-5">
                                            <div className="p-3 bg-blue-50 rounded-2xl text-blue-700">
                                                <Navigation className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Altitude</div>
                                                <div className="text-3xl font-black text-slate-900">
                                                    {flightData.live?.altitude ? Math.round(flightData.live.altitude * 3.28084).toLocaleString() : 'N/A'} <span className="text-sm font-medium text-slate-400">ft</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-5">
                                            <div className="p-3 bg-cyan-50 rounded-2xl text-cyan-700">
                                                <Clock className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ground Speed</div>
                                                <div className="text-3xl font-black text-slate-900">
                                                    {flightData.live?.speed_horizontal ? Math.round(flightData.live.speed_horizontal * 0.539957) : 'N/A'} <span className="text-sm font-medium text-slate-400">knots</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-5">
                                            <div className="p-3 bg-slate-100 rounded-2xl text-slate-700">
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Coordinates</div>
                                                <div className="text-lg font-bold text-slate-900 font-mono tracking-tighter">
                                                    {flightData.live?.latitude?.toFixed(2) || '--'} / {flightData.live?.longitude?.toFixed(2) || '--'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                                        <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Details</h4>
                                        <ul className="space-y-3 text-sm text-slate-600">
                                            <li className="flex justify-between border-b border-slate-200/50 pb-2">
                                                <span>Aircraft</span>
                                                <span className="font-bold text-slate-900">{flightData.aircraft?.iata || 'Unknown'}</span>
                                            </li>
                                            <li className="flex justify-between border-b border-slate-200/50 pb-2">
                                                <span>Terminal</span>
                                                <span className="font-bold text-slate-900">{flightData.departure?.terminal || 'N/A'}</span>
                                            </li>
                                            <li className="flex justify-between pt-1">
                                                <span>Gate</span>
                                                <span className="font-bold text-slate-900">{flightData.departure?.gate || 'N/A'}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty State / How it works - RE-DESIGNED OCEAN BLUE THEME */}
                {!flightData && !loading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 mb-20">
                        {[
                            { icon: Search, title: "Search Flight", desc: "Enter your airline and flight number to instantly find your plane on the map." },
                            { icon: Navigation, title: "Track Live", desc: "See real-time GPS position, altitude, and ground speed updates." },
                            { icon: Clock, title: "Stay Updated", desc: "Get accurate arrival times, gate info, and delay notifications." }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-xl border border-white/40 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group overflow-hidden relative">
                                {/* Decorative Gradient Background on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                                {/* Icon with Blue Gradient */}
                                <div className="relative z-10 w-24 h-24 mx-auto bg-gradient-to-tr from-blue-100 to-cyan-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                    <item.icon className="w-10 h-10 group-hover:text-cyan-600 transition-colors" />
                                </div>

                                {/* Text Content */}
                                <h3 className="relative z-10 text-2xl font-heritage font-bold text-slate-900 mb-4">{item.title}</h3>
                                <p className="relative z-10 text-slate-600 leading-relaxed font-light">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlightTrackerPage;
