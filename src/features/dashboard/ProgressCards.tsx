import { Flame, Zap, Award, Check } from "lucide-react";
export function ProgressCards() {
  return (
    <section
      className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 xl:gap-5"
      aria-label="Demo learning progress"
    >
      <article className="grid grid-cols-2 items-center gap-3 rounded-xl border border-line bg-surface p-5 shadow-panel sm:block sm:min-h-44 xl:px-6 2xl:min-h-48">
        <div className="col-start-1 flex items-center justify-between gap-2 text-xs font-medium text-muted [&>svg]:w-4 [&>svg]:text-accent sm:[&>svg]:w-[19px]">
          <span>Learning streak</span>
          <Flame size={19} />
        </div>
        <div className="col-start-2 row-start-1 text-right text-3xl font-semibold tracking-tight tabular-nums sm:my-3 sm:text-left sm:text-4xl [&>span]:ml-1 [&>span]:text-xs [&>span]:font-normal [&>span]:tracking-normal [&>span]:text-muted">
          3 <span>days</span>
        </div>
        <div className="col-span-full flex items-center gap-1.5 sm:mt-4 [&>span]:grid [&>span]:size-[22px] [&>span]:place-items-center [&>span]:rounded-full [&>span]:border [&>span]:text-[9px] [&>small]:ml-auto [&>small]:text-[10px] [&>small]:text-muted sm:[&>small]:hidden xl:[&>small]:block">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span
              key={i}
              className={
                i < 3
                  ? "border-accent/35 bg-tint text-accent"
                  : "border-line text-muted"
              }
              aria-label={`${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][i]}${i < 3 ? ", complete" : ""}`}
            >
              {i < 3 ? <Check size={12} /> : d}
            </span>
          ))}
          <small>Keep it going</small>
        </div>
      </article>
      <article className="grid grid-cols-2 items-center gap-3 rounded-xl border border-line bg-surface p-5 shadow-panel sm:block sm:min-h-44 xl:px-6 2xl:min-h-48">
        <div className="col-start-1 flex items-center justify-between gap-2 text-xs font-medium text-muted [&>svg]:w-4 [&>svg]:text-accent sm:[&>svg]:w-[19px]">
          <span>Total experience</span>
          <Zap size={19} />
        </div>
        <div className="col-start-2 row-start-1 text-right text-3xl font-semibold tracking-tight tabular-nums sm:my-3 sm:text-left sm:text-4xl [&>span]:ml-1 [&>span]:text-xs [&>span]:font-normal [&>span]:tracking-normal [&>span]:text-muted">
          750 <span>XP</span>
        </div>
        <p className="col-span-full text-[11px] leading-relaxed text-muted sm:mt-4">
          A little learning. A lasting edge.
        </p>
        <div className="mt-3 hidden h-0.5 w-11 bg-accent/70 sm:block" />
      </article>
      <article className="grid grid-cols-2 items-center gap-3 rounded-xl border border-line bg-surface p-5 shadow-panel sm:block sm:min-h-44 xl:px-6 2xl:min-h-48">
        <div className="col-start-1 flex items-center justify-between gap-2 text-xs font-medium text-muted [&>svg]:w-4 [&>svg]:text-accent sm:[&>svg]:w-[19px]">
          <span>Your level</span>
          <Award size={19} />
        </div>
        <div className="col-start-2 row-start-1 flex items-center justify-end sm:justify-between">
          <div className="col-start-2 row-start-1 text-right text-3xl font-semibold tracking-tight tabular-nums sm:my-3 sm:text-left sm:text-4xl [&>span]:ml-1 [&>span]:text-xs [&>span]:font-normal [&>span]:tracking-normal [&>span]:text-muted">
            03 <span>Explorer</span>
          </div>
          <span className="hidden rounded-lg border border-line bg-tint px-2 py-1 font-sans text-xl tracking-wide text-accent sm:inline">
            III
          </span>
        </div>
        <div
          className="col-span-full h-1 overflow-hidden rounded-full bg-raised [&>span]:block [&>span]:h-full [&>span]:w-3/4 [&>span]:bg-linear-to-r [&>span]:from-sky-500 [&>span]:to-cyan-300"
          role="progressbar"
          aria-label="Progress to level 4"
          aria-valuenow={75}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span />
        </div>
        <div className="col-span-full flex justify-between text-[10px] text-muted sm:mt-2.5">
          <span>750 / 1,000 XP</span>
          <span>Level 4</span>
        </div>
      </article>
    </section>
  );
}
