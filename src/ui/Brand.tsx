import { ChartNoAxesCombined } from "lucide-react";
export function Brand() {
  return (
    <a
      className="flex items-center justify-start gap-2.5 text-xl font-bold tracking-tight sm:justify-center lg:justify-start [&>span:last-child]:block sm:[&>span:last-child]:hidden lg:[&>span:last-child]:block"
      href="#dashboard"
      aria-label="TradeWise AI dashboard"
    >
      <span className="grid h-9 w-[34px] shrink-0 place-items-center rounded-[10px] bg-linear-to-br from-cyan-200 to-sky-400 text-slate-950">
        <ChartNoAxesCombined size={23} />
      </span>
      <span>
        TradeWise
        <span className="ml-1.5 text-xs font-semibold tracking-normal text-accent">
          AI
        </span>
      </span>
    </a>
  );
}
