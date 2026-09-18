import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Send, Megaphone, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import DiscordEmbedPreview from "../components/DiscordEmbedPreview";
import api from "../lib/api";

export default function Announcements() {
  const { gid } = useParams();
  const [cfg, setCfg] = useState(null);
  const [channels, setChannels] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.announcementDefaults(gid).then(setCfg);
    api.channels(gid).then((c) => setChannels(c.filter((x) => x.type === "text")));
    api.listAnnouncements(gid).then(setHistory);
  }, [gid]);

  if (!cfg) return <div className="text-slate-500">Loading…</div>;
  const embed = cfg.embed || {};
  const setE = (p) => setCfg({ ...cfg, embed: { ...embed, ...p } });
  const setF = (i, p) => { const f = [...(embed.fields || [])]; f[i] = { ...f[i], ...p }; setE({ fields: f }); };
  const send = async () => {
    if (!cfg.channel_id) { toast.error("Select a channel"); return; }
    try { await api.sendAnnouncement(gid, cfg); toast.success("Announcement sent"); api.listAnnouncements(gid).then(setHistory); }
    catch (e) { toast.error(e?.response?.data?.detail || "Send failed"); }
  };

  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">// announcements</div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl font-extrabold flex items-center gap-3"><Megaphone className="w-8 h-8 text-cyan-400" /> Announcements</h1>
        <Button data-testid="ann-send" onClick={send} className="bg-cyan-400 text-[#070A10] font-semibold"><Send className="w-4 h-4 mr-1" /> Send now</Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-obsidian rounded-2xl p-5 space-y-4">
          <div>
            <Label className="text-xs">Channel</Label>
            <Select value={cfg.channel_id || ""} onValueChange={(v) => setCfg({ ...cfg, channel_id: v || null })}>
              <SelectTrigger data-testid="ann-channel"><SelectValue placeholder="Select channel" /></SelectTrigger>
              <SelectContent>{channels.map((c) => <SelectItem key={c.id} value={c.id}>#{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Ping (optional)</Label>
            <Input placeholder="@everyone / @here / <@&role_id>" value={cfg.mention} onChange={(e) => setCfg({ ...cfg, mention: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Message text (above embed)</Label>
            <Textarea rows={3} value={cfg.text || ""} onChange={(e) => setCfg({ ...cfg, text: e.target.value })} />
          </div>
          <div className="border-t border-slate-800/60 pt-4 space-y-3">
            <div className="text-xs font-mono uppercase text-slate-400">Embed</div>
            <Input placeholder="Title" value={embed.title || ""} onChange={(e) => setE({ title: e.target.value })} />
            <Textarea rows={3} placeholder="Description" value={embed.description || ""} onChange={(e) => setE({ description: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <Input type="color" value={embed.color || "#00F0FF"} onChange={(e) => setE({ color: e.target.value })} />
              <Input placeholder="Footer" value={embed.footer_text || ""} onChange={(e) => setE({ footer_text: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Thumbnail URL" value={embed.thumbnail || ""} onChange={(e) => setE({ thumbnail: e.target.value })} />
              <Input placeholder="Image URL" value={embed.image || ""} onChange={(e) => setE({ image: e.target.value })} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Fields</Label>
                <Button size="sm" variant="outline" onClick={() => setE({ fields: [...(embed.fields || []), { name: "", value: "", inline: false }] })}><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
              </div>
              {(embed.fields || []).map((f, i) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <Input className="col-span-4" value={f.name} onChange={(e) => setF(i, { name: e.target.value })} placeholder="name" />
                  <Input className="col-span-7" value={f.value} onChange={(e) => setF(i, { value: e.target.value })} placeholder="value" />
                  <Button size="sm" variant="ghost" className="col-span-1" onClick={() => setE({ fields: embed.fields.filter((_, idx) => idx !== i) })}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-6 h-max">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500">// preview</div>
          <DiscordEmbedPreview embed={embed} text={cfg.text} vars={{ server: "Your server" }} />
          <div className="card-obsidian rounded-2xl p-4">
            <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Recent announcements</div>
            {history.length === 0 && <div className="text-xs text-slate-500">Nothing sent yet.</div>}
            {history.map((h) => (
              <div key={h.id} className="flex justify-between text-xs py-1.5 border-b border-slate-800/40 last:border-0">
                <span className="text-slate-300 truncate">{h.embed?.title || h.text?.slice(0, 40) || "(no title)"}</span>
                <span className="text-slate-500 font-mono">{new Date(h.sent_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
