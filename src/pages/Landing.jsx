import React from "react";
import { Link } from "react-router-dom";
import {
  Shield, Activity, MessageSquare, Bot, Radar, Cog, Sparkles, LockKeyhole,
  Terminal, ArrowRight, Zap, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Feature = ({ icon: Icon, title, desc, testid }) => (
  <div data-testid={testid} className="card-obsidian rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-200">
    <div className="w-11 h-11 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center mb-4">
      <Icon className="w-5 h-5 text-cyan-300" />
    </div>
    <h3 className="font-display text-lg font-bold text-slate-100 mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="border-l-2 border-cyan-500/40 pl-3">
    <div className="text-xs font-mono uppercase tracking-widest text-slate-500">{label}</div>
    <div className="text-xl font-display font-bold text-slate-100">{value}</div>
  </div>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#070A10] text-slate-100">
      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-[#070A10]/70 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-400 to-emerald-500 grid place-items-center font-black text-[#070A10]">Æ</div>
            <span className="font-display font-extrabold text-lg tracking-wide">AETHERIS</span>
            <span className="hidden sm:inline text-[10px] font-mono uppercase text-slate-500 tracking-widest ml-1">// v0.1</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#modules" className="hover:text-cyan-300">Modules</a>
            <a href="#automod" className="hover:text-cyan-300">AutoMod</a>
            <a href="#tickets" className="hover:text-cyan-300">Tickets</a>
            <a href="#faq" className="hover:text-cyan-300">FAQ</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/servers">
              <Button data-testid="nav-dashboard-btn" variant="ghost" size="sm" className="text-slate-300 hover:text-cyan-300">Control Deck</Button>
            </Link>
            <a href="https://discord.com/api/oauth2/authorize?permissions=8&scope=bot%20applications.commands" target="_blank" rel="noreferrer">
              <Button data-testid="nav-add-btn" size="sm" className="bg-cyan-400 hover:bg-cyan-300 text-[#070A10] font-semibold">Add to Discord</Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-60" />
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-28 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-xs font-mono uppercase tracking-widest text-cyan-300 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Operational · Bot Online
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight text-glow">
              Tactical<br/>
              Discord<br/>
              <span className="text-cyan-300">Infrastructure.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-400 max-w-xl leading-relaxed">
              A serious, deeply-configurable command deck for moderation, AutoMod, tickets, and server automation. No XP grinds. No filler. Just a control system for admins who care.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://discord.com/api/oauth2/authorize?permissions=8&scope=bot%20applications.commands" target="_blank" rel="noreferrer">
                <Button data-testid="hero-add-btn" size="lg" className="bg-cyan-400 hover:bg-cyan-300 text-[#070A10] font-semibold glow-cyan">
                  Add to Discord <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <Link to="/servers">
                <Button data-testid="hero-dashboard-btn" size="lg" variant="outline" className="border-slate-700 hover:border-cyan-500/60 hover:text-cyan-300">
                  Launch Control Deck
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              <Stat label="Modules" value="12+" />
              <Stat label="AutoMod Rules" value="14" />
              <Stat label="Slash Cmds" value="20+" />
            </div>
          </div>

          {/* Command preview */}
          <div className="card-obsidian rounded-2xl p-1 glow-cyan">
            <div className="bg-[#05080E] rounded-xl p-5 font-mono text-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-2 text-slate-500 text-xs">// aetheris — live feed</span>
              </div>
              {[
                { t: "AUTOMOD", c: "text-red-400", m: "Blocked profanity from @user_2401  →  warned + logged" },
                { t: "CASE #142", c: "text-cyan-300", m: "TIMEOUT @spammer  ·  10m  ·  reason: mass mentions" },
                { t: "TICKET", c: "text-emerald-400", m: "New ticket opened  ·  panel: General Support" },
                { t: "AI SUPPORT", c: "text-fuchsia-300", m: "Answered FAQ · escalated 1 to staff" },
                { t: "JOIN", c: "text-emerald-400", m: "@newmember cleared verification · auto-role assigned" },
                { t: "AUTOMOD", c: "text-red-400", m: "Deleted Discord invite from @user_1180" },
              ].map((row, i) => (
                <div key={i} className="flex gap-3 py-1.5">
                  <span className={`${row.c} font-semibold w-24 shrink-0`}>{row.t}</span>
                  <span className="text-slate-400">{row.m}</span>
                </div>
              ))}
              <div className="mt-3 flex items-center gap-2 text-cyan-400">
                <Terminal className="w-3.5 h-3.5" /> <span className="animate-pulse">▍</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules grid */}
      <section id="modules" className="border-t border-slate-800/60 bg-[#0A0F19]">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl mb-14">
            <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3">// modules</div>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold">Every system. Independently tuned.</h2>
            <p className="mt-4 text-slate-400 text-lg">Configure each rule, panel, and automation on its own terms. No one-size-fits-all toggles.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Feature testid="feat-moderation" icon={Shield} title="Precision Moderation" desc="Warn, timeout, kick, ban with case IDs, hierarchy protection, and per-action DM templates." />
            <Feature testid="feat-automod" icon={Radar} title="AutoMod Rule Engine" desc="Independent rules for profanity, spam, invites, mass mentions, scams, and custom regex — each with its own actions." />
            <Feature testid="feat-tickets" icon={MessageSquare} title="Ticket Panels" desc="Multiple panels, custom forms, support roles, transcripts, and per-panel AI Support toggle." />
            <Feature testid="feat-ai" icon={Bot} title="AI Ticket Support" desc="Optional AI agent per panel — trained on your knowledge base. Never silently takes over." />
            <Feature testid="feat-welcome" icon={Sparkles} title="Welcome & Goodbye" desc="Live embed builder with variables, DM greetings, and real-time preview." />
            <Feature testid="feat-logging" icon={Activity} title="Granular Logging" desc="22 event categories, each with its own channel, ignore list, and toggle." />
            <Feature testid="feat-raid" icon={LockKeyhole} title="Raid Shield" desc="Detect join spikes, mass mentions, mass channel creation. Auto-lock, verify-mode, quarantine." />
            <Feature testid="feat-automations" icon={Cog} title="Automation Engine" desc="Trigger → Conditions → Actions. Compose any workflow across every event Discord exposes." />
            <Feature testid="feat-analytics" icon={Zap} title="Admin Analytics" desc="Joins, leaves, mod actions, AutoMod hits, tickets, uptime — the numbers admins actually need." />
          </div>
        </div>
      </section>

      {/* AutoMod / Tickets Split */}
      <section id="automod" className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-10">
        <div className="card-obsidian rounded-2xl p-8">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3">// automod shield</div>
          <h3 className="font-display text-3xl font-bold mb-3">14 default rules. Zero setup.</h3>
          <p className="text-slate-400 mb-6">Ships with a curated English blocklist covering profanity, obfuscation, invites, mass mentions, scam patterns, and more. Fully editable.</p>
          <div className="space-y-2">
            {["Profanity Filter · delete + warn + dm", "Discord Invites · delete + warn", "Mass Mentions · delete + timeout", "Scam Detector · delete + warn", "Excessive Caps · delete", "Custom Regex · configurable"].map((r) => (
              <div key={r} className="flex items-center justify-between p-3 rounded-lg bg-[#05080E] border border-slate-800/70">
                <span className="text-sm text-slate-300">{r}</span>
                <span className="text-xs font-mono text-emerald-400">ACTIVE</span>
              </div>
            ))}
          </div>
        </div>
        <div id="tickets" className="card-obsidian rounded-2xl p-8">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3">// ticket system</div>
          <h3 className="font-display text-3xl font-bold mb-3">Panels, forms, and AI — per your terms.</h3>
          <p className="text-slate-400 mb-6">Every panel is independent. Turn AI Support on for general support, off for staff applications.</p>
          <div className="discord-embed">
            <div className="text-xs font-semibold text-slate-300 mb-1">SERVER SUPPORT</div>
            <div className="text-slate-200 font-semibold mb-1">Need help?</div>
            <div className="text-sm text-slate-400 mb-3">Click the button to open a ticket. AI can answer FAQs; staff handles the rest.</div>
            <button className="text-xs px-3 py-1.5 rounded bg-cyan-500 text-[#070A10] font-semibold">Open Ticket</button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3">// faq</div>
          <h2 className="font-display text-4xl font-extrabold mb-10">Frequently asked</h2>
          <div className="space-y-4">
            {[
              ["Is AI Support automatic?", "No. It's OFF by default and toggled per ticket panel."],
              ["Does it work out of the box?", "Yes — sensible defaults for AutoMod, moderation escalation, and logging are pre-seeded."],
              ["Can each rule be customized separately?", "Every rule, panel, automation, and DM template is independent."],
              ["Does it have XP or leveling?", "No. AETHERIS is strictly an administration platform."],
            ].map(([q, a]) => (
              <div key={q} className="card-obsidian rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <ChevronRight className="w-4 h-4 text-cyan-400 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-100">{q}</div>
                    <div className="text-sm text-slate-400 mt-1">{a}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/60 py-10">
        <div className="max-w-7xl mx-auto px-6 text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} AETHERIS · Tactical Discord Infrastructure</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-cyan-300">Privacy</a>
            <a href="#" className="hover:text-cyan-300">Terms</a>
            <a href="#" className="hover:text-cyan-300">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
