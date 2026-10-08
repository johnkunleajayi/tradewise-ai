import { ChartNoAxesCombined, ImagePlus, Sparkles } from "lucide-react";

export function WorkspacePreview() {
  return (
    <figure className="min-w-0 rounded-2xl border border-line bg-surface p-4 shadow-panel sm:p-6">
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
        <span className="flex items-center gap-2 text-xs font-medium">
          <ChartNoAxesCombined size={16} className="text-accent" /> Your
          thinking space
        </span>
        <span className="rounded-full border border-line px-2.5 py-1 text-[10px] text-muted">
          Concept preview
        </span>
      </figcaption>
      <div className="pt-6">
        <p className="text-[10px] font-medium tracking-widest text-muted">
          A QUESTION WORTH ASKING
        </p>
        <p className="mt-3 text-lg leading-7 font-medium tracking-tight sm:text-xl">
          “What should I consider before entering this trade?”
        </p>
        <div className="my-5 rounded-xl border border-line bg-canvas p-4">
          <div className="flex items-center justify-between text-[10px] text-muted">
            <span>MARKET CONTEXT</span>
            <span>Illustrative chart</span>
          </div>
          <svg
            viewBox="0 0 400 108"
            className="mt-4 w-full text-accent"
            role="img"
            aria-label="Illustrative market price movement, not live data"
          >
            <path
              d="M0 24H400 M0 54H400 M0 84H400"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.12"
            />
            <path
              d="M0 87L22 77L40 82L59 59L78 68L98 50L115 58L137 31L157 47L178 39L199 63L219 51L240 66L260 41L281 47L300 23L322 34L343 19L363 38L382 21L400 27"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
          <span className="mt-2 flex items-center gap-2 text-[11px] text-muted">
            <ImagePlus size={14} /> Bring your chart. Add your context.
          </span>
        </div>
        <div className="rounded-xl border border-accent/20 bg-tint p-4">
          <p className="flex items-center gap-2 text-xs font-semibold text-accent">
            <Sparkles size={15} /> A framework for reflection
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">
            What supports your idea? What could invalidate it? How much risk are
            you prepared to take?
          </p>
        </div>
        <p className="mt-4 text-[10px] leading-5 text-muted">
          Illustrative experience. AI responses and screenshot analysis are not
          yet available.
        </p>
      </div>
    </figure>
  );
}
