import React, { useState } from "react";
import { toast } from "sonner";
import { Sparkles, X, Send, Copy, Wand2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import api from "../lib/api";

const SECTIONS = [
  { key: "welcome", label: "Welcome message", applies: true },
  { key: "goodbye", label: "Goodbye message", applies: true },
  { key: "moderation", label: "Moderation DMs", applies: true },
  { key: "automod", label: "AutoMod rule (creates new)", applies: true },
  { key: "verification", label: "Verification", applies: true },
  { key: "raid", label: "Raid protection", applies: true },
  { key: "starboard", label: "Starboard", applies: true },
  { key: "tickets", label: "Ticket panel", applies: false },
  { key: "announcement", label: "Announcement", applies: false },
];

/** Floating AI assistant that suggests configuration for any section, and can push it directly. */
export default function AiAssistant({ gid }) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState("welcome");
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [applying, setApplying] = useState(null); // index of history being applied
  const [history, setHistory] = useState([]);

  const ask = async () => {
    if (!prompt.trim()) return;
    setBusy(true);
    try {
      const res = await api.aiSetup(gid, { section, prompt });
      setHistory((h) => [{ prompt, section, applied: false, ...res }, ...h].slice(0, 6));
      setPrompt("");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "AI helper failed");
    } finally {
      setBusy(false);
    }
  };

  const apply = async (i) => {
    const h = history[i];
    if (!h?.config) { toast.error("No config to apply"); return; }
    setApplying(i);
    try {
      await api.aiApply(gid, { section: h.section, config: h.config });
      setHistory((prev) => prev.map((row, idx) => (idx === i ? { ...row, applied: true } : row)));
      toast.success(`Applied to ${h.section}`);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Apply failed");
    } finally {
      setApplying(null);
    }
  };

  const canApply = (h) => h?.config && SECTIONS.find((s) => s.key === h.section)?.applies;

  return (
    <>
      <button
        data-testid="ai-assistant-fab"
        onClick={() => setOpen(true)}
        className="fixed z-40 bottom-6 right-6 h-14 w-14 rounded-full bg-cyan-400 hover:bg-cyan-300 text-[#070A10] shadow-2xl grid place-items-center transition-transform hover:scale-105"
        aria-label="Open AI setup assistant"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-end p-0 sm:p-6 pointer-events-none">
          <div className="pointer-events-auto w-full sm:w-[440px] max-h-[85vh] rounded-t-2xl sm:rounded-2xl bg-[#0B0F17] border border-slate-800/80 shadow-2xl flex flex-col">
            <div className="px-4 py-3 border-b border-slate-800/60 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <div className="flex-1">
                <div className="font-display font-bold text-slate-100">Setup assistant</div>
                <div className="text-[11px] text-slate-500">Describe what you want. I'll write it and apply it in one click.</div>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-4 space-y-2 border-b border-slate-800/60">
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger data-testid="ai-section-select"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SECTIONS.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Textarea
                data-testid="ai-prompt"
                rows={3}
                placeholder="e.g. Write a welcoming greeting for 1GC RIVALS, mention the #rules channel and ranked matchmaking."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="flex justify-end">
                <Button data-testid="ai-send" onClick={ask} disabled={busy} className="bg-cyan-400 hover:bg-cyan-300 text-[#070A10] font-semibold">
                  <Send className="w-4 h-4 mr-1" /> {busy ? "Thinking…" : "Ask"}
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {history.length === 0 && (
                <div className="text-xs text-slate-500 font-mono">
                  Tip: choose a section, describe what you want, and I'll produce ready-to-apply config with a one-click Apply button.
                </div>
              )}
              {history.map((h, i) => (
                <div key={i} className="space-y-2">
                  <div className="text-xs text-slate-500 font-mono">you asked · {h.section}</div>
                  <div className="text-sm text-slate-300 whitespace-pre-wrap">{h.prompt}</div>
                  <div className="text-xs text-slate-500 font-mono mt-2">assistant</div>
                  <div className="text-sm text-slate-200 whitespace-pre-wrap">{h.text}</div>
                  {h.config && (
                    <div className="rounded-lg bg-[#05080E] border border-slate-800 p-3 relative">
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          className="text-slate-500 hover:text-cyan-300 p-1"
                          onClick={() => { navigator.clipboard.writeText(JSON.stringify(h.config, null, 2)); toast.success("Copied JSON"); }}
                          title="Copy JSON"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <pre className="text-[11px] font-mono text-cyan-300 whitespace-pre-wrap break-words">{JSON.stringify(h.config, null, 2)}</pre>
                      {canApply(h) ? (
                        <Button
                          data-testid={`ai-apply-${i}`}
                          size="sm"
                          onClick={() => apply(i)}
                          disabled={applying === i || h.applied}
                          className={`mt-3 w-full font-semibold ${h.applied ? "bg-emerald-500 text-[#070A10]" : "bg-cyan-400 hover:bg-cyan-300 text-[#070A10]"}`}
                        >
                          {h.applied ? (<><Check className="w-4 h-4 mr-1" /> Applied</>) : (<><Wand2 className="w-4 h-4 mr-1" /> {applying === i ? "Applying…" : `Apply to ${h.section}`}</>)}
                        </Button>
                      ) : (
                        <div className="mt-3 text-[10px] font-mono text-slate-500">
                          One-click apply isn't supported for this section yet — copy the JSON and paste into the relevant page.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
