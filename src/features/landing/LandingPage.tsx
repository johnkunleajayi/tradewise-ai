import type { ReactNode } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Brand } from "../../ui/Brand";
import { ThemeToggle } from "../../ui/ThemeToggle";
import { WorkspacePreview } from "./WorkspacePreview";
import { LearningSteps } from "./LearningSteps";

export function LandingPage({ signIn }: { signIn: ReactNode }) {
  return (
    <div id="dashboard" className="min-h-dvh bg-canvas">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-6 sm:px-10 [&_a]:justify-start [&_a>span:last-child]:block">
        <Brand />
        <div className="flex items-center gap-6">
          <a
            href="#how-it-works"
            className="hidden text-xs text-muted hover:text-ink sm:inline"
          >
            How it works
          </a>
          <ThemeToggle />
        </div>
      </header>
      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-12 pb-16 sm:px-10 sm:py-20 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            <p className="mb-6 text-[10px] font-semibold tracking-[0.2em] text-accent">
              YOUR THINKING PARTNER FOR FOREX & CRYPTO
            </p>
            <h1 className="text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.04] font-semibold tracking-[-0.055em]">
              Think. Learn.
              <br />
              <span className="text-accent">Trade Wiser.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-8 text-muted">
              Real trading situations. Clearer thinking. TradeWise AI helps you explore Forex and crypto decisions with
              AI-powered guidance — and understand the reasoning behind them.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href="#get-started"
                className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-canvas hover:opacity-90"
              >
                Get Started <ArrowUpRight size={18} />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex min-h-12 items-center gap-2 text-sm text-muted hover:text-ink"
              >
                Explore the approach <ArrowDown size={15} />
              </a>
            </div>
            <p className="mt-5 text-xs leading-6 text-muted">
              A learning companion. Not a trading signal service.
            </p>
          </div>
          <WorkspacePreview />
        </section>
        <LearningSteps />
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-10 sm:py-20 lg:grid-cols-2 lg:gap-20">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-accent">
              BUILD THE HABIT OF THINKING FIRST
            </p>
            <h2 className="mt-5 text-3xl leading-tight font-semibold tracking-[-0.035em] sm:text-4xl">
              More perspective.
              <br />
              More discipline.
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted">
              Pause before acting. Question your assumptions. Understand the
              risk. The goal is to help you develop a repeatable decision-making
              process, one learning moment at a time.
            </p>
            <p className="mt-6 border-l-2 border-accent pl-4 text-sm leading-7">
              Your decisions stay yours.
            </p>
            <p className="mt-6 text-xs leading-6 text-muted">
              Explore the workspace today. AI guidance and chart analysis are
              coming next and are not available yet.
            </p>
          </div>
          {signIn}
        </section>
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-8 sm:px-10 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-semibold">
              TradeWise <span className="text-accent">AI</span>
            </p>
            <p className="mt-2 text-xs text-muted">
              Think. Learn. Trade Wiser.
            </p>
          </div>
          <p className="max-w-md text-xs leading-6 text-muted">
            For education and decision support only. Not financial advice or
            trading signals. Trading involves risk, including loss of capital.
          </p>
          <a href="#dashboard" className="text-xs text-muted hover:text-ink">
            Back to top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
