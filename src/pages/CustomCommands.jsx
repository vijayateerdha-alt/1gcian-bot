import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Terminal, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import api from "../lib/api";

export default function CustomCommands() {
  const { gid } = useParams();
  const [items, setItems] = useState([]);
  const load = () => api.ccs(gid).then(setItems);
  useEffect(() => { load(); }, [gid]); // eslint-disable-line react-hooks/exhaustive-deps
  const add = async () => {
    const c = await api.createCC(gid, { name: `cmd${items.length + 1}`, response_text: "Hello {user}", enabled: true });
    setItems([...items, c]);
  };
  const upd = (id, next) => setItems(items.map((i) => (i.id === id ? next : i)));
  const save = async (c) => { await api.updateCC(gid, c.id, c); toast.success(`!${c.name} saved`); };
  const del = async (c) => { await api.deleteCC(gid, c.id); setItems(items.filter((x) => x.id !== c.id)); };
  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">// custom commands</div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl font-extrabold flex items-center gap-3"><Terminal className="w-8 h-8 text-cyan-400" /> Custom Commands</h1>
        <Button data-testid="add-cc" onClick={add} className="bg-cyan-400 text-[#070A10] font-semibold"><Plus className="w-4 h-4 mr-1" /> New</Button>
      </div>
      <div className="grid gap-4">
        {items.map((c) => (
          <div key={c.id} className="card-obsidian rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <Switch checked={c.enabled} onCheckedChange={(v) => upd(c.id, { ...c, enabled: v })} />
                <span className="text-cyan-300 font-mono">!</span>
                <Input value={c.name} onChange={(e) => upd(c.id, { ...c, name: e.target.value.replace(/[^a-z0-9_]/gi, "").toLowerCase() })} className="max-w-xs font-mono" />
                <Input value={c.description || ""} onChange={(e) => upd(c.id, { ...c, description: e.target.value })} placeholder="Short description" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => del(c)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                <Button size="sm" onClick={() => save(c)} className="bg-cyan-400 text-[#070A10] font-semibold"><Save className="w-4 h-4 mr-1" /> Save</Button>
              </div>
            </div>
            <Textarea rows={3} value={c.response_text || ""} onChange={(e) => upd(c.id, { ...c, response_text: e.target.value })} placeholder="Response text (supports {user}, {server}, {channel})" />
            <div className="grid grid-cols-3 gap-3">
              <div><Label className="text-xs">Cooldown (seconds)</Label><Input type="number" value={c.cooldown_seconds || 0} onChange={(e) => upd(c.id, { ...c, cooldown_seconds: parseInt(e.target.value || 0) })} /></div>
              <div className="flex items-end gap-2"><Switch checked={c.delete_trigger} onCheckedChange={(v) => upd(c.id, { ...c, delete_trigger: v })} /><Label className="text-sm">Delete trigger message</Label></div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-slate-500">No custom commands yet.</div>}
      </div>
    </div>
  );
}
