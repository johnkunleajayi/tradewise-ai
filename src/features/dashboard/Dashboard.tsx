import { useState } from "react";
import { ArrowUpRight, Compass, Sparkles } from "lucide-react";
import type { LocalDraft } from "../../types/dashboard";
import { AskWorkspace } from "./AskWorkspace";
import { ProgressCards } from "./ProgressCards";
import { RecentAnalysis } from "./RecentAnalysis";
export function Dashboard({ name }: { name: string }) {
  const [drafts, setDrafts] = useState<LocalDraft[]>([]);
  return (
    <div
      className="mx-auto max-w-[1360px] px-5 py-8 sm:px-7 sm:py-9 xl:px-10 xl:pt-12 2xl:pt-14"
      id="dashboard"
    >
      <section className="relative mb-8 flex min-h-[120px] items-center justify-between sm:min-h-[140px] 2xl:mb-12">
        <div>
          <div className="flex items-center gap-2 text-[9px] font-semibold tracking-[0.14em] text-accent sm:text-[10px] [&>span]:size-1.5 [&>span]:rounded-full [&>span]:bg-accent">
            <span />
            YOUR NEXT CHAPTER IN TRADING
          </div>
          <h1 className="mt-4 mb-3 break-words text-[30px] leading-tight font-semibold tracking-[-0.04em] sm:text-[clamp(30px,2.7vw,42px)] [&>span]:text-accent">
            Good to see you, {name.trim().split(/\s+/)[0]}
            <span>.</span>
          </h1>
          <p className="max-w-80 text-[13px] leading-7 text-muted sm:max-w-none sm:text-sm">
            Less noise. More perspective. Let’s build your trading edge.
          </p>
        </div>
        <div
          className="relative mr-4 hidden h-36 w-44 shrink-0 opacity-60 lg:block xl:w-60 xl:opacity-80"
          aria-hidden="true"
        >
          <div className="absolute -inset-y-2.5 inset-x-5 -rotate-30 rounded-full border border-line" />
          <div className="absolute -inset-y-6 inset-x-10 rotate-45 rounded-full border border-line opacity-60" />
          <ChartGlyph />
        </div>
      </section>
      <div className="mb-4 flex items-center justify-between gap-3 text-xs font-medium [&>span:last-child]:text-[9px] [&>span:last-child]:tracking-widest [&>span:last-child]:text-muted">
        <span>Small steps. Real progress.</span>
        <span>DEMO PROGRESS</span>
      </div>
      <ProgressCards />
      <AskWorkspace
        onDraft={(draft) => setDrafts((previous) => [draft, ...previous])}
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[minmax(0,1fr)_230px] lg:grid-cols-[minmax(0,1fr)_245px] xl:grid-cols-[minmax(0,1fr)_280px]">
        <RecentAnalysis drafts={drafts} />
        <aside className="rounded-xl border border-line bg-linear-to-br from-tint to-surface p-6 [&>h2]:mt-5 [&>h2]:mb-3 [&>h2]:text-2xl [&>h2]:leading-snug [&>h2]:font-semibold [&>h2]:tracking-tight [&_br]:hidden sm:[&_br]:block [&>p]:text-xs [&>p]:leading-7 [&>p]:text-muted [&>a]:mt-5 [&>a]:flex [&>a]:items-center [&>a]:gap-2 [&>a]:text-xs [&>a]:font-medium [&>a]:text-accent">
          <div className="flex items-center gap-2 text-[9px] font-semibold tracking-[0.14em] text-accent sm:text-[10px] [&>span]:size-1.5 [&>span]:rounded-full [&>span]:bg-accent">
            <Compass size={16} />
            THE TRADER’S MINDSET
          </div>
          <h2>
            Consistency <br />
            is your superpower.
          </h2>
          <p>
            You don’t need to catch every move. You need a process you can
            repeat.
          </p>
          <div className="my-5 h-px bg-line" />
          <div className="flex gap-3 text-accent [&>p]:text-xs [&>p]:leading-7 [&>p]:text-muted">
            <Sparkles size={17} />
            <p>
              Start with one chart. <br />
              Ask one better question. <br />
              Learn something new.
            </p>
          </div>
          <a href="#ask">
            Make today count <ArrowUpRight size={16} />
          </a>
        </aside>
      </div>
    </div>
  );
}
function ChartGlyph() {
  return (
    <svg
      className="absolute inset-x-0 top-7 w-44 xl:top-5 xl:w-[230px]"
      viewBox="0 0 240 120"
    >
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#43d7f5" stopOpacity=".3" />
          <stop offset="1" stopColor="#43d7f5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M10 100 45 80 70 88 101 49 125 60 165 22 185 35 222 8V120H10Z"
        fill="url(#chartFill)"
      />
      <path
        d="m10 100 35-20 25 8 31-39 24 11 40-38 20 13 37-27"
        fill="none"
        stroke="#43d7f5"
        strokeWidth="2.5"
      />
      <circle cx="222" cy="8" r="5" fill="#43d7f5" />
    </svg>
  );
}
