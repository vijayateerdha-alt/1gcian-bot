import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Gift, Plus, X, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import api from "../lib/api";

export default function Giveaways() {
  const { gid } = useParams();
  const [items, setItems] = useState([]);
  const [channels, setChannels] = useState([]);
  const [roles, setRoles] = useState([]);
  const [creating, setCreating] = useState(null);

  const load = () => api.giveaways(gid).then(setItems);
  useEffect(() => {
    load();
    api.channels(gid).then((c) => setChannels(c.filter((x) => x.type === "text")));
    api.roles(gid).then(setRoles);
  }, [gid]); // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = async () => setCreating(await api.giveawayDefaults(gid));
  const create = async () => {
    if (!creating.channel_id) return toast.error("Select a channel");
    try { await api.createGiveaway(gid, creating); toast.success("Giveaway started"); setCreating(null); load(); }
    catch (e) { toast.error(e?.response?.data?.detail || "Failed"); }
  };
  const end = async (g) => { await api.endGiveaway(gid, g.id); toast("Ended"); load(); };
  const reroll = async (g) => { const r = await api.rerollGiveaway(gid, g.id); toast(r.winner ? `New winner: <@${r.winner}>` : "No candidates"); };

  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">// giveaways</div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl font-extrabold flex items-center gap-3"><Gift className="w-8 h-8 text-amber-400" /> Giveaways</h1>
        <Button data-testid="add-giveaway" onClick={openNew} className="bg-cyan-400 text-[#070A10] font-semibold"><Plus className="w-4 h-4 mr-1" /> New giveaway</Button>
      </div>

      <div className="grid gap-4">
        {items.map((g) => (
          <div key={g.id} className="card-obsidian rounded-2xl p-5 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-slate-100">{g.prize}</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Winners: {g.winners} · Ends: {new Date(g.ends_at).toLocaleString()} · Status: <span className={g.status === "active" ? "text-emerald-400" : "text-slate-400"}>{g.status}</span>
              </div>
            </div>
            {g.status === "active" && <Button size="sm" variant="outline" onClick={() => end(g)}><X className="w-3.5 h-3.5 mr-1" /> End now</Button>}
            {g.status === "ended" && <Button size="sm" variant="outline" onClick={() => reroll(g)}><RotateCw className="w-3.5 h-3.5 mr-1" /> Reroll</Button>}
          </div>
        ))}
        {items.length === 0 && <div className="text-slate-500">No giveaways yet.</div>}
      </div>

      <Dialog open={!!creating} onOpenChange={(v) => !v && setCreating(null)}>
        <DialogContent className="max-w-xl bg-[#0B0F17] border-slate-800">
          <DialogHeader><DialogTitle>New giveaway</DialogTitle></DialogHeader>
          {creating && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Prize</Label><Input value={creating.prize} onChange={(e) => setCreating({ ...creating, prize: e.target.value })} /></div>
                <div><Label className="text-xs">Winners</Label><Input type="number" value={creating.winners} onChange={(e) => setCreating({ ...creating, winners: parseInt(e.target.value || 1) })} /></div>
                <div><Label className="text-xs">Duration (minutes)</Label><Input type="number" value={creating.duration_minutes} onChange={(e) => setCreating({ ...creating, duration_minutes: parseInt(e.target.value || 1) })} /></div>
                <div><Label className="text-xs">Channel</Label>
                  <Select value={creating.channel_id || ""} onValueChange={(v) => setCreating({ ...creating, channel_id: v || null })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{channels.map((c) => <SelectItem key={c.id} value={c.id}>#{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">Min account age (days)</Label><Input type="number" value={creating.min_account_age_days} onChange={(e) => setCreating({ ...creating, min_account_age_days: parseInt(e.target.value || 0) })} /></div>
                <div><Label className="text-xs">Min server membership (days)</Label><Input type="number" value={creating.min_membership_days} onChange={(e) => setCreating({ ...creating, min_membership_days: parseInt(e.target.value || 0) })} /></div>
              </div>
              <div>
                <Label className="text-xs">Announcement text</Label>
                <Textarea rows={3} value={creating.announcement_text} onChange={(e) => setCreating({ ...creating, announcement_text: e.target.value })} />
                <div className="text-[10px] text-slate-500 mt-1 font-mono">vars: {"{prize}"} {"{winners}"} {"{ends_ts}"}</div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setCreating(null)}>Cancel</Button>
                <Button data-testid="create-giveaway" onClick={create} className="bg-cyan-400 text-[#070A10] font-semibold">Start</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
