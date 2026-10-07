import { useRef, useState } from "react";
import {
  ArrowUp,
  ChartCandlestick,
  Paperclip,
  Sparkles,
  X,
} from "lucide-react";
import type { LocalDraft } from "../../types/dashboard";
export function AskWorkspace({
  onDraft,
}: {
  onDraft: (draft: LocalDraft) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [chart, setChart] = useState<File>();
  const [notice, setNotice] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  function submit() {
    if (!prompt.trim() && !chart) return;
    onDraft({
      id: crypto.randomUUID(),
      prompt: prompt.trim() || "Review my uploaded chart",
      chartName: chart?.name,
    });
    setNotice(
      "Draft added below. AI analysis is not connected in this frontend preview.",
    );
    setPrompt("");
    setChart(undefined);
    if (fileInput.current) fileInput.current.value = "";
  }
  return (
    <section
      className="mb-9 scroll-mt-6 rounded-2xl border border-accent/25 bg-surface p-5 shadow-panel sm:p-6 xl:p-7 2xl:p-8"
      id="ask"
    >
      <div className="mb-6 flex items-center gap-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight sm:[&_h2]:text-xl [&_p]:mt-1.5 [&_p]:text-[11px] [&_p]:leading-relaxed [&_p]:text-muted sm:[&_p]:text-xs">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-accent/20 bg-tint text-accent sm:size-11">
          <Sparkles size={23} />
        </span>
        <div>
          <h2>Ask TradeWise AI</h2>
          <p>A fresh perspective for your next move.</p>
        </div>
        <span className="ml-auto hidden rounded-md border border-accent/20 px-2 py-1.5 text-[9px] font-medium tracking-widest text-accent sm:inline">
          AI WORKSPACE
        </span>
      </div>
      <form
        className="rounded-xl border border-line bg-canvas p-4 focus-within:border-accent/70 sm:p-5"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label className="sr-only" htmlFor="prompt">
          Ask TradeWise AI
        </label>
        <textarea
          className="block min-h-28 max-h-64 w-full resize-y border-0 bg-transparent text-sm leading-7 text-ink outline-none placeholder:text-muted focus-visible:outline-none sm:min-h-24"
          id="prompt"
          placeholder="What’s on your trading mind? Ask a question or upload a chart…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={4000}
        />
        {chart && (
          <div className="flex items-center gap-2 py-2 text-xs text-accent [&>span]:wrap-anywhere [&>button]:grid [&>button]:size-7 [&>button]:shrink-0 [&>button]:place-items-center [&>button]:rounded-md [&>button]:bg-raised">
            <Paperclip size={14} />
            <span>{chart.name}</span>
            <button
              type="button"
              aria-label="Remove chart"
              onClick={() => {
                setChart(undefined);
                if (fileInput.current) fileInput.current.value = "";
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}
        <div className="mt-3 flex items-center gap-3">
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (
                !["image/png", "image/jpeg", "image/webp"].includes(
                  file.type,
                ) ||
                file.size > 10 * 1024 * 1024
              ) {
                setNotice("Choose a PNG, JPG or WebP image under 10 MB.");
                e.target.value = "";
                return;
              }
              setChart(file);
              setNotice("Chart attached locally. No file has been uploaded.");
            }}
          />
          <button
            className="flex min-h-10 items-center gap-2 rounded-lg border border-line bg-raised px-3 py-2 text-xs font-medium hover:border-accent hover:bg-tint"
            type="button"
            onClick={() => fileInput.current?.click()}
          >
            <ChartCandlestick size={17} />
            Upload Chart
          </button>
          <span className="hidden text-[10px] text-muted sm:inline xl:text-[11px]">
            PNG, JPG or WebP · up to 10 MB
          </span>
          <button
            className="ml-auto grid size-10 shrink-0 place-items-center rounded-lg bg-linear-to-br from-cyan-200 to-sky-400 text-slate-950 hover:from-cyan-100 hover:to-sky-300"
            type="submit"
            aria-label="Create local analysis draft"
            disabled={!prompt.trim() && !chart}
          >
            <ArrowUp size={21} />
          </button>
        </div>
      </form>
      <div className="mt-5 flex flex-wrap items-center gap-2 [&>span]:w-full [&>span]:text-[11px] [&>span]:text-muted xl:[&>span]:mr-1 xl:[&>span]:w-auto [&>button]:flex [&>button]:min-h-8 [&>button]:items-center [&>button]:gap-2 [&>button]:rounded-lg [&>button]:border [&>button]:border-line [&>button]:px-2.5 [&>button]:py-2 [&>button]:text-[11px] [&>button]:text-muted [&>button:hover]:border-accent/50 [&>button:hover]:bg-tint [&>button:hover]:text-accent [&_svg]:rotate-45">
        <span>Try asking</span>
        {[
          "Explain support & resistance",
          "How do I manage risk?",
          "Build a trading checklist",
        ].map((text) => (
          <button
            key={text}
            onClick={() => {
              setPrompt(text);
              document.getElementById("prompt")?.focus();
            }}
          >
            {text}
            <ArrowUp size={12} />
          </button>
        ))}
      </div>
      <p
        className="mt-4 text-[10px] leading-6 text-muted sm:text-[11px]"
        role="status"
      >
        {notice ||
          "Your space to explore. Prompts and charts stay in this session; live AI is coming later."}
      </p>
    </section>
  );
}
