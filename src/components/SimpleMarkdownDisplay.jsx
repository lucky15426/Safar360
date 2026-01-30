import React from 'react';
import { MapPin, Calendar, Utensils, Star, Clock } from 'lucide-react';

const SimpleMarkdownDisplay = ({ markdown }) => {
    // Simple parser to convert markdown structure to UI
    // Expecting:
    // # Title
    // ## Country
    // ### Place
    // *Description*
    // **Highlights:** ...

    if (!markdown) return null;

    const sections = markdown.split('## 🏳️ ');
    const title = sections[0].replace('# 🌍 ', '').trim();
    const countrySections = sections.slice(1);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-8 rounded-3xl shadow-2xl text-white">
                <h1 className="text-4xl font-cinzel font-bold mb-2">{title}</h1>
                <p className="text-cyan-100">A custom journey curated by Safar AI</p>
            </div>

            {countrySections.map((section, idx) => {
                const lines = section.split('\n');
                const countryName = lines[0].trim();
                const content = lines.slice(1).join('\n');

                // Split by Places (### 📍 )
                const places = content.split('### 📍 ').slice(1);

                return (
                    <div key={idx} className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
                        <h2 className="text-3xl font-bold text-cyan-300 mb-6 flex items-center">
                            <span className="mr-3 text-4xl">🏳️</span> {countryName}
                        </h2>

                        <div className="grid gap-6">
                            {places.map((placeBlock, pIdx) => {
                                const placeLines = placeBlock.split('\n').filter(l => l.trim());
                                const placeName = placeLines[0].trim();
                                const description = placeLines.find(l => l.startsWith('*'))?.replace(/\*/g, '') || '';

                                const highlights = placeLines.find(l => l.includes('Highlights:'))?.split('**')[2].trim();
                                const mustTry = placeLines.find(l => l.includes('Must Try:'))?.split('**')[2].trim();
                                const bestSeason = placeLines.find(l => l.includes('Best Season:'))?.split('**')[2].trim();

                                // Extract Day Plan
                                const dayPlanIndex = placeLines.findIndex(l => l.includes('> **Day Plan**'));
                                const dayPlan = dayPlanIndex !== -1 ? placeLines.slice(dayPlanIndex + 1) : [];

                                return (
                                    <div key={pIdx} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                                            <MapPin className="w-6 h-6 mr-2 text-cyan-400" /> {placeName}
                                        </h3>
                                        <p className="text-gray-300 italic mb-4">{description}</p>

                                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                                            {highlights && (
                                                <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl">
                                                    <div className="flex items-center text-purple-300 mb-1 font-semibold text-sm">
                                                        <Star className="w-4 h-4 mr-2" /> Highlights
                                                    </div>
                                                    <div className="text-white text-sm">{highlights}</div>
                                                </div>
                                            )}
                                            {mustTry && (
                                                <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-xl">
                                                    <div className="flex items-center text-orange-300 mb-1 font-semibold text-sm">
                                                        <Utensils className="w-4 h-4 mr-2" /> Must Try
                                                    </div>
                                                    <div className="text-white text-sm">{mustTry}</div>
                                                </div>
                                            )}
                                            {bestSeason && (
                                                <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl">
                                                    <div className="flex items-center text-green-300 mb-1 font-semibold text-sm">
                                                        <Calendar className="w-4 h-4 mr-2" /> Season
                                                    </div>
                                                    <div className="text-white text-sm">{bestSeason}</div>
                                                </div>
                                            )}
                                        </div>

                                        {dayPlan.length > 0 && (
                                            <div className="bg-black/20 rounded-xl p-4">
                                                <h4 className="text-cyan-200 font-semibold mb-3 flex items-center">
                                                    <Clock className="w-4 h-4 mr-2" /> Suggested Day Plan
                                                </h4>
                                                <ul className="space-y-2">
                                                    {dayPlan.map((l, i) => {
                                                        const cleanLine = l.replace('> - ', '').replace('>', '').trim();
                                                        if (!cleanLine) return null;
                                                        return (
                                                            <li key={i} className="text-gray-300 text-sm flex items-start">
                                                                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                                                                {cleanLine}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SimpleMarkdownDisplay;
