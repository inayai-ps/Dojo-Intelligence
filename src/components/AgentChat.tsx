import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  MessageSquare, 
  Sparkles, 
  User, 
  Check, 
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { ChatMessage, AnalysisParameters } from "../types.js";

interface AgentChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  params: AnalysisParameters;
  onApplyExtractedParams: (extracted: Partial<AnalysisParameters>) => void;
}

const QUICK_PROMPTS = [
  {
    label: "Explore Loyalty Trends",
    prompt: "I'd like to analyse visitor loyalty and repeat shopper intervals for our client Dishoom London."
  },
  {
    label: "Analyse Peak Weekend Hours",
    prompt: "Show me a peak sales day and time shift performance breakdown for Pret A Manger nationwide."
  },
  {
    label: "Compare Local Competitors",
    prompt: "Let's run a competitive index benchmark analysis for Blacklock Manchester in Fine Dining region South West."
  },
  {
    label: "What's in Scope?",
    prompt: "What transactional metrics and BigQuery dbt columns do you have permission to query? Do you have EPOS item data?"
  }
];

export default function AgentChat({
  messages,
  onSendMessage,
  isLoading,
  params,
  onApplyExtractedParams,
}: AgentChatProps) {
  const [inputVal, setInputVal] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onSendMessage(inputVal.trim());
    setInputVal("");
  };

  const handleQuickPromptClick = (promptText: string) => {
    if (isLoading) return;
    onSendMessage(promptText);
  };

  // Find the most recent message with extracted parameters to show as a handy review bar
  const lastMsgWithParams = [...messages]
    .reverse()
    .find(m => m.extractedParams && Object.keys(m.extractedParams).length > 0);

  const hasNewExtractions = lastMsgWithParams?.extractedParams && 
    Object.keys(lastMsgWithParams.extractedParams).some(key => {
      const typedKey = key as keyof AnalysisParameters;
      const val = lastMsgWithParams.extractedParams?.[typedKey];
      return val && params[typedKey] !== val;
    });

  return (
    <div id="dojo-agent-chat" className="flex flex-col h-full bg-[#F1F1EC] border-r border-dojo-mist">
      {/* Agent Chat Header */}
      <div className="px-6 py-4 border-b border-dojo-mist bg-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-dojo-green flex items-center justify-center text-dojo-teal">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-dojo-teal border-2 border-white" />
          </div>
          <div className="font-sans">
            <h3 className="text-xs font-bold text-dojo-black flex items-center gap-1.5 uppercase tracking-wide">
              Dojo Intelligence Engine
              <span className="text-[9px] bg-dojo-fresh text-dojo-green font-extrabold px-1.5 py-0.5 rounded tracking-wider">Analyst</span>
            </h3>
            <p className="text-[10px] text-dojo-stone font-semibold uppercase tracking-wider">Ready to assist you</p>
          </div>
        </div>
      </div>

      {/* Messages Console */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F1F1EC]">
        {messages.map((msg) => {
          const isAssistant = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 max-w-[85%] ${
                isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"
              }`}
            >
              {/* Avatar Icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                isAssistant 
                  ? "bg-white border border-dojo-mist text-dojo-green" 
                  : "bg-dojo-green text-[#3CEAC7]"
              }`}>
                {isAssistant ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1.5 font-sans">
                <div className={`p-4 rounded-xl text-xs leading-relaxed shadow-xs ${
                  isAssistant 
                    ? "bg-white border border-dojo-mist text-dojo-black" 
                    : "bg-dojo-green text-white font-medium"
                }`}>
                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* Visual clue of parameter extraction */}
                  {isAssistant && msg.extractedParams && Object.keys(msg.extractedParams).length > 0 && (
                    <div className="mt-3.5 pt-3.5 border-t border-dojo-mist text-[10px] text-dojo-stone">
                      <div className="font-bold text-dojo-green uppercase tracking-wider flex items-center gap-1 mb-1.5">
                        <Check className="w-3.5 h-3.5 text-dojo-teal" />
                        Intelligence Extractions
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(msg.extractedParams).map(([k, v]) => {
                          if (!v) return null;
                          return (
                            <span key={k} className="bg-dojo-white px-2 py-0.5 rounded border border-dojo-mist text-dojo-black font-mono text-[9px]">
                              {k}: <strong className="text-dojo-green font-sans font-semibold">{v}</strong>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <div className={`text-[9px] font-mono text-dojo-stone uppercase ${isAssistant ? "text-left" : "text-right"}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3.5 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-lg bg-white border border-dojo-mist text-dojo-teal flex items-center justify-center shrink-0 animate-spin">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div className="p-4 bg-white border border-dojo-mist rounded-xl text-xs text-dojo-stone italic font-sans">
              Gathering your data...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Parameter Alerts */}
      {hasNewExtractions && lastMsgWithParams?.extractedParams && (
        <div className="px-6 py-2.5 bg-dojo-fresh border-t border-dojo-mist flex items-center justify-between text-xs text-dojo-darkgreen font-sans animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-dojo-green shrink-0 animate-bounce" />
            <p className="font-bold uppercase tracking-wide text-[10px]">
              New details found. Update your workspace?
            </p>
          </div>
          <button
            id="apply-extractions-btn"
            onClick={() => onApplyExtractedParams(lastMsgWithParams.extractedParams!)}
            className="px-2.5 py-1 rounded bg-dojo-green hover:bg-dojo-darkgreen transition text-[9px] font-extrabold text-[#3CEAC7] shrink-0 font-mono shadow-sm cursor-pointer uppercase tracking-wider"
          >
            Apply to Workspace
          </button>
        </div>
      )}

      {/* Input / Form section */}
      <div className="p-6 border-t border-dojo-mist bg-white">
        {/* Quick prompt templates custom menu */}
        <div className="mb-4" ref={dropdownRef}>
          <span className="text-[10px] font-extrabold text-dojo-stone uppercase tracking-widest mb-1.5 block">
            Quick Prompt Assist
          </span>
          <div className="relative">
            <button
              id="quick-prompt-menu-btn"
              type="button"
              disabled={isLoading}
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-full text-xs font-semibold px-4 py-2.5 rounded-xl bg-dojo-white hover:bg-dojo-fresh border border-dojo-mist text-dojo-black transition-all disabled:opacity-40 cursor-pointer shadow-xs font-sans text-left flex items-center justify-between outline-none focus:border-dojo-green focus:ring-1 focus:ring-dojo-green"
            >
              <span className="text-dojo-stone font-medium">Select a quick template...</span>
              <svg className={`h-4 w-4 text-dojo-stone transition-transform duration-250 ${menuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <div 
                id="quick-prompt-dropdown-panel"
                className="absolute z-50 bottom-full mb-2 left-0 right-0 max-h-60 overflow-y-auto bg-white border border-dojo-mist rounded-xl shadow-lg font-sans divide-y divide-dojo-mist animate-fadeIn"
              >
                {QUICK_PROMPTS.map((qp, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      handleQuickPromptClick(qp.prompt);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-dojo-white text-xs font-semibold text-dojo-black transition-colors block"
                  >
                    <div className="text-dojo-green text-[10px] uppercase tracking-wider mb-0.5 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-dojo-teal" />
                      {qp.label}
                    </div>
                    <div className="text-[11px] text-dojo-stone truncate font-medium">
                      {qp.prompt}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <input
            id="chat-message-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isLoading}
            placeholder="Type structured requests (e.g. 'Let's check Blacklock Restaurant in London' or similar)..."
            className="w-full bg-[#F1F1EC] border border-dojo-mist focus:border-dojo-green focus:bg-white rounded-xl pl-4 pr-12 py-3.5 text-xs text-dojo-black focus:outline-none transition-all placeholder:text-dojo-stone font-semibold shadow-xs"
          />
          <button
            id="send-message-btn"
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-dojo-green hover:bg-dojo-darkgreen disabled:opacity-30 disabled:hover:bg-dojo-green text-white flex items-center justify-center transition shadow-md shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-[#3CEAC7]" />
          </button>
        </form>
      </div>
    </div>
  );
}
