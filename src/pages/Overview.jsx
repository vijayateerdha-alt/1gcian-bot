import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Users, ShieldAlert, Radar, MessageSquare, Activity, Clock, Gift } from "lucide-react";
import api from "../lib/api";

const Stat = ({ icon: Icon, label, value, tid }) => (
  <div data-testid={tid} className="card-obsidian rounded-2xl p-5">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{label}</span>
      <Icon className="w-4 h-4 text-cyan-400" />
    </div>
    <div className="font-display text-3xl font-extrabold">{value ?? "—"}</div>
  </div>
);

export default function Overview() {
  const { gid } = useParams();
  const [s, setS] = useState(null);
  useEffect(() => { api.stats(gid).then(setS); }, [gid]);
  const upt = s?.bot_uptime_seconds ?? 0;
  const uptimeStr = `${Math.floor(upt / 3600)}h ${Math.floor((upt % 3600) / 60)}m`;
  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">// overview</div>
      <h1 className="font-display text-4xl font-extrabold mb-8">Server dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        <Stat tid="stat-members" icon={Users} label="Members" value={s?.member_count} />
        <Stat tid="stat-mod" icon={ShieldAlert} label="Mod cases" value={s?.mod_actions} />
        <Stat tid="stat-automod" icon={Radar} label="AutoMod hits" value={s?.automod_actions} />
        <Stat tid="stat-tickets" icon={MessageSquare} label="Open tickets" value={s?.tickets_open} />
        <Stat tid="stat-giveaways" icon={Gift} label="Active giveaways" value={s?.giveaways_active} />
        <Stat tid="stat-uptime" icon={Clock} label="Bot uptime" value={uptimeStr} />
      </div>
      <div className="card-obsidian rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="font-display text-xl font-bold">Recent events</h2>
        </div>
        {s?.recent_events?.length ? (
          <div className="space-y-2 font-mono text-xs">
            {s.recent_events.map((e, i) => (
              <div key={i} className="flex gap-3 py-2 border-b border-slate-800/40 last:border-0">
                <span className="text-cyan-400 w-24 shrink-0">{e.type?.toUpperCase()}</span>
                <span className="text-slate-500 w-40 shrink-0 truncate">{new Date(e.created_at).toLocaleString()}</span>
                <span className="text-slate-300 truncate">{e.reason || e.rule_name || "—"}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-500">No recent activity.</div>
        )}
      </div>
    </div>
  );
}
