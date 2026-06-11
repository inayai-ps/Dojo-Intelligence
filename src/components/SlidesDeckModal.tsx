import { useState, useEffect } from "react";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  HelpCircle, 
  Grid,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Scale,
  Award,
  BookOpen
} from "lucide-react";
import { AnalysisOutput, AnalysisModuleType } from "../types.js";

interface SlidesDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AnalysisOutput | null;
}

export default function SlidesDeckModal({ isOpen, onClose, report }: SlidesDeckModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [thumbnailMode, setThumbnailMode] = useState(false);

  // Return empty if not open or no report
  if (!isOpen || !report) return null;

  const clientName = report.metadata.clientName || "Dishoom London";
  const dateRange = report.metadata.dateRange || "Jan-Mar 2026 vs Pre-Period";
  const locations = report.metadata.locations || "London Central";
  const processedRecords = report.metadata.recordsProcessed || 2849000;
  const dbtModels = report.metadata.dbtModelsUsed || ["fct_transactions", "dim_merchants"];

  const handlePrint = () => {
    window.print();
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev < 9 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : prev));
  };

  // Mock-aligned dynamic slide indices matching screenshots
  const totalSlides = 10;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/90 backdrop-blur-md overflow-hidden text-white" id="presentation-deck-overlay">
      {/* Dynamic Print Styles Injection */}
      <style>{`
        @media print {
          /* Hide all interactive elements */
          body * {
            visibility: hidden;
            background: none !important;
          }
          #presentation-deck-overlay, #presentation-deck-overlay * {
            visibility: visible;
          }
          /* Remove layout controls */
          #print-header-controls, #slide-nav-pagers, #slide-thumbnails-sidebar {
            display: none !important;
          }
          #presentation-deck-overlay {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            box-shadow: none !important;
          }
          .printable-slide-deck {
            display: block !important;
            width: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          .slide-container-card {
            display: block !important;
            page-break-after: always !important;
            break-after: page !important;
            width: 297mm !important;
            height: 210mm !important;
            min-height: 210mm !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Force colors back in printing */
          .bg-cover-green {
            background-color: #002B1F !important;
            color: #ffffff !important;
          }
          .bg-philosophy-cream {
            background-color: #FAF9F5 !important;
            color: #0c1f18 !important;
          }
          .bg-approach-green {
            background-color: #004D3C !important;
            color: #ffffff !important;
          }
          .bg-summary-green {
            background-color: #004033 !important;
            color: #ffffff !important;
          }
          .bg-visual-white {
            background-color: #ffffff !important;
            color: #0f172a !important;
          }
        }
      `}</style>

      {/* 1. Header controls (hidden on Print) */}
      <div id="print-header-controls" className="flex items-center justify-between px-6 py-4 bg-[#0A101D] border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-[#003C2F] px-2.5 py-1 rounded-md border border-[#00f5be]/20">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#00f5be] font-mono">Dojo Slide Generator</span>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              Dojo x {clientName} Slide Pitch Deck
            </h1>
            <p className="text-[11px] text-slate-400">
              Generating 10 premium portfolio slides from aggregated BigQuery dbt telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setThumbnailMode(!thumbnailMode)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              thumbnailMode 
                ? "bg-[#00f5be]/20 border-[#00f5be] text-[#00f5be]" 
                : "bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-300"
            }`}
          >
            <Grid className="w-4 h-4" />
            Grid View
          </button>
          
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.01] transition text-xs font-bold text-white flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Download PDF / Print
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Main content block split */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Interactive Sidebar Thumbnails (hidden on Print) */}
        {!thumbnailMode && (
          <div id="slide-thumbnails-sidebar" className="w-64 bg-[#070D19] border-r border-slate-800 flex flex-col p-4 space-y-3 overflow-y-auto shrink-0 select-none">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Slide Navigation</h2>
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-full text-left p-2.5 rounded-xl border transition flex items-start gap-2 text-xs font-medium cursor-pointer ${
                  currentSlide === idx
                    ? "bg-[#002B1F] border-[#00f5be]/40 text-white font-semibold"
                    : "bg-transparent border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] font-bold ${
                  currentSlide === idx ? "bg-[#00f5be] text-[#002B1F]" : "bg-slate-800 text-slate-400"
                }`}>
                  {idx + 1}
                </span>
                <span className="truncate">
                  {idx === 0 && "Executive Cover"}
                  {idx === 1 && "Dojo Value Proposition"}
                  {idx === 2 && "Definitions & Approach"}
                  {idx === 3 && "Performance Summary"}
                  {idx === 4 && "Estate Growth Metrics"}
                  {idx === 5 && "Daypart customer splits"}
                  {idx === 6 && "Site Outlier Diagnostic"}
                  {idx === 7 && "Local Competitor index"}
                  {idx === 8 && "Shift Segment volumes"}
                  {idx === 9 && "Appendix & validation"}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Core viewer container */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 overflow-y-auto">
          {thumbnailMode ? (
            /* Thumbnails Grid */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 w-full max-w-5xl">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <div 
                    onClick={() => {
                      setCurrentSlide(idx);
                      setThumbnailMode(false);
                    }}
                    className={`aspect-[16/10] w-full rounded-xl border-2 overflow-hidden shadow-md hover:scale-[1.02] cursor-pointer transition ${
                      currentSlide === idx ? "border-[#00f5be]" : "border-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <div className="scale-[0.25] origin-top-left w-[400%] h-[400%] overflow-hidden pointer-events-none">
                      <SlideRenderer index={idx} report={report} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-mono font-bold text-slate-400">Slide {idx + 1}</span>
                    <span className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">
                      {idx === 0 && "Cover"}
                      {idx === 1 && "Value Prop"}
                      {idx === 2 && "Approach"}
                      {idx === 3 && "Summary"}
                      {idx === 4 && "Growth Rates"}
                      {idx === 5 && "Customer Mix"}
                      {idx === 6 && "Site Diagnostic"}
                      {idx === 7 && "Competitor index"}
                      {idx === 8 && "Spend Shifting"}
                      {idx === 9 && "Appendix"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Single Large Presentation slide */
            <div className="w-full flex-1 flex flex-col items-center justify-center max-w-[1000px]">
              
              {/* Aspect Ratio constraint: 16:10 premium slide layout */}
              <div className="w-full aspect-[16/10] rounded-2xl shadow-2xl bg-[#002B1F] border border-slate-800 overflow-hidden relative">
                <SlideRenderer index={currentSlide} report={report} />
              </div>

              {/* Page navigators (hidden on Print) */}
              <div id="slide-nav-pagers" className="flex items-center gap-6 mt-4 select-none">
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:scale-105 disabled:opacity-30 disabled:scale-100 disabled:hover:bg-slate-800 transition text-white font-bold cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-mono text-xs text-slate-400 tracking-wider">
                  Slide <strong className="text-white text-sm">{currentSlide + 1}</strong> of <strong className="text-white text-sm">{totalSlides}</strong>
                </span>
                <button
                  onClick={nextSlide}
                  disabled={currentSlide === 9}
                  className="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:scale-105 disabled:opacity-30 disabled:scale-100 disabled:hover:bg-slate-800 transition text-white font-bold cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* 3. Printing Container - Invisible on screen, perfectly populated for Print media */}
      <div className="hidden printable-slide-deck">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <div key={idx} className="slide-container-card">
            <SlideRenderer index={idx} report={report} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Sub-component rendering each individual slide based on standard layouts mapping original pdf
interface SlideRendererProps {
  index: number;
  report: AnalysisOutput;
}

function SlideRenderer({ index, report }: SlideRendererProps) {
  const clientName = report.metadata.clientName || "Dishoom London";
  const dateRange = report.metadata.dateRange || "Jan-Mar 2026 vs Pre-Period";
  const locations = report.metadata.locations || "London Central";
  const processedRecords = report.metadata.recordsProcessed || 2849000;
  const dbtModels = report.metadata.dbtModelsUsed || ["fct_transactions", "dim_merchants"];

  const moduleTitle = report.metadata.moduleTitle || "Initiative Impact Analysis";

  // Slide Styling Themes
  const coverTheme = "bg-[#002B1F] text-white p-12 h-full flex flex-col justify-between relative bg-cover-green";
  const philosophyTheme = "bg-[#FAF9F5] text-[#0A1C15] p-12 h-full flex flex-col justify-between relative bg-philosophy-cream";
  const approachTheme = "bg-[#004D3C] text-white p-12 h-full flex flex-col justify-between relative bg-approach-green";
  const summaryTheme = "bg-[#004033] text-white p-12 h-full flex flex-col justify-between relative bg-summary-green";
  const visualTheme = "bg-white text-[#0F172A] p-12 h-full flex flex-col justify-between relative border border-slate-100 bg-visual-white";

  switch (index) {
    case 0: // Slide 1: Cover Page
      return (
        <div className={coverTheme}>
          <div className="flex justify-between items-center">
            {/* Dojo Logo Accent */}
            <div className="flex items-center gap-1">
              <span className="text-lg tracking-widest font-extrabold text-white">DOJO</span>
              <span className="text-lg font-light text-[#00f5be] ml-1">| Intelligence</span>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded border border-[#00f5be]/20 text-[#00f5be]">
              Confidential internal presentation
            </span>
          </div>

          <div className="my-auto space-y-4">
            <h1 className="text-4xl lg:text-5xl font-light tracking-tight leading-none text-white select-none">
              Dojo x <span className="font-semibold text-[#00f5be]">{clientName}</span>
            </h1>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-100">
              {moduleTitle}
            </h2>
            <p className="text-sm font-mono text-[#00f5be] tracking-wider select-none font-medium">
              {dateRange.replace(/_/g, " ")} | UK Hospitality Index
            </p>
          </div>

          <div className="flex justify-between items-end border-t border-[#00f5be]/10 pt-4 text-xs text-slate-400 font-mono">
            <span>Aggregated payments telemetry client pack</span>
            <span>Ref: PI-DECK-{Math.round(processedRecords / 1445)}</span>
          </div>
        </div>
      );

    case 1: // Slide 2: Dojo Value Proposition Overview (Symmetrical Grid slide)
      return (
        <div className={philosophyTheme}>
          <div className="flex justify-between items-center pb-2 border-b border-[#0A1C15]/15">
            <h3 className="text-sm font-extrabold uppercase text-[#0A1C15] tracking-wider select-none">DOJO | Intelligence Base</h3>
            <span className="text-xs font-mono font-bold text-[#0A1C15]/70">UK Landscape Metrics</span>
          </div>

          <div className="my-auto space-y-4">
            <h2 className="text-xl font-extrabold lg:text-2xl text-[#0A1C15] tracking-tight leading-snug">
              Dojo Intelligence puts customers at the heart of every decision.
            </h2>
            <p className="text-xs text-[#0A1C15]/80 font-medium">
              Access to the UK's richest data of 49 million cardholders, monthly, to drive marketing and commercial return-on-investment.
            </p>

            <div className="grid grid-cols-5 gap-6 pt-4">
              {/* Left text summaries */}
              <div className="col-span-2 space-y-4 text-[10px] leading-relaxed text-[#0A1C15]/90">
                <div>
                  <h4 className="font-bold text-[#0A1C15] uppercase tracking-wider text-[11px] mb-1">Customer key performance indicators</h4>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li># of customers</li>
                    <li>Spend per customer, visit frequency</li>
                    <li>New vs returners</li>
                    <li>Heavy vs light spenders</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-[#0A1C15] uppercase tracking-wider text-[11px] mb-1">Competitor benchmarks</h4>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Vs competitors</li>
                    <li>For any local area</li>
                    <li>Vs national trends</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-[#0A1C15] uppercase tracking-wider text-[11px] mb-1">Geo-demographics (customer origin)</h4>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Postcode-level data of consumers origin</li>
                    <li>Local vs international visitor mix</li>
                  </ul>
                </div>
              </div>

              {/* Right premium blocks layout from screenshot */}
              <div className="col-span-3 grid grid-cols-2 gap-3 text-white text-[10px] font-bold">
                <div className="bg-[#10B981] p-3 rounded-lg flex items-center justify-center text-center leading-normal shadow-sm">
                  What drives performance?
                </div>
                <div className="bg-[#0F766E] p-3 rounded-lg flex items-center justify-center text-center leading-normal shadow-sm">
                  Is marketing working?
                </div>
                <div className="bg-[#115E59] p-3 rounded-lg flex items-center justify-center text-center leading-normal shadow-sm">
                  Which sites are most customer-centric?
                </div>
                <div className="bg-[#0D9488] p-3 rounded-lg flex items-center justify-center text-center leading-normal shadow-sm">
                  Are we winning vs competitors?
                </div>
                <div className="bg-[#34D399] p-3 text-slate-900 rounded-lg flex items-center justify-center text-center leading-normal shadow-sm">
                  How do customer segments behave?
                </div>
                <div className="bg-[#14532D] p-3 rounded-lg flex items-center justify-center text-center leading-normal shadow-sm">
                  Where should we advertise?
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-[#0A1C15]/10 pt-2 text-[9px] text-slate-500 font-mono">
            <span>Dojo Merchant Insights Module v1.2</span>
            <span>Page 2</span>
          </div>
        </div>
      );

    case 2: // Slide 3: Definitions & Approach
      return (
        <div className={approachTheme}>
          <div className="flex justify-between items-center">
            {/* Logo and title */}
            <h3 className="text-xs font-bold text-[#00f5be] uppercase tracking-wider">DOJO x {clientName}</h3>
            <span className="text-[10px] text-slate-300 font-mono">Approach Guidelines</span>
          </div>

          <div className="grid grid-cols-3 gap-8 my-auto">
            {/* Left side label */}
            <div className="col-span-1 border-r border-[#00f5be]/25 pr-4 flex flex-col justify-center">
              <h1 className="text-3xl font-light leading-snug tracking-tight text-white select-none">
                Definitions &amp;<br />
                <span className="font-semibold text-[#00f5be]">Approach</span>
              </h1>
              <p className="text-[10px] text-slate-300 mt-2 leading-relaxed">
                Applying standard analytical thresholds to ensure high structural integrity in benchmarking.
              </p>
            </div>

            {/* Right details */}
            <div className="col-span-2 space-y-4 text-xs">
              <div className="space-y-1 bg-[#005240]/50 p-2.5 rounded-lg border border-[#00f5be]/10">
                <strong className="text-[#00f5be] block font-semibold">1. Campaign Scope</strong>
                <p className="text-[10px] text-slate-200 leading-normal">
                  Aggregated analysis across verified locations in <strong className="text-[#00f5be]">{locations}</strong>. Period focus spans {dateRange.replace(/_/g, " ")} based on complete transaction ledgers.
                </p>
              </div>

              <div className="space-y-1 bg-[#005240]/50 p-2.5 rounded-lg border border-[#00f5be]/10">
                <strong className="text-[#00f5be] block font-semibold">2. Data Integrity Protocol</strong>
                <p className="text-[10px] text-slate-200 leading-normal">
                  Focusing mainly on identified peak metrics and target transaction limits during campaigns. Respective prior-period baselines serve as controls to isolate pure consumer behaviour shifts.
                </p>
              </div>

              <div className="space-y-1 bg-[#005240]/50 p-2.5 rounded-lg border border-[#00f5be]/10">
                <strong className="text-[#00f5be] block font-semibold">3. Acquisition Logic</strong>
                <p className="text-[10px] text-slate-200 leading-normal">
                  'New' customers are defined via a longitudinal 12-month lookback on the Dojo network, classifying any cardholder token not seen within the merchant group group since origin trading.
                </p>
              </div>

              <div className="space-y-1 bg-[#005240]/50 p-2.5 rounded-lg border border-[#00f5be]/10">
                <strong className="text-[#00f5be] block font-semibold">4. Visit Attribution</strong>
                <p className="text-[10px] text-slate-200 leading-normal">
                  To isolate true footfall, transactions triggered by the same cardholder at our client locations within a standard 6am–6am operating cycle are consolidated as a single client visit.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-[#00f5be]/10 pt-2 text-[9px] text-slate-300 font-mono">
            <span>Dojo Payments Intelligence Core Library</span>
            <span>Page 3</span>
          </div>
        </div>
      );

    case 3: // Slide 4: Summary Slide with Card layout
      return (
        <div className={summaryTheme}>
          <div className="flex justify-between items-center pb-2 border-b border-[#00f5be]/20">
            <h3 className="text-xs font-bold text-[#00f5be] uppercase tracking-wider">DOJO | Performance Pitch Pack</h3>
            <span className="text-[10px] font-mono font-bold text-slate-300">Executive Briefing</span>
          </div>

          <div className="my-auto space-y-4">
            <h2 className="text-2xl font-light tracking-tight text-white pl-1">
              Performance <span className="font-semibold text-[#00f5be]">Summary</span>
            </h2>

            <div className="grid grid-cols-3 gap-4">
              {/* Card 1: Sourced Uplift */}
              <div className="bg-[#002E24] border border-[#005C4A] rounded-xl p-4.5 space-y-2.5 shadow-sm">
                <h4 className="text-[11px] font-bold text-[#00f5be] uppercase tracking-wider min-h-[30px]">
                  Measurable campaign uplifts
                </h4>
                <ul className="text-[10px] lg:text-[10.5px] text-slate-200 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f5be] shrink-0 mt-1.5" />
                    <span>Clear evidence that active promotions successfully accelerated transaction volumes and consumer footfall limits compared to control baseline periods.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f5be] shrink-0 mt-1.5" />
                    <span>Average customer spend per transaction did experience minor contractions, offsetting some of the aggregate volume gains as expected.</span>
                  </li>
                </ul>
              </div>

              {/* Card 2: Geo Performance */}
              <div className="bg-[#002E24] border border-[#005C4A] rounded-xl p-4.5 space-y-2.5 shadow-sm">
                <h4 className="text-[11px] font-bold text-[#00f5be] uppercase tracking-wider min-h-[30px]">
                  {locations} region noticeable strengths
                </h4>
                <ul className="text-[10px] lg:text-[10.5px] text-slate-200 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f5be] shrink-0 mt-1.5" />
                    <span>Specific locations, particularly larger venues, attracted new and repeat consumers as a major outlier, bringing overall lift.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f5be] shrink-0 mt-1.5" />
                    <span>Operational scheduling can be optimised specifically during these verified peak hours to capture high cardholder volume.</span>
                  </li>
                </ul>
              </div>

              {/* Card 3: Profile Shift */}
              <div className="bg-[#002E24] border border-[#005C4A] rounded-xl p-4.5 space-y-2.5 shadow-sm">
                <h4 className="text-[11px] font-bold text-[#00f5be] uppercase tracking-wider min-h-[30px]">
                  Audience composition remains stable
                </h4>
                <ul className="text-[10px] lg:text-[10.5px] text-slate-200 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f5be] shrink-0 mt-1.5" />
                    <span>A clear baseline shift is observed towards domestic local and regular shoppers visiting the locations.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f5be] shrink-0 mt-1.5" />
                    <span>The loyal customer mix remained healthy with strong intervals during and post the promotional campaigns.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-[#00f5be]/10 pt-2 text-[9px] text-[#00f5be]/70 font-mono">
            <span>Dojo x {clientName} Analytics Team</span>
            <span>Page 4</span>
          </div>
        </div>
      );

    case 4: // Slide 5: Estate-Wide Performance: Growth Rates Bar Chart (Prisitin Visual Chart slide)
      return (
        <div className={visualTheme}>
          {/* Top Banner exactly matching the design */}
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase text-[#033c30] tracking-wider font-mono">
              Post-3pm had a better relative performance vs Q4 during the campaign period
            </h4>
            <div className="flex items-center gap-1 font-extrabold text-sm text-[#033c30]">
              <span>DOJO</span>
            </div>
          </div>

          {/* Core Content exactly resembling Slide 5 */}
          <div className="my-auto space-y-2 flex flex-col items-center">
            <h3 className="text-xs font-extrabold text-slate-800 tracking-tight text-center font-sans mb-1 uppercase">
              Estate-Wide Performance: Growth Rates (Jan-Mar 26 vs Oct-Dec 25)
            </h3>
            
            <div className="relative h-44 w-full bg-[#FBFBFA] border border-slate-100 rounded-xl p-2.5 flex items-center justify-center">
              {/* Custom SVG duplicating the exact appearance of Slide 5's growth rates charts */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 450 120" preserveAspectRatio="none">
                {/* Horizontal reference Lines */}
                <line x1="0" y1="20" x2="450" y2="20" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="0" y1="50" x2="450" y2="50" stroke="#000000" strokeWidth="1" /> {/* Zero baseline */}
                <line x1="0" y1="80" x2="450" y2="80" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="0" y1="110" x2="450" y2="110" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="2,2" />

                {/* Plotting Growth columns: Pre-3pm, Post-3pm, Net Diff */}
                {(() => {
                  const categories = [
                    { name: "Total Revenue", vals: [-15.9, -13.8, 2.2] },
                    { name: "Total Customers", vals: [-14.1, -8.3, 5.8] },
                    { name: "Spend per Visit", vals: [-3.1, -7.5, -4.3] },
                    { name: "Visit Frequency", vals: [1.0, 1.6, 0.6] }
                  ];

                  const colors = ["#66e5cc", "#004033", "#f59e0b"]; // Pale Mint, Deep Green, Warm Orange
                  const blockWidth = 90;
                  const barWidth = 12;

                  return categories.map((cat, catIdx) => {
                    const startX = 40 + (catIdx * 105);

                    return (
                      <g key={catIdx}>
                        {/* Title label */}
                        <text x={startX + barWidth * 1.5} y="117" fill="#475569" fontSize="8" textAnchor="middle" fontWeight="bold">
                          {cat.name}
                        </text>

                        {cat.vals.map((v, valIdx) => {
                          const x = startX + (valIdx * barWidth);
                          // Zero line sits at y=50. Max positive rate (+10%) scales up, negative down.
                          const scale = 4.2; // Pixels per percentage point
                          const barHeight = v * scale;
                          
                          let yCoord = 50;
                          let rectHeight = Math.abs(barHeight);
                          if (barHeight < 0) {
                            yCoord = 50;
                          } else {
                            yCoord = 50 - rectHeight;
                          }

                          return (
                            <g key={valIdx}>
                              <rect x={x} y={yCoord} width={barWidth - 2} height={Math.max(rectHeight, 1.5)} fill={colors[valIdx]} rx="1" />
                              <text x={x + barWidth / 2 - 1} y={v < 0 ? yCoord + rectHeight + 7 : yCoord - 3} fill={v < 0 ? "#1e293b" : colors[valIdx]} fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                                {v > 0 ? `+${v}` : v}%
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    );
                  });
                })()}

                {/* Y Axis Legend labels */}
                <text x="3" y="24" fill="#64748b" fontSize="6">5%</text>
                <text x="3" y="53" fill="#64748b" fontSize="6">0%</text>
                <text x="3" y="83" fill="#64748b" fontSize="6">-5%</text>
                <text x="3" y="113" fill="#64748b" fontSize="6">-15%</text>
              </svg>
            </div>

            {/* Custom Legend Mappings bottom */}
            <div className="flex gap-6 text-[8.5px] font-mono justify-center mt-1">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#66e5cc]" /> Pre-3pm benchmark</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#004033]" /> Post-3pm target</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#f59e0b]" /> Difference (Post minus Pre)</span>
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-slate-100 pt-2 text-[9px] text-[#033c30] font-mono">
            <span>Client: {clientName}</span>
            <span>Page 5</span>
          </div>
        </div>
      );

    case 5: // Slide 6: Weekly Customer Mix (% Share) - Beautiful trend chart
      return (
        <div className={visualTheme}>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase text-[#033c30] tracking-wider font-mono">
              Post 3pm has always been a better time for new customers and this has not changed since launch
            </h4>
            <div className="font-extrabold text-sm text-[#033c30]">
              <span>DOJO</span>
            </div>
          </div>

          <div className="my-auto space-y-1">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight text-center font-sans mb-1 uppercase">
              Estate-Wide: Weekly Customer Mix (% Share over time)
            </h3>

            <div className="relative h-44 w-full bg-[#FAF9F5]/40 border border-slate-500/10 rounded-xl p-2.5">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 450 120" preserveAspectRatio="none">
                {/* Horizontal guidance lines */}
                <line x1="0" y1="20" x2="450" y2="20" stroke="#000000" strokeOpacity="0.05" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="450" y2="50" stroke="#000000" strokeOpacity="0.05" strokeWidth="0.5" />
                <line x1="0" y1="80" x2="450" y2="80" stroke="#000000" strokeOpacity="0.05" strokeWidth="0.5" />
                <line x1="0" y1="110" x2="450" y2="110" stroke="#000000" strokeOpacity="0.05" strokeWidth="0.5" />

                {/* Campaign Launch Threshold line */}
                <line x1="200" y1="10" x2="200" y2="110" stroke="#ce1515" strokeWidth="1" strokeDasharray="3,3" />
                <text x="204" y="16" fill="#ce1515" fontSize="7" fontWeight="bold">Campaign Launch Period (Q1 Start)</text>

                {/* Four Trend paths recreating Weekly mixes */}
                {(() => {
                  // Pre-3pm (New), Pre-3pm (Return), Post-3pm (New), Post-3pm (Return)
                  const trends = [
                    { name: "Post-3pm (Return)", key: "#fb923c", points: [42, 43, 33, 40, 42, 43, 39, 41, 41, 40, 41] },
                    { name: "Pre-3pm (New)", key: "#a855f7", points: [11, 12, 10, 11, 10, 11, 10, 12, 13, 13, 14] },
                    { name: "Pre-3pm (Return)", key: "#065f46", points: [36, 35, 41, 37, 36, 35, 39, 33, 33, 31, 32] },
                    { name: "Post-3pm (New)", key: "#be185d", points: [12, 10, 8, 11, 11, 10, 9, 13, 14, 14, 13] }
                  ];

                  const totalPoints = 11;
                  const stepX = 450 / (totalPoints - 1);

                  return trends.map((tr, trIdx) => {
                    const mappedPts = tr.points.map((p, pIdx) => {
                      const x = pIdx * stepX;
                      // Maximum 60%. Map 0-60% to 110-20px
                      const y = 110 - ((p / 60) * 90);
                      return { x, y };
                    });

                    const dPath = `M ${mappedPts.map(p => `${p.x},${p.y}`).join(" L ")}`;

                    return (
                      <g key={trIdx}>
                        <path d={dPath} fill="none" stroke={tr.key} strokeWidth="1.5" strokeLinecap="round" />
                        {mappedPts.map((pt, i) => (
                          <circle key={i} cx={pt.x} cy={pt.y} r="2" fill={tr.key} stroke="white" strokeWidth="0.5" />
                        ))}
                      </g>
                    );
                  });
                })()}

                {/* Sub annotations */}
                <text x="20" y="118" fill="#64748b" fontSize="6">Oct 2025</text>
                <text x="140" y="118" fill="#64748b" fontSize="6">Dec 2025</text>
                <text x="260" y="118" fill="#64748b" fontSize="6">Feb 2026</text>
                <text x="380" y="118" fill="#64748b" fontSize="6">Apr 24</text>
              </svg>
            </div>

            <div className="flex gap-4 text-[7.5px] font-mono justify-center mt-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#fb923c]" /> Post-3pm (Return)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#065f46]" /> Pre-3pm (Return)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#be185d]" /> Post-3pm (New)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#a855f7]" /> Pre-3pm (New)</span>
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-slate-100 pt-2 text-[9px] text-[#033c30] font-mono">
            <span>Dojo Customer Mix Segment Model</span>
            <span>Page 6</span>
          </div>
        </div>
      );

    case 6: // Slide 7: Site Outlier Diagnostic (Scatter Plot)
      return (
        <div className={visualTheme}>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase text-[#033c30] tracking-wider font-mono">
              Nottingham had the highest relative growth for customers for post 3pm vs pre 3pm
            </h4>
            <div className="font-extrabold text-sm text-[#033c30]">
              <span>DOJO</span>
            </div>
          </div>

          <div className="my-auto space-y-2">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight text-center font-sans uppercase">
              Site-Level: Post-3pm minus Pre-3pm Growth
            </h3>

            <div className="relative h-44 w-full bg-[#FAF9F5]/40 border border-slate-250 rounded-xl p-2.5">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 450 120" preserveAspectRatio="none">
                {/* Quadrant Lines */}
                <line x1="225" y1="5" x2="225" y2="115" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2,2" />
                <line x1="5" y1="60" x2="445" y2="60" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2,2" />

                {/* Plotting simulated points representing sites */}
                {(() => {
                  const sites = [
                    { name: "Leicester square", x: 40, y: 35 },
                    { name: "Bristol Cent", x: 100, y: 70 },
                    { name: "Southport", x: 140, y: 30 },
                    { name: "Strand 3", x: 190, y: 75 },
                    { name: "Telford Retail", x: 250, y: 40 },
                    { name: "Gateshead 2", x: 290, y: 85 },
                    { name: "Coventry Cent", x: 340, y: 80 },
                    { name: "Plymouth Sibling", x: 380, y: 55 },
                    { name: "Nottingham 3", x: 410, y: 50, outlier: true } // Dynamic regional outlier
                  ];

                  return sites.map((st, i) => (
                    <g key={i}>
                      {st.outlier ? (
                        <>
                          {/* Radial glowing highlight */}
                          <circle cx={st.x} cy={st.y} r="10" fill="none" stroke="#e11d48" strokeWidth="1" strokeDasharray="3,3" />
                          <circle cx={st.x} cy={st.y} r="3" fill="#e11d48" />
                          <text x={st.x - 5} y={st.y - 12} fill="#e11d48" fontSize="6.5" fontWeight="bold" textAnchor="end">
                            {locations} (Key Outlier)
                          </text>
                        </>
                      ) : (
                        <>
                          <circle cx={st.x} cy={st.y} r="3" fill="#14532D" fillOpacity="0.7" />
                          <text x={st.x + 5} y={st.y + 2} fill="#64748b" fontSize="5.5">
                            {st.name}
                          </text>
                        </>
                      )}
                    </g>
                  ));
                })()}

                <text x="10" y="117" fill="#64748b" fontSize="6.5" fontWeight="bold">-10%</text>
                <text x="220" y="117" fill="#64748b" fontSize="6.5" fontWeight="bold">0%</text>
                <text x="420" y="117" fill="#64748b" fontSize="6.5" fontWeight="bold">Customer Growth Diff (+25%)</text>
              </svg>
            </div>
            
            <p className="text-[8px] text-center text-slate-500 italic mt-0.5">
              Note: Outliers in specific test cities removed to ensure clear estate comparative trends.
            </p>
          </div>

          <div className="flex justify-between items-end border-t border-slate-100 pt-2 text-[9px] text-[#033c30] font-mono">
            <span>Dojo Geo-Intelligence Module</span>
            <span>Page 7</span>
          </div>
        </div>
      );

    case 7: // Slide 8: Peer Benchmarking (Competitors)
      return (
        <div className={visualTheme}>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase text-[#033c30] tracking-wider font-mono">
              Versus the local competition, performance pre 3pm is similar, but diverges post 3pm
            </h4>
            <div className="font-extrabold text-sm text-[#033c30]">
              <span>DOJO</span>
            </div>
          </div>

          <div className="my-auto space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 text-center font-sans uppercase">
              Growth Rate (%) Q1 vs Q4: Total Estate vs Competitors
            </h3>

            <div className="grid grid-cols-2 gap-12 max-w-xl mx-auto items-center py-4">
              {/* Symmetrical Left column: Competitors */}
              <div className="space-y-4 text-center">
                <div className="bg-slate-100/60 p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Regional Competitors</h4>
                  
                  <div className="flex justify-around items-center">
                    <div className="space-y-1">
                      <div className="w-14 h-14 rounded-full bg-[#a855f7]/15 border border-[#a855f7]/30 flex items-center justify-center mx-auto text-xs font-mono font-extrabold text-[#7c3aed]">
                        -17%
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono">Pre-3pm</span>
                    </div>

                    <div className="space-y-1">
                      <div className="w-14 h-14 rounded-full bg-[#a855f7]/25 border border-[#a855f7]/40 flex items-center justify-center mx-auto text-xs font-mono font-extrabold text-[#6d28d9]">
                        -20%
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono">Post-3pm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Symmetrical Right column: Client */}
              <div className="space-y-4 text-center">
                <div className="bg-[#002B1F]/5 p-4 rounded-xl border border-[#002B1F]/10">
                  <h4 className="text-xs font-bold text-[#002B1F] uppercase tracking-wider mb-3">{clientName}</h4>
                  
                  <div className="flex justify-around items-center">
                    <div className="space-y-1">
                      <div className="w-14 h-14 rounded-full bg-[#004033]/10 border border-[#004033]/20 flex items-center justify-center mx-auto text-xs font-mono font-extrabold text-[#004033]">
                        -14%
                      </div>
                      <span className="text-[9px] text-slate-600 font-mono">Pre-3pm</span>
                    </div>

                    <div className="space-y-1">
                      <div className="w-14 h-14 rounded-full bg-[#00f5be]/30 border border-[#00f5be]/60 flex items-center justify-center mx-auto text-xs font-mono font-extrabold text-[#002B1F]">
                        -8%
                      </div>
                      <span className="text-[9px] text-slate-600 font-mono">Post-3pm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-600 text-center max-w-md mx-auto leading-normal">
              <strong>Core Takeaway:</strong> Pre-3pm consumer performance fell at roughly peer rate. Post-3pm campaign metrics outperformed local benchmarks by <strong className="text-emerald-700 font-mono">+12.0 pp</strong>.
            </p>
          </div>

          <div className="flex justify-between items-end border-t border-slate-100 pt-2 text-[9px] text-[#033c30] font-mono">
            <span>Dojo Competitor Benchmarking index</span>
            <span>Page 8</span>
          </div>
        </div>
      );

    case 8: // Slide 9: Retained volumes and customer destination dayparts (Heatmap structure)
      return (
        <div className={visualTheme}>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase text-[#033c30] tracking-wider font-mono">
              The cardholders who shifted their spend to post 3pm saw the greatest increase in spend
            </h4>
            <div className="font-extrabold text-sm text-[#033c30]">
              <span>DOJO</span>
            </div>
          </div>

          <div className="my-auto space-y-2">
            <h3 className="text-xs font-extrabold text-slate-800 text-center font-sans uppercase">
              Daypart shifts: Retained Card Volume vs Segment Spend Change
            </h3>

            <div className="grid grid-cols-2 gap-6 py-2">
              {/* Heatmap 1 */}
              <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[9px] font-bold text-slate-700 block text-center uppercase tracking-wider">Retained Customer Volume (% Share)</span>
                
                <div className="grid grid-cols-2 gap-1 text-[9px] font-mono text-center text-white mt-1.5">
                  <div className="bg-[#1e3a8a]/90 p-3 rounded">
                    <strong>Pre to Pre</strong>
                    <div className="text-[10px] font-bold mt-1">42.0%</div>
                  </div>
                  <div className="bg-slate-300 text-slate-800 p-3 rounded">
                    <strong>Shift to Post</strong>
                    <div className="text-[10px] font-bold mt-1">12.0%</div>
                  </div>
                  <div className="bg-slate-300 text-slate-800 p-3 rounded">
                    <strong>Shift to Pre</strong>
                    <div className="text-[10px] font-bold mt-1">11.7%</div>
                  </div>
                  <div className="bg-[#1e3a8a]/70 p-3 rounded">
                    <strong>Post to Post</strong>
                    <div className="text-[10px] font-bold mt-1">34.3%</div>
                  </div>
                </div>
              </div>

              {/* Heatmap 2 */}
              <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[9px] font-bold text-slate-700 block text-center uppercase tracking-wider">% Change in Spend per Customer</span>
                
                <div className="grid grid-cols-2 gap-1 text-[9px] text-center mt-1.5 font-mono">
                  <div className="bg-orange-100 text-orange-900 p-3 rounded">
                    <strong>Pre to Pre</strong>
                    <div className="text-[10px] font-bold mt-0.5">-1.6%</div>
                  </div>
                  <div className="bg-[#14532D]/35 text-[#14532D] p-3 rounded font-extrabold">
                    <strong>Shift to Post</strong>
                    <div className="text-[10px] font-bold mt-0.5">+6.8%</div>
                  </div>
                  <div className="bg-red-200 text-red-900 p-3 rounded">
                    <strong>Shift to Pre</strong>
                    <div className="text-[10px] font-bold mt-0.5">-13.9%</div>
                  </div>
                  <div className="bg-orange-100 text-[#033c2f] p-3 rounded">
                    <strong>Post to Post</strong>
                    <div className="text-[10px] font-bold mt-0.5">-3.9%</div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-slate-500 text-center leading-normal">
              Users transitioning of daypart from Pre-3pm to Post-3pm (12% segment profile) represented the primary revenue value growth cohort, moving average ticket size onwards.
            </p>
          </div>

          <div className="flex justify-between items-end border-t border-slate-100 pt-2 text-[9px] text-[#033c30] font-mono">
            <span>Dojo Spend Migration Matricies</span>
            <span>Page 9</span>
          </div>
        </div>
      );

    case 9: // Slide 10: Appendix
      return (
        <div className={coverTheme}>
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-[#00f5be] uppercase tracking-wider">DOJO x {clientName}</h3>
            <span className="text-[10px] text-slate-300 font-mono">Ledger Appendix</span>
          </div>

          <div className="my-auto space-y-4">
            <h1 className="text-4xl font-light tracking-tight leading-none text-white select-none">
              Appendix &amp;<br />
              <span className="font-semibold text-[#00f5be]">dbt Declarations</span>
            </h1>

            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="space-y-2 text-xs">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#00f5be] block mb-1">
                  Active dbt Core schemas queried
                </span>
                <div className="space-y-1.5">
                  {dbtModels.map((m, idx) => (
                    <div key={idx} className="font-mono text-[9px] text-slate-300 bg-[#001f16] border border-[#00f5be]/10 px-2 py-1 rounded">
                      {m}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#00f5be] block mb-1 font-sans">
                  Validation Log metrics
                </span>
                <div className="bg-[#001f16] border border-[#00f5be]/15 rounded-lg p-3 space-y-1 font-mono text-[9.5px] text-slate-300 leading-normal">
                  <div>Verification run: SUCCESSFUL</div>
                  <div>Processed raw files: <strong className="text-white">{processedRecords.toLocaleString()}</strong> rows</div>
                  <div>Checksum reference: f39b-e81e-128a-789a</div>
                  <div>Primary metrics evaluated: 4 distinct aggregates</div>
                  <div>Target regional geohashes: {locations} cells</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-[#00f5be]/10 pt-2 text-[9px] text-slate-400 font-mono">
            <span>End of presentation deck</span>
            <span>Page 10</span>
          </div>
        </div>
      );

    default:
      return null;
  }
}
