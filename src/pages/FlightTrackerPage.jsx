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
                Full Screen Video Background & Premium Theme
            */}
            <div className="relative h-screen px-6 shadow-2xl overflow-hidden flex flex-col justify-center items-center">

                {/* VIDEO BACKGROUND */}
                <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden bg-slate-900">
                    {/* Cloudinary Background Video – replace YOUR_VIDEO_ID with your Cloudinary public ID */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute top-1/2 left-1/2 w-[177.77vh] h-[100vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover scale-110 pointer-events-none opacity-85"
                    >
                        <source src="https://res.cloudinary.com/dnmhqosoa/video/upload/v1772188206/bgvideo_rzovxb.mp4" type="video/mp4" />
                    </video>
                    {/* Multi-layered Overlays for depth and readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-transparent to-slate-950/10" />
                    <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
                    {/* Decorative radial glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
                </div>

                <div className="max-w-6xl mx-auto text-center relative z-10 w-full px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-6 py-2 rounded-full mb-10 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    >
                        <Plane className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-cyan-100">SkyLink Live Tracker</span>
                    </motion.div>

                    <h1 className="text-6xl md:text-[7rem] font-heritage font-bold mb-8 tracking-tighter leading-none text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        Track The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Sky</span>
                    </h1>

                    <p className="text-xl md:text-3xl text-blue-50/80 mb-0 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-lg">
                        Real-time visualization and global flight intelligence at your fingertips.
                    </p>
                </div>

                {/* Bottom Scroll Indicator - adjusted position for full screen */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
                    <div className="w-1 h-12 bg-gradient-to-b from-white to-transparent rounded-full" />
                </div>
            </div>

            {/* SEARCH SECTION - POSITIONED BELOW THE FOLD */}
            <div className="bg-white relative z-30 py-24">
                <div className="max-w-2xl mx-auto px-6">
                    <form onSubmit={fetchFlightData} className="relative group">
                        {/* Glow effect around search */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-[2.5rem] blur opacity-15 group-focus-within:opacity-30 transition duration-500" />

                        <div className="relative flex items-center">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                <Search className="h-7 w-7 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={flightNumber}
                                onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                                placeholder="Flight Number (e.g. EK202)"
                                className="w-full pl-16 pr-44 py-7 rounded-[2.2rem] text-slate-900 bg-slate-50 border border-slate-200 backdrop-blur-2xl placeholder-slate-400 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xl font-medium tracking-wide transition-all"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-3 top-3 bottom-3 bg-slate-900 hover:bg-black text-white px-10 rounded-[1.8rem] font-black text-sm tracking-widest transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2 shadow-xl border border-white/10 hover:shadow-blue-500/20"
                            >
                                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <span>SEARCH</span>}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 flex items-center justify-center space-x-3 text-red-600 bg-red-50 px-8 py-4 rounded-2xl border border-red-100 shadow-sm"
                        >
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <span className="font-semibold text-sm">{error}</span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* 
                FLIGHT STATUS DASHBOARD
            */}
            <div className="max-w-7xl mx-auto px-6 relative z-20">
                <AnimatePresence>
                    {flightData && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 20 }}
                            className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-slate-200/50 overflow-hidden backdrop-blur-xl mb-24"
                        >
                            {/* Header: Route Info */}
                            <div className="bg-white border-b border-slate-50 p-10 flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                                        <div className="bg-blue-600 text-white px-5 py-2 rounded-xl text-lg font-black italic tracking-tighter shadow-lg shadow-blue-500/20">
                                            {flightData.flight?.iata || flightNumber}
                                        </div>
                                        <div className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-sm ${flightData.flight_status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                            flightData.flight_status === 'scheduled' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                'bg-slate-50 text-slate-500 border border-slate-100'
                                            }`}>
                                            {flightData.flight_status}
                                        </div>
                                    </div>
                                    <h2 className="text-4xl font-heritage font-bold text-slate-900 mb-1">
                                        {flightData.airline?.name}
                                    </h2>
                                    <p className="text-slate-400 flex items-center justify-center md:justify-start gap-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                        Primary Carrier Intelligence
                                    </p>
                                </div>

                                <div className="flex items-center space-x-16 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                                    <div className="text-center">
                                        <div className="text-5xl font-black text-slate-900 tracking-tighter drop-shadow-sm">{flightData.departure?.iata}</div>
                                        <div className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em] mt-2 opacity-70">Dep. Origin</div>
                                        <div className="text-xl font-bold text-slate-900 mt-2 font-mono">
                                            {new Date(flightData.departure?.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <motion.div
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ repeat: Infinity, duration: 3 }}
                                            className="w-40 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent relative mb-4"
                                        >
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 border border-blue-100 rounded-full shadow-md">
                                                <Plane className="w-6 h-6 text-blue-600 rotate-90" />
                                            </div>
                                        </motion.div>
                                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">NON-STOP FLIGHT</div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-5xl font-black text-slate-900 tracking-tighter drop-shadow-sm">{flightData.arrival?.iata}</div>
                                        <div className="text-[10px] text-cyan-600 font-black uppercase tracking-[0.3em] mt-2 opacity-70">Arr. Destination</div>
                                        <div className="text-xl font-bold text-slate-900 mt-2 font-mono">
                                            {new Date(flightData.arrival?.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Grid: Map + Details */}
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                {/* Map Section - Spans 2 cols */}
                                <div className="lg:col-span-2 h-[650px] bg-slate-50 relative z-0">
                                    {/* MAP CONTAINER */}
                                    {(flightData.live || (flightData.departure?.latitude)) ? (
                                        <MapContainer
                                            center={[
                                                flightData.live?.latitude || flightData.departure.latitude || 20,
                                                flightData.live?.longitude || flightData.departure.longitude || 0
                                            ]}
                                            zoom={5}
                                            className="w-full h-full z-0 contrast-[1.05]"
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
                                                        <div className="font-bold flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                                                            {flightData.flight?.iata}
                                                        </div>
                                                        <div className="text-xs mt-1">
                                                            <div>Alt: {Math.round(flightData.live.altitude * 3.28084).toLocaleString()} ft</div>
                                                            <div>Speed: {Math.round(flightData.live.speed_horizontal * 0.539957)} kts</div>
                                                        </div>
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
                                                        [Number(flightData.arrival.latitude), Number(flightData.arrival.longitude)]
                                                    ]}
                                                    color="#2563eb"
                                                    weight={3}
                                                    dashArray="12, 12"
                                                    opacity={0.6}
                                                />
                                            )}

                                            <MapRecenter lat={flightData.live?.latitude || flightData.departure?.latitude} lng={flightData.live?.longitude || flightData.departure?.longitude} />
                                        </MapContainer>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                                            <div className="text-center">
                                                <MapPin className="w-16 h-16 mx-auto mb-4 opacity-20 text-slate-500" />
                                                <p className="font-bold text-slate-400">Tactical Map Data Restricted</p>
                                            </div>
                                        </div>
                                    )}
                                    {/* Map Data Badge */}
                                    <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border border-slate-200 pointer-events-none">
                                        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-900 uppercase">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                                            High-Fidelity Telemetry Enabled
                                        </div>
                                    </div>
                                </div>

                                {/* Details Panel */}
                                <div className="bg-white p-10 border-l border-slate-100 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-[10px] font-black text-blue-600/50 uppercase tracking-[0.4em] mb-10">Network Payload</h3>

                                        <div className="space-y-12">
                                            <div className="flex items-start space-x-6 group">
                                                <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                                    <Navigation className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Flight Altitude</div>
                                                    <div className="text-4xl font-black text-slate-900 leading-none">
                                                        {flightData.live?.altitude ? Math.round(flightData.live.altitude * 3.28084).toLocaleString() : '--'} <span className="text-sm font-black text-blue-500 uppercase">FT</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-6 group">
                                                <div className="p-4 bg-cyan-500 text-white rounded-2xl shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                                                    <Clock className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ground Speed</div>
                                                    <div className="text-4xl font-black text-slate-900 leading-none">
                                                        {flightData.live?.speed_horizontal ? Math.round(flightData.live.speed_horizontal * 0.539957) : '--'} <span className="text-sm font-black text-cyan-500 uppercase">KTS</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-6 group">
                                                <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                                                    <MapPin className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Geospatial Pos.</div>
                                                    <div className="text-xl font-bold text-slate-900 font-mono italic">
                                                        {flightData.live?.latitude?.toFixed(4) || '---'} / {flightData.live?.longitude?.toFixed(4) || '---'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-16 p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="w-1 h-3 bg-blue-600 rounded-full" />
                                            <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">Metadata</h4>
                                        </div>
                                        <ul className="space-y-4 text-sm">
                                            <li className="flex justify-between items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100">
                                                <span className="text-slate-400 font-medium">Aircraft</span>
                                                <span className="font-black text-slate-900">{flightData.aircraft?.iata || 'TBD'}</span>
                                            </li>
                                            <li className="flex justify-between items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100">
                                                <span className="text-slate-400 font-medium">Terminal</span>
                                                <span className="font-black text-slate-900">{flightData.departure?.terminal || '---'}</span>
                                            </li>
                                            <li className="flex justify-between items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100">
                                                <span className="text-slate-400 font-medium">Gate</span>
                                                <span className="font-black text-slate-900">{flightData.departure?.gate || '---'}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty State / How it works - PREMIUM REDESIGN */}
                {!flightData && !loading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10 mb-32">
                        {[
                            {
                                icon: Search,
                                title: "Instant Intelligence",
                                desc: "Ingest live AIS data points from ground stations worldwide to pinpoint your specific aircraft.",
                                gradient: "from-blue-600 to-indigo-700"
                            },
                            {
                                icon: Navigation,
                                title: "Telemetry Feed",
                                desc: "Visualize real-time vector components including barometric altitude, vertical rate, and true airspeed.",
                                gradient: "from-indigo-600 to-purple-700"
                            },
                            {
                                icon: Clock,
                                title: "Terminal Dynamics",
                                desc: "Monitor precision turnaround times, gate allocation shifts, and tactical delay notifications.",
                                gradient: "from-purple-600 to-pink-700"
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 text-center hover:shadow-[0_30px_70px_rgba(0,0,0,0.1)] hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden"
                            >
                                {/* Active Gradient Background on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                                {/* Animated Background Glow */}
                                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${item.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />

                                {/* Icon Wrapped in Premium Container */}
                                <div className={`relative z-10 w-28 h-28 mx-auto bg-gradient-to-br ${item.gradient} p-[2px] rounded-[2rem] mb-10 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-blue-500/10`}>
                                    <div className="w-full h-full bg-white rounded-[1.9rem] flex items-center justify-center">
                                        <item.icon className="w-10 h-10 text-slate-900 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                </div>

                                {/* Text Content */}
                                <h3 className="relative z-10 text-2xl font-heritage font-bold text-slate-900 mb-6 tracking-tight group-hover:text-blue-600 transition-colors">{item.title}</h3>
                                <p className="relative z-10 text-slate-500 leading-relaxed font-medium text-sm px-2 opacity-80 group-hover:opacity-100 transition-opacity">{item.desc}</p>

                                {/* Decorative Line */}
                                <div className={`w-12 h-1 mx-auto mt-8 bg-gradient-to-r ${item.gradient} rounded-full opacity-20 group-hover:opacity-100 transition-all duration-500 group-hover:w-20`} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlightTrackerPage;
