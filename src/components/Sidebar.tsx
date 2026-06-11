import React from "react";
import { 
  PRE_APPROVED_MODULES, 
  AnalysisModuleType, 
  AnalysisParameters 
} from "../types.js";
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  Info, 
  Sparkles, 
  FileText,
  Sliders
} from "lucide-react";

interface SidebarProps {
  activeModule: AnalysisModuleType;
  setActiveModule: (module: AnalysisModuleType) => void;
  params: AnalysisParameters;
  setParams: React.Dispatch<React.SetStateAction<AnalysisParameters>>;
  onClearReport?: () => void;
}

export default function Sidebar({
  activeModule,
  setActiveModule,
  params,
  setParams,
  onClearReport,
}: SidebarProps) {
  const activeModuleSchema = PRE_APPROVED_MODULES.find(m => m.id === activeModule) || PRE_APPROVED_MODULES[0];

  // Validation state checks
  const isClientValid = params.clientName.trim().length > 0;
  const isDateValid = !!params.dateRange;

  const missingSidebarFields: string[] = [];
  activeModuleSchema.requiredParams.forEach(p => {
    const value = params[p as keyof AnalysisParameters];
    if (!value || (typeof value === "string" && value.trim().length === 0)) {
      missingSidebarFields.push(p);
    }
  });

  const isCoherent = missingSidebarFields.length === 0;

  const handleParamChange = (key: keyof AnalysisParameters, value: string) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }));
    if (onClearReport) {
      onClearReport();
    }
  };

  const handleLoadPreset = (presetName: string) => {
    if (onClearReport) {
      onClearReport();
    }
    switch (presetName) {
      case "dishoom_london_campaign":
        setActiveModule(AnalysisModuleType.CAMPAIGN_IMPACT);
        setParams({
          clientName: "Dishoom London",
          merchantId: "MID-8032148",
          dateRange: "last_year",
          locationRegion: "London",
          competitorSector: "Casual Dining",
          selectedMetrics: ["Primary Metric Lift", "Revenue Uplift", "Transaction Volume Shift"],
          comparisonBenchmark: "sector average",
          leadMetric: "revenue",
          newVsReturningSplit: "yes",
          targetFrequency: "visits per month",
          campaignHours: "post-3pm",
          comparisonWindow: "same period prior month",
          primaryMetric: "revenue",
          overlapDefinition: "customers visiting more than one site in the period",
          includeVisitFrequency: "yes",
        });
        break;
      case "blacklock_cannibalisation":
        setActiveModule(AnalysisModuleType.CANNIBALISATION);
        setParams({
          clientName: "Blacklock Soho & Blacklock Covent Garden",
          merchantId: "MID-4029415",
          dateRange: "last_quarter",
          locationRegion: "London",
          competitorSector: "Fine Dining",
          selectedMetrics: ["Overlap Rate", "Cannibalisation index correlation", "Net Cross-Site Revenue Impact"],
          comparisonBenchmark: "sector average",
          leadMetric: "revenue",
          newVsReturningSplit: "yes",
          targetFrequency: "visits per month",
          campaignHours: "all day",
          comparisonWindow: "same period prior year",
          primaryMetric: "revenue",
          overlapDefinition: "customers visiting more than one site in the period",
          includeVisitFrequency: "yes",
        });
        break;
      case "pret_loyalty":
        setActiveModule(AnalysisModuleType.CUSTOMER_LOYALTY);
        setParams({
          clientName: "Pret A Manger",
          merchantId: "MID-2018491",
          dateRange: "year_to_date",
          locationRegion: "UK Nationwide",
          competitorSector: "Fast Food",
          selectedMetrics: ["Customer Visit Frequency", "New vs Returning Ratio", "Spend per Customer"],
          comparisonBenchmark: "other sites",
          leadMetric: "frequency",
          newVsReturningSplit: "yes",
          targetFrequency: "visits per month",
          campaignHours: "all day",
          comparisonWindow: "same period prior month",
          primaryMetric: "transaction volume",
          overlapDefinition: "customers visiting more than one site in the period",
          includeVisitFrequency: "yes",
        });
        break;
    }
  };

  return (
    <div id="dojo-sidebar" className="flex flex-col h-full bg-dojo-darkgreen border-r border-[#003F33]/30 text-[#F8FAFC] overflow-y-auto">
      {/* Brand Header */}
      <div className="p-6 border-b border-dojo-green bg-dojo-green">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dojo-teal flex items-center justify-center font-black text-dojo-darkgreen tracking-tighter text-xl shadow-md">
            D
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5 font-sans uppercase">
              DOJO | Intelligence
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-dojo-teal/20 text-dojo-teal font-extrabold font-mono border border-dojo-teal/20">V3.5</span>
            </h1>
            <p className="text-[10px] text-dojo-fresh/70 font-semibold tracking-wider uppercase">Your merchant insights portal</p>
          </div>
        </div>
      </div>

      {/* Preset Fast Actions */}
      <div className="p-5 border-b border-dojo-green/40 bg-dojo-green/10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-dojo-teal animate-pulse" />
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#C3F9EE]">Enterprise Portfolio Templates</h3>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <button 
            id="preset-dishoom"
            onClick={() => handleLoadPreset("dishoom_london_campaign")}
            title="Module 3: Campaign & Event Impact Analysis"
            className="text-left text-xs px-3 py-2 rounded-lg bg-dojo-green/50 hover:bg-dojo-green border border-dojo-teal/20 hover:border-dojo-teal/50 transition flex justify-between items-center cursor-pointer group"
          >
            <span className="font-semibold text-dojo-fresh group-hover:text-white transition-colors">Dishoom — Campaign Impact</span>
            <span className="text-[9px] bg-dojo-darkgreen text-dojo-teal px-1.5 py-0.5 rounded font-mono font-bold" title="Module 3 Campaign Impact">M3</span>
          </button>
          <button 
            id="preset-blacklock"
            onClick={() => handleLoadPreset("blacklock_cannibalisation")}
            title="Module 4: Cross-Site Overlap & Cannibalisation Analysis"
            className="text-left text-xs px-3 py-2 rounded-lg bg-dojo-green/50 hover:bg-dojo-green border border-dojo-teal/20 hover:border-dojo-teal/50 transition flex justify-between items-center cursor-pointer group"
          >
            <span className="font-semibold text-dojo-fresh group-hover:text-white transition-colors">Blacklock — Cross-Site Overlap</span>
            <span className="text-[9px] bg-dojo-darkgreen text-dojo-teal px-1.5 py-0.5 rounded font-mono font-bold" title="Module 4 Cross-Site Overlap">M4</span>
          </button>
          <button 
            id="preset-pret"
            onClick={() => handleLoadPreset("pret_loyalty")}
            title="Module 2: Customer Loyalty & Retention Analysis"
            className="text-left text-xs px-3 py-2 rounded-lg bg-dojo-green/50 hover:bg-dojo-green border border-dojo-teal/20 hover:border-dojo-teal/50 transition flex justify-between items-center cursor-pointer group"
          >
            <span className="font-semibold text-dojo-fresh group-hover:text-white transition-colors">Pret — Loyalty &amp; Retention</span>
            <span className="text-[9px] bg-dojo-darkgreen text-dojo-teal px-1.5 py-0.5 rounded font-mono font-bold" title="Module 2 Loyalty & Retention">M2</span>
          </button>
        </div>

        {/* Legend describing what key labels imply */}
        <div className="mt-3.5 space-y-1 block">
          <p className="text-[9px] text-[#C3F9EE]/50 font-bold uppercase tracking-wider">Module Legend Keys:</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] text-[#C3F9EE]/75 font-semibold font-mono">
            <span title="Module 1: Site Underperformance Diagnostic" className="truncate cursor-help">● M1: Underperformance</span>
            <span title="Module 2: Customer Loyalty & Frequency Analysis" className="truncate cursor-help">● M2: Customer Loyalty</span>
            <span title="Module 3: Campaign & Event Impact Analysis" className="truncate cursor-help">● M3: Campaign Impact</span>
            <span title="Module 4: Cross-Site Overlap & Cannibalisation" className="truncate cursor-help">● M4: Cross-Site Overlap</span>
          </div>
        </div>
      </div>

      {/* Analysis Modules Selector */}
      <div className="p-5 border-b border-dojo-green/45 flex-1 font-sans">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#C3F9EE] mb-3 flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-dojo-teal" />
          dbt Approved Analysis Modules
        </h3>
        
        <div className="space-y-2.5">
          {PRE_APPROVED_MODULES.map((module) => {
            const isSelected = module.id === activeModule;
            return (
              <button
                key={module.id}
                id={`module-btn-${module.id.toLowerCase()}`}
                onClick={() => {
                  setActiveModule(module.id);
                  if (onClearReport) onClearReport();
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? "bg-dojo-green border-dojo-teal shadow-md" 
                    : "bg-dojo-green/10 border-dojo-green/35 hover:bg-dojo-green/30 hover:border-dojo-teal/30 text-white/95"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className={`text-xs font-extrabold ${isSelected ? "text-dojo-teal" : "text-white"}`}>
                    {module.title}
                  </h4>
                  {isSelected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-dojo-teal mt-1 animate-pulse" />
                  )}
                </div>
                <p className="text-[11px] text-dojo-fresh/80 leading-normal mt-1 border-b border-dojo-green/20 pb-1.5">
                  {module.description}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  {module.dbtModels.map((dbt, idx) => (
                    <span key={idx} className="text-[9px] font-mono bg-dojo-darkgreen px-1.5 py-0.5 rounded text-dojo-teal/90 border border-dojo-green/30">
                      {dbt}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Parameter Control Panel */}
      <div className="p-5 border-b border-dojo-green/45 bg-dojo-green/10">
        <div className="flex items-center gap-2 mb-3">
          <Sliders className="w-4 h-4 text-dojo-teal" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#C3F9EE]">Active Parameters</h3>
        </div>

        <div className="space-y-3.5 text-xs font-sans">
          {/* Client Name */}
          <div>
            <label className="block text-dojo-fresh/85 mb-1 font-semibold">Client/Merchant Name</label>
            <input 
              id="input-client-name"
              type="text"
              value={params.clientName}
              onChange={(e) => handleParamChange("clientName", e.target.value)}
              placeholder="e.g. Dishoom London"
              className="w-full bg-dojo-darkgreen/60 rounded-lg border border-dojo-green px-3 py-2 text-white focus:outline-none focus:border-dojo-teal font-medium"
            />
          </div>

          {/* Merchant ID */}
          <div>
            <label className="block text-dojo-fresh/85 mb-1 font-semibold">Merchant ID (MID)</label>
            <input 
              id="input-merchant-id"
              type="text"
              value={params.merchantId}
              onChange={(e) => handleParamChange("merchantId", e.target.value)}
              placeholder="e.g. MID-901844"
              className="w-full bg-dojo-darkgreen/60 rounded-lg border border-dojo-green px-3 py-2 text-white focus:outline-none focus:border-dojo-teal font-mono"
            />
          </div>

          {/* Date range selection */}
          <div>
            <label className="block text-dojo-fresh/85 mb-1 font-semibold">Date Period Filter</label>
            <select
              id="select-date-range"
              value={params.dateRange}
              onChange={(e) => handleParamChange("dateRange", e.target.value)}
              className="w-full bg-dojo-darkgreen/60 rounded-lg border border-dojo-green px-2.5 py-2 text-white focus:outline-none focus:border-dojo-teal"
            >
              <option value="last_month" className="bg-dojo-darkgreen text-white">Last Month</option>
              <option value="last_quarter" className="bg-dojo-darkgreen text-white">Last Quarter</option>
              <option value="year_to_date" className="bg-dojo-darkgreen text-white">Year to Date (YTD)</option>
              <option value="last_year" className="bg-dojo-darkgreen text-white">Last Year (Full)</option>
            </select>
          </div>

          {/* Geographic Region selection */}
          <div>
            <label className="block text-dojo-fresh/85 mb-1 font-semibold">Region Selection</label>
            <select
              id="select-region"
              value={params.locationRegion}
              onChange={(e) => handleParamChange("locationRegion", e.target.value)}
              className="w-full bg-dojo-darkgreen/60 rounded-lg border border-dojo-green px-2.5 py-2 text-white focus:outline-none focus:border-dojo-teal"
            >
              <option value="London" className="bg-dojo-darkgreen text-white">London (Greater)</option>
              <option value="North West" className="bg-dojo-darkgreen text-white">North West (Manchester/Liverpool)</option>
              <option value="South West" className="bg-dojo-darkgreen text-white">South West (Bristol/Bath)</option>
              <option value="Midlands" className="bg-dojo-darkgreen text-white">Midlands (Birmingham)</option>
              <option value="Scotland" className="bg-dojo-darkgreen text-white">Scotland (Edinburgh/Glasgow)</option>
              <option value="UK Nationwide" className="bg-dojo-darkgreen text-white">UK Nationwide (All Aggregated)</option>
            </select>
          </div>

          {/* Module 1: Site Underperformance Diagnostic parameters */}
          {activeModule === AnalysisModuleType.SITE_UNDERPERFORMANCE && (
            <>
              <div>
                <label className="block text-dojo-fresh/85 mb-1 font-semibold font-sans">Comparison Benchmark</label>
                <select
                  id="select-comparison-benchmark"
                  value={params.comparisonBenchmark}
                  onChange={(e) => handleParamChange("comparisonBenchmark", e.target.value)}
                  className="w-full bg-dojo-darkgreen/60 rounded-lg border border-dojo-green px-2.5 py-2 text-white focus:outline-none focus:border-dojo-teal font-sans"
                >
                  <option value="other sites" className="bg-dojo-darkgreen">Other Sibling Sites</option>
                  <option value="sector average" className="bg-dojo-darkgreen">Sector Average Benchmark</option>
                  <option value="prior period" className="bg-dojo-darkgreen">Prior Period Baseline</option>
                </select>
              </div>
              <div>
                <label className="block text-dojo-fresh/85 mb-1 font-semibold font-sans">Lead Performance Metric</label>
                <select
                  id="select-lead-metric"
                  value={params.leadMetric}
                  onChange={(e) => handleParamChange("leadMetric", e.target.value)}
                  className="w-full bg-dojo-darkgreen/60 rounded-lg border border-dojo-green px-2.5 py-2 text-white focus:outline-none focus:border-dojo-teal font-sans"
                >
                  <option value="revenue" className="bg-dojo-darkgreen">Sales Revenue</option>
                  <option value="transactions" className="bg-dojo-darkgreen">Transaction Volume</option>
                  <option value="basket size" className="bg-dojo-darkgreen">Basket Size (AOV)</option>
                  <option value="frequency" className="bg-dojo-darkgreen">Visit Frequency</option>
                </select>
              </div>
            </>
          )}

          {/* Module 2: Customer Loyalty parameters */}
          {activeModule === AnalysisModuleType.CUSTOMER_LOYALTY && (
            <>
              <div>
                <label className="block text-dojo-fresh/85 mb-1 font-semibold font-sans">New vs Returning Split</label>
                <select
                  id="select-new-vs-returning"
                  value={params.newVsReturningSplit}
                  onChange={(e) => handleParamChange("newVsReturningSplit", e.target.value)}
                  className="w-full bg-dojo-darkgreen/60 rounded-lg border border-dojo-green px-2.5 py-2 text-white focus:outline-none focus:border-dojo-teal font-sans"
                >
                  <option value="yes" className="bg-dojo-darkgreen">Yes (Split cohorts)</option>
                  <option value="no" className="bg-dojo-darkgreen">No (Aggregate view)</option>
                </select>
              </div>
              <div>
                <label className="block text-dojo-fresh/85 mb-1 font-semibold font-sans">Target Frequency Cadence</label>
                <select
                  id="select-target-frequency"
                  value={params.targetFrequency}
                  onChange={(e) => handleParamChange("targetFrequency", e.target.value)}
                  className="w-full bg-dojo-darkgreen/60 rounded-lg border border-dojo-green px-2.5 py-2 text-white focus:outline-none focus:border-dojo-teal font-sans"
                >
                  <option value="visits per month" className="bg-dojo-darkgreen">Visits per Month</option>
                  <option value="visits per quarter" className="bg-dojo-darkgreen">Visits per Quarter</option>
                </select>
              </div>
            </>
          )}

          {/* Module 3: Campaign / Event Impact parameters */}
          {activeModule === AnalysisModuleType.CAMPAIGN_IMPACT && (
            <>
              <div>
                <label className="block text-dojo-fresh/85 mb-1 font-semibold font-sans">Campaign Operating Hours</label>
                <select
                  id="select-campaign-hours"
                  value={params.campaignHours}
                  onChange={(e) => handleParamChange("campaignHours", e.target.value)}
                  className="w-full bg-dojo-darkgreen/60 rounded-lg border border-dojo-green px-2.5 py-2 text-white focus:outline-none focus:border-dojo-teal font-sans"
                >
                  <option value="all day" className="bg-dojo-darkgreen">All-Day Operation</option>
                  <option value="post-3pm" className="bg-dojo-darkgreen">Post-3PM Hours</option>
                  <option value="lunch time" className="bg-dojo-darkgreen">Lunch Time Hours</option>
                </select>
              </div>
              <div>
                <label className="block text-dojo-fresh/85 mb-1 font-semibold font-sans">Comparison Control Period</label>
                <select
                  id="select-comparison-window"
                  value={params.comparisonWindow}
                  onChange={(e) => handleParamChange("comparisonWindow", e.target.value)}
                  className="w-full bg-dojo-darkgreen/60 rounded-lg border border-dojo-green px-2.5 py-2 text-white focus:outline-none focus:border-dojo-teal font-sans"
                >
                  <option value="same period prior month" className="bg-dojo-darkgreen">Same Period Prior Month</option>
                  <option value="same period prior year" className="bg-dojo-darkgreen">Same Period Prior Year</option>
                  <option value="non-campaign days" className="bg-dojo-darkgreen">Adjacent Non-Campaign Days</option>
                </select>
              </div>
              <div>
                <label className="block text-dojo-fresh/85 mb-1 font-semibold font-sans">Primary Lift Metric</label>
                <select
                  id="select-primary-metric"
                  value={params.primaryMetric}
                  onChange={(e) => handleParamChange("primaryMetric", e.target.value)}
                  className="w-full bg-dojo-darkgreen/60 rounded-lg border border-dojo-green px-2.5 py-2 text-white focus:outline-none focus:border-dojo-teal font-sans"
                >
                  <option value="revenue" className="bg-dojo-darkgreen">Sales Revenue GBP</option>
                  <option value="transaction volume" className="bg-dojo-darkgreen">Transaction Volume</option>
                  <option value="basket size" className="bg-dojo-darkgreen">Average Basket Ticket</option>
                </select>
              </div>
            </>
          )}

          {/* Module 4: Cannibalisation parameters */}
          {activeModule === AnalysisModuleType.CANNIBALISATION && (
            <>
              <div>
                <label className="block text-dojo-fresh/85 mb-1 font-semibold font-sans">Overlap Definition</label>
                <select
                  id="select-overlap-definition"
                  value={params.overlapDefinition}
                  onChange={(e) => handleParamChange("overlapDefinition", e.target.value)}
                  className="w-full bg-dojo-darkgreen/60 rounded-lg border border-dojo-green px-2.5 py-2 text-white focus:outline-none focus:border-dojo-teal font-sans"
                >
                  <option value="customers visiting more than one site in the period" className="bg-dojo-darkgreen">Visits Sibling Multi-Sites</option>
                </select>
              </div>
              <div>
                <label className="block text-dojo-fresh/85 mb-1 font-semibold font-sans">Include Visit Frequency</label>
                <select
                  id="select-include-frequency"
                  value={params.includeVisitFrequency}
                  onChange={(e) => handleParamChange("includeVisitFrequency", e.target.value)}
                  className="w-full bg-dojo-darkgreen/60 rounded-lg border border-dojo-green px-2.5 py-2 text-white focus:outline-none focus:border-dojo-teal font-sans"
                >
                  <option value="yes" className="bg-dojo-darkgreen">Yes (Breakdown per site)</option>
                  <option value="no" className="bg-dojo-darkgreen">No (Overlap percentage only)</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sanity Check Parameters Checklist bar */}
      <div className="p-5 bg-dojo-green bg-gradient-to-t from-dojo-darkgreen to-dojo-green text-xs font-sans">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#C3F9EE] mb-3.5 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-dojo-teal" />
          Audit &amp; Verification Checklist
        </h3>

        <div className="space-y-2">
          {/* Client Check */}
          <div className="flex items-center justify-between py-1 bg-dojo-darkgreen/40 px-2 rounded border border-dojo-green/30">
            <span className="text-dojo-fresh/80 text-[11px]">Merchant Client Identified</span>
            {isClientValid ? (
              <span className="flex items-center gap-1 text-dojo-teal font-extrabold font-mono text-[10px]">
                <CheckCircle className="w-3.5 h-3.5 text-dojo-teal" /> CONFIRMED
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-400 font-extrabold font-mono text-[10px]">
                <XCircle className="w-3.5 h-3.5 text-red-400" /> MISSING
              </span>
            )}
          </div>

          {/* Period Check */}
          <div className="flex items-center justify-between py-1 bg-dojo-darkgreen/40 px-2 rounded border border-dojo-green/30">
            <span className="text-dojo-fresh/80 text-[11px]">Date Filter Range Specified</span>
            {isDateValid ? (
              <span className="flex items-center gap-1 text-dojo-teal font-extrabold font-mono text-[10px]">
                <CheckCircle className="w-3.5 h-3.5 text-dojo-teal" /> SPECIFIED
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-200 font-extrabold font-mono text-[10px]">
                <XCircle className="w-3.5 h-3.5 text-red-400" /> MISSING
              </span>
            )}
          </div>

          {/* Dynamic Module Parameter Checks */}
          {activeModuleSchema.requiredParams.map(param => {
            if (param === "clientName" || param === "dateRange") return null;
            const value = params[param as keyof AnalysisParameters];
            const isParamValid = value && (Array.isArray(value) ? value.length > 0 : typeof value === "string" && value.trim().length > 0);
            const friendlyName = param
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, str => str.toUpperCase());

            return (
              <div key={param} className="flex items-center justify-between py-1 bg-dojo-darkgreen/40 px-2 rounded border border-dojo-green/30">
                <span className="text-dojo-fresh/80 text-[11px] truncate max-w-[160px]">{friendlyName} Defined</span>
                {isParamValid ? (
                  <span className="flex items-center gap-1 text-dojo-teal font-extrabold font-mono text-[10px]">
                    <CheckCircle className="w-3.5 h-3.5 text-dojo-teal" /> VERIFIED
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400 font-extrabold font-mono text-[10px]">
                    <XCircle className="w-3.5 h-3.5 text-red-400" /> MISSING
                  </span>
                )}
              </div>
            );
          })}

          {/* Total coherence validation info bar */}
          <div className="mt-3.5 pt-3 border-t border-dojo-green/30 text-[11px] text-dojo-fresh/75 leading-normal flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-dojo-teal shrink-0 mt-0.5" />
            <p>
              Analysis data requires strict parameter checks to prevent rendering null BigQuery arrays or empty cohorts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
