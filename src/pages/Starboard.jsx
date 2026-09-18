import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Save, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import api from "../lib/api";

export default function Starboard() {
  const { gid } = useParams();
  const [cfg, setCfg] = useState(null);
  const [channels, setChannels] = useState([]);
  useEffect(() => {
    api.getStar(gid).then(setCfg);
    api.channels(gid).then((c) => setChannels(c.filter((x) => x.type === "text")));
  }, [gid]);
  if (!cfg) return <div className="text-slate-500">Loading…</div>;
  const save = async () => { await api.putStar(gid, cfg); toast.success("Starboard saved"); };
  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">// starboard</div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl font-extrabold flex items-center gap-3"><Star className="w-8 h-8 text-amber-400" /> Starboard</h1>
        <div className="flex items-center gap-3">
          <Switch checked={cfg.enabled} onCheckedChange={(v) => setCfg({ ...cfg, enabled: v })} />
          <Button onClick={save} className="bg-cyan-400 text-[#070A10] font-semibold"><Save className="w-4 h-4 mr-1" /> Save</Button>
        </div>
      </div>
      <div className="card-obsidian rounded-2xl p-6 space-y-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">Emoji</Label><Input value={cfg.emoji} onChange={(e) => setCfg({ ...cfg, emoji: e.target.value })} /></div>
          <div><Label className="text-xs">Threshold</Label><Input type="number" value={cfg.threshold} onChange={(e) => setCfg({ ...cfg, threshold: parseInt(e.target.value || 1) })} /></div>
        </div>
        <div>
          <Label className="text-xs">Starboard channel</Label>
          <Select value={cfg.channel_id || ""} onValueChange={(v) => setCfg({ ...cfg, channel_id: v || null })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{channels.map((c) => <SelectItem key={c.id} value={c.id}>#{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between border-t border-slate-800/60 pt-4">
          <Label className="text-sm">Ignore bot messages</Label>
          <Switch checked={cfg.ignore_bots} onCheckedChange={(v) => setCfg({ ...cfg, ignore_bots: v })} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm">Allow authors to star their own posts</Label>
          <Switch checked={cfg.self_star} onCheckedChange={(v) => setCfg({ ...cfg, self_star: v })} />
        </div>
      </div>
    </div>
  );
}
