import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useParams, Link } from "react-router-dom";
import {
  Home, Shield, Radar, DoorOpen, DoorClosed, MessageSquare, ScrollText,
  Menu, X, ShieldCheck, AlertOctagon, UserPlus, Megaphone, Zap, Gift, Star, Terminal, Wrench,
} from "lucide-react";
import api from "../lib/api";

const NAV = [
  { to: "", icon: Home, label: "Overview", end: true, testid: "nav-overview" },
  { to: "moderation", icon: Shield, label: "Moderation", testid: "nav-moderation" },
  { to: "automod", icon: Radar, label: "AutoMod", testid: "nav-automod" },
  { to: "welcome", icon: DoorOpen, label: "Welcome", testid: "nav-welcome" },
  { to: "goodbye", icon: DoorClosed, label: "Goodbye", testid: "nav-goodbye" },
  { to: "tickets", icon: MessageSquare, label: "Tickets", testid: "nav-tickets" },
  { to: "verification", icon: ShieldCheck, label: "Verification", testid: "nav-verification" },
  { to: "raid", icon: AlertOctagon, label: "Raid Shield", testid: "nav-raid" },
  { to: "auto-roles", icon: UserPlus, label: "Auto Roles", testid: "nav-autoroles" },
  { to: "announcements", icon: Megaphone, label: "Announcements", testid: "nav-announcements" },
  { to: "automations", icon: Zap, label: "Automations", testid: "nav-automations" },
  { to: "giveaways", icon: Gift, label: "Giveaways", testid: "nav-giveaways" },
  { to: "starboard", icon: Star, label: "Starboard", testid: "nav-starboard" },
  { to: "custom-commands", icon: Terminal, label: "Custom Commands", testid: "nav-cc" },
  { to: "utilities", icon: Wrench, label: "Utilities", testid: "nav-util" },
  { to: "logging", icon: ScrollText, label: "Logging", testid: "nav-logging" },
];

export default function DashboardShell() {
  const { gid } = useParams();
  const [guild, setGuild] = useState(null);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    api.guild(gid).then(setGuild).catch(() => setGuild({ id: gid, name: "Unknown Server" }));
  }, [gid]);

  const NavItems = () => NAV.map(({ to, icon: Icon, label, end, testid }) => (
    <NavLink
      key={label}
      to={to}
      end={end}
      data-testid={testid}
      onClick={() => setDrawer(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          isActive
            ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
            : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent"
        }`
      }
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="truncate">{label}</span>
    </NavLink>
  ));

  return (
    <div className="flex h-screen overflow-hidden bg-[#070A10] text-slate-100">
      <aside className="w-64 border-r border-slate-800/60 bg-[#0B0F17] flex-col shrink-0 hidden lg:flex">
        <Link to="/" className="px-5 py-5 flex items-center gap-2.5 border-b border-slate-800/60">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-400 to-emerald-500 grid place-items-center font-black text-[#070A10]">1</div>
          <div className="leading-tight">
            <div className="font-display font-extrabold tracking-wide text-sm">1GC(ian)</div>
            <div className="text-[10px] font-mono uppercase text-slate-500 tracking-widest">dashboard</div>
          </div>
        </Link>
        <div className="p-3 border-b border-slate-800/60">
          <Link to="/servers" data-testid="server-selector" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/40 transition">
            {guild?.icon ? (
              <img src={guild.icon} alt="" className="w-9 h-9 rounded-lg object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 grid place-items-center font-display font-bold text-cyan-300">
                {guild?.name?.[0] ?? "?"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">{guild?.name ?? "..."}</div>
              <div className="text-[10px] font-mono uppercase text-slate-500 tracking-widest">Switch server</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavItems />
        </nav>
        <div className="p-4 text-[10px] font-mono uppercase text-slate-600 tracking-widest border-t border-slate-800/60">
          1GC(ian) dashboard · v1.0
        </div>
      </aside>

      {drawer && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawer(false)} />
          <div className="relative w-72 bg-[#0B0F17] border-r border-slate-800/60 flex flex-col">
            <div className="px-5 py-4 border-b border-slate-800/60 flex items-center justify-between">
              <span className="font-display font-extrabold">1GC(ian) dashboard</span>
              <button onClick={() => setDrawer(false)}><X className="w-5 h-5" /></button>
            </div>
            <nav className="p-3 space-y-1 flex-1 overflow-y-auto"><NavItems /></nav>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="lg:hidden sticky top-0 z-30 bg-[#070A10]/90 backdrop-blur border-b border-slate-800/60 px-4 py-3 flex items-center justify-between">
          <button data-testid="mobile-menu-btn" onClick={() => setDrawer(true)}><Menu className="w-5 h-5" /></button>
          <span className="text-sm font-semibold truncate">{guild?.name}</span>
          <span />
        </header>
        <main className="flex-1 p-6 lg:p-10 max-w-6xl w-full">
          <Outlet context={{ guild }} />
        </main>
      </div>
    </div>
  );
}
