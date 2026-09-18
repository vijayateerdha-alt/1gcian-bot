import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Save, ShieldCheck, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import DiscordEmbedPreview from "../components/DiscordEmbedPreview";
import api from "../lib/api";

export default function Verification() {
  const { gid } = useParams();
  const [cfg, setCfg] = useState(null);
  const [channels, setChannels] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    api.getVerify(gid).then(setCfg);
    api.channels(gid).then((c) => setChannels(c.filter((x) => x.type === "text")));
    api.roles(gid).then(setRoles);
  }, [gid]);

  if (!cfg) return <div className="text-slate-500">Loading…</div>;
  const embed = cfg.embed || {};
  const setE = (p) => setCfg({ ...cfg, embed: { ...embed, ...p } });
  const save = async () => { await api.putVerify(gid, cfg); toast.success("Verification saved"); };
  const deploy = async () => {
    try { await api.deployVerify(gid); toast.success("Verification panel posted"); }
    catch (e) { toast.error(e?.response?.data?.detail || "Deploy failed"); }
  };

  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">// verification</div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl font-extrabold flex items-center gap-3"><ShieldCheck className="w-8 h-8 text-emerald-400" /> Verification</h1>
        <div className="flex items-center gap-3">
          <Switch data-testid="verify-enabled" checked={cfg.enabled} onCheckedChange={(v) => setCfg({ ...cfg, enabled: v })} />
          <Button variant="outline" onClick={deploy} data-testid="verify-deploy"><Rocket className="w-4 h-4 mr-1" /> Deploy panel</Button>
          <Button onClick={save} data-testid="verify-save" className="bg-cyan-400 hover:bg-cyan-300 text-[#070A10] font-semibold"><Save className="w-4 h-4 mr-1" /> Save</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-obsidian rounded-2xl p-5 space-y-4">
          <div>
            <Label className="text-xs">Verification channel</Label>
            <Select value={cfg.channel_id || ""} onValueChange={(v) => setCfg({ ...cfg, channel_id: v || null })}>
              <SelectTrigger data-testid="verify-channel"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{channels.map((c) => <SelectItem key={c.id} value={c.id}>#{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Role to assign on verify</Label>
            <Select value={cfg.verified_role_id || ""} onValueChange={(v) => setCfg({ ...cfg, verified_role_id: v || null })}>
              <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
              <SelectContent>{roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Button label</Label>
              <Input value={cfg.button_label} onChange={(e) => setCfg({ ...cfg, button_label: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Min account age (days)</Label>
              <Input type="number" value={cfg.min_account_age_days} onChange={(e) => setCfg({ ...cfg, min_account_age_days: parseInt(e.target.value || 0) })} />
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-800/60 pt-4">
            <Label className="text-sm">Kick if verification fails</Label>
            <Switch checked={cfg.kick_on_fail} onCheckedChange={(v) => setCfg({ ...cfg, kick_on_fail: v })} />
          </div>
          <div>
            <Label className="text-xs">Success message (DM)</Label>
            <Textarea rows={2} value={cfg.success_message} onChange={(e) => setCfg({ ...cfg, success_message: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Failure message (DM)</Label>
            <Textarea rows={2} value={cfg.fail_message} onChange={(e) => setCfg({ ...cfg, fail_message: e.target.value })} />
          </div>
          <div className="border-t border-slate-800/60 pt-4 space-y-3">
            <div className="text-xs font-mono uppercase text-slate-400">Embed</div>
            <Input placeholder="Title" value={embed.title || ""} onChange={(e) => setE({ title: e.target.value })} />
            <Textarea rows={3} placeholder="Description" value={embed.description || ""} onChange={(e) => setE({ description: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <Input type="color" value={embed.color || "#10B981"} onChange={(e) => setE({ color: e.target.value })} />
              <Input placeholder="Footer" value={embed.footer_text || ""} onChange={(e) => setE({ footer_text: e.target.value })} />
            </div>
          </div>
        </div>
        <div className="lg:sticky lg:top-6 h-max">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3">// preview</div>
          <DiscordEmbedPreview embed={embed} vars={{ server: "Your server" }} />
        </div>
      </div>
    </div>
  );
}
