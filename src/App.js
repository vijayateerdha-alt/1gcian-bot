import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import DashboardShell from "./components/DashboardShell";
import ServerPicker from "./pages/ServerPicker";
import Overview from "./pages/Overview";
import Moderation from "./pages/Moderation";
import AutoMod from "./pages/AutoMod";
import Welcome from "./pages/Welcome";
import Goodbye from "./pages/Goodbye";
import Tickets from "./pages/Tickets";
import Logging from "./pages/Logging";
import Verification from "./pages/Verification";
import Raid from "./pages/Raid";
import AutoRoles from "./pages/AutoRoles";
import Announcements from "./pages/Announcements";
import Automations from "./pages/Automations";
import Giveaways from "./pages/Giveaways";
import Starboard from "./pages/Starboard";
import CustomCommands from "./pages/CustomCommands";
import Utilities from "./pages/Utilities";
import api from "./lib/api";
import "./index.css";

// Root component: send user straight to the dashboard.
// If exactly one server, auto-open it; otherwise show the picker.
function RootRedirect() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("Opening dashboard…");
  useEffect(() => {
    let alive = true;
    api.guilds().then((gs) => {
      if (!alive) return;
      if (gs.length === 1) navigate(`/g/${gs[0].id}`, { replace: true });
      else navigate("/servers", { replace: true });
    }).catch(() => {
      if (alive) setMsg("Backend unreachable. Retrying…");
      setTimeout(() => alive && navigate("/servers", { replace: true }), 1500);
    });
    return () => { alive = false; };
  }, [navigate]);
  return (
    <div className="min-h-screen grid place-items-center bg-[#070A10] text-slate-400 text-sm font-mono">
      {msg}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster theme="dark" position="top-right" richColors />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/servers" element={<ServerPicker />} />
        <Route path="/g/:gid" element={<DashboardShell />}>
          <Route index element={<Overview />} />
          <Route path="moderation" element={<Moderation />} />
          <Route path="automod" element={<AutoMod />} />
          <Route path="welcome" element={<Welcome />} />
          <Route path="goodbye" element={<Goodbye />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="logging" element={<Logging />} />
          <Route path="verification" element={<Verification />} />
          <Route path="raid" element={<Raid />} />
          <Route path="auto-roles" element={<AutoRoles />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="automations" element={<Automations />} />
          <Route path="giveaways" element={<Giveaways />} />
          <Route path="starboard" element={<Starboard />} />
          <Route path="custom-commands" element={<CustomCommands />} />
          <Route path="utilities" element={<Utilities />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
