import { useState } from "react";
import { ArrowUpRight, Compass, Sparkles } from "lucide-react";
import type { LocalDraft } from "../../types/dashboard";
import { AskWorkspace } from "./AskWorkspace";
import { ProgressCards } from "./ProgressCards";
import { RecentAnalysis } from "./RecentAnalysis";
export function Dashboard() {
  const [drafts, setDrafts] = useState<LocalDraft[]>([]);
  return (
    <div className="dashboard" id="dashboard">
      <section className="hero">
        <div>
          <div className="eyebrow">
            <span />
            YOUR NEXT CHAPTER IN TRADING
          </div>
          <h1>
            Good to see you, trader<span>.</span>
          </h1>
          <p>Less noise. More perspective. Let’s build your trading edge.</p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <ChartGlyph />
        </div>
      </section>
      <div className="progress-heading">
        <span>Small steps. Real progress.</span>
        <span>DEMO PROGRESS</span>
      </div>
      <ProgressCards />
      <AskWorkspace
        onDraft={(draft) => setDrafts((previous) => [draft, ...previous])}
      />
      <div className="bottom-grid">
        <RecentAnalysis drafts={drafts} />
        <aside className="insight-card">
          <div className="eyebrow">
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
          <div className="insight-rule" />
          <div className="tip">
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
    <svg className="hero-chart" viewBox="0 0 240 120">
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
