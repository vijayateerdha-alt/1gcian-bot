import React from "react";

// Renders a Discord-style embed preview from the same config shape as backend.
export default function DiscordEmbedPreview({ embed = {}, text = "", vars = {} }) {
  const replace = (s) => Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, v ?? ""), s ?? "");
  const bar = embed.color || "#00F0FF";
  return (
    <div className="rounded-lg bg-[#313338] p-4 max-w-xl">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 grid place-items-center text-cyan-300 font-bold text-sm">Æ</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">1GC(ian)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500 text-[#070A10] font-bold">BOT</span>
            <span className="text-[11px] text-slate-500">Today at {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          {text && <div className="text-slate-200 text-sm whitespace-pre-wrap break-words">{replace(text)}</div>}
        </div>
      </div>
      {embed.enabled !== false && (embed.title || embed.description || (embed.fields && embed.fields.length) || embed.image || embed.thumbnail) ? (
        <div className="ml-13 flex" style={{ marginLeft: "3.25rem" }}>
          <div className="w-1 rounded-l" style={{ background: bar }} />
          <div className="flex-1 bg-[#2b2d31] rounded-r p-3">
            {embed.author_name && (
              <div className="flex items-center gap-2 mb-1">
                {embed.author_icon && <img src={embed.author_icon} alt="" className="w-5 h-5 rounded-full" />}
                <span className="text-xs font-semibold text-slate-200">{replace(embed.author_name)}</span>
              </div>
            )}
            <div className="flex gap-3">
              <div className="flex-1 min-w-0">
                {embed.title && <div className="font-semibold text-white mb-1">{replace(embed.title)}</div>}
                {embed.description && <div className="text-sm text-slate-300 whitespace-pre-wrap break-words">{replace(embed.description)}</div>}
                {embed.fields?.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {embed.fields.map((f, i) => (
                      <div key={i} className={f.inline ? "" : "col-span-2"}>
                        <div className="text-xs font-semibold text-slate-200">{replace(f.name)}</div>
                        <div className="text-xs text-slate-400 whitespace-pre-wrap break-words">{replace(f.value)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {embed.thumbnail && <img src={embed.thumbnail} alt="" className="w-16 h-16 rounded object-cover" />}
            </div>
            {embed.image && <img src={embed.image} alt="" className="mt-2 rounded max-h-56 object-cover w-full" />}
            {(embed.footer_text) && (
              <div className="mt-2 flex items-center gap-2">
                {embed.footer_icon && <img src={embed.footer_icon} alt="" className="w-4 h-4 rounded-full" />}
                <span className="text-xs text-slate-400">{replace(embed.footer_text)}</span>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
