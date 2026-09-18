import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Trash2, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import api from "../lib/api";

const KIND_LABEL = {
  profanity: "Profanity", strong_profanity: "Strong Profanity", slurs: "Hateful / Slurs",
  insults: "Insults", invites: "Discord Invites", external_links: "External Links",
  spam: "Spam", flood: "Flood", repeated_messages: "Repeated Msgs",
  excessive_caps: "Excessive Caps", excessive_emojis: "Excessive Emojis",
  mass_mentions: "Mass Mentions", scam_links: "Scam Links",
  obfuscation: "Obfuscation", custom_regex: "Custom Regex",
};

const RuleCard = ({ rule, onChange, onDelete, onSave }) => {
  const a = rule.actions || {};
  const set = (patch) => onChange({ ...rule, ...patch });
  const setA = (patch) => onChange({ ...rule, actions: { ...a, ...patch } });
  return (
    <div className="card-obsidian rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Switch data-testid={`rule-enabled-${rule.id}`} checked={rule.enabled} onCheckedChange={(v) => set({ enabled: v })} />
          <div>
            <div className="font-display font-bold text-slate-100">{rule.name || KIND_LABEL[rule.kind] || rule.kind}</div>
            <div className="text-[10px] font-mono uppercase text-slate-500 tracking-widest">{rule.kind}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={onDelete} data-testid={`rule-delete-${rule.id}`}><Trash2 className="w-4 h-4 text-red-400" /></Button>
          <Button size="sm" onClick={onSave} data-testid={`rule-save-${rule.id}`} className="bg-cyan-400 hover:bg-cyan-300 text-[#070A10] font-semibold">
            <Save className="w-3.5 h-3.5 mr-1" /> Save
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label className="text-xs font-mono uppercase text-slate-400">Rule name</Label>
          <Input value={rule.name || ""} onChange={(e) => set({ name: e.target.value })} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs font-mono uppercase text-slate-400">Threshold</Label>
          <Input type="number" value={rule.threshold ?? 0} onChange={(e) => set({ threshold: parseInt(e.target.value || 0) })} className="mt-1" />
        </div>
      </div>

      {(rule.kind === "profanity" || rule.kind === "strong_profanity" || rule.kind === "slurs" || rule.kind === "insults") && (
        <div className="mb-4">
          <Label className="text-xs font-mono uppercase text-slate-400">Extra words (comma-separated). Leave empty to use defaults.</Label>
          <Textarea rows={2} value={(rule.words || []).join(", ")}
                    onChange={(e) => set({ words: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                    className="mt-1 font-mono text-xs" />
        </div>
      )}

      {rule.kind === "external_links" && (
        <div className="mb-4">
          <Label className="text-xs font-mono uppercase text-slate-400">Allowed domains</Label>
          <Textarea rows={2} value={(rule.allowed_domains || []).join(", ")}
                    onChange={(e) => set({ allowed_domains: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                    className="mt-1 font-mono text-xs" placeholder="youtube.com, github.com" />
        </div>
      )}

      {rule.kind === "custom_regex" && (
        <div className="mb-4">
          <Label className="text-xs font-mono uppercase text-slate-400">Regex pattern</Label>
          <Input value={rule.regex || ""} onChange={(e) => set({ regex: e.target.value })} className="mt-1 font-mono text-xs" />
        </div>
      )}

      <div className="border-t border-slate-800/60 pt-4">
        <div className="text-xs font-mono uppercase text-slate-400 mb-3">Actions</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {[["delete", "Delete"], ["warn", "Warn"], ["dm", "DM user"], ["kick", "Kick"], ["ban", "Ban"], ["alert_staff", "Alert staff"], ["log", "Log"]].map(([k, l]) => (
            <label key={k} className="flex items-center gap-2 cursor-pointer">
              <Switch data-testid={`action-${k}-${rule.id}`} checked={!!a[k]} onCheckedChange={(v) => setA({ [k]: v })} />
              <span className="text-slate-300">{l}</span>
            </label>
          ))}
          <div className="col-span-2 md:col-span-4">
            <Label className="text-xs text-slate-400">Timeout (seconds, 0 = off)</Label>
            <Input type="number" value={a.timeout_seconds ?? 0} onChange={(e) => setA({ timeout_seconds: parseInt(e.target.value || 0) })} className="mt-1" />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/60 pt-4 mt-4">
        <Label className="text-xs font-mono uppercase text-slate-400">DM message when this rule fires</Label>
        <Textarea rows={2} value={rule.dm_template || ""} onChange={(e) => set({ dm_template: e.target.value })} className="mt-1" />
      </div>
    </div>
  );
};

export default function AutoMod() {
  const { gid } = useParams();
  const [rules, setRules] = useState(null);

  const load = () => api.getAutomod(gid).then(setRules);
  useEffect(() => { load(); }, [gid]); // eslint-disable-line react-hooks/exhaustive-deps

  const upd = (id, next) => setRules(rules.map((r) => (r.id === id ? next : r)));
  const save = async (r) => { await api.updateAutomod(gid, r.id, r); toast.success(`Rule "${r.name}" saved`); };
  const del = async (r) => { await api.deleteAutomod(gid, r.id); toast("Rule removed"); load(); };
  const add = async () => {
    const created = await api.createAutomod(gid, { kind: "custom_regex", name: "New Custom Rule", threshold: 0, actions: { delete: true, log: true } });
    setRules([...rules, created]);
  };

  if (!rules) return <div className="text-slate-500">Loading…</div>;

  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">// automod shield</div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl font-extrabold">AutoMod rules</h1>
        <Button data-testid="add-rule-btn" onClick={add} className="bg-cyan-400 hover:bg-cyan-300 text-[#070A10] font-semibold">
          <Plus className="w-4 h-4 mr-1" /> Add custom rule
        </Button>
      </div>
      <div className="grid gap-5">
        {rules.map((r) => (
          <RuleCard key={r.id} rule={r} onChange={(next) => upd(r.id, next)} onSave={() => save(r)} onDelete={() => del(r)} />
        ))}
      </div>
    </div>
  );
}
