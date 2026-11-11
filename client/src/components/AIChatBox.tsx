import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Globe,
  Loader2,
  Mic,
  MicOff,
  Send,
  Sparkles,
  User,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIChatBoxProps = {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  height?: string | number;
  emptyStateMessage?: string;
  suggestedPrompts?: string[];
  language?: "en" | "hi";
  onLanguageChange?: (lang: "en" | "hi") => void;
};

export function AIChatBox({
  messages,
  onSendMessage,
  isLoading = false,
  placeholder,
  className,
  height = "600px",
  emptyStateMessage = "Namaste. I am Dhenu, your agricultural and conscious commerce guide.",
  suggestedPrompts,
  language = "en",
  onLanguageChange,
}: AIChatBoxProps) {
  const [input, setInput] = useState("");
  const [activeLang, setActiveLang] = useState<"en" | "hi">(language);
  const [isListening, setIsListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const displayMessages = messages.filter((msg) => msg.role !== "system");

  // Keep language in sync with prop
  useEffect(() => {
    setActiveLang(language);
  }, [language]);

  const toggleLanguage = (newLang: "en" | "hi") => {
    setActiveLang(newLang);
    onLanguageChange?.(newLang);
    toast.info(newLang === "hi" ? "भाषा बदली: हिंदी (Hindi)" : "Language set: English");
  };

  // Setup Web Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = activeLang === "hi" ? "hi-IN" : "en-IN";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
            toast.success("Voice captured.");
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("[Voice STT] Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeLang]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error("Voice input is supported in Chrome, Edge, and Safari.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = activeLang === "hi" ? "hi-IN" : "en-IN";
        recognitionRef.current.start();
        setIsListening(true);
        toast.info(
          activeLang === "hi"
            ? "सुन रहा हूँ... बोलिए (Listening in Hindi)"
            : "Listening... speak now"
        );
      } catch (err) {
        console.warn("[Voice STT] Could not start speech recognition:", err);
        setIsListening(false);
      }
    }
  };

  const handleSpeak = (text: string, index: number) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      toast.error("Speech synthesis is not supported on this browser.");
      return;
    }

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for cleaner voice narration
    const cleanText = text
      .replace(/[#*_`~[\]]/g, "")
      .replace(/\(http[^)]+\)/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = activeLang === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 1.0;

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLDivElement;

    if (viewport) {
      requestAnimationFrame(() => {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    onSendMessage(trimmedInput);
    setInput("");
    scrollToBottom();
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const defaultPlaceholder =
    activeLang === "hi"
      ? "धनु से पूछें... जैसे 'बिलोना घी के फायदे' या 'फसल का उपचार'..."
      : "Ask Dhenu... e.g. 'Add 1 Bilona Ghee to my basket' or 'Feed for cows'...";

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col bg-card text-card-foreground rounded-xl border border-[#dce5d8] shadow-sm overflow-hidden",
        className
      )}
      style={{ height }}
    >
      {/* Assistant Control Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#e2eade] bg-[#f8fbf5] text-xs">
        <div className="flex items-center gap-1.5 text-[#30573c] font-medium">
          <Sparkles className="size-3.5 text-[#356142]" />
          <span>Dhenu Intelligence</span>
          <span className="text-[10px] bg-[#e1eee0] text-[#2b5637] px-2 py-0.5 rounded-full font-bold ml-1">
            Grounded & Safe
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollAreaRef} className="flex-1 overflow-hidden bg-[#faf9f4]">
        {displayMessages.length === 0 ? (
          <div className="flex h-full flex-col p-4">
            <div className="flex flex-1 flex-col items-center justify-center gap-5 text-muted-foreground text-center">
              <div className="size-12 rounded-full bg-[#e3eedf] flex items-center justify-center text-[#355b3f]">
                <Sparkles className="size-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-[#2a4d34] mb-1">
                  Namaste, I am Dhenu
                </h4>
                <p className="text-xs text-[#708272] max-w-sm">{emptyStateMessage}</p>
              </div>

              {suggestedPrompts && suggestedPrompts.length > 0 && (
                <div className="flex max-w-md flex-wrap justify-center gap-2 mt-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => onSendMessage(prompt)}
                      disabled={isLoading}
                      className="rounded-full border border-[#d4dfcf] bg-white px-3.5 py-1.5 text-xs text-[#39563f] transition-all hover:bg-[#ebf3e7] hover:border-[#adc4a7] shadow-2xs disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="flex flex-col space-y-3.5 p-4">
              {displayMessages.map((message, index) => {
                const isAssistant = message.role === "assistant";
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-2.5",
                      isAssistant ? "justify-start items-start" : "justify-end items-start"
                    )}
                  >
                    {isAssistant && (
                      <div className="size-7 shrink-0 mt-0.5 rounded-full bg-[#dbe8d6] flex items-center justify-center text-[#2d5438]">
                        <Sparkles className="size-3.5" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs",
                        isAssistant
                          ? "bg-white text-[#2a3c2c] border border-[#e1e7dc]"
                          : "bg-[#315a3d] text-[#fbfaf6]"
                      )}
                    >
                      {isAssistant ? (
                        <div>
                          <div className="prose prose-xs max-w-none text-[#2d4030]">
                            <Streamdown>{message.content}</Streamdown>
                          </div>
                          {/* Audio narration button */}
                          <div className="mt-2 pt-1.5 border-t border-[#edf2ea] flex items-center justify-between text-[10px] text-[#788a79]">
                            <button
                              type="button"
                              onClick={() => handleSpeak(message.content, index)}
                              className="inline-flex items-center gap-1 hover:text-[#2d5236] transition-colors"
                              title="Listen to this advice"
                            >
                              {speakingIndex === index ? (
                                <>
                                  <VolumeX className="size-3 text-[#b4593e]" />
                                  <span className="text-[#b4593e]">Stop speaking</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="size-3" />
                                  <span>Listen (बोलकर सुनें)</span>
                                </>
                              )}
                            </button>
                            <span className="text-[9px] opacity-60">Verified Agriculture</span>
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>

                    {!isAssistant && (
                      <div className="size-7 shrink-0 mt-0.5 rounded-full bg-[#e3eedf] flex items-center justify-center text-[#355b3f]">
                        <User className="size-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="size-7 shrink-0 mt-0.5 rounded-full bg-[#dbe8d6] flex items-center justify-center text-[#2d5438]">
                    <Sparkles className="size-3.5" />
                  </div>
                  <div className="rounded-2xl bg-white border border-[#e1e7dc] px-4 py-3 text-xs text-[#718473] flex items-center gap-2">
                    <Loader2 className="size-3.5 animate-spin text-[#315a3d]" />
                    <span>
                      {activeLang === "hi"
                        ? "धनु उत्तर तैयार कर रही हैं…"
                        : "Dhenu is searching the living catalog…"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Input Form with Voice STT & Send */}
      <form
        ref={inputAreaRef}
        onSubmit={handleSubmit}
        className="flex gap-2 p-3 border-t border-[#e2e9df] bg-white items-end"
      >
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || defaultPlaceholder}
          className="flex-1 max-h-24 resize-none min-h-[38px] text-xs border-[#d7e0d3] focus-visible:ring-[#315a3d] rounded-xl py-2"
          rows={1}
        />

        {/* Microphone Voice Button */}
        <Button
          type="button"
          size="icon"
          onClick={toggleVoiceInput}
          className={cn(
            "shrink-0 h-[38px] w-[38px] rounded-xl transition-all border",
            isListening
              ? "bg-[#b34832] text-white border-[#b34832] animate-pulse"
              : "bg-[#f2f6ee] text-[#4d6b51] border-[#d4dfcf] hover:bg-[#e4ede0]"
          )}
          title={isListening ? "Stop listening" : "Speak with your microphone"}
          aria-label="Voice input"
        >
          {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
        </Button>

        {/* Send Button */}
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading}
          className="shrink-0 h-[38px] w-[38px] rounded-xl bg-[#315a3d] hover:bg-[#254830] text-white disabled:opacity-40"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
