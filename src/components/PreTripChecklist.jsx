// Updated PreTripChecklist.jsx - Add this at the top of your file

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, Circle, Plus, Trash2, AlertCircle, Download, Share2, MapPin } from 'lucide-react';
import ConfidenceMeter from './ConfidenceMeter';
import { fetchConfidenceScores, getCoordinates } from '../services/confidenceService';

const PreTripChecklist = () => {
    const [checklists, setChecklists] = useState([]);
    const [activeChecklist, setActiveChecklist] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newTrip, setNewTrip] = useState({
        trip_name: '',
        destination: '',
        travel_date: ''
    });
    const [coordinates, setCoordinates] = useState(null);

    // ... existing DEFAULT_ITEMS code stays the same ...

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('safar360_checklists');
        if (saved) {
            const parsed = JSON.parse(saved);
            setChecklists(parsed);
            if (parsed.length > 0) {
                setActiveChecklist(parsed[0]);
            }
        }
    }, []);

    // Save to localStorage whenever checklists change
    useEffect(() => {
        if (checklists.length > 0) {
            localStorage.setItem('safar360_checklists', JSON.stringify(checklists));
        }
    }, [checklists]);

    // Fetch coordinates when destination changes
    useEffect(() => {
        if (activeChecklist?.destination) {
            fetchDestinationCoordinates(activeChecklist.destination);
        }
    }, [activeChecklist?.destination]);

    const fetchDestinationCoordinates = async (destination) => {
        try {
            const coords = await getCoordinates(destination);
            if (coords) {
                setCoordinates(coords);
            } else {
                // Default to India if coordinates not found
                setCoordinates({ lat: 20.5937, lng: 78.9629 });
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            setCoordinates({ lat: 20.5937, lng: 78.9629 });
        }
    };

    const createNewChecklist = (e) => {
        e.preventDefault();

        if (!newTrip.trip_name || !newTrip.destination || !newTrip.travel_date) {
            toast.error('Please fill in all fields');
            return;
        }

        const newChecklist = {
            id: Date.now(),
            ...newTrip,
            items: Object.entries(DEFAULT_ITEMS).map(([category, items]) => ({
                category,
                items: items.map(item => ({ ...item, id: Math.random() }))
            })),
            createdAt: new Date().toISOString()
        };

        setChecklists([...checklists, newChecklist]);
        setActiveChecklist(newChecklist);
        setNewTrip({ trip_name: '', destination: '', travel_date: '' });
        setShowForm(false);
        toast.success('Trip checklist created!');
    };

    // ... rest of your existing functions stay the same ...
    const toggleItem = (categoryIndex, itemIndex) => {
        if (!activeChecklist) return;
        const updated = { ...activeChecklist };
        updated.items[categoryIndex].items[itemIndex].completed =
            !updated.items[categoryIndex].items[itemIndex].completed;
        setActiveChecklist(updated);
        setChecklists(checklists.map(c => c.id === updated.id ? updated : c));
        toast.success('Item updated!');
    };

    const addCustomItem = (categoryIndex, itemName) => {
        if (!activeChecklist || !itemName.trim()) return;
        const updated = { ...activeChecklist };
        updated.items[categoryIndex].items.push({
            id: Math.random(),
            name: itemName,
            priority: 'medium',
            completed: false
        });
        setActiveChecklist(updated);
        setChecklists(checklists.map(c => c.id === updated.id ? updated : c));
        toast.success('Item added!');
    };

    const deleteItem = (categoryIndex, itemIndex) => {
        if (!activeChecklist) return;
        const updated = { ...activeChecklist };
        updated.items[categoryIndex].items.splice(itemIndex, 1);
        setActiveChecklist(updated);
        setChecklists(checklists.map(c => c.id === updated.id ? updated : c));
        toast.success('Item removed!');
    };

    const deleteChecklist = (id) => {
        const filtered = checklists.filter(c => c.id !== id);
        setChecklists(filtered);
        if (activeChecklist?.id === id) {
            setActiveChecklist(filtered[0] || null);
        }
        toast.success('Checklist deleted!');
    };

    const downloadChecklist = () => {
        if (!activeChecklist) return;
        let content = `${activeChecklist.trip_name} - ${activeChecklist.destination}\n`;
        content += `Travel Date: ${activeChecklist.travel_date}\n\n`;
        activeChecklist.items.forEach(cat => {
            content += `\n${cat.category.toUpperCase()}\n`;
            content += `${'='.repeat(cat.category.length + 10)}\n`;
            cat.items.forEach(item => {
                const checked = item.completed ? '✓' : '✗';
                content += `[${checked}] ${item.name}\n`;
            });
        });
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', `${activeChecklist.trip_name}_checklist.txt`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast.success('Checklist downloaded!');
    };

    const getProgressPercentage = () => {
        if (!activeChecklist) return 0;
        const total = activeChecklist.items.reduce((sum, cat) => sum + cat.items.length, 0);
        const completed = activeChecklist.items.reduce(
            (sum, cat) => sum + cat.items.filter(item => item.completed).length,
            0
        );
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    const getCriticalItemsStatus = () => {
        if (!activeChecklist) return { total: 0, completed: 0 };
        const critical = activeChecklist.items.flatMap(cat =>
            cat.items.filter(item => item.priority === 'critical')
        );
        return {
            total: critical.length,
            completed: critical.filter(item => item.completed).length
        };
    };

    const criticalStatus = getCriticalItemsStatus();
    const progress = getProgressPercentage();

    // Add DEFAULT_ITEMS here (your existing code)
    const DEFAULT_ITEMS = {
        Documents: [
            { name: 'Passport', priority: 'critical', completed: false },
            { name: 'Visa (if required)', priority: 'critical', completed: false },
            { name: 'Travel Insurance', priority: 'high', completed: false },
            { name: 'Flight/Hotel Confirmations', priority: 'high', completed: false },
            { name: 'ID Card', priority: 'high', completed: false },
            { name: 'Driver\'s License', priority: 'medium', completed: false },
            { name: 'Credit Card & Bank Info', priority: 'high', completed: false }
        ],
        Health: [
            { name: 'Prescription Medications', priority: 'critical', completed: false },
            { name: 'Vaccination Certificates', priority: 'high', completed: false },
            { name: 'First Aid Kit', priority: 'medium', completed: false },
            { name: 'Sunscreen & Bug Spray', priority: 'medium', completed: false },
            { name: 'Travel Health Insurance Card', priority: 'high', completed: false }
        ],
        Clothing: [
            { name: 'Comfortable Walking Shoes', priority: 'high', completed: false },
            { name: 'Weather-Appropriate Clothing', priority: 'high', completed: false },
            { name: 'Underwear & Socks', priority: 'high', completed: false },
            { name: 'Comfortable Outfits', priority: 'high', completed: false },
            { name: 'Formal Wear (if needed)', priority: 'medium', completed: false },
            { name: 'Sleepwear', priority: 'high', completed: false },
            { name: 'Jacket/Sweater', priority: 'medium', completed: false }
        ],
        Electronics: [
            { name: 'Phone & Charger', priority: 'critical', completed: false },
            { name: 'Universal Power Adapter', priority: 'high', completed: false },
            { name: 'Power Bank', priority: 'high', completed: false },
            { name: 'Camera', priority: 'medium', completed: false },
            { name: 'Headphones', priority: 'medium', completed: false },
            { name: 'Laptop/Tablet', priority: 'medium', completed: false }
        ],
        Toiletries: [
            { name: 'Toothbrush & Toothpaste', priority: 'high', completed: false },
            { name: 'Deodorant', priority: 'medium', completed: false },
            { name: 'Shampoo & Conditioner', priority: 'medium', completed: false },
            { name: 'Skincare Products', priority: 'medium', completed: false },
            { name: 'Medications/Supplements', priority: 'high', completed: false },
            { name: 'Feminine Hygiene Products', priority: 'medium', completed: false },
            { name: 'Sunscreen', priority: 'high', completed: false }
        ],
        'Pre-Travel': [
            { name: 'Inform Bank of Travel Dates', priority: 'high', completed: false },
            { name: 'Check Flight Status', priority: 'high', completed: false },
            { name: 'Book Accommodations', priority: 'critical', completed: false },
            { name: 'Arrange Airport Transport', priority: 'high', completed: false },
            { name: 'Set Up Travel Itinerary', priority: 'medium', completed: false },
            { name: 'Buy Travel Insurance', priority: 'high', completed: false },
            { name: 'Download Offline Maps', priority: 'medium', completed: false }
        ]
    };

    return (
        <div className="min-h-screen pt-20 pb-20 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">
                        🎒 Pre-Trip Checklist & Travel Confidence
                    </h1>
                    <p className="text-slate-600 text-lg">Plan smarter, pack better, travel safely</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Sidebar - Checklist List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-slate-900">My Trips</h2>
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                                    title="Add new trip"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            {showForm && (
                                <form onSubmit={createNewChecklist} className="mb-6 pb-6 border-b border-slate-200">
                                    <input
                                        type="text"
                                        placeholder="Trip name"
                                        value={newTrip.trip_name}
                                        onChange={(e) => setNewTrip({ ...newTrip, trip_name: e.target.value })}
                                        className="w-full px-3 py-2 mb-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Destination"
                                        value={newTrip.destination}
                                        onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                                        className="w-full px-3 py-2 mb-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="date"
                                        value={newTrip.travel_date}
                                        onChange={(e) => setNewTrip({ ...newTrip, travel_date: e.target.value })}
                                        className="w-full px-3 py-2 mb-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                                    >
                                        Create Checklist
                                    </button>
                                </form>
                            )}

                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {checklists.length === 0 ? (
                                    <p className="text-slate-600 text-sm text-center py-8">No trips yet. Create one!</p>
                                ) : (
                                    checklists.map((checklist) => (
                                        <div
                                            key={checklist.id}
                                            className={`p-3 rounded-lg cursor-pointer transition-all border ${activeChecklist?.id === checklist.id
                                                    ? 'bg-blue-50 border-blue-400 shadow-md'
                                                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                                }`}
                                        >
                                            <button
                                                onClick={() => setActiveChecklist(checklist)}
                                                className="w-full text-left"
                                            >
                                                <p className="font-semibold text-slate-900">{checklist.trip_name}</p>
                                                <p className="text-xs text-slate-600 flex items-center gap-1">
                                                    <MapPin size={12} /> {checklist.destination}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">{new Date(checklist.travel_date).toLocaleDateString()}</p>
                                            </button>
                                            <button
                                                onClick={() => deleteChecklist(checklist.id)}
                                                className="mt-2 w-full text-xs text-red-600 hover:bg-red-50 py-1 rounded transition-all"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Confidence Meter + Checklist Items */}
                    <div className="lg:col-span-3">
                        {activeChecklist ? (
                            <>
                                {/* CONFIDENCE METER - NEW FEATURE */}
                                {coordinates && (
                                    <ConfidenceMeter
                                        destination={activeChecklist.destination}
                                        coordinates={coordinates}
                                        travelDate={activeChecklist.travel_date}
                                    />
                                )}

                                {/* Progress Bar */}
                                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900">{activeChecklist.trip_name}</h3>
                                            <p className="text-slate-600">📍 {activeChecklist.destination} • ✈️ {new Date(activeChecklist.travel_date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={downloadChecklist}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                                            >
                                                <Download size={18} />
                                                <span className="hidden sm:inline">Download</span>
                                            </button>
                                            <button
                                                onClick={() => toast.success('Share link copied!')}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
                                            >
                                                <Share2 size={18} />
                                                <span className="hidden sm:inline">Share</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress Stats */}
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <p className="text-sm text-blue-700 font-semibold">Overall Progress</p>
                                            <p className="text-3xl font-bold text-blue-900">{progress}%</p>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                            <p className="text-sm text-red-700 font-semibold">Critical Items</p>
                                            <p className="text-3xl font-bold text-red-900">{criticalStatus.completed}/{criticalStatus.total}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                            <p className="text-sm text-green-700 font-semibold">Items Packed</p>
                                            <p className="text-3xl font-bold text-green-900">
                                                {activeChecklist.items.reduce((sum, cat) => sum + cat.items.filter(i => i.completed).length, 0)}/{activeChecklist.items.reduce((sum, cat) => sum + cat.items.length, 0)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Main Progress Bar */}
                                    <div className="w-full bg-slate-300 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="space-y-6">
                                    {activeChecklist.items.map((category, catIndex) => (
                                        <div key={catIndex} className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <span className="text-2xl">📦</span>
                                                {category.category}
                                            </h3>

                                            <div className="space-y-3 mb-4">
                                                {category.items.map((item, itemIndex) => (
                                                    <div
                                                        key={item.id}
                                                        className={`flex items-center gap-3 p-3 rounded-lg transition-all border ${item.completed
                                                                ? 'bg-green-50 border-green-200'
                                                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                                            }`}
                                                    >
                                                        <button
                                                            onClick={() => toggleItem(catIndex, itemIndex)}
                                                            className="flex-shrink-0"
                                                        >
                                                            {item.completed ? (
                                                                <CheckCircle2 size={24} className="text-green-600" />
                                                            ) : (
                                                                <Circle size={24} className="text-slate-400" />
                                                            )}
                                                        </button>

                                                        <div className="flex-1">
                                                            <p className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-slate-900'}`}>
                                                                {item.name}
                                                            </p>
                                                            <div className="flex gap-2 mt-1">
                                                                {item.priority === 'critical' && (
                                                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                                                                        <AlertCircle size={12} /> Critical
                                                                    </span>
                                                                )}
                                                                {item.priority === 'high' && (
                                                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
                                                                        High Priority
                                                                    </span>
                                                                )}
                                                                {item.priority === 'medium' && (
                                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                                                                        Medium Priority
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => deleteItem(catIndex, itemIndex)}
                                                            className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Delete item"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Add Custom Item */}
                                            <div className="pt-4 border-t border-slate-200">
                                                <input
                                                    type="text"
                                                    placeholder={`Add custom item to ${category.category}...`}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter' && e.target.value.trim()) {
                                                            addCustomItem(catIndex, e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg p-12 border border-slate-200 text-center">
                                <div className="text-6xl mb-4">📋</div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">No Checklist Selected</h3>
                                <p className="text-slate-600 mb-6">Create a new trip checklist to get started!</p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                                >
                                    Create Your First Checklist
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreTripChecklist;
