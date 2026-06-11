import { useState } from "react";
import { 
  FileText, 
  Copy, 
  Check, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Activity, 
  Share2, 
  Scale,
  ShieldCheck,
  AlertCircle,
  Printer
} from "lucide-react";
import { AnalysisOutput, AnalysisModuleType } from "../types.js";

interface AnalysisReportProps {
  report: AnalysisOutput | null;
  isGenerating: boolean;
  onGenerate: () => void;
  isValid: boolean;
  missingFields: string[];
  onOpenDeck?: () => void;
}

export default function AnalysisReport({
  report,
  isGenerating,
  onGenerate,
  isValid,
  missingFields,
  onOpenDeck,
}: AnalysisReportProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (!report) return;
    navigator.clipboard.writeText(report.narrative.clientNarrative);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe SVG graphing math helpers
  const getMaximumValue = (list: number[]) => Math.max(...list, 10);
  
  return (
    <div id="dojo-analysis-workspace" className="h-full overflow-y-auto bg-dojo-white p-6 lg:p-8 space-y-6">
      {/* Header section with Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-dojo-mist">
        <div className="font-sans">
          <h2 className="text-lg font-extrabold text-dojo-black tracking-tight flex items-center gap-2 uppercase">
            <FileText className="w-5.5 h-5.5 text-dojo-green" />
            Client-Ready Analysis Workspace
          </h2>
          <p className="text-xs text-dojo-stone mt-1">
            Turning your payments data into clear merchant insights.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isGenerating && report && onOpenDeck && (
            <button
              id="presentation-deck-btn"
              onClick={onOpenDeck}
              className="px-5 py-3 bg-dojo-teal hover:bg-dojo-teal/80 active:scale-[0.98] hover:scale-[1.01] transition rounded-xl font-extrabold text-xs text-dojo-darkgreen tracking-wide shadow-sm flex items-center gap-2 uppercase cursor-pointer"
            >
              <Printer className="w-4 h-4 text-dojo-darkgreen" />
              Download Report / PDF
            </button>
          )}
          {isValid ? (
            <button
              id="generate-analysis-btn"
              onClick={onGenerate}
              disabled={isGenerating}
              className={`px-5 py-3 rounded-xl font-extrabold text-xs text-white tracking-wide transition shadow-md cursor-pointer flex items-center gap-2 uppercase ${
                isGenerating 
                  ? "bg-dojo-mist border border-dojo-stone/30 text-dojo-stone animate-pulse" 
                   : "bg-dojo-green hover:bg-dojo-darkgreen hover:scale-[1.01] active:scale-[0.98]"
              }`}
            >
              {isGenerating ? (
                <>Generative Audit Ongoing...</>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-dojo-teal animate-bounce" />
                  Run Validated dbt Analysis
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-dojo-mist/40 border border-dojo-stone/20 px-4 py-2.5 rounded-lg text-xs text-dojo-black">
              <AlertCircle className="w-4 h-4 text-dojo-stone" />
              <span>
                Pending parameters: <strong className="text-dojo-green uppercase font-mono">{missingFields.join(", ")}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {isGenerating && (
        <div className="bg-white border border-dojo-mist shadow-xs rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-dojo-mist border-t-dojo-teal animate-spin mx-auto" />
          <h3 className="text-dojo-black font-extrabold text-sm uppercase">Gathering your metrics...</h3>
          <p className="text-xs text-dojo-stone max-w-sm mx-auto">
            Checking transactions and sector benchmarks. Just a second!
          </p>
        </div>
      )}

      {!isGenerating && !report && (
        <div className="bg-white border border-dojo-mist shadow-xs rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 my-8">
          <div className="w-12 h-12 rounded-xl bg-dojo-white border border-dojo-mist text-dojo-stone flex items-center justify-center mx-auto">
            <Activity className="w-6 h-6 text-dojo-green" />
          </div>
          <div>
            <h3 className="text-dojo-black font-extrabold text-sm uppercase">Ready to start</h3>
            <p className="text-xs text-dojo-stone mt-1 max-w-sm mx-auto leading-relaxed">
              Fill in the details on the left, or just tell the Dojo Agent what you'd like to analyze.
            </p>
          </div>
          {isValid ? (
            <button
              id="workspace-init-generate-btn"
              onClick={onGenerate}
              className="px-4 py-2 bg-dojo-green hover:bg-dojo-darkgreen transition font-extrabold text-xs rounded-lg text-white cursor-pointer shadow-sm animate-bounce"
            >
              Analyse Active State Now
            </button>
          ) : (
            <p className="text-[11px] text-dojo-stone font-semibold">Please enter a merchant name and region to begin.</p>
          )}
        </div>
      )}

      {/* Primary Report Console */}
      {!isGenerating && report && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Metadata Ribbon */}
          <div className="p-4 bg-white border border-dojo-mist shadow-xs rounded-2xl grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
            <div className="space-y-1">
              <span className="text-dojo-stone block font-bold uppercase tracking-wider text-[10px]">Merchant Client</span>
              <strong className="text-dojo-green block text-sm font-extrabold">{report.metadata.clientName}</strong>
              <span className="text-[10px] font-mono text-dojo-stone">MID: {report.metadata.merchantId}</span>
            </div>
            <div className="space-y-1 border-l border-dojo-mist pl-4">
              <span className="text-dojo-stone block font-bold uppercase tracking-wider text-[10px]">Geographic Scope</span>
              <strong className="text-dojo-black block text-sm font-extrabold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-dojo-teal shrink-0" />
                {report.metadata.locations}
              </strong>
              <span className="text-[10px] font-mono text-dojo-stone">BigQuery geohash cells</span>
            </div>
            <div className="space-y-1 border-l border-dojo-mist pl-4">
              <span className="text-dojo-stone block font-bold uppercase tracking-wider text-[10px]">Period Filter</span>
              <strong className="text-dojo-black block text-sm font-extrabold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-dojo-teal shrink-0" />
                {report.metadata.dateRange}
              </strong>
              <span className="text-[10px] font-mono text-dojo-stone">dbt partitioned tables</span>
            </div>
            <div className="space-y-1 border-l border-dojo-mist pl-4">
              <span className="text-dojo-stone block font-bold uppercase tracking-wider text-[10px]">Validation Status</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-dojo-fresh text-dojo-green font-mono text-[9px] uppercase font-extrabold border border-dojo-green/20">
                <ShieldCheck className="w-3.5 h-3.5 text-dojo-green shrink-0" />
                Sanity Passed
              </span>
              <div className="text-[10px] text-dojo-stone font-mono mt-0.5">{report.metadata.recordsProcessed.toLocaleString()} records processed</div>
            </div>
          </div>

          {/* Key Metrics Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {report.keyMetrics.map((met, idx) => (
              <div key={idx} className="bg-white border border-dojo-mist rounded-2xl p-5 space-y-2 shadow-xs hover:border-dojo-green/40 transition duration-150 font-sans flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-dojo-stone font-bold uppercase tracking-wider block">{met.title}</span>
                  
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-base lg:text-lg font-extrabold tracking-tight text-dojo-green font-mono">
                      {met.value}
                    </span>
                    <span 
                      className={`text-[9px] font-extrabold font-mono inline-block px-1.5 py-0.5 rounded-md ${
                        met.isPositive 
                          ? "bg-[#3CEAC7]/15 text-[#003F33] border border-[#3CEAC7]/30" 
                          : "bg-amber-100 text-amber-850 border border-amber-200"
                      }`}
                    >
                      {met.change}
                    </span>
                  </div>
                </div>

                <div className="text-[9px] text-dojo-stone leading-normal border-t border-dojo-mist pt-2 mt-3 font-semibold">
                  Definition: {met.definition}
                </div>
              </div>
            ))}
          </div>

          {/* Graphical Split Dash */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* SVG area / line trend chart */}
            <div className="bg-white border border-dojo-mist p-6 rounded-2xl space-y-4 shadow-xs">
              <div className="font-sans">
                <h4 className="text-xs font-bold uppercase text-dojo-black tracking-wider">Payments Revenue Trend</h4>
                <p className="text-[10px] text-dojo-stone font-semibold">Aggregated sales trend values mapped through time periods</p>
              </div>

              {/* Responsive SVG Line Chart */}
              <div className="relative h-44 w-full bg-dojo-white border border-dojo-mist rounded-xl p-2 flex items-center justify-center">
                {report.timeSeries && report.timeSeries.length > 0 ? (
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3CEAC7" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3CEAC7" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Horizontal Grid lines */}
                    <line x1="0" y1="20" x2="400" y2="20" stroke="#E0E0DC" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="0" y1="60" x2="400" y2="60" stroke="#E0E0DC" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#E0E0DC" strokeWidth="0.5" strokeDasharray="2,2" />

                    {/* Compile parameters points path */}
                    {(() => {
                      const maxVal = getMaximumValue(report.timeSeries.map(p => p.revenue));
                      const stepX = 400 / (report.timeSeries.length - 1);
                      const points = report.timeSeries.map((p, idx) => {
                        const x = idx * stepX;
                        // Transform 120px height max to match coordinates
                        const y = 110 - ((p.revenue / maxVal) * 90);
                        return { x, y, ...p };
                      });

                      const dPath = `M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`;
                      const areaPath = `${dPath} L ${points[points.length - 1].x},110 L ${points[0].x},110 Z`;

                      return (
                        <>
                          {/* Shaded Area */}
                          <path d={areaPath} fill="url(#chartGradient)" />
                          {/* Glowing Line */}
                          <path d={dPath} fill="none" stroke="#003F33" strokeWidth="2.5" strokeLinecap="round" />
                          {/* Coordinates dots */}
                          {points.map((pt, i) => (
                            <g key={i} className="group cursor-pointer font-sans">
                              <circle cx={pt.x} cy={pt.y} r="3.5" fill="#3CEAC7" stroke="#003F33" strokeWidth="1.5" />
                              <text x={pt.x} y={pt.y - 8} fill="#003F33" fontSize="8.5" fontFamily="monospace" textAnchor="middle" fontWeight="extrabold">
                                £{Math.round(pt.revenue / 1000)}k
                              </text>
                              <text x={pt.x} y="118" fill="#5F5850" fontSize="8" textAnchor="middle" fontWeight="bold">
                                {pt.period}
                              </text>
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                ) : (
                  <p className="text-[10px] text-dojo-stone font-semibold">Insufficient series blocks</p>
                )}
              </div>
            </div>

            {/* SVG bar split for day of week splits */}
            <div className="bg-white border border-dojo-mist p-6 rounded-2xl space-y-4 shadow-xs">
              <div className="font-sans">
                <h4 className="text-xs font-bold uppercase text-dojo-black tracking-wider">Weekly Revenue Distribution</h4>
                <p className="text-[10px] text-dojo-stone font-semibold">Volume and ticket contribution split daily split</p>
              </div>

              {/* Responsive SVG Bar plots */}
              <div className="relative h-44 w-full bg-dojo-white border border-dojo-mist rounded-xl p-2 flex items-center justify-center">
                {report.splits.dayOfWeek && report.splits.dayOfWeek.length > 0 ? (
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                    {/* Horizontal threshold limits */}
                    <line x1="0" y1="30" x2="400" y2="30" stroke="#E0E0DC" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="0" y1="80" x2="400" y2="80" stroke="#E0E0DC" strokeWidth="0.5" strokeDasharray="2,2" />

                    {(() => {
                      const days = report.splits.dayOfWeek;
                      const maxPct = getMaximumValue(days.map(d => d.revenuePercent));
                      const paddingX = 30;
                      const barGap = (400 - (paddingX * 2)) / days.length;
                      const barWidth = 14;

                      return days.map((d, i) => {
                        const x = paddingX + (i * barGap) - (barWidth / 2);
                        const barHeight = (d.revenuePercent / maxPct) * 80;
                        const y = 98 - barHeight;

                        return (
                          <g key={i}>
                            {/* Background track */}
                            <rect x={x} y="18" width={barWidth} height="80" fill="#E0E0DC" rx="3" />
                            {/* Sourced bar */}
                            <rect x={x} y={y} width={barWidth} height={barHeight} fill="#003F33" rx="3" className="hover:fill-dojo-teal transition-all cursor-pointer" />
                            
                            {/* Values text */}
                            <text x={x + barWidth / 2} y={y - 5} fill="#003F33" fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="extrabold">
                              {d.revenuePercent}%
                            </text>
                            {/* Subtitle day label */}
                            <text x={x + barWidth / 2} y="112" fill="#5F5850" fontSize="8" textAnchor="middle" fontWeight="bold">
                              {d.day}
                            </text>
                          </g>
                        );
                      });
                    })()}
                  </svg>
                ) : (
                  <p className="text-[10px] text-dojo-stone font-semibold">No weekday splits datasets</p>
                )}
              </div>
            </div>
          </div>

          {/* Hour Peak shifts and card origins */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hour Split table ledger */}
            <div className="bg-white border border-dojo-mist p-6 rounded-2xl space-y-3 shadow-xs font-sans">
              <h4 className="text-xs font-bold uppercase text-dojo-black tracking-wider">Peak Hourly Splits Contribution</h4>
              <div className="space-y-2 text-xs">
                {report.splits.hourOfDay?.map((sh, i) => (
                  <div key={i} className="p-3 bg-dojo-white rounded-xl border border-dojo-mist flex items-center justify-between">
                    <div>
                      <span className="font-bold text-dojo-green block">{sh.hour}</span>
                      <span className="text-[10px] text-dojo-stone font-semibold font-mono">Count: {sh.transactions.toLocaleString()} settled files</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-dojo-black font-mono text-xs">{sh.revenuePercent}%</span>
                      <div className="w-20 bg-dojo-mist h-1 rounded overflow-hidden mt-1">
                        <div className="bg-dojo-green h-full rounded" style={{ width: `${sh.revenuePercent}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Card origin breakdowns with no NULL checking */}
            <div className="bg-white border border-dojo-mist p-6 rounded-2xl space-y-3 shadow-xs font-sans">
              <h4 className="text-xs font-bold uppercase text-dojo-black tracking-wider">Card Issuance Network Origins</h4>
              <div className="space-y-2.5 text-xs">
                {report.splits.cardOrigin?.map((co, i) => (
                  <div key={i} className="space-y-1 bg-dojo-white p-3 rounded-xl border border-dojo-mist">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-dojo-green">{co.origin}</span>
                      <strong className="text-dojo-green font-mono font-extrabold">{co.revenuePercent}% share</strong>
                    </div>
                    <div className="w-full bg-dojo-mist h-2 rounded overflow-hidden">
                      <div 
                        className={`h-full rounded ${i === 0 ? "bg-dojo-green" : (i === 1 ? "bg-dojo-teal" : "bg-dojo-stone/50")}`} 
                        style={{ width: `${co.revenuePercent}%` }} 
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-dojo-stone font-mono font-semibold">
                      <span>Transactions: {co.transactionCount.toLocaleString()}</span>
                      <span>Avg Spend: £{co.avgSpend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competitor Sector Benchmarking indexes */}
          {report.comparisons && report.comparisons.length > 0 && (
            <div className="bg-white border border-dojo-mist p-6 rounded-2xl space-y-3 shadow-xs font-sans">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-dojo-teal" />
                <h4 className="text-xs font-bold uppercase text-dojo-black tracking-wider">
                  dbt Local Competitor Index Mappings
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.comparisons.map((c, idx) => (
                  <div key={idx} className="bg-dojo-white p-4 rounded-xl border border-dojo-mist flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px] text-dojo-green font-bold block">{c.metric}</span>
                      <span className="text-[10px] text-dojo-stone font-semibold font-mono">Benchmark Peer Group baseline</span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-1.5 justify-end">
                        <strong className="text-dojo-black font-mono font-extrabold">{typeof c.clientValue === "number" && !c.metric.includes("MoM") ? "£" : ""}{c.clientValue}</strong>
                        <span className="text-[9px] text-dojo-stone font-mono font-semibold">vs {typeof c.benchmarkValue === "number" && !c.metric.includes("MoM") ? "£" : ""}{c.benchmarkValue}</span>
                      </div>
                      <span className={`text-[10px] font-extrabold font-mono leading-none ${c.status === "above" ? "text-dojo-teal" : "text-amber-800"}`}>
                        {c.differencePercent > 0 ? `+${c.differencePercent}` : c.differencePercent}% {c.status} sector
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Narratives & Executive translation */}
          <div className="bg-white border border-dojo-mist rounded-2xl overflow-hidden shadow-xs font-sans">
            {/* Context Title */}
            <div className="px-6 py-4.5 bg-dojo-white border-b border-dojo-mist flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-dojo-teal animate-pulse" />
                <h4 className="text-xs font-bold uppercase text-dojo-black tracking-wider">
                  Dojo Intelligence Contextual Narratives
                </h4>
              </div>
              <span className="text-[10px] font-mono text-dojo-stone font-semibold uppercase">Validated analyst translation logic</span>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {/* Executive summary block */}
              <div className="space-y-1.5">
                <h5 className="font-extrabold text-dojo-stone uppercase tracking-widest text-[9px]">Executive Performance Summary</h5>
                <p className="text-dojo-black leading-relaxed bg-dojo-white p-4 rounded-xl border border-dojo-mist">
                  {report.narrative.executiveSummary}
                </p>
              </div>

              {/* Achievements & Opportunities Bullets splits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2">
                <div className="space-y-2">
                  <h5 className="font-extrabold text-dojo-green uppercase tracking-widest text-[9px]">dbt Sourced Performance Highlights</h5>
                  <ul className="space-y-2">
                    {report.narrative.keyAchievements?.map((ach, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-dojo-black leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-dojo-teal shrink-0 mt-1.5" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-extrabold text-dojo-green uppercase tracking-widest text-[9px]">Strategic Revenue Expansion Opportunities</h5>
                  <ul className="space-y-2">
                    {report.narrative.growthOpportunities?.map((opp, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-dojo-black leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-dojo-green shrink-0 mt-1.5" />
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Ready-to-copy client-ready paragraph as requested */}
              <div className="p-5 bg-dojo-white border border-dojo-mist rounded-xl space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-extrabold text-dojo-green uppercase tracking-wider text-[9px] flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-dojo-teal" />
                      Client-Ready Email Pitch Copy
                    </h5>
                    <p className="text-[10px] text-dojo-stone font-semibold">Zero placeholders. Copy-paste directly to merchant correspondence.</p>
                  </div>
                  <button
                    id="copy-to-clipboard-btn"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dojo-green hover:bg-dojo-darkgreen transition text-[9px] text-white font-extrabold tracking-widest uppercase shadow-sm cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#3CEAC7]" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#3CEAC7]" /> Copy Pitch
                      </>
                    )}
                  </button>
                </div>
                <div className="text-dojo-black italic leading-relaxed text-xs p-4 bg-white rounded-lg border border-dojo-mist">
                  "{report.narrative.clientNarrative}"
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
