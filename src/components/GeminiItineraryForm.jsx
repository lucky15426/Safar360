
import React, { useState } from "react";
import { generateItinerary } from "../services/aiService";
import toast from "react-hot-toast";
import { globalDestinations } from "../data/globalDestinations";
import {
  Users, Wallet, Clock, Compass, Heart, Camera,
  Utensils, Map as MapIcon, Sun, Moon,
  Palmtree, Building, LandPlot, Music, Check
} from "lucide-react";

/**
 * Options for various preferences
 */
const TRAVEL_PACES = [
  { id: "Relaxed", label: "Relaxed", desc: "Plenty of downtime", icon: <Palmtree size={18} /> },
  { id: "Moderate", label: "Moderate", desc: "Balanced activity", icon: <Compass size={18} /> },
  { id: "Intense", label: "Intense", desc: "Packed schedule", icon: <Clock size={18} /> },
];

const TRAVEL_STYLES = [
  { id: "Budget", label: "Budget", desc: "Cost-conscious", icon: <Wallet size={18} /> },
  { id: "Mid Range", label: "Mid Range", desc: "Comfort focused", icon: <Building size={18} /> },
  { id: "Luxury", label: "Luxury", desc: "Top-tier experience", icon: <Heart size={18} /> },
];

const INTERESTS_OPTIONS = [
  { id: "Culture", label: "Culture", icon: <LandPlot size={16} /> },
  { id: "History", label: "History", icon: <Building size={16} /> },
  { id: "Nature", label: "Nature", icon: <Palmtree size={16} /> },
  { id: "Adventure", label: "Adventure", icon: <Compass size={16} /> },
  { id: "Food", label: "Food", icon: <Utensils size={16} /> },
  { id: "Shopping", label: "Shopping", icon: <Wallet size={16} /> },
  { id: "Nightlife", label: "Nightlife", icon: <Moon size={16} /> },
  { id: "Relaxation", label: "Relaxation", icon: <Sun size={16} /> },
  { id: "Photography", label: "Photography", icon: <Camera size={16} /> },
  { id: "Art", label: "Art", icon: <Music size={16} /> }, // Using Music as proxy for Art icon if Palette not available or just general arts
];

const GeminiItineraryForm = ({ onItineraryGenerated }) => {
  // Separate UI state for dropdowns
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [availableCities, setAvailableCities] = useState([]);

  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "20:00",
    pace: "Moderate",
    travelStyle: "Mid Range",
    interests: [],
    travelingWithChildren: false,
    travelingWithSeniors: false,
    budget: "",
    specialRequests: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle Country selection
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    const countryData = globalDestinations.find(c => c.country === country);
    setAvailableCities(countryData ? countryData.cities : []);
    setSelectedCity("");
    setForm(prev => ({ ...prev, destination: "" }));
  };

  // Handle City selection
  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    if (city === "Select 'Others' and type manually below..." || selectedCountry === "Others") {
      setForm(prev => ({ ...prev, destination: "" }));
    } else {
      setForm(prev => ({ ...prev, destination: `${city}, ${selectedCountry}` }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Toggle interest
  const toggleInterest = (interestId) => {
    setForm(prev => {
      const exists = prev.interests.includes(interestId);
      if (exists) {
        return { ...prev, interests: prev.interests.filter(i => i !== interestId) };
      } else {
        return { ...prev, interests: [...prev.interests, interestId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalDest = form.destination;

    if (!finalDest && (selectedCountry === "Others" || selectedCity.includes("manual"))) {
      toast.error("Please type your destination manually below");
      return;
    }
    if (!finalDest) {
      toast.error("Please select a destination");
      return;
    }
    if (!form.startDate || !form.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    if (new Date(form.startDate) > new Date(form.endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      setLoading(true);
      const itinerary = await generateItinerary({ ...form, destination: finalDest });
      onItineraryGenerated(itinerary, form);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Styles ---
  const sectionTitleClass = "text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2";
  const labelClasses = "block text-sm font-semibold text-cyan-100 mb-2 tracking-wide";
  const inputClasses = "w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition backdrop-blur-sm hover:bg-slate-800/70";
  const selectClasses = "w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition backdrop-blur-sm appearance-none cursor-pointer hover:bg-slate-800/70";

  const radioCardClass = (active) => `
    relative flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all duration-300
    ${active
      ? "bg-cyan-500/20 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
      : "bg-slate-800/40 border-white/5 hover:border-white/20 hover:bg-slate-800/60"}
  `;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-10">

        {/* 1. Destination Section */}
        <div>
          <h3 className={sectionTitleClass}><MapIcon size={20} className="text-cyan-400" /> Destination & Dates</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="relative">
              <label className={labelClasses}>Country</label>
              <select value={selectedCountry} onChange={handleCountryChange} className={selectClasses} required>
                <option value="" disabled className="bg-slate-900">Choose a country...</option>
                {globalDestinations.map(c => <option key={c.country} value={c.country} className="bg-slate-900">{c.country}</option>)}
              </select>
            </div>
            <div className={`relative ${!selectedCountry ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}>
              <label className={labelClasses}>City / Region</label>
              <select value={selectedCity} onChange={handleCityChange} className={selectClasses} disabled={!selectedCountry} required={selectedCountry !== "Others"}>
                <option value="" disabled className="bg-slate-900">{selectedCountry ? `Choose city...` : "Select country first..."}</option>
                {availableCities.map(city => <option key={city} value={city} className="bg-slate-900">{city}</option>)}
              </select>
            </div>
          </div>

          {/* Manual Destination Override */}
          {(selectedCountry === "Others" || selectedCity.includes("manual") || (!selectedCity && selectedCountry)) && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2">
              <label className={labelClasses}>Specific Destination Name</label>
              <input type="text" name="destination" value={form.destination} onChange={handleChange} placeholder="e.g. Kyoto, Japan" className={inputClasses} />
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Start Date</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required className={`${inputClasses} [color-scheme:dark]`} />
            </div>
            <div>
              <label className={labelClasses}>End Date</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required className={`${inputClasses} [color-scheme:dark]`} />
            </div>
          </div>
        </div>

        {/* 2. Preferences Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Travel Pace */}
          <div>
            <h3 className={sectionTitleClass}><Clock size={20} className="text-cyan-400" /> Travel Pace</h3>
            <div className="grid grid-cols-3 gap-3">
              {TRAVEL_PACES.map((pace) => (
                <div
                  key={pace.id}
                  onClick={() => setForm(prev => ({ ...prev, pace: pace.id }))}
                  className={radioCardClass(form.pace === pace.id)}
                >
                  <div className={`mb-2 ${form.pace === pace.id ? "text-cyan-400" : "text-slate-400"}`}>{pace.icon}</div>
                  <span className="text-sm font-semibold text-white">{pace.label}</span>
                  <span className="text-[10px] text-slate-400 text-center mt-1 leading-tight">{pace.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Style */}
          <div>
            <h3 className={sectionTitleClass}><Wallet size={20} className="text-cyan-400" /> Travel Style</h3>
            <div className="grid grid-cols-3 gap-3">
              {TRAVEL_STYLES.map((style) => (
                <div
                  key={style.id}
                  onClick={() => setForm(prev => ({ ...prev, travelStyle: style.id }))}
                  className={radioCardClass(form.travelStyle === style.id)}
                >
                  <div className={`mb-2 ${form.travelStyle === style.id ? "text-cyan-400" : "text-slate-400"}`}>{style.icon}</div>
                  <span className="text-sm font-semibold text-white">{style.label}</span>
                  <span className="text-[10px] text-slate-400 text-center mt-1 leading-tight">{style.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Interests */}
        <div>
          <h3 className={sectionTitleClass}><Heart size={20} className="text-cyan-400" /> Interests</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {INTERESTS_OPTIONS.map((interest) => {
              const active = form.interests.includes(interest.id);
              return (
                <div
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`
                    flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                    ${active
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/50"
                      : "bg-slate-800/40 border-white/5 hover:bg-slate-800/60"}
                  `}
                >
                  <div className={`${active ? "text-cyan-400" : "text-slate-500"}`}>{interest.icon}</div>
                  <span className={`text-sm ${active ? "text-white font-medium shadow-cyan-500/50" : "text-slate-300"}`}>{interest.label}</span>
                  {active && <Check size={14} className="ml-auto text-cyan-400" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Details: Travelers & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Traveler Group Info */}
          <div>
            <h3 className={sectionTitleClass}><Users size={20} className="text-cyan-400" /> Who's Traveling?</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/30 border border-white/5 cursor-pointer hover:bg-slate-800/50 transition">
                <input
                  type="checkbox"
                  name="travelingWithChildren"
                  checked={form.travelingWithChildren}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-offset-slate-900 focus:ring-cyan-500 bg-slate-700/50"
                />
                <span className="text-slate-200">Traveling with Children (0-12)</span>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/30 border border-white/5 cursor-pointer hover:bg-slate-800/50 transition">
                <input
                  type="checkbox"
                  name="travelingWithSeniors"
                  checked={form.travelingWithSeniors}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-offset-slate-900 focus:ring-cyan-500 bg-slate-700/50"
                />
                <span className="text-slate-200">Traveling with Seniors (65+)</span>
              </label>
            </div>
          </div>

          {/* Budget & Special Requests */}
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Total Budget (Approx. USD/INR)</label>
              <input
                type="number"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder="e.g. 2000"
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* 5. Special Requests */}
        <div>
          <label className={labelClasses}>Special Requests or Notes</label>
          <textarea
            name="specialRequests"
            value={form.specialRequests}
            onChange={handleChange}
            placeholder="Any specific dietary restrictions, mobility issues, or must-see landmarks..."
            rows={3}
            className={inputClasses}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 rounded-2xl transition duration-300 transform hover:scale-[1.01] shadow-xl shadow-cyan-900/40 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-2xl"></div>
          {loading ? (
            <span className="flex items-center justify-center space-x-2 relative z-10">
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              <span>Designing your journey...</span>
            </span>
          ) : (
            <span className="relative z-10 text-lg">✨ Generate Custom Itinerary</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default GeminiItineraryForm;
