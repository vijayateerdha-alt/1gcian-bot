import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import api from "../lib/api";

const EVENTS = [
  "message_delete", "message_edit", "member_join", "member_leave",
  "member_ban", "member_unban", "member_timeout", "member_warn",
  "role_add", "role_remove", "role_create", "role_delete",
  "channel_create", "channel_delete", "channel_update", "server_update",
  "voice_join", "voice_leave", "automod", "tickets", "verification",
];

const label = (k) => k.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function Logging() {
  const { gid } = useParams();
  const [cfg, setCfg] = useState(null);
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    api.getLogging(gid).then(setCfg);
    api.channels(gid).then((c) => setChannels(c.filter((x) => x.type === "text")));
  }, [gid]);

  if (!cfg) return <div className="text-slate-500">Loading…</div>;

  const set = (key, patch) => setCfg({ ...cfg, categories: { ...cfg.categories, [key]: { ...(cfg.categories[key] || {}), ...patch } } });
  const save = async () => { await api.putLogging(gid, { categories: cfg.categories }); toast.success("Logging saved"); };

  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">// logging</div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl font-extrabold">Event log matrix</h1>
        <Button data-testid="logging-save" onClick={save} className="bg-cyan-400 hover:bg-cyan-300 text-[#070A10] font-semibold">
          <Save className="w-4 h-4 mr-1" /> Save
        </Button>
      </div>

      <div className="card-obsidian rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0A0F19] text-xs uppercase font-mono tracking-widest text-slate-500">
            <tr>
              <th className="text-left px-4 py-3">Event</th>
              <th className="text-left px-4 py-3">Enabled</th>
              <th className="text-left px-4 py-3">Channel</th>
            </tr>
          </thead>
          <tbody>
            {EVENTS.map((k) => {
              const c = cfg.categories[k] || { enabled: false, channel_id: null };
              return (
                <tr key={k} data-testid={`log-row-${k}`} className="border-t border-slate-800/40">
                  <td className="px-4 py-3 font-medium text-slate-200">{label(k)}</td>
                  <td className="px-4 py-3">
                    <Switch data-testid={`log-${k}-enabled`} checked={!!c.enabled} onCheckedChange={(v) => set(k, { enabled: v })} />
                  </td>
                  <td className="px-4 py-3">
                    <Select value={c.channel_id || ""} onValueChange={(v) => set(k, { channel_id: v || null })}>
                      <SelectTrigger className="max-w-xs"><SelectValue placeholder="Select channel" /></SelectTrigger>
                      <SelectContent>{channels.map((ch) => <SelectItem key={ch.id} value={ch.id}>#{ch.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
