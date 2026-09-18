import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Save, Plus, Trash2, Rocket, Copy, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DiscordEmbedPreview from "../components/DiscordEmbedPreview";
import api, { API } from "../lib/api";

export default function Tickets() {
  const { gid } = useParams();
  const [panels, setPanels] = useState([]);
  const [channels, setChannels] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => {
    api.panels(gid).then(setPanels);
    api.channels(gid).then(setChannels);
    api.roles(gid).then(setRoles);
    api.tickets(gid).then(setTickets);
  };
  useEffect(() => { load(); }, [gid]); // eslint-disable-line react-hooks/exhaustive-deps
  const textChannels = channels.filter((c) => c.type === "text");
  const categories = channels.filter((c) => c.type === "category");

  const openNew = async () => {
    const d = await api.panelDefaults(gid);
    setEditing({
      name: d.name, channel_id: null, button_label: d.button_label, button_style: d.button_style,
      category_id: null, support_role_ids: [],
      opening_message: d.opening_message, closing_message: d.closing_message,
      ai_support_enabled: false, ai_knowledge_base: "", log_channel_id: null,
      form_enabled: false, form_questions: d.form_questions || [], embed: d.embed,
    });
  };

  const savePanel = async () => {
    const payload = { ...editing };
    delete payload.id; delete payload.guild_id; delete payload.created_at; delete payload.message_id;
    // Force AI off — feature disabled server-wide
    payload.ai_support_enabled = false;
    payload.ai_knowledge_base = "";
    if (editing.id) { await api.updatePanel(gid, editing.id, payload); toast.success("Panel updated"); }
    else { await api.createPanel(gid, payload); toast.success("Panel created"); }
    setEditing(null); load();
  };
  const del = async (p) => { await api.deletePanel(gid, p.id); toast("Panel deleted"); load(); };
  const dup = async (p) => {
    const { id, guild_id, created_at, message_id, ...rest } = p;
    await api.createPanel(gid, { ...rest, name: `${rest.name} (copy)` });
    toast.success("Panel duplicated"); load();
  };
  const deploy = async (p) => {
    try { await api.deployPanel(gid, p.id); toast.success("Panel deployed"); }
    catch (e) { toast.error(e?.response?.data?.detail || "Deploy failed"); }
  };

  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">// tickets</div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl font-extrabold">Ticket panels</h1>
        <Button data-testid="add-panel-btn" onClick={openNew} className="bg-cyan-400 hover:bg-cyan-300 text-[#070A10] font-semibold">
          <Plus className="w-4 h-4 mr-1" /> New panel
        </Button>
      </div>

      <Tabs defaultValue="panels">
        <TabsList className="mb-6">
          <TabsTrigger value="panels" data-testid="tickets-tab-panels">Panels ({panels.length})</TabsTrigger>
          <TabsTrigger value="tickets" data-testid="tickets-tab-list">Tickets ({tickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="panels" className="space-y-4">
          {panels.map((p) => (
            <div key={p.id} data-testid={`panel-${p.id}`} className="card-obsidian rounded-2xl p-5 flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-[240px]">
                <div className="font-display font-bold text-slate-100">{p.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Channel: {textChannels.find((c) => c.id === p.channel_id)?.name || "—"}
                  {p.form_enabled && (p.form_questions?.length || 0) > 0 ? ` · Form: ${p.form_questions.length} q` : ""}
                  {p.support_role_ids?.length > 0 && ` · Support: ${p.support_role_ids.length} role${p.support_role_ids.length !== 1 ? "s" : ""}`}
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => deploy(p)} data-testid={`deploy-${p.id}`}><Rocket className="w-3.5 h-3.5 mr-1" /> Deploy</Button>
              <Button size="sm" variant="ghost" onClick={() => dup(p)}><Copy className="w-4 h-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing({ ...p })} data-testid={`edit-${p.id}`}>Edit</Button>
              <Button size="sm" variant="ghost" onClick={() => del(p)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
            </div>
          ))}
          {panels.length === 0 && <div className="text-slate-500">No panels yet. Click <b>New panel</b> to build one.</div>}
        </TabsContent>

        <TabsContent value="tickets">
          <div className="card-obsidian rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#0A0F19] text-xs uppercase font-mono tracking-widest text-slate-500">
                <tr>
                  <th className="text-left px-4 py-3">Opened by</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">When</th>
                  <th className="text-left px-4 py-3">Transcript</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} className="border-t border-slate-800/40">
                    <td className="px-4 py-3 text-slate-200 truncate">{t.opener_tag}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-mono uppercase ${t.status === "closed" ? "text-slate-500" : "text-emerald-400"}`}>{t.status}</span></td>
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(t.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <a href={`${API}/guilds/${gid}/tickets/${t.id}/transcript`} target="_blank" rel="noreferrer" className="text-xs text-cyan-300 hover:underline inline-flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Open
                      </a>
                    </td>
                  </tr>
                ))}
                {tickets.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-slate-500">No tickets yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-[#0B0F17] border-slate-800">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit panel" : "New panel"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid lg:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Panel name</Label>
                    <Input data-testid="panel-name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">Button label</Label>
                    <Input value={editing.button_label} onChange={(e) => setEditing({ ...editing, button_label: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">Button style</Label>
                    <Select value={editing.button_style} onValueChange={(v) => setEditing({ ...editing, button_style: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary (blue)</SelectItem>
                        <SelectItem value="secondary">Secondary (grey)</SelectItem>
                        <SelectItem value="success">Success (green)</SelectItem>
                        <SelectItem value="danger">Danger (red)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Panel channel</Label>
                    <Select value={editing.channel_id || ""} onValueChange={(v) => setEditing({ ...editing, channel_id: v || null })}>
                      <SelectTrigger data-testid="panel-channel"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{textChannels.map((c) => <SelectItem key={c.id} value={c.id}>#{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Ticket category</Label>
                    <Select value={editing.category_id || ""} onValueChange={(v) => setEditing({ ...editing, category_id: v || null })}>
                      <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                      <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Log channel (transcripts)</Label>
                    <Select value={editing.log_channel_id || ""} onValueChange={(v) => setEditing({ ...editing, log_channel_id: v || null })}>
                      <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                      <SelectContent>{textChannels.map((c) => <SelectItem key={c.id} value={c.id}>#{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Support roles (can see/manage tickets)</Label>
                  <div className="flex flex-wrap gap-2 mt-1 max-h-32 overflow-y-auto">
                    {roles.map((r) => {
                      const on = editing.support_role_ids.includes(r.id);
                      return (
                        <button key={r.id} type="button" onClick={() => setEditing({
                          ...editing,
                          support_role_ids: on ? editing.support_role_ids.filter((x) => x !== r.id) : [...editing.support_role_ids, r.id],
                        })} className={`text-xs px-2 py-1 rounded-full border ${on ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-200" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}>
                          {r.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Opening message (inside new tickets)</Label>
                  <Textarea rows={3} value={editing.opening_message} onChange={(e) => setEditing({ ...editing, opening_message: e.target.value })} />
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">vars: {"{user}"} {"{server}"}</div>
                </div>
                <div>
                  <Label className="text-xs">Closing message</Label>
                  <Textarea rows={2} value={editing.closing_message} onChange={(e) => setEditing({ ...editing, closing_message: e.target.value })} />
                </div>

                <div className="border-t border-slate-800/60 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-semibold">Application form (up to 5 questions)</Label>
                    <Switch data-testid="form-enabled" checked={editing.form_enabled} onCheckedChange={(v) => setEditing({ ...editing, form_enabled: v })} />
                  </div>
                  {editing.form_enabled && (
                    <div className="space-y-2">
                      {(editing.form_questions || []).map((q, i) => (
                        <div key={i} className="grid grid-cols-12 gap-2">
                          <Input className="col-span-5" placeholder="Question label" value={q.label} onChange={(e) => {
                            const arr = [...editing.form_questions]; arr[i] = { ...arr[i], label: e.target.value };
                            setEditing({ ...editing, form_questions: arr });
                          }} />
                          <Input className="col-span-5" placeholder="Placeholder" value={q.placeholder || ""} onChange={(e) => {
                            const arr = [...editing.form_questions]; arr[i] = { ...arr[i], placeholder: e.target.value };
                            setEditing({ ...editing, form_questions: arr });
                          }} />
                          <Select value={q.style || "short"} onValueChange={(v) => {
                            const arr = [...editing.form_questions]; arr[i] = { ...arr[i], style: v };
                            setEditing({ ...editing, form_questions: arr });
                          }}>
                            <SelectTrigger className="col-span-1"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="short">short</SelectItem><SelectItem value="paragraph">para</SelectItem></SelectContent>
                          </Select>
                          <Button size="sm" variant="ghost" className="col-span-1" onClick={() => setEditing({ ...editing, form_questions: editing.form_questions.filter((_, idx) => idx !== i) })}>
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      ))}
                      {(editing.form_questions?.length || 0) < 5 && (
                        <Button size="sm" variant="outline" onClick={() => setEditing({ ...editing, form_questions: [...(editing.form_questions || []), { label: "", placeholder: "", required: true, style: "short" }] })}>
                          <Plus className="w-3.5 h-3.5 mr-1" /> Add question
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 lg:sticky lg:top-6 h-max">
                <div className="text-xs font-mono uppercase tracking-widest text-slate-500">// preview</div>
                <DiscordEmbedPreview embed={editing.embed} text="" vars={{ user: "@you", server: "Your server" }} />
                <div className="card-obsidian rounded-lg p-3 space-y-3">
                  <div className="text-xs font-mono uppercase text-slate-400">Embed</div>
                  <Input placeholder="Title" value={editing.embed?.title || ""} onChange={(e) => setEditing({ ...editing, embed: { ...editing.embed, title: e.target.value } })} />
                  <Textarea rows={3} placeholder="Description" value={editing.embed?.description || ""} onChange={(e) => setEditing({ ...editing, embed: { ...editing.embed, description: e.target.value } })} />
                  <Input type="color" value={editing.embed?.color || "#00F0FF"} onChange={(e) => setEditing({ ...editing, embed: { ...editing.embed, color: e.target.value } })} />
                  <Input placeholder="Footer" value={editing.embed?.footer_text || ""} onChange={(e) => setEditing({ ...editing, embed: { ...editing.embed, footer_text: e.target.value } })} />
                </div>
              </div>

              <DialogFooter className="lg:col-span-2">
                <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                <Button data-testid="save-panel-btn" onClick={savePanel} className="bg-cyan-400 text-[#070A10] font-semibold"><Save className="w-4 h-4 mr-1" /> Save</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
