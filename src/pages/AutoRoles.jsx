import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Save, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import api from "../lib/api";

const RolePicker = ({ roles, value, onChange, testid }) => (
  <div data-testid={testid} className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
    {roles.map((r) => {
      const on = value.includes(r.id);
      return (
        <button key={r.id} type="button" onClick={() => onChange(on ? value.filter((x) => x !== r.id) : [...value, r.id])}
                className={`text-xs px-2 py-1 rounded-full border ${on ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-200" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}>
          {r.name}
        </button>
      );
    })}
  </div>
);

export default function AutoRoles() {
  const { gid } = useParams();
  const [cfg, setCfg] = useState(null);
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    api.getAuto(gid).then(setCfg);
    api.roles(gid).then(setRoles);
  }, [gid]);
  if (!cfg) return <div className="text-slate-500">Loading…</div>;
  const save = async () => { await api.putAuto(gid, cfg); toast.success("Auto roles saved"); };
  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">// auto roles</div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl font-extrabold flex items-center gap-3"><UserPlus className="w-8 h-8 text-emerald-400" /> Auto Roles</h1>
        <div className="flex items-center gap-3">
          <Switch data-testid="auto-enabled" checked={cfg.enabled} onCheckedChange={(v) => setCfg({ ...cfg, enabled: v })} />
          <Button data-testid="auto-save" onClick={save} className="bg-cyan-400 text-[#070A10] font-semibold"><Save className="w-4 h-4 mr-1" /> Save</Button>
        </div>
      </div>
      <div className="card-obsidian rounded-2xl p-6 space-y-5 max-w-3xl">
        <div>
          <Label className="text-sm font-semibold">Roles for new members</Label>
          <div className="mt-2"><RolePicker roles={roles} value={cfg.role_ids} onChange={(v) => setCfg({ ...cfg, role_ids: v })} testid="member-roles" /></div>
        </div>
        <div className="border-t border-slate-800/60 pt-5">
          <Label className="text-sm font-semibold">Roles for bots</Label>
          <div className="mt-2"><RolePicker roles={roles} value={cfg.bot_role_ids} onChange={(v) => setCfg({ ...cfg, bot_role_ids: v })} testid="bot-roles" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-slate-800/60 pt-5">
          <div>
            <Label className="text-xs">Assignment delay (seconds)</Label>
            <Input type="number" value={cfg.delay_seconds} onChange={(e) => setCfg({ ...cfg, delay_seconds: parseInt(e.target.value || 0) })} />
          </div>
          <div className="flex items-end gap-3">
            <Switch checked={cfg.only_after_verification} onCheckedChange={(v) => setCfg({ ...cfg, only_after_verification: v })} />
            <Label className="text-sm">Only after verification</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
