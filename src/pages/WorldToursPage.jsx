import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
    Play, X, MapPin, Globe as GlobeIcon, ArrowLeft, Star, Compass, RotateCcw,
    Monitor, Glasses, Eye, Users, Award, ChevronLeft, ChevronRight, Sparkles,
    Volume2, VolumeX, Maximize2, ArrowRight
} from "lucide-react";
import Globe from "../components/3d/Globe";

// Premium VR Tours Data - Curated 360° YouTube VR Videos
const vrTours = [
    // ─────────────────────────────────────────────────────────────────────────────
    // CITIES & URBAN WONDERS
    // ─────────────────────────────────────────────────────────────────────────────
    { id: "rio", name: "Rio de Janeiro", country: "Brazil", category: "City", videoId: "KkSzad253o0", thumbnail: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=3840&auto=format&fit=crop", description: "Vibrant carnival spirit beneath Christ the Redeemer.", highlights: ["Copacabana", "Sugarloaf", "Christ the Redeemer"], gradient: "from-green-500 via-yellow-500 to-blue-500", duration: "5:30", views: "3.1M" },
    { id: "st-petersburg", name: "St. Petersburg", country: "Russia", category: "City", videoId: "q5GXQQo8I-k", thumbnail: "https://images.unsplash.com/photo-1556610961-2fecc5927173?q=80&w=3840&auto=format&fit=crop", description: "The cultural heart of Russia, home to the Hermitage.", highlights: ["Hermitage", "Church of Savior", "Canals"], gradient: "from-blue-600 via-indigo-500 to-purple-600", duration: "6:15", views: "1.2M" },
    { id: "tokyo", name: "Tokyo", country: "Japan", category: "City", videoId: "kyN623RzFe0", thumbnail: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=3840&auto=format&fit=crop", description: "A neon-lit metropolis where tradition meets future.", highlights: ["Shibuya Crossing", "Tokyo Tower", "Senso-ji"], gradient: "from-red-600 via-pink-600 to-purple-600", duration: "4:45", views: "5.5M" },
    { id: "miami", name: "Miami", country: "USA", category: "City", videoId: "xI1ft3sCH2Y", thumbnail: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?q=80&w=3840&auto=format&fit=crop", description: "Sun-soaked beaches and Art Deco glamour.", highlights: ["South Beach", "Ocean Drive", "Downtown"], gradient: "from-cyan-400 via-teal-400 to-blue-500", duration: "3:30", views: "2.8M" },
    { id: "dubai", name: "Dubai", country: "UAE", category: "City", videoId: "b7BUpveunKo", thumbnail: "https://images.unsplash.com/photo-1518684079858-191c49182754?q=80&w=3840&auto=format&fit=crop", description: "Futuristic skyline rising from the desert sands.", highlights: ["Burj Khalifa", "Palm Jumeirah", "Marina"], gradient: "from-amber-400 via-orange-400 to-yellow-500", duration: "7:10", views: "8.1M" },
    { id: "los-angeles", name: "Los Angeles", country: "USA", category: "City", videoId: "JSNZbZ8gswo", thumbnail: "https://images.unsplash.com/photo-1534190239940-9ba8944ea261?q=80&w=3840&auto=format&fit=crop", description: "The entertainment capital of the world.", highlights: ["Hollywood Sign", "Santa Monica", "Beverly Hills"], gradient: "from-purple-500 via-pink-500 to-orange-500", duration: "5:50", views: "4.2M" },
    { id: "las-vegas", name: "Las Vegas", country: "USA", category: "City", videoId: "0vtXW8wy1DM", thumbnail: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?q=80&w=3840&auto=format&fit=crop", description: "The dazzling city of lights and entertainment.", highlights: ["The Strip", "Bellagio Fountains", "Freemont St"], gradient: "from-fuchsia-600 via-purple-600 to-indigo-600", duration: "4:20", views: "6.7M" },
    { id: "zurich", name: "Zurich", country: "Switzerland", category: "City", videoId: "P3jyeihhCWk", thumbnail: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?q=80&w=3840&auto=format&fit=crop", description: "Alpine beauty meets urban sophistication.", highlights: ["Lake Zurich", "Old Town", "Bahnhofstrasse"], gradient: "from-blue-400 via-cyan-400 to-white", duration: "6:00", views: "1.5M" },
    { id: "london", name: "London", country: "UK", category: "City", videoId: "KGerjHMa90s", thumbnail: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=3840&auto=format&fit=crop", description: "Historic royal grandeur and modern vibrancy.", highlights: ["Big Ben", "Tower Bridge", "London Eye"], gradient: "from-red-700 via-blue-800 to-white", duration: "7:45", views: "9.2M" },
    { id: "manhattan", name: "Manhattan", country: "USA", category: "City", videoId: "YM6GTu_RcWM", thumbnail: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=3840&auto=format&fit=crop", description: "The iconic skyline of New York City.", highlights: ["Empire State", "Central Park", "Times Square"], gradient: "from-slate-700 via-gray-600 to-zinc-500", duration: "8:00", views: "10M+" },
    { id: "paris", name: "Paris", country: "France", category: "City", videoId: "2ghX9JFKsE0", thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=3840&auto=format&fit=crop", description: "Romance and art in the City of Light.", highlights: ["Eiffel Tower", "Louvre", "Notre Dame"], gradient: "from-blue-600 via-white to-red-600", duration: "6:30", views: "7.4M" },
    { id: "porto", name: "Porto", country: "Portugal", category: "City", videoId: "2JMbosX2HHY", thumbnail: "https://images.unsplash.com/photo-1563212720-3b02f83a7a93?q=80&w=3840&auto=format&fit=crop", description: "Colorful riverside charm and historic bridges.", highlights: ["Douro River", "Ribeira", "Dom Luis I Bridge"], gradient: "from-orange-500 via-red-500 to-green-600", duration: "5:15", views: "900K" },
    { id: "guangzhou", name: "Guangzhou", country: "China", category: "City", videoId: "IfnO4tEdkpo", thumbnail: "https://images.unsplash.com/photo-1583498875560-6b71f971b84e?q=80&w=3840&auto=format&fit=crop", description: "A sprawling port city and shimmering skyline.", highlights: ["Canton Tower", "Pearl River", "Shamian"], gradient: "from-red-600 via-yellow-500 to-orange-500", duration: "4:50", views: "1.1M" },

    // ─────────────────────────────────────────────────────────────────────────────
    // HERITAGE & ANCIENT WONDERS
    // ─────────────────────────────────────────────────────────────────────────────
    { id: "taj-mahal", name: "Taj Mahal", country: "India", category: "Heritage", videoId: "2aJ9cOwbzxo", thumbnail: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=3840&auto=format&fit=crop", description: "An ivory-white marble mausoleum of eternal love.", highlights: ["Mausoleum", "Gardens", "Yamuna River"], gradient: "from-amber-200 via-orange-200 to-white", duration: "5:45", views: "5.9M" },
    { id: "teotihuacan", name: "Teotihuacan", country: "Mexico", category: "Heritage", videoId: "5nCVL_z5Doo", thumbnail: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?q=80&w=3840&auto=format&fit=crop", description: "Ancient Mesoamerican pyramids of the Sun and Moon.", highlights: ["Pyramid of Sun", "Avenue of Dead", "Citadel"], gradient: "from-orange-700 via-stone-600 to-amber-600", duration: "6:20", views: "2.1M" },
    { id: "jerusalem", name: "Jerusalem", country: "Israel", category: "Heritage", videoId: "dtpvkWgTXGM", thumbnail: "https://images.unsplash.com/photo-1541369722379-305459393c83?q=80&w=3840&auto=format&fit=crop", description: "A holy city of deep spiritual significance.", highlights: ["Western Wall", "Dome of Rock", "Old City"], gradient: "from-amber-400 via-stone-300 to-white", duration: "7:00", views: "3.3M" },
    { id: "petra", name: "Petra", country: "Jordan", category: "Heritage", videoId: "xSiv4TkfSOE", thumbnail: "https://images.unsplash.com/photo-1501238295340-c810d2c15cc8?q=80&w=3840&auto=format&fit=crop", description: "The Rose City carved directly into vibrant rock.", highlights: ["The Treasury", "The Siq", "Royal Tombs"], gradient: "from-rose-500 via-orange-400 to-red-400", duration: "8:10", views: "2.5M" },
    { id: "fenghuang", name: "Fenghuang", country: "China", category: "Heritage", videoId: "FNObY8x9ixQ", thumbnail: "https://images.unsplash.com/photo-1549420067-152865293233?q=80&w=3840&auto=format&fit=crop", description: "The Ancient Phoenix Town with stilt houses.", highlights: ["Tuojiang River", "Diaojiaolou", "Ancient Walls"], gradient: "from-emerald-600 via-teal-600 to-cyan-700", duration: "5:05", views: "850K" },
    { id: "pyramids", name: "Pyramids of Giza", country: "Egypt", category: "Heritage", videoId: "HiCX09V7iac", thumbnail: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=3840&auto=format&fit=crop", description: "The timeless wonder of the ancient world.", highlights: ["Great Pyramid", "Sphinx", "Giza Plateau"], gradient: "from-yellow-600 via-amber-600 to-orange-600", duration: "6:55", views: "8.8M" },

    // ─────────────────────────────────────────────────────────────────────────────
    // NATURE & PARADISE
    // ─────────────────────────────────────────────────────────────────────────────
    { id: "maldives", name: "Malé", country: "Maldives", category: "Nature", videoId: "9JR1IekZGUY", thumbnail: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=3840&auto=format&fit=crop", description: "Tropical island paradise with crystal clear waters.", highlights: ["Coral Reefs", "Blue Lagocn", "White Sand"], gradient: "from-cyan-400 via-teal-500 to-blue-500", duration: "4:15", views: "4.5M" },
    { id: "montenegro", name: "Montenegro", country: "Montenegro", category: "Nature", videoId: "JEV_euIuwlY", thumbnail: "https://images.unsplash.com/photo-1560931558-8685e1350a83?q=80&w=3840&auto=format&fit=crop", description: "Red roofs meeting the azure Adriatic Sea.", highlights: ["Kotor Bay", "Budva", "Sveti Stefan"], gradient: "from-orange-500 via-red-500 to-blue-600", duration: "5:40", views: "1.1M" },
    { id: "cancun", name: "Cancun", country: "Mexico", category: "Nature", videoId: "_kJkCut7I1k", thumbnail: "https://images.unsplash.com/photo-1534655381831-274889c258d4?q=80&w=3840&auto=format&fit=crop", description: "Caribbean turquoise waters and white beaches.", highlights: ["Beaches", "Cenotes", "Resorts"], gradient: "from-cyan-300 via-blue-400 to-teal-400", duration: "5:00", views: "3.7M" },
    { id: "bali", name: "Bali", country: "Indonesia", category: "Nature", videoId: "6SbH51yN-q8", thumbnail: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=3840&auto=format&fit=crop", description: "Island of the Gods, lush jungles and temples.", highlights: ["Rice Terraces", "Temples", "Beaches"], gradient: "from-green-600 via-emerald-500 to-teal-500", duration: "6:45", views: "4.9M" },

    // ─────────────────────────────────────────────────────────────────────────────
    // NEW ADDITIONS
    // ─────────────────────────────────────────────────────────────────────────────
    { id: "cape-town", name: "Cape Town", country: "South Africa", category: "City", videoId: "E-M61Y-WPQs", thumbnail: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=3840&auto=format&fit=crop", description: "A port city on South Africa's southwest coast.", highlights: ["Table Mountain", "Robben Island", "V&A Waterfront"], gradient: "from-blue-600 via-green-500 to-yellow-500", duration: "5:20", views: "1.2M", start: 4 },
    { id: "angel-falls", name: "Angel Falls", country: "Venezuela", category: "Nature", videoId: "L_tqK4eqelA", thumbnail: "https://images.unsplash.com/photo-1575351740920-1b702432863e?q=80&w=3840&auto=format&fit=crop", description: "The world's highest uninterrupted waterfall.", highlights: ["Waterfall", "Canaima National Park", "Jungle"], gradient: "from-green-700 via-teal-600 to-white", duration: "4:00", views: "800K", start: 4 },
    { id: "san-francisco", name: "San Francisco", country: "USA", category: "City", videoId: "tjQGnXBn1WA", thumbnail: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=3840&auto=format&fit=crop", description: "Famous for the Golden Gate Bridge and fog.", highlights: ["Golden Gate", "Alcatraz", "Cable Cars"], gradient: "from-orange-600 via-red-600 to-blue-600", duration: "5:50", views: "3.9M", start: 4 },
    { id: "lake-hibara", name: "Lake Hibara", country: "Japan", category: "Nature", videoId: "VUVDXSJqYbM", thumbnail: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=3840&auto=format&fit=crop", description: "Scenic lake created by the eruption of Mount Bandai.", highlights: ["Mount Bandai", "Goshikinuma", "Camping"], gradient: "from-emerald-500 via-teal-500 to-cyan-500", duration: "5:10", views: "650K", start: 4 },
    { id: "lapland", name: "Lapland", country: "Finland", category: "Nature", videoId: "sto1YBOS2bw", thumbnail: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?q=80&w=3840&auto=format&fit=crop", description: "The magical home of Santa Claus and snowy wonders.", highlights: ["Northern Lights", "Reindeer", "Santa Claus Village"], gradient: "from-indigo-600 via-blue-500 to-white", duration: "4:40", views: "2.3M", start: 4 },
    { id: "northern-lights", name: "Northern Lights", country: "Arctic", category: "Nature", videoId: "W11U_CZXUCQ", thumbnail: "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?q=80&w=3840&auto=format&fit=crop", description: "The Aurora Borealis dancing across the night sky.", highlights: ["Aurora", "Stars", "Night Sky"], gradient: "from-green-400 via-teal-500 to-purple-600", duration: "3:30", views: "5.1M", start: 4 },
    { id: "kazan", name: "Kazan", country: "Russia", category: "City", videoId: "fOxt1cR2XK4", thumbnail: "https://images.unsplash.com/photo-1596426305677-44933932782e?q=80&w=3840&auto=format&fit=crop", description: "A melting pot of Asian and European culture.", highlights: ["Kazan Kremlin", "Kul Sharif Mosque", "Volga River"], gradient: "from-blue-600 via-white to-red-600", duration: "5:20", views: "920K", start: 4 },
    { id: "bhutan", name: "Kingdom of Bhutan", country: "Bhutan", category: "Heritage", videoId: "z4HwBo3VlC4", thumbnail: "https://images.unsplash.com/photo-1624890659688-66a90802e3b2?q=80&w=3840&auto=format&fit=crop", description: "The Land of the Thunder Dragon in the Himalayas.", highlights: ["Tiger's Nest", "Dzongs", "Himalayas"], gradient: "from-orange-500 via-yellow-500 to-red-600", duration: "4:50", views: "1.5M", start: 4 },
    { id: "hong-kong", name: "Hong Kong", country: "China", category: "City", videoId: "skn-h6pi8V8", thumbnail: "https://images.unsplash.com/photo-1506318137071-a8bcbf6755dd?q=80&w=3840&auto=format&fit=crop", description: "A dazzling skyline meeting the harbor.", highlights: ["Victoria Peak", "Harbour", "Skyline"], gradient: "from-purple-600 via-pink-600 to-blue-600", duration: "6:00", views: "4.1M", start: 4 },
    { id: "huangshan", name: "Huangshan Mountain", country: "China", category: "Nature", videoId: "0YwaAgB_-nw", thumbnail: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=3840&auto=format&fit=crop", description: "The Yellow Mountains famous for sunrises and pines.", highlights: ["Granite Peaks", "Pine Trees", "Clouds"], gradient: "from-green-700 via-emerald-600 to-stone-500", duration: "5:30", views: "1.1M", start: 4 },
    { id: "sahara", name: "Sahara Desert", country: "Algeria", category: "Nature", videoId: "RdFkC6Gtb5A", thumbnail: "https://images.unsplash.com/photo-1539768652586-b45281862551?q=80&w=3840&auto=format&fit=crop", description: "Endless golden dunes of the world's largest hot desert.", highlights: ["Dunes", "Oasis", "Sunset"], gradient: "from-orange-500 via-amber-500 to-yellow-500", duration: "4:15", views: "2.8M", start: 4 },
    { id: "ingushetia", name: "Ingushetia", country: "Russia", category: "Heritage", videoId: "qW5P_m3lDXI", thumbnail: "https://images.unsplash.com/photo-1612294137279-d591b6e49226?q=80&w=3840&auto=format&fit=crop", description: "Ancient watchtowers in the Caucasus Mountains.", highlights: ["Towers", "Mountains", "History"], gradient: "from-stone-600 via-gray-500 to-green-600", duration: "5:00", views: "600K", start: 4 },
    { id: "shibuya", name: "Shibuya Crossing", country: "Japan", category: "City", videoId: "7f7MvEzBeDk", thumbnail: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=3840&auto=format&fit=crop", description: "The world's busiest pedestrian crossing.", highlights: ["Crossing", "Neon Lights", "Tokyo"], gradient: "from-blue-600 via-purple-600 to-pink-600", duration: "3:45", views: "8.5M", start: 4 },
    { id: "shanghai", name: "Shanghai", country: "China", category: "City", videoId: "2pQ-pHbRPiQ", thumbnail: "https://images.unsplash.com/photo-1538428494252-43fb0d67d22e?q=80&w=3840&auto=format&fit=crop", description: "A global financial hub with a futuristic skyline.", highlights: ["The Bund", "Oriental Pearl", "Tower"], gradient: "from-purple-800 via-indigo-700 to-blue-800", duration: "6:10", views: "3.2M", start: 4 },
    { id: "golden-ring", name: "Golden Ring", country: "Russia", category: "Heritage", videoId: "KC5YDoqVkBE", thumbnail: "https://images.unsplash.com/photo-1569335406180-877794711317?q=80&w=3840&auto=format&fit=crop", description: "Historic cities northeast of Moscow.", highlights: ["Churches", "History", "Balloon Ride"], gradient: "from-yellow-500 via-orange-500 to-red-500", duration: "7:30", views: "1.4M", start: 4 },
    { id: "icebergs", name: "Greenland Icebergs", country: "Greenland", category: "Nature", videoId: "YGa7p4_J9nA", thumbnail: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=3840&auto=format&fit=crop", description: "Majestic icebergs floating in arctic waters.", highlights: ["Icebergs", "Ocean", "Glaciers"], gradient: "from-cyan-200 via-blue-200 to-white", duration: "4:20", views: "2.1M", start: 4 },
    { id: "egypt-pyramids-2", name: "Egyptian Pyramids", country: "Egypt", category: "Heritage", videoId: "9TCHI2qbZ78", thumbnail: "https://images.unsplash.com/photo-1598555894178-02484c207909?q=80&w=3840&auto=format&fit=crop", description: "Another perspective of the ancient architectural marvels.", highlights: ["Pyramids", "Desert", "History"], gradient: "from-yellow-600 via-orange-500 to-amber-600", duration: "5:50", views: "4.8M", start: 4 },
];

const categories = ["All", "City", "Nature", "Heritage"];

// Custom Player Modal with "Dual-Stream" In-App VR & Master-Slave Sync
const PlayerModal = ({ tour, onClose }) => {
    const [isVRMode, setIsVRMode] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Player Instances
    const standardPlayerRef = useRef(null);
    const leftPlayerRef = useRef(null);
    const rightPlayerRef = useRef(null);

    // Animation Frame ID for Sync Loop
    const syncRef = useRef(null);

    // Initialize YouTube API
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
        }

        // Polling for API ready
        const initPlayers = () => {
            if (!window.YT || !window.YT.Player) {
                setTimeout(initPlayers, 100);
                return;
            }

            const playerConfig = (id, isMuted = false, isLeft = false) => ({
                videoId: tour.videoId,
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    iv_load_policy: 3,
                    playsinline: 1,
                    enablejsapi: 1,
                    start: tour.start || 0,
                    loop: 1,
                    playlist: tour.videoId
                },
                events: {
                    onReady: (event) => {
                        if (isMuted) event.target.mute();
                        // If Left Eye (Master), we don't mute but we might need to handle click-to-play
                    }
                }
            });

            // Init Standard Player
            if (!standardPlayerRef.current) {
                standardPlayerRef.current = new window.YT.Player('player-standard', playerConfig('player-standard'));
            }

            // Init VR Players
            if (!leftPlayerRef.current) {
                leftPlayerRef.current = new window.YT.Player('player-left', playerConfig('player-left', false, true));
            }
            if (!rightPlayerRef.current) {
                rightPlayerRef.current = new window.YT.Player('player-right', playerConfig('player-right', true)); // Muted Slave
            }
        };

        initPlayers();

        return () => {
            if (syncRef.current) cancelAnimationFrame(syncRef.current);
            if (standardPlayerRef.current) standardPlayerRef.current.destroy();
            if (leftPlayerRef.current) leftPlayerRef.current.destroy();
            if (rightPlayerRef.current) rightPlayerRef.current.destroy();
            standardPlayerRef.current = null;
            leftPlayerRef.current = null;
            rightPlayerRef.current = null;
        };
    }, [tour.videoId]); // Re-init if video changes

    // Master-Slave Sync Loop
    useEffect(() => {
        const syncLoop = () => {
            if (isVRMode && leftPlayerRef.current && rightPlayerRef.current &&
                leftPlayerRef.current.getSphericalProperties && rightPlayerRef.current.setSphericalProperties) {

                // Get master properties (Yaw/Pitch/Roll/Fov)
                const props = leftPlayerRef.current.getSphericalProperties();

                // Set slave properties (Force sync)
                // We add enableOrientationSensor: false to the SLAVE to prevent double-gyro effect
                if (props) {
                    rightPlayerRef.current.setSphericalProperties({
                        yaw: props.yaw,
                        pitch: props.pitch,
                        roll: props.roll,
                        fov: props.fov,
                        enableOrientationSensor: false
                    });
                }
            }
            syncRef.current = requestAnimationFrame(syncLoop);
        };

        if (isVRMode) {
            syncRef.current = requestAnimationFrame(syncLoop);
        } else {
            if (syncRef.current) cancelAnimationFrame(syncRef.current);
        }

        return () => {
            if (syncRef.current) cancelAnimationFrame(syncRef.current);
        };
    }, [isVRMode]);


    const togglePlay = () => {
        const playing = !isPlaying;
        setIsPlaying(playing);
        const method = playing ? 'playVideo' : 'pauseVideo';

        if (isVRMode) {
            leftPlayerRef.current?.[method]();
            rightPlayerRef.current?.[method]();
        } else {
            standardPlayerRef.current?.[method]();
        }
    };

    const toggleVRMode = () => {
        const newMode = !isVRMode;
        setIsVRMode(newMode);
        setIsPlaying(false); // Pause on switch to allow manual sync start

        if (newMode) { // Enter VR
            standardPlayerRef.current?.pauseVideo();
            // Optional: seek VR players to match standard player time?
            // const time = standardPlayerRef.current?.getCurrentTime() || 0;
            // leftPlayerRef.current?.seekTo(time);
            // rightPlayerRef.current?.seekTo(time);
        } else { // Exit VR
            leftPlayerRef.current?.pauseVideo();
            rightPlayerRef.current?.pauseVideo();
        }
    };

    // Auto-sync start for VR
    useEffect(() => {
        let timeout;
        if (isVRMode && !isPlaying) {
            timeout = setTimeout(() => {
                togglePlay();
            }, 2000);
        }
        return () => clearTimeout(timeout);
    }, [isVRMode]);

    return (
        <div className="relative w-full h-full bg-black overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* STANDARD PLAYER CONTAINER */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${isVRMode ? 'opacity-0 pointer-events-none' : 'opacity-100 z-10'}`}>
                <div id="player-standard" className="w-full h-full" />
            </div>

            {/* VR PLAYER CONTAINER */}
            <div className={`absolute inset-0 flex transition-opacity duration-500 ${isVRMode ? 'opacity-100 z-20' : 'opacity-0 pointer-events-none invisible'}`}>
                {/* Left Eye (Master) - Pointer Events AUTO only in VR Mode */}
                <div className="w-1/2 h-full border-r-2 border-black overflow-hidden relative" style={{ pointerEvents: isVRMode ? 'auto' : 'none' }}>
                    <div id="player-left" className="w-full h-full" />
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/50 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference" />
                </div>

                {/* Right Eye (Slave) - Pointer Events NONE */}
                <div className="w-1/2 h-full border-l-2 border-black overflow-hidden relative" style={{ pointerEvents: 'none' }}>
                    <div id="player-right" className="w-full h-full" />
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/50 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference" />
                </div>

                {/* VR TAP TO PLAY OVERLAY */}
                {!isPlaying && isVRMode && (
                    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-auto" onClick={togglePlay}>
                        <div className="bg-black/60 backdrop-blur-md px-8 py-4 rounded-full border border-white/20 animate-pulse cursor-pointer">
                            <p className="text-white font-bold tracking-widest">TAP SCREEN TO SYNC</p>
                        </div>
                    </div>
                )}
            </div>

            {/* UI OVERLAY */}
            <AnimatePresence>
                {!isVRMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[60] pointer-events-none"
                    >
                        {/* Top Bar */}
                        <div className="absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-auto flex justify-between items-start">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/10 transition-colors z-50"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                                <div>
                                    <h2 className="text-2xl font-bold text-white drop-shadow-md">{tour.name}</h2>
                                    <p className="text-sm text-white/70 font-medium tracking-wide">{tour.country} • {tour.category}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={toggleVRMode}
                                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-full shadow-lg shadow-purple-500/20 border border-white/10 transition-all hover:scale-105 group"
                                >
                                    <Glasses className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    <span className="font-bold tracking-wide text-sm">HEADSET MODE</span>
                                </button>
                            </div>
                        </div>

                        {/* Center Play Button */}
                        {!isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                                <button onClick={togglePlay} className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:scale-110 transition-transform shadow-2xl">
                                    <Play className="w-10 h-10 text-white fill-white ml-2" />
                                </button>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
                            <div className="flex items-center space-x-2 text-white/50 text-xs uppercase tracking-widest bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                <Monitor className="w-4 h-4" />
                                <span>Drag to pan 360°</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* EXIT VR BUTTON */}
            {isVRMode && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                    <button
                        onClick={toggleVRMode}
                        className="bg-red-600/80 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold backdrop-blur-md border border-white/20 shadow-lg text-sm flex items-center space-x-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>EXIT VR</span>
                    </button>
                </div>
            )}
        </div>
    );
};

const WorldToursPage = ({ onPageChange, setIsImmersiveMode }) => { // Accept updated prop
    const [activeTour, setActiveTour] = useState(null);
    const [activeCategory, setActiveCategory] = useState("All");
    // const [isMuted, setIsMuted] = useState(true); // Removed unused local state
    // const [isFullscreen, setIsFullscreen] = useState(false); // Removed unused local state
    const heroRef = useRef(null);
    const modalRef = useRef(null);

    // Call setIsImmersiveMode when activeTour changes
    useEffect(() => {
        if (setIsImmersiveMode) {
            setIsImmersiveMode(!!activeTour);
        }
    }, [activeTour, setIsImmersiveMode]);

    const filteredTours = activeCategory === "All"
        ? vrTours
        : vrTours.filter(t => t.category === activeCategory);

    // Stats animation
    const [stats, setStats] = useState({ tours: 0, countries: 0, hours: 0 });

    useEffect(() => {
        const timer = setTimeout(() => {
            setStats({ tours: vrTours.length, countries: 12, hours: 150 });
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">

            {/* ═══════════════════════════════════════════════════════════════════════════
                 PREMIUM HERO SECTION - Cinematic & Immersive
            ═══════════════════════════════════════════════════════════════════════════ */}
            <section
                ref={heroRef}
                className="relative h-screen flex items-center justify-center overflow-hidden"
            >
                {/* Animated Globe Background - REMOVED PER USER REQUEST */}
                {/* 
                <div className="absolute inset-0 z-0 opacity-30">
                    <Globe
                        autoRotate={true}
                        rotationSpeed={0.003}
                        showStars={true}
                        cameraPosition={[0, 0, 3.5]}
                        markers={[]}
                        globeColor="#0f172a"
                        atmosphereColor="#0ea5e9"
                    />
                </div>
                 */}

                {/* YouTube Video Background - User Requested ID: ueeTs3BINtA */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none w-screen h-screen bg-black">
                    <iframe
                        className="absolute top-1/2 left-1/2 w-[177.77vh] min-w-full min-h-[56.25vw] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        src="https://www.youtube.com/embed/f6SwQAV4aDc?autoplay=1&mute=1&controls=0&loop=1&playlist=f6SwQAV4aDc&start=2&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&enablejsapi=1&origin=http://localhost:5173&vq=hd2160"
                        title="VR Tours Background"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        style={{ aspectRatio: '16/9' }}
                    ></iframe>
                </div>

                {/* Light Gradient Overlays (Reduced opacity for better visibility) */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/80 z-[2]" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-slate-950/30 z-[2]" />

                {/* Main Hero Content */}
                <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-8 backdrop-blur-md"
                    >
                        <Glasses className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium text-slate-200 tracking-wide uppercase">VR Headset Compatible</span>
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-white to-blue-500 font-heritage">
                            VR Tours
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-xl md:text-2xl text-slate-300 font-light tracking-wide max-w-3xl mx-auto leading-relaxed mb-12"
                    >
                        Immersive 360° virtual reality experiences.
                        <span className="text-cyan-400 font-medium"> Connect your VR headset</span> and explore the world like never before.
                    </motion.p>

                    {/* Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="flex flex-wrap justify-center gap-8 mb-12"
                    >
                        {[
                            { label: "VR Tours", value: stats.tours + "+", icon: GlobeIcon, color: "text-cyan-400" },
                            { label: "Countries", value: stats.countries + "+", icon: MapPin, color: "text-blue-400" },
                            { label: "Hours of VR", value: stats.hours + "+", icon: Eye, color: "text-sky-300" },
                        ].map((stat, idx) => (
                            <div key={idx} className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-sm"
                            >
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                <div className="text-left">
                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                    <div className="text-xs text-slate-400 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <button
                            onClick={() => document.getElementById('tours-grid')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 rounded-2xl font-bold text-lg flex items-center space-x-3 hover:scale-105 transition-transform shadow-lg shadow-blue-500/25"
                        >
                            <Play className="w-5 h-5" />
                            <span>Start Exploring</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => onPageChange("home")}
                            className="bg-white/5 border border-white/20 px-8 py-4 rounded-2xl font-medium text-lg flex items-center space-x-3 hover:bg-white/10 transition-colors backdrop-blur-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Home</span>
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════════════
                 CATEGORY FILTER BAR
            ═══════════════════════════════════════════════════════════════════════════ */}
            <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat
                                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="hidden md:flex items-center space-x-4 text-sm text-slate-400">
                        <span>{filteredTours.length} experiences</span>
                        <div className="w-[1px] h-4 bg-white/10" />
                        <span className="flex items-center space-x-2">
                            <Glasses className="w-4 h-4 text-cyan-400" />
                            <span>WebVR Ready</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════════════
                 TOURS GRID - Premium Cards with Thumbnails
            ═══════════════════════════════════════════════════════════════════════════ */}
            <section id="tours-grid" className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredTours.map((tour, index) => (
                                <motion.div
                                    key={tour.id}
                                    layout
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    onClick={() => setActiveTour(tour)}
                                    className="group relative rounded-3xl overflow-hidden cursor-pointer bg-slate-900/50 border border-white/5 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_60px_rgba(6,182,212,0.15)] hover:-translate-y-2"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={tour.thumbnail}
                                            alt={tour.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                e.target.src = `https://img.youtube.com/vi/${tour.videoId}/hqdefault.jpg`;
                                            }}
                                        />
                                        {/* Gradient Overlay */}
                                        <div className={`absolute inset-0 bg-gradient-to-t ${tour.gradient} opacity-30 group-hover:opacity-50 transition-opacity`} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                                        {/* Play Button */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform scale-75 group-hover:scale-100 transition-transform">
                                                <Play className="w-8 h-8 text-white fill-white ml-1" />
                                            </div>
                                        </div>

                                        {/* Duration Badge */}
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                                            {tour.duration}
                                        </div>

                                        {/* VR Badge */}
                                        <div className="absolute top-4 left-4 bg-blue-600/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                                            <Glasses className="w-3 h-3" />
                                            <span>360° VR</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Category & Country */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="w-3 h-3 text-cyan-400" />
                                                <span className="text-xs text-cyan-300 uppercase tracking-wider font-medium">{tour.country}</span>
                                            </div>
                                            <span className="text-xs text-slate-500">{tour.views} views</span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors font-heritage">
                                            {tour.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-slate-400 text-sm line-clamp-2 mb-4 group-hover:text-slate-300 transition-colors">
                                            {tour.description}
                                        </p>

                                        {/* Highlights */}
                                        <div className="flex flex-wrap gap-2">
                                            {tour.highlights.slice(0, 3).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-slate-400"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════════════
                 IMMERSIVE VR PLAYER MODAL - WebVR/WebXR Ready
            ═══════════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {activeTour && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black"
                        onClick={() => setActiveTour(null)}
                    >
                        <PlayerModal tour={activeTour} onClose={() => setActiveTour(null)} />
                    </motion.div>
                )}
            </AnimatePresence>


        </div >
    );
};

export default WorldToursPage;
