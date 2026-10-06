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
    <section className="ask-card" id="ask">
      <div className="ask-heading">
        <span className="sparkle-box">
          <Sparkles size={23} />
        </span>
        <div>
          <h2>Ask TradeWise AI</h2>
          <p>A fresh perspective for your next move.</p>
        </div>
        <span className="preview-pill">AI WORKSPACE</span>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label className="sr-only" htmlFor="prompt">
          Ask TradeWise AI
        </label>
        <textarea
          id="prompt"
          placeholder="What’s on your trading mind? Ask a question or upload a chart…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={4000}
        />
        {chart && (
          <div className="attachment">
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
        <div className="composer-actions">
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
            className="upload-button"
            type="button"
            onClick={() => fileInput.current?.click()}
          >
            <ChartCandlestick size={17} />
            Upload Chart
          </button>
          <span className="file-hint">PNG, JPG or WebP · up to 10 MB</span>
          <button
            className="send-button"
            type="submit"
            aria-label="Create local analysis draft"
            disabled={!prompt.trim() && !chart}
          >
            <ArrowUp size={21} />
          </button>
        </div>
      </form>
      <div className="suggestions">
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
      <p className="workspace-note" role="status">
        {notice ||
          "Your space to explore. Prompts and charts stay in this session; live AI is coming later."}
      </p>
    </section>
  );
}
