import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Sparkles, Plus, X, ArrowLeft, Users, Home } from 'lucide-react';
import { useGroups } from '../hooks/social/useGroups';
import GroupExplorer from '../components/SocialGroups/GroupExplorer';
import GroupDetail from '../components/SocialGroups/GroupDetail';
import GroupSearchFilters from '../components/SocialGroups/GroupSearchFilters';
import GroupCreationForm from '../components/SocialGroups/GroupCreationForm';
import TravelMatchMaker from '../components/SocialGroups/TravelMatchMaker';

const SocialPage = ({ onBack }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [selectedGroupTab, setSelectedGroupTab] = useState('about');
    const { getGroupById, addGroup, getJoinedGroups, toggleJoinGroup, isGroupJoined } = useGroups();

    // Modal State
    const [activeModal, setActiveModal] = useState(null); // 'create' | 'match' | null

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [showJoinedGroups, setShowJoinedGroups] = useState(false);

    // Listen for reset events from Header
    useEffect(() => {
        if (location.state?.resetSocialPage) {
            setSelectedGroupId(null);
            setSearchQuery('');
            setIsSearchActive(false);
            setShowJoinedGroups(false);
            setShowFilters(false);
            setActiveModal(null);

            // Clear the state so it doesn't loop
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname]);

    // Update active state when search query changes
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setIsSearchActive(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Optional: Auto-activate on typing? Or wait for submit? 
            // User said "when i search something it appears", usually implies typing or submit.
            // Let's stick to submit for activation to avoid jumping, but RESET on clear.
        }
    }, [searchQuery]);
    // Filters State
    const [filters, setFilters] = useState({
        destination: '',
        startDate: '2026-03-15',
        endDate: '2026-03-22',
        interests: [],
        groupSize: 'any',
        language: 'any'
    });

    const handleGroupClick = (groupId, tab = 'about') => {
        setSelectedGroupId(groupId);
        setSelectedGroupTab(tab);
        window.scrollTo(0, 0);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim().length > 0) {
            setIsSearchActive(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // YouTube Iframe API setup for custom timestamp looping
    const playerRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        // Load YouTube API script if not already present
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        const initPlayer = () => {
            playerRef.current = new window.YT.Player('youtube-bg-player', {
                videoId: 'NVNIdsK0ql4', // The specific video ID
                playerVars: {
                    'autoplay': 1,
                    'controls': 0,
                    'showinfo': 0,
                    'rel': 0,
                    'mute': 1,
                    'modestbranding': 1,
                    'iv_load_policy': 3,
                    'start': 10
                },
                events: {
                    'onReady': (event) => {
                        event.target.playVideo();

                        // Check time frequently to enforce the custom end timestamp (84s)
                        intervalRef.current = setInterval(() => {
                            if (playerRef.current && playerRef.current.getCurrentTime) {
                                const currentTime = playerRef.current.getCurrentTime();
                                if (currentTime >= 84) {
                                    playerRef.current.seekTo(10);
                                }
                            }
                        }, 500);
                    },
                    'onStateChange': (event) => {
                        // Fallback: If it actually hits the very end (unlikely due to interval, but safe)
                        if (event.data === window.YT.PlayerState.ENDED) {
                            playerRef.current.seekTo(10);
                            playerRef.current.playVideo();
                        }
                    }
                }
            });
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            window.onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
            }
        };
    }, []);

    const selectedGroup = selectedGroupId ? getGroupById(selectedGroupId) : null;
    return (
        <div className="min-h-screen relative overflow-x-hidden">
            {/* Background Layer - Video from YouTube via API */}
            <div className="fixed inset-0 z-0 bg-black overflow-hidden pointer-events-none">
                <div
                    id="youtube-bg-player"
                    className="absolute top-1/2 left-1/2 w-[200vw] h-[200vh] -translate-x-1/2 -translate-y-1/2 md:w-[150vw] md:h-[150vh] pointer-events-none opacity-80"
                ></div>
                {/* Lighter overlay for better contrast */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            </div>

            {/* Modals Layer */}
            <AnimatePresence>
                {activeModal === 'create' && (
                    <GroupCreationForm
                        onClose={() => setActiveModal(null)}
                        onSubmit={(data) => {
                            const newGroup = addGroup(data);
                            // Optional: Select the new group immediately
                            setSelectedGroupId(newGroup.groupId);
                            setActiveModal(null);
                        }}
                    />
                )}
                {activeModal === 'match' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-2xl"
                        >
                            <button
                                onClick={() => setActiveModal(null)}
                                className="absolute -top-12 right-0 text-white/50 hover:text-white p-2"
                            >
                                <X size={24} />
                            </button>
                            <TravelMatchMaker />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Content Layer */}
            <div className={`relative z-10 min-h-screen flex flex-col transition-all duration-300 ${isSearchActive ? 'justify-start pt-0' : 'justify-center items-center'}`}>

                {selectedGroup ? (
                    // If group selected, show detail view
                    // If group selected, show detail view
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-[100] bg-white overflow-y-auto"
                    >
                        <GroupDetail
                            group={selectedGroup}
                            initialTab={selectedGroupTab}
                            onBack={() => setSelectedGroupId(null)}
                            onCreateGroup={() => setActiveModal('create')}
                            isJoined={isGroupJoined(selectedGroup.groupId)}
                            onToggleJoin={() => toggleJoinGroup(selectedGroup.groupId)}
                        />
                    </motion.div>
                ) : (
                    <>
                        {/* Title Header Placed Above the Box */}
                        {!isSearchActive && !selectedGroup && (
                            <div className="w-full text-center mt-16 mb-16 relative z-20">
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400 tracking-[0.3em] font-cinzel uppercase" style={{ filter: 'drop-shadow(0 4px 16px rgba(34, 211, 238, 0.5))' }}>
                                    SAFAR GROUPS
                                </h1>
                            </div>
                        )}

                        {/* Central Glass Card / Sticky Header - Removed 'layout' prop to stop transition distortions */}
                        <div
                            className={`backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500 ease-in-out relative z-20
                        ${isSearchActive
                                    ? 'w-full sticky top-0 z-50 border-b border-white/10 bg-white/10 px-4 py-6 rounded-none'
                                    : 'w-[90%] max-w-3xl rounded-[2rem] p-8 bg-black/40 backdrop-blur-md mx-auto mb-12'
                                }
                    `}
                        >
                            <div className={`mx-auto ${isSearchActive ? 'max-w-7xl flex flex-col md:flex-row items-center gap-6 justify-between' : 'flex flex-col items-center text-center'}`}>

                                {/* Title Section */}
                                <div className={`flex flex-col ${isSearchActive ? 'items-start text-left mb-0' : 'items-center text-center mb-4'}`}>
                                    {!isSearchActive && (
                                        <>
                                            <h2 className="text-3xl md:text-5xl font-medium text-white mb-3 drop-shadow-md tracking-tight font-cinzel">Discover Your Tribe</h2>
                                            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-sky-500 mb-4 rounded-full" />
                                            <p className="text-gray-100 text-base font-light max-w-md">Join vibrant communities of travelers, explorers, and adventure seekers.</p>

                                            {/* Joined Groups Button (Compact) */}
                                            <button
                                                onClick={() => setShowJoinedGroups(!showJoinedGroups)}
                                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm font-medium transition-all backdrop-blur-sm"
                                            >
                                                <Users size={16} />
                                                <span>My Groups</span>
                                                <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-xs">{getJoinedGroups().length}</span>
                                            </button>
                                        </>
                                    )}
                                    {isSearchActive && (
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setIsSearchActive(false);
                                                }}
                                                className="p-2 -ml-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10"
                                            >
                                                <ArrowLeft size={24} />
                                            </button>
                                            <h1 className="text-2xl font-bold text-white hidden md:block">SAFAR360</h1>
                                        </div>
                                    )}
                                </div>

                                {/* Search & Actions Section */}
                                <div className={`w-full ${isSearchActive ? 'flex-1 flex items-center gap-4 justify-end' : 'flex flex-col gap-5 w-full mt-2'}`}>

                                    {/* Search Bar Array */}
                                    <div className={`flex flex-col md:flex-row gap-3 w-full ${isSearchActive ? 'justify-end' : ''}`}>
                                        <form onSubmit={handleSearchSubmit} className={`relative flex-1 ${isSearchActive ? 'max-w-xl' : ''}`}>
                                            <input
                                                type="text"
                                                placeholder="Search groups like 'Rafting in Spain'..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full h-14 bg-white/10 border border-white/30 rounded-2xl px-5 pl-12 text-white placeholder-gray-300 focus:outline-none focus:bg-white/20 focus:border-cyan-400 transition-all font-medium backdrop-blur-sm shadow-inner"
                                            />
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                            {isSearchActive && searchQuery && (
                                                <button type="button" onClick={() => { setSearchQuery(''); setIsSearchActive(false); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-300 hover:text-white uppercase font-bold tracking-wider">
                                                    Clear
                                                </button>
                                            )}
                                        </form>

                                        {/* Filter Toggle */}
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className={`flex items-center justify-center gap-2 px-8 h-14 rounded-2xl font-semibold transition-all ${showFilters ? 'bg-cyan-600 text-white border-transparent shadow-lg shadow-cyan-500/30' : 'bg-white/10 text-white border border-white/30 hover:bg-white/20'}`}
                                        >
                                            <Filter className="w-5 h-5" />
                                            <span>Filters</span>
                                        </button>
                                    </div>

                                    {/* Action Buttons */}
                                    {!isSearchActive && (
                                        <div className="flex flex-col md:flex-row gap-3 w-full">
                                            <button
                                                onClick={() => setActiveModal('match')}
                                                className="flex-1 h-14 bg-gradient-to-r from-cyan-500 to-sky-500 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-cyan-500/20 transition-all border border-cyan-400/30"
                                            >
                                                <Sparkles className="w-5 h-5" />
                                                Find My Match
                                            </button>
                                            <button
                                                onClick={() => setActiveModal('create')}
                                                className="flex-1 h-14 bg-white/10 border border-white/30 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:bg-white/20 active:scale-[0.98] transition-all"
                                            >
                                                <Plus className="w-5 h-5" />
                                                Create Group
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Expandable Filters Panel */}
                            <AnimatePresence>
                                {showFilters && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-6 border-t border-white/10 mt-6">
                                            <GroupSearchFilters
                                                filters={filters}
                                                onChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
                                                onClose={() => setShowFilters(false)}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Joined Groups Sidebar/Overlay */}
                        <AnimatePresence>
                            {showJoinedGroups && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="fixed top-24 right-4 z-[60] w-[320px] max-h-[70vh] bg-black/60 backdrop-blur-2xl shadow-2xl flex flex-col rounded-2xl border border-white/20 overflow-hidden"
                                >
                                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 sticky top-0 z-10">
                                        <h2 className="text-sm font-bold flex items-center gap-2 text-white">
                                            <Users size={16} className="text-blue-400" />
                                            My Joined Groups
                                        </h2>
                                        <button onClick={() => setShowJoinedGroups(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                            <X size={18} className="text-white/70 hover:text-white" />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                                        {getJoinedGroups().length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-white/50 space-y-4">
                                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                                                    <Users size={32} className="text-white/30" />
                                                </div>
                                                <p className="text-lg font-medium text-white">No groups joined yet</p>
                                                <p className="text-sm">Start exploring and join communities that interest you!</p>
                                                <button
                                                    onClick={() => setShowJoinedGroups(false)}
                                                    className="px-6 py-2 bg-cyan-600 text-white rounded-full font-bold hover:bg-cyan-700 transition-colors shadow-lg shadow-cyan-500/30"
                                                >
                                                    Explore Groups
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-4">
                                                {getJoinedGroups().map(group => (
                                                    <div
                                                        key={group.groupId}
                                                        onClick={() => {
                                                            // Close panel and open detail
                                                            setShowJoinedGroups(false);
                                                            handleGroupClick(group.groupId);
                                                        }}
                                                        className="bg-white/10 p-4 rounded-xl shadow-lg border border-white/10 cursor-pointer hover:bg-white/20 transition-all flex gap-4 items-center group"
                                                    >
                                                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-black/50 border border-white/10">
                                                            <img src={group.image} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-90 group-hover:opacity-100" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-white truncate">{group.name}</h3>
                                                            <p className="text-xs text-blue-200 flex items-center gap-1 mt-1 font-medium">
                                                                {group.category}
                                                            </p>
                                                            <p className="text-xs text-gray-300 mt-1 truncate">{group.destination?.city}, {group.destination?.country}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Results Section */}
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className={`w-full max-w-7xl mx-auto px-4 py-8 ${!isSearchActive ? 'mt-8' : ''}`}
                            >
                                <GroupExplorer
                                    headless={true}
                                    onGroupClick={handleGroupClick}
                                    externalSearchQuery={searchQuery}
                                    externalFilters={filters}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </>
                )}

            </div>

            {/* Chatbot - Assuming fixed position in root or layout, or added here */}
            {/* <div className="fixed bottom-6 right-6 z-50"> ... </div> */}
        </div >
    );
};


export default SocialPage;
