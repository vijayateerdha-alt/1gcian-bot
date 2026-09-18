import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Zap, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import api from "../lib/api";

export default function Automations() {
  const { gid } = useParams();
  const [schema, setSchema] = useState({ triggers: [], conditions: [], actions: [] });
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.automationSchema(gid).then(setSchema);
    api.automations(gid).then(setItems);
  }, [gid]);

  const create = async () => {
    const created = await api.createAutomation(gid, {
      name: "New automation", enabled: true,
      trigger: { type: schema.triggers[0] || "member_join", params: {} },
      conditions: [], actions: [{ type: "send_message", params: { channel_id: "", text: "Hello {user}" } }],
    });
    setItems([...items, created]);
  };
  const upd = (id, next) => setItems(items.map((i) => (i.id === id ? next : i)));
  const save = async (a) => { await api.updateAutomation(gid, a.id, a); toast.success("Automation saved"); };
  const del = async (a) => { await api.deleteAutomation(gid, a.id); setItems(items.filter((x) => x.id !== a.id)); };

  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">// automations</div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl font-extrabold flex items-center gap-3"><Zap className="w-8 h-8 text-cyan-400" /> Automations</h1>
        <Button data-testid="add-automation" onClick={create} className="bg-cyan-400 text-[#070A10] font-semibold"><Plus className="w-4 h-4 mr-1" /> New automation</Button>
      </div>

      {items.length === 0 && <div className="card-obsidian rounded-2xl p-10 text-center text-slate-500">
        No automations yet. Create your first workflow — pick a trigger, add optional conditions, then chain actions.
      </div>}

      <div className="grid gap-5">
        {items.map((a) => (
          <div key={a.id} data-testid={`auto-${a.id}`} className="card-obsidian rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch checked={a.enabled} onCheckedChange={(v) => upd(a.id, { ...a, enabled: v })} />
                <Input value={a.name} onChange={(e) => upd(a.id, { ...a, name: e.target.value })} className="max-w-md font-semibold" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => del(a)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                <Button size="sm" onClick={() => save(a)} className="bg-cyan-400 text-[#070A10] font-semibold"><Save className="w-4 h-4 mr-1" /> Save</Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs font-mono uppercase text-cyan-400">Trigger</Label>
                <Select value={a.trigger?.type} onValueChange={(v) => upd(a.id, { ...a, trigger: { type: v, params: a.trigger?.params || {} } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{schema.triggers.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-mono uppercase text-cyan-400">Conditions ({a.conditions?.length || 0})</Label>
                <div className="space-y-2 mt-1">
                  {(a.conditions || []).map((c, i) => (
                    <div key={i} className="flex gap-2">
                      <Select value={c.type} onValueChange={(v) => {
                        const arr = [...a.conditions]; arr[i] = { ...c, type: v };
                        upd(a.id, { ...a, conditions: arr });
                      }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{schema.conditions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                      <Input placeholder="value" value={c.value || ""} onChange={(e) => {
                        const arr = [...a.conditions]; arr[i] = { ...c, value: e.target.value };
                        upd(a.id, { ...a, conditions: arr });
                      }} />
                      <Button size="sm" variant="ghost" onClick={() => upd(a.id, { ...a, conditions: a.conditions.filter((_, idx) => idx !== i) })}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={() => upd(a.id, { ...a, conditions: [...(a.conditions || []), { type: schema.conditions[0] || "has_role", value: "" }] })}><Plus className="w-3.5 h-3.5 mr-1" /> Add condition</Button>
                </div>
              </div>
              <div>
                <Label className="text-xs font-mono uppercase text-cyan-400">Actions ({a.actions?.length || 0})</Label>
                <div className="space-y-2 mt-1">
                  {(a.actions || []).map((ac, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex gap-2">
                        <Select value={ac.type} onValueChange={(v) => {
                          const arr = [...a.actions]; arr[i] = { ...ac, type: v };
                          upd(a.id, { ...a, actions: arr });
                        }}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{schema.actions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                        <Button size="sm" variant="ghost" onClick={() => upd(a.id, { ...a, actions: a.actions.filter((_, idx) => idx !== i) })}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                      </div>
                      <Input placeholder='params (JSON, e.g. {"channel_id":"...", "text":"..."})' value={JSON.stringify(ac.params || {})} onChange={(e) => {
                        try {
                          const p = JSON.parse(e.target.value || "{}");
                          const arr = [...a.actions]; arr[i] = { ...ac, params: p };
                          upd(a.id, { ...a, actions: arr });
                        } catch { /* ignore parse until valid */ }
                      }} className="font-mono text-xs" />
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={() => upd(a.id, { ...a, actions: [...(a.actions || []), { type: schema.actions[0] || "send_message", params: {} }] })}><Plus className="w-3.5 h-3.5 mr-1" /> Add action</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
