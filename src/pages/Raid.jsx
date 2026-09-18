import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Save, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import api from "../lib/api";

export default function Raid() {
  const { gid } = useParams();
  const [cfg, setCfg] = useState(null);
  const [channels, setChannels] = useState([]);
  useEffect(() => {
    api.getRaid(gid).then(setCfg);
    api.channels(gid).then((c) => setChannels(c.filter((x) => x.type === "text")));
  }, [gid]);
  if (!cfg) return <div className="text-slate-500">Loading…</div>;
  const save = async () => { await api.putRaid(gid, cfg); toast.success("Raid protection saved"); };
  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">// raid shield</div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl font-extrabold flex items-center gap-3"><AlertOctagon className="w-8 h-8 text-red-400" /> Raid Shield</h1>
        <div className="flex items-center gap-3">
          <Switch data-testid="raid-enabled" checked={cfg.enabled} onCheckedChange={(v) => setCfg({ ...cfg, enabled: v })} />
          <Button data-testid="raid-save" onClick={save} className="bg-cyan-400 text-[#070A10] font-semibold"><Save className="w-4 h-4 mr-1" /> Save</Button>
        </div>
      </div>
      <div className="card-obsidian rounded-2xl p-6 space-y-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">Join burst threshold</Label>
            <Input type="number" value={cfg.join_burst_threshold} onChange={(e) => setCfg({ ...cfg, join_burst_threshold: parseInt(e.target.value || 0) })} /></div>
          <div><Label className="text-xs">Window (seconds)</Label>
            <Input type="number" value={cfg.join_burst_window_seconds} onChange={(e) => setCfg({ ...cfg, join_burst_window_seconds: parseInt(e.target.value || 0) })} /></div>
          <div><Label className="text-xs">New-account age (days)</Label>
            <Input type="number" value={cfg.new_account_days} onChange={(e) => setCfg({ ...cfg, new_account_days: parseInt(e.target.value || 0) })} /></div>
          <div><Label className="text-xs">Auto response</Label>
            <Select value={cfg.action} onValueChange={(v) => setCfg({ ...cfg, action: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="verify">Force verification mode</SelectItem>
                <SelectItem value="lockdown">Lockdown (lock channels)</SelectItem>
                <SelectItem value="kick_new">Kick new accounts</SelectItem>
                <SelectItem value="ban_new">Ban new accounts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-xs">Alert channel</Label>
          <Select value={cfg.alert_channel_id || ""} onValueChange={(v) => setCfg({ ...cfg, alert_channel_id: v || null })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{channels.map((c) => <SelectItem key={c.id} value={c.id}>#{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Alert message</Label>
          <Textarea rows={3} value={cfg.alert_message} onChange={(e) => setCfg({ ...cfg, alert_message: e.target.value })} />
          <div className="text-[10px] text-slate-500 mt-1 font-mono">vars: {"{count}"} {"{window}"} {"{threshold}"} {"{action}"}</div>
        </div>
      </div>
    </div>
  );
}
