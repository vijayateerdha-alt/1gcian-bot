import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import api from "../lib/api";

const ACTIONS = ["warn", "timeout", "kick", "ban"];

export default function Moderation() {
  const { gid } = useParams();
  const [settings, setSettings] = useState(null);
  const [cases, setCases] = useState([]);
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    api.getMod(gid).then(setSettings);
    api.cases(gid).then(setCases);
    api.channels(gid).then((c) => setChannels(c.filter((x) => x.type === "text")));
  }, [gid]);

  const save = async () => {
    await api.putMod(gid, settings);
    toast.success("Moderation settings saved");
  };

  const addEsc = () => setSettings({ ...settings, escalation: [...(settings.escalation || []), { warnings: 1, action: "warn" }] });
  const rmEsc = (i) => setSettings({ ...settings, escalation: settings.escalation.filter((_, idx) => idx !== i) });
  const setEsc = (i, patch) => {
    const e = [...settings.escalation];
    e[i] = { ...e[i], ...patch };
    setSettings({ ...settings, escalation: e });
  };

  if (!settings) return <div className="text-slate-500">Loading…</div>;

  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">// moderation</div>
      <h1 className="font-display text-4xl font-extrabold mb-8">Moderation & cases</h1>

      <Tabs defaultValue="settings">
        <TabsList className="mb-6">
          <TabsTrigger value="settings" data-testid="mod-tab-settings">Settings</TabsTrigger>
          <TabsTrigger value="cases" data-testid="mod-tab-cases">Case log ({cases.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <div className="card-obsidian rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold mb-4">Escalation ladder</h2>
            <p className="text-sm text-slate-400 mb-4">Trigger an automatic action when a member reaches N warnings.</p>
            <div className="space-y-3">
              {(settings.escalation || []).map((r, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <span className="col-span-2 text-xs font-mono uppercase text-slate-500">At warns</span>
                  <Input data-testid={`esc-warns-${i}`} type="number" min={1} value={r.warnings}
                          onChange={(e) => setEsc(i, { warnings: parseInt(e.target.value || 1) })} className="col-span-2" />
                  <Select value={r.action} onValueChange={(v) => setEsc(i, { action: v })}>
                    <SelectTrigger data-testid={`esc-action-${i}`} className="col-span-3"><SelectValue /></SelectTrigger>
                    <SelectContent>{ACTIONS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input placeholder="duration seconds (timeout)" type="number" value={r.duration_seconds ?? ""}
                          onChange={(e) => setEsc(i, { duration_seconds: parseInt(e.target.value || 0) || null })}
                          className="col-span-4" />
                  <Button size="sm" variant="ghost" onClick={() => rmEsc(i)} data-testid={`esc-remove-${i}`}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={addEsc} data-testid="esc-add-btn">
                <Plus className="w-4 h-4 mr-1" /> Add rule
              </Button>
            </div>
          </div>

          <div className="card-obsidian rounded-2xl p-6 space-y-5">
            <h2 className="font-display text-xl font-bold">DM templates & log channel</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-mono uppercase tracking-widest text-slate-400">Mod log channel</Label>
                <Select value={settings.log_channel_id || ""} onValueChange={(v) => setSettings({ ...settings, log_channel_id: v || null })}>
                  <SelectTrigger data-testid="mod-log-channel" className="mt-1"><SelectValue placeholder="Select channel" /></SelectTrigger>
                  <SelectContent>
                    {channels.map((c) => <SelectItem key={c.id} value={c.id}>#{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {[["warn", "Warn DM", "warn_dm_template", "dm_on_warn"],
              ["timeout", "Timeout DM", "timeout_dm_template", "dm_on_timeout"],
              ["kick", "Kick DM", "kick_dm_template", "dm_on_kick"],
              ["ban", "Ban DM", "ban_dm_template", "dm_on_ban"]].map(([k, label, tpl, flag]) => (
              <div key={k}>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold">{label}</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Send DM</span>
                    <Switch data-testid={`mod-${flag}`} checked={settings[flag]} onCheckedChange={(v) => setSettings({ ...settings, [flag]: v })} />
                  </div>
                </div>
                <Textarea data-testid={`mod-${tpl}`} rows={2} value={settings[tpl] || ""} onChange={(e) => setSettings({ ...settings, [tpl]: e.target.value })} />
                <div className="text-[10px] text-slate-500 mt-1 font-mono">vars: {"{user}"} {"{server}"} {"{reason}"} {"{duration}"} {"{case_id}"} {"{moderator}"}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button data-testid="mod-save-btn" onClick={save} className="bg-cyan-400 hover:bg-cyan-300 text-[#070A10] font-semibold">
              <Save className="w-4 h-4 mr-1" /> Save
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="cases">
          <div className="card-obsidian rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#0A0F19] text-xs uppercase font-mono tracking-widest text-slate-500">
                <tr>
                  <th className="text-left px-4 py-3">Case</th>
                  <th className="text-left px-4 py-3">Action</th>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">Moderator</th>
                  <th className="text-left px-4 py-3">Reason</th>
                  <th className="text-left px-4 py-3">When</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id} data-testid={`case-row-${c.case_number}`} className="border-t border-slate-800/40">
                    <td className="px-4 py-3 font-mono text-cyan-300">#{c.case_number}</td>
                    <td className="px-4 py-3"><span className="text-xs font-mono uppercase text-slate-300">{c.action}</span></td>
                    <td className="px-4 py-3 truncate">{c.target_tag}</td>
                    <td className="px-4 py-3 truncate">{c.moderator_tag}</td>
                    <td className="px-4 py-3 text-slate-400 truncate max-w-[280px]">{c.reason}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{new Date(c.created_at).toLocaleString()}</td>
                  </tr>
                ))}
                {cases.length === 0 && (
                  <tr><td colSpan={6} className="p-10 text-center text-slate-500">No cases yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
