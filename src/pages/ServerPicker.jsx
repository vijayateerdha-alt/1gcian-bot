import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "../lib/api";

export default function ServerPicker() {
  const [guilds, setGuilds] = useState(null);
  const [error, setError] = useState(null);
  const load = () => { setError(null); api.guilds().then(setGuilds).catch((e) => setError(e.message)); };
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="min-h-screen bg-[#070A10] text-slate-100">
      <nav className="border-b border-slate-800/60 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-400 to-emerald-500 grid place-items-center font-black text-[#070A10]">1</div>
          <span className="font-display font-extrabold text-lg tracking-wide">1GC(ian) dashboard</span>
        </Link>
        <Button data-testid="refresh-guilds-btn" onClick={load} variant="ghost" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3">// control deck</div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-3">Select a server</h1>
        <p className="text-slate-400 mb-10">Servers where 1GC(ian) is installed.</p>
        {error && <div data-testid="picker-error" className="card-obsidian rounded-xl p-6 border-red-500/30 text-red-300 mb-6">Failed to load: {error}</div>}
        {!guilds && !error && <div className="text-slate-500">Loading...</div>}
        {guilds && guilds.length === 0 && (
          <div data-testid="picker-empty" className="card-obsidian rounded-2xl p-10 text-center">
            <div className="text-slate-300 font-semibold mb-2">No servers yet.</div>
            <p className="text-slate-500 text-sm mb-6">Invite the bot, then refresh.</p>
          </div>
        )}
        {guilds && guilds.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {guilds.map((g) => (
              <Link key={g.id} to={`/g/${g.id}`} data-testid={`server-card-${g.id}`}
                    className="card-obsidian rounded-2xl p-5 flex items-center gap-4 hover:border-cyan-500/40 transition-all">
                {g.icon ? <img src={g.icon} alt="" className="w-14 h-14 rounded-xl object-cover" /> : (
                  <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 grid place-items-center font-display font-bold text-cyan-300">{g.name?.[0] ?? "?"}</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-100 truncate">{g.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><Users className="w-3 h-3" /> {g.member_count} members</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
