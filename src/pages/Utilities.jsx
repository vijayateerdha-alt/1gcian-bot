import React from "react";
import { Terminal } from "lucide-react";

const CMDS = [
  ["/ping", "Bot latency"],
  ["/serverinfo", "Info about this server"],
  ["/userinfo", "Info about a user"],
  ["/avatar", "Show a user's avatar"],
  ["/membercount", "Show member count"],
  ["/uptime", "Bot uptime"],
  ["/warn", "Warn a member"],
  ["/warnings", "List warnings"],
  ["/timeout", "Timeout a member"],
  ["/untimeout", "Remove a timeout"],
  ["/kick", "Kick a member"],
  ["/ban", "Ban a member"],
  ["/unban", "Unban a user"],
  ["/clear", "Bulk delete messages"],
  ["/slowmode", "Set channel slowmode"],
  ["/lock", "Lock the channel"],
  ["/unlock", "Unlock the channel"],
  ["/case", "View a moderation case"],
];

export default function Utilities() {
  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">// utilities</div>
      <h1 className="font-display text-4xl font-extrabold mb-8 flex items-center gap-3"><Terminal className="w-8 h-8 text-cyan-400" /> Slash commands</h1>
      <div className="card-obsidian rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0A0F19] text-xs uppercase font-mono tracking-widest text-slate-500">
            <tr><th className="text-left px-4 py-3">Command</th><th className="text-left px-4 py-3">What it does</th></tr>
          </thead>
          <tbody>
            {CMDS.map(([c, d]) => (
              <tr key={c} className="border-t border-slate-800/40">
                <td className="px-4 py-3 font-mono text-cyan-300">{c}</td>
                <td className="px-4 py-3 text-slate-300">{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
