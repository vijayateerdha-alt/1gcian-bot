import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import DiscordEmbedPreview from "../components/DiscordEmbedPreview";
import api from "../lib/api";

export function WGFormExport({ gid, kind }) {
  const [cfg, setCfg] = useState(null);
  const [channels, setChannels] = useState([]);
  useEffect(() => {
    api.getWG(gid, kind).then(setCfg);
    api.channels(gid).then((c) => setChannels(c.filter((x) => x.type === "text")));
  }, [gid, kind]);
  if (!cfg) return <div className="text-slate-500">Loading…</div>;
  const embed = cfg.embed || {};
  const setE = (p) => setCfg({ ...cfg, embed: { ...embed, ...p } });
  const setF = (i, p) => {
    const f = [...(embed.fields || [])];
    f[i] = { ...f[i], ...p };
    setE({ fields: f });
  };
  const save = async () => { await api.putWG(gid, kind, cfg); toast.success(`${kind} settings saved`); };

  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">// {kind}</div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl font-extrabold capitalize">{kind} message</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase text-slate-400">Enabled</span>
          <Switch data-testid={`${kind}-enabled`} checked={cfg.enabled} onCheckedChange={(v) => setCfg({ ...cfg, enabled: v })} />
          <Button data-testid={`${kind}-save`} onClick={save} className="bg-cyan-400 hover:bg-cyan-300 text-[#070A10] font-semibold">
            <Save className="w-4 h-4 mr-1" /> Save
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="card-obsidian rounded-2xl p-5 space-y-4">
            <div>
              <Label className="text-xs font-mono uppercase text-slate-400">Channel</Label>
              <Select value={cfg.channel_id || ""} onValueChange={(v) => setCfg({ ...cfg, channel_id: v || null })}>
                <SelectTrigger data-testid={`${kind}-channel`} className="mt-1"><SelectValue placeholder="Select channel" /></SelectTrigger>
                <SelectContent>{channels.map((c) => <SelectItem key={c.id} value={c.id}>#{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-mono uppercase text-slate-400">Plain text message</Label>
              <Textarea rows={3} value={cfg.text || ""} onChange={(e) => setCfg({ ...cfg, text: e.target.value })} className="mt-1" />
              <div className="text-[10px] text-slate-500 mt-1 font-mono">vars: {"{user}"} {"{username}"} {"{server}"} {"{member_count}"}</div>
            </div>
            {kind === "welcome" && (
              <>
                <div className="flex items-center justify-between border-t border-slate-800/60 pt-4">
                  <Label className="text-sm">Also send a DM</Label>
                  <Switch data-testid="welcome-dm" checked={cfg.dm_enabled} onCheckedChange={(v) => setCfg({ ...cfg, dm_enabled: v })} />
                </div>
                <Textarea rows={2} value={cfg.dm_text || ""} onChange={(e) => setCfg({ ...cfg, dm_text: e.target.value })} placeholder="DM text..." />
              </>
            )}
          </div>

          <div className="card-obsidian rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Embed</h3>
              <Switch data-testid={`${kind}-embed-enabled`} checked={embed.enabled !== false} onCheckedChange={(v) => setE({ enabled: v })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-400">Title</Label>
                <Input value={embed.title || ""} onChange={(e) => setE({ title: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs text-slate-400">Color</Label>
                <Input type="color" value={embed.color || "#00F0FF"} onChange={(e) => setE({ color: e.target.value })} />
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-400">Description</Label>
              <Textarea rows={3} value={embed.description || ""} onChange={(e) => setE({ description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-400">Thumbnail URL</Label>
                <Input value={embed.thumbnail || ""} onChange={(e) => setE({ thumbnail: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs text-slate-400">Image URL</Label>
                <Input value={embed.image || ""} onChange={(e) => setE({ image: e.target.value })} />
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-400">Footer text</Label>
              <Input value={embed.footer_text || ""} onChange={(e) => setE({ footer_text: e.target.value })} />
            </div>
            <div className="border-t border-slate-800/60 pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-mono uppercase text-slate-400">Fields</Label>
                <Button size="sm" variant="outline" onClick={() => setE({ fields: [...(embed.fields || []), { name: "", value: "", inline: false }] })}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add
                </Button>
              </div>
              {(embed.fields || []).map((f, i) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <Input className="col-span-4" value={f.name} onChange={(e) => setF(i, { name: e.target.value })} placeholder="Field name" />
                  <Input className="col-span-6" value={f.value} onChange={(e) => setF(i, { value: e.target.value })} placeholder="Field value" />
                  <div className="col-span-1 flex items-center"><Switch checked={f.inline} onCheckedChange={(v) => setF(i, { inline: v })} /></div>
                  <Button size="sm" variant="ghost" className="col-span-1" onClick={() => setE({ fields: embed.fields.filter((_, idx) => idx !== i) })}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 h-max">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3">// live preview</div>
          <DiscordEmbedPreview
            embed={embed}
            text={cfg.text}
            vars={{ user: "@Alex", username: "Alex#0001", server: "Command Deck", member_count: "1,247" }}
          />
        </div>
      </div>
    </div>
  );
}
