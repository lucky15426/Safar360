import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  MapPin, Calendar, Clock, Wallet, Info,
  ThermometerSun, Lightbulb, Backpack, CheckCircle,
  Map as MapIcon, ArrowRight, DollarSign, ShieldAlert, Download, FileText, Loader
} from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const GeminiItineraryDisplay = ({ itinerary, formData }) => {
  const itineraryRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!itinerary) return null;

  const {
    selectedState,
    recommendationReason,
    recommendedCities,
    tripSummary,
    days,
    costBreakdown,
    generalSafetyRecommendations,
    bestTimeToVisit,
    travelTips,
    packingRecommendations,
  } = itinerary;

  const handleDownloadPDF = async () => {
    if (!itineraryRef.current) return;

    try {
      setIsDownloading(true);
      toast.loading("Generating PDF...", { id: "pdf-toast" });

      const element = itineraryRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        backgroundColor: "#0f172a", // Match dark theme background
        logging: false
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Subsequent pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Safar360-Itinerary-${selectedState}.pdf`);

      toast.dismiss("pdf-toast");
      toast.success("📄 PDF Downloaded successfully!", { duration: 3000 });
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.dismiss("pdf-toast");
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // --- Styles ---
  const glassCard = "bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl";
  const sectionTitle = "text-xl font-bold text-white mb-4 flex items-center gap-2";
  const subText = "text-slate-300 leading-relaxed";

  return (
    <div className="space-y-8 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

      {/* 🌍 1. Trip Header / Hero Card */}
      <div ref={itineraryRef} className="p-4 bg-slate-950 rounded-[2rem]"> {/* Wrapper for PDF Capture */}
        <div className="relative group overflow-hidden rounded-[2rem] border border-white/10 mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/80 via-blue-900/80 to-slate-900/90 backdrop-blur-md z-0"></div>

          {/* Decorative Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 p-8 md:p-10 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <div className="flex items-center space-x-2 text-cyan-300 mb-2 uppercase tracking-wider text-xs font-bold">
                  <MapIcon size={14} />
                  <span>Destination Confirmed</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-heritage font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-100">
                  {selectedState}
                </h2>

                {recommendationReason && (
                  <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10 mb-6 max-w-3xl">
                    <Lightbulb size={20} className="text-yellow-300 mt-1 shrink-0" />
                    <p className="text-slate-200 italic font-light">"{recommendationReason}"</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 text-sm font-medium">
                  {recommendedCities && recommendedCities.length > 0 && (
                    <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-800/80 border border-white/10 text-cyan-200">
                      <MapPin size={14} /> {recommendedCities.join(" → ")}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-800/80 border border-white/10 text-cyan-200">
                    <Calendar size={14} /> {formData.startDate} - {formData.endDate}
                  </span>
                  <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-800/80 border border-white/10 text-emerald-300 border-emerald-500/20">
                    <Wallet size={14} /> ₹{costBreakdown?.totalEstimatedCostINR?.toLocaleString("en-IN") || "TBD"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-lg text-slate-200 leading-relaxed font-light">
                {tripSummary}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <h3 className="text-4xl font-bold text-white flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            <span className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></span>
            Detailed Itinerary
            <span className="w-12 h-0.5 bg-gradient-to-l from-cyan-500 to-transparent"></span>
          </h3>

          {days?.map((day) => (
            <div key={day.dayNumber} className={`${glassCard} hover:border-cyan-500/30 transition-colors duration-300 mb-6`}>
              {/* Day Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-white/5 gap-4">
                <div>
                  <div className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-1">Day {day.dayNumber}</div>
                  <h4 className="text-2xl font-bold text-white">{day.date}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {day.theme && (
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
                      ✨ {day.theme}
                    </span>
                  )}
                  {day.dayTotal && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
                      ₹{day.dayTotal.toLocaleString("en-IN")} est.
                    </span>
                  )}
                </div>
              </div>

              {/* Activities Timeline */}
              <div className="space-y-6 relative pl-4 md:pl-0">
                {/* Vertical Line for Tablet+ */}
                <div className="hidden md:block absolute left-[8.5rem] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/50 via-slate-700 to-transparent"></div>

                {day.activities?.map((activity, idx) => (
                  <div key={idx} className="relative md:grid md:grid-cols-[8rem_auto] gap-8 group">

                    {/* Time Column */}
                    <div className="mb-2 md:mb-0 md:text-right">
                      <div className="inline-block md:block bg-slate-800/80 px-3 py-1 rounded-lg text-cyan-200 font-mono text-sm border border-white/5 group-hover:border-cyan-500/30 transition">
                        {activity.startTime}
                      </div>
                      <div className="hidden md:block text-slate-500 text-xs mt-1">{activity.duration}</div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="hidden md:block absolute left-[8.5rem] top-4 w-3 h-3 bg-cyan-500 rounded-full -translate-x-1.5 border-2 border-slate-900 shadow-[0_0_10px_rgba(6,182,212,0.5)] z-10"></div>

                    {/* Content Card */}
                    <div className="bg-slate-800/30 rounded-xl p-5 border border-white/5 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg break-inside-avoid">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h5 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{activity.title}</h5>
                        {activity.estimatedCostINR > 0 && (
                          <span className="shrink-0 text-emerald-400 font-bold text-sm">₹{activity.estimatedCostINR.toLocaleString("en-IN")}</span>
                        )}
                      </div>

                      <p className="text-slate-300 text-sm mb-3 leading-relaxed">{activity.shortDescription}</p>

                      <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                        {activity.location && (
                          <span className="flex items-center gap-1"><MapPin size={12} /> {activity.location}</span>
                        )}
                        <span className="flex items-center gap-1 md:hidden"><Clock size={12} /> {activity.duration}</span>
                      </div>

                      {/* Enhancements inside activity */}
                      {(activity.recommendedTransport || activity.safetyTips) && (
                        <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-2">
                          {activity.recommendedTransport && (
                            <div className="text-xs text-cyan-200/80 flex items-center gap-2">
                              <ArrowRight size={12} /> Transport: {activity.recommendedTransport}
                            </div>
                          )}
                          {activity.safetyTips && (
                            <div className="text-xs text-orange-300/80 flex items-center gap-2 bg-orange-500/10 p-2 rounded-lg border border-orange-500/20">
                              <ShieldAlert size={12} /> Tip: {activity.safetyTips}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 💰 3. Financial & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 break-inside-avoid">
          {/* Cost Breakdown */}
          {costBreakdown && (
            <div className={`${glassCard} md:col-span-2`}>
              <h3 className={`${sectionTitle} text-emerald-400`}><Wallet /> Financial Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {[
                  { label: "Transport", value: costBreakdown.totalTransportCostINR },
                  { label: "Dining", value: costBreakdown.totalFoodCostINR },
                  { label: "Activities", value: costBreakdown.totalActivityTicketsCostINR },
                  { label: "Daily Avg", value: costBreakdown.costPerDayAverage },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-800/50 p-4 rounded-xl border border-white/5 text-center group hover:border-emerald-500/30 transition">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-2xl font-bold text-white group-hover:text-emerald-400 transition">₹{item.value?.toLocaleString("en-IN") || 0}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center px-4">
                <span className="text-slate-300 font-medium">Total Estimated Budget</span>
                <span className="text-3xl font-bold text-emerald-400 drop-shadow-sm">₹{costBreakdown.totalEstimatedCostINR?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          )}

          {/* Safety */}
          {generalSafetyRecommendations?.length > 0 && (
            <div className={`${glassCard} border-l-4 border-l-orange-500`}>
              <h3 className={sectionTitle}><ShieldAlert className="text-orange-500" /> Safety First</h3>
              <ul className="space-y-3">
                {generalSafetyRecommendations.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="mt-1 w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips - Centered as requested */}
          {travelTips?.length > 0 && (
            <div className={`${glassCard} border-l-4 border-l-cyan-500 flex flex-col items-center text-center md:col-span-2`}>
              <h3 className={`${sectionTitle} font-bold text-4xl text-cyan-300 mb-6`}><Lightbulb className="text-cyan-500" size={28} /> Pro Tips</h3>
              <ul className="space-y-4 max-w-3xl">
                {travelTips.map((tip, idx) => (
                  <li key={idx} className="flex flex-col items-center gap-2 text-slate-300 text-lg leading-relaxed">
                    <CheckCircle size={18} className="text-cyan-500 mb-1" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Packing */}
          {packingRecommendations?.length > 0 && (
            <div className={`${glassCard} border-l-4 border-l-purple-500 md:col-span-2`}>
              <h3 className={sectionTitle}><Backpack className="text-purple-500" /> Packing Essentials</h3>
              <div className="flex flex-wrap gap-3">
                {packingRecommendations.map((item, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-200 text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer for PDF */}
        <div className="mt-8 text-center text-slate-500 text-xs py-4 border-t border-white/10">
          Generated by Safar360 AI • {new Date().toLocaleDateString()}
        </div>

      </div> {/* End of PDF Capture Wrapper */}

      {/* Download Action - Outside PDF Wrapper */}
      <div className="flex justify-center pt-2 pb-10">
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="group relative px-8 py-4 bg-slate-100 text-slate-900 font-bold rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 flex items-center gap-3 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
          {isDownloading ? (
            <span className="relative z-10 flex items-center gap-2">
              <Loader size={18} className="animate-spin" /> Generating PDF...
            </span>
          ) : (
            <span className="relative z-10 flex items-center gap-2">
              <Download size={18} /> Download Itinerary PDF <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default GeminiItineraryDisplay;
