"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AskTideshiftProps {
  tokenId?: string;
  tokenSymbol?: string;
  tokenData?: string;
}

const TOKEN_PROMPTS = [
  { label: "Why migrate?", prompt: "Why should Sunrise migrate this token to Solana?" },
  { label: "Biggest risks?", prompt: "What are the biggest risks of migrating this token?" },
  { label: "Bridge strategy", prompt: "What bridge framework should be used and why?" },
  { label: "Explain demand", prompt: "Explain the demand evidence for this token" },
];

const DISCOVERY_PROMPTS = [
  { label: "Top priorities?", prompt: "Which tokens should Sunrise prioritize for migration and why?" },
  { label: "Strongest signals?", prompt: "What are the strongest demand signals across all candidates?" },
  { label: "Compare top 3", prompt: "Compare the top 3 migration candidates side by side" },
  { label: "Low risk picks?", prompt: "Which tokens have the lowest risk and highest demand?" },
];

export function AskTideshift({ tokenId, tokenSymbol, tokenData }: AskTideshiftProps) {
  const isDiscovery = !tokenId;
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const SUGGESTED_PROMPTS = isDiscovery ? DISCOVERY_PROMPTS : TOKEN_PROMPTS;

  const transport = useMemo(
    () => new DefaultChatTransport({
      api: "/api/ai/chat",
      body: tokenId ? { tokenId, ...(tokenData ? { tokenData } : {}) } : {},
    }),
    [tokenId, tokenData]
  );

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport,
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (text: string) => {
    if (!text.trim() || isLoading) return;
    sendMessage({ text: text.trim() });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(input);
    }
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg hover:opacity-90 transition-opacity"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Ask Tideshift</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] h-[500px] flex flex-col rounded-xl border border-purple-500/20 shadow-2xl overflow-hidden bg-background max-sm:w-[calc(100vw-2rem)] max-sm:h-[calc(100vh-6rem)] max-sm:bottom-4 max-sm:right-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-purple-500/20 bg-gradient-to-r from-purple-500 to-cyan-500">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-white" />
                <span className="text-sm font-semibold text-white">Ask Tideshift</span>
                <span className="text-[10px] text-white/70 bg-white/15 px-1.5 py-0.5 rounded">
                  {isDiscovery ? "Discovery" : tokenSymbol}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center gap-4 pt-6">
                  <Sparkles className="h-8 w-8 text-primary/40" />
                  <p className="text-xs text-muted-foreground text-center max-w-[280px]">
                    {isDiscovery
                      ? "Ask about migration candidates, demand signals, prioritization, or compare tokens across the discovery pipeline."
                      : `Ask about ${tokenSymbol}'s migration potential, demand signals, bridge strategy, or compare with other tokens.`}
                  </p>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {SUGGESTED_PROMPTS.map((sp) => (
                      <button
                        key={sp.label}
                        onClick={() => handleSubmit(sp.prompt)}
                        className="text-left px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-colors"
                      >
                        {sp.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-primary/15 text-foreground"
                        : "bg-white/[0.03] text-muted-foreground"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-invert prose-sm max-w-none [&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_strong]:text-foreground [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-2 [&_h2]:mb-1 [&_ul]:my-1 [&_li]:mb-0.5">
                        <ReactMarkdown>
                          {msg.parts
                            .filter((p): p is { type: "text"; text: string } => p.type === "text")
                            .map((p) => p.text)
                            .join("")}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span>
                        {msg.parts
                          .filter((p): p is { type: "text"; text: string } => p.type === "text")
                          .map((p) => p.text)
                          .join("")}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && !(messages[messages.length - 1]?.role === "assistant" && messages[messages.length - 1]?.parts.some((p) => p.type === "text" && "text" in p && (p as { type: "text"; text: string }).text.length > 0)) && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.03] rounded-lg px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/5 rounded-lg px-3 py-2">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>AI unavailable. Check your API key.</span>
                  <button
                    onClick={() => setMessages([])}
                    className="ml-auto text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isDiscovery ? "Ask about migration candidates..." : `Ask about ${tokenSymbol}...`}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30"
                  disabled={isLoading}
                />
                <Button
                  size="sm"
                  onClick={() => handleSubmit(input)}
                  disabled={!input.trim() || isLoading}
                  className="h-9 w-9 p-0 bg-primary/20 hover:bg-primary/30 text-primary"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
