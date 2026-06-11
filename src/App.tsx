import { useState } from "react";
import { 
  AnalysisModuleType, 
  AnalysisParameters, 
  ChatMessage, 
  AnalysisOutput,
  PRE_APPROVED_MODULES
} from "./types.js";
import Sidebar from "./components/Sidebar.js";
import AgentChat from "./components/AgentChat.js";
import AnalysisReport from "./components/AnalysisReport.js";
import SlidesDeckModal from "./components/SlidesDeckModal.js";
import { HelpCircle, Sparkles, BookOpen } from "lucide-react";

export default function App() {
  const [activeModule, setActiveModule] = useState<AnalysisModuleType>(
    AnalysisModuleType.SITE_UNDERPERFORMANCE
  );

  const [params, setParams] = useState<AnalysisParameters>({
    clientName: "Dishoom London",
    merchantId: "MID-8032148",
    dateRange: "last_quarter",
    locationRegion: "London",
    competitorSector: "Casual Dining",
    selectedMetrics: ["Sales Revenue Impact", "Transaction Count Shift"],
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

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-msg",
      role: "assistant",
      content: "Hi! I'm here to help you dive into Dojo payments data. I can analyze underperforming sites, customer loyalty, campaign impact, or cross-site overlap.\n\nFeel free to ask a question to get started, like:\n\"How did our post-[3pm] meal deal in London perform last quarter?\"",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [report, setReport] = useState<AnalysisOutput | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [isDeckOpen, setIsDeckOpen] = useState(false);

  // Handle conversational chat submission
  const handleSendMessage = async (text: string) => {
    try {
      setChatLoading(true);

      // Append new human bubble to local messages first
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages(prev => [...prev, userMsg]);

      // Call server end point
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!res.ok) {
        throw new Error("Chat assistant endpoint failed to respond with code " + res.status);
      }

      const data = await res.json();
      
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply || "No reply generated. Please specify parameters.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        extractedParams: data.extractedParams || undefined
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (e: any) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I had an issue connecting to the Dojo telemetry dbt engines. Let's refine the criteria and try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Merge suggested parameters derived from conversation to parameters panel
  const handleApplyExtractedParams = (extracted: Partial<AnalysisParameters>) => {
    setParams(prev => {
      const updated = { ...prev };
      if (extracted.clientName) updated.clientName = extracted.clientName;
      if (extracted.merchantId) updated.merchantId = extracted.merchantId;
      if (extracted.dateRange) updated.dateRange = extracted.dateRange;
      if (extracted.locationRegion) updated.locationRegion = extracted.locationRegion;
      if (extracted.competitorSector) updated.competitorSector = extracted.competitorSector;
      
      // Dynamic V1 parameters
      if (extracted.comparisonBenchmark) updated.comparisonBenchmark = extracted.comparisonBenchmark;
      if (extracted.leadMetric) updated.leadMetric = extracted.leadMetric;
      if (extracted.newVsReturningSplit) updated.newVsReturningSplit = extracted.newVsReturningSplit;
      if (extracted.targetFrequency) updated.targetFrequency = extracted.targetFrequency;
      if (extracted.campaignHours) updated.campaignHours = extracted.campaignHours;
      if (extracted.comparisonWindow) updated.comparisonWindow = extracted.comparisonWindow;
      if (extracted.primaryMetric) updated.primaryMetric = extracted.primaryMetric;
      if (extracted.overlapDefinition) updated.overlapDefinition = extracted.overlapDefinition;
      if (extracted.includeVisitFrequency) updated.includeVisitFrequency = extracted.includeVisitFrequency;
      return updated;
    });

    // Notify user with clear logs
    setMessages(prev => [
      ...prev,
      {
        id: `applied-${Date.now()}`,
        role: "assistant",
        content: `Parameters applied! Workspace updated with: ${extracted.clientName ? `Client: ${extracted.clientName} ` : ""}${extracted.campaignHours ? `Hours: ${extracted.campaignHours} ` : ""}${extracted.primaryMetric ? `Metric: ${extracted.primaryMetric} ` : ""}. Ready to generate report.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Compile active report from parameters
  const handleGenerateReport = async () => {
    try {
      setReportLoading(true);
      
      const res = await fetch("/api/gemini/generate-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: params.clientName,
          merchantId: params.merchantId,
          moduleType: activeModule,
          dateRange: params.dateRange,
          locationRegion: params.locationRegion,
          competitorSector: params.competitorSector,
          selectedMetrics: params.selectedMetrics,
          // Dynamic V1 parameters explicitly forwarded
          comparisonBenchmark: params.comparisonBenchmark,
          leadMetric: params.leadMetric,
          newVsReturningSplit: params.newVsReturningSplit,
          targetFrequency: params.targetFrequency,
          campaignHours: params.campaignHours,
          comparisonWindow: params.comparisonWindow,
          primaryMetric: params.primaryMetric,
          overlapDefinition: params.overlapDefinition,
          includeVisitFrequency: params.includeVisitFrequency
        })
      });

      if (!res.ok) {
        throw new Error("Report model compilation failed.");
      }

      const generatedReport = await res.json();
      setReport(generatedReport);

      // Notify in chat with appropriate metadata Stating
      setMessages(prev => [
        ...prev,
        {
          id: `gen-${Date.now()}`,
          role: "assistant",
          content: `Validated analysis built successfully! I plotted monthly volumes and assembled the ready-to-copy client-ready narration regarding ${params.clientName} for the ${params.dateRange.replace("_", " ")} period in ${params.locationRegion}. \n\nYou can review and copy the full output in the Workspace on the right. What adjustments would you like to make next?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          id: `gen-err-${Date.now()}`,
          role: "assistant",
          content: "Failed to compile the dbt metrics. Please ensure all parameter checks are fulfilled first.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setReportLoading(false);
    }
  };

  // Parameter Validation Checks
  const activeModuleSchema = PRE_APPROVED_MODULES.find(m => m.id === activeModule) || PRE_APPROVED_MODULES[0];
  const missingFields: string[] = [];

  activeModuleSchema.requiredParams.forEach(param => {
    const value = params[param as keyof AnalysisParameters];
    if (!value || (typeof value === "string" && value.toString().trim().length === 0)) {
      missingFields.push(param);
    }
  });

  const isValid = missingFields.length === 0;

  return (
    <div id="app-root-container" className="flex h-screen w-screen bg-[#F8FAFC] text-[#1E293B] overflow-hidden font-sans">
      
      {/* 1. Symmetrical left sidebar layout */}
      <div className="w-80 shrink-0 h-full hidden md:block">
        <Sidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          params={params}
          setParams={setParams}
          onClearReport={() => setReport(null)}
        />
      </div>

      {/* Main split application console */}
      <div className="flex-1 h-full flex flex-col md:flex-row overflow-hidden">
        
        {/* 2. Interactive assistant chat console (Left Column of main panel) */}
        <div className="w-full md:w-1/2 h-full flex flex-col border-r border-[#E2E8F0]">
          <AgentChat
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={chatLoading}
            params={params}
            onApplyExtractedParams={handleApplyExtractedParams}
          />
        </div>

        {/* 3. Output analysis reports workspace (Right Column of main panel) */}
        <div className="w-full md:w-1/2 h-full flex flex-col overflow-hidden bg-[#F8FAFC]">
          
          {/* Quick tips bar */}
          <div className="px-6 py-2.5 bg-white border-b border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B] font-medium shrink-0">
            <span className="flex items-center gap-1.5 uppercase font-mono tracking-wider font-bold text-[#0F172A]">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" /> dbt Data Access
            </span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 
              <span>Active BigQuery Partition: v3.5.2</span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <AnalysisReport
              report={report}
              isGenerating={reportLoading}
              onGenerate={handleGenerateReport}
              isValid={isValid}
              missingFields={missingFields}
              onOpenDeck={() => setIsDeckOpen(true)}
            />
          </div>

        </div>

      </div>

      <SlidesDeckModal
        isOpen={isDeckOpen}
        onClose={() => setIsDeckOpen(false)}
        report={report}
      />

    </div>
  );
}
