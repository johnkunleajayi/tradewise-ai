import {
  ArrowUpRight,
  ChartNoAxesCombined,
  FileText,
  Clock3,
} from "lucide-react";
import type { LocalDraft } from "../../types/dashboard";
import { SectionHeading } from "../../ui/SectionHeading";
export function RecentAnalysis({ drafts }: { drafts: LocalDraft[] }) {
  return (
    <section className="min-w-0 scroll-mt-6" id="recent">
      <SectionHeading
        title="Recent analysis"
        subtitle="Your ideas, insights and next steps. All in one place."
        action={
          <span className="shrink-0 rounded-md border border-line px-2 py-1 text-[10px] whitespace-nowrap text-muted">
            {drafts.length} drafts
          </span>
        }
      />
      {drafts.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface/50 px-4 py-7 text-center sm:p-7 [&>h3]:mb-2.5 [&>h3]:text-[13px] [&>h3]:font-medium [&>p]:text-xs [&>p]:leading-6 [&>p]:text-muted [&>a]:mt-5 [&>a]:flex [&>a]:items-center [&>a]:gap-2 [&>a]:text-xs [&>a]:font-medium [&>a]:text-accent">
          <span className="mb-5 grid size-14 place-items-center rounded-2xl border border-line bg-surface text-muted">
            <ChartNoAxesCombined size={28} />
          </span>
          <h3>A clearer picture starts with one question.</h3>
          <p>
            Your analysis will live here. Start with a question
            <br className="hidden sm:block" /> or bring a chart you’d like to
            explore.
          </p>
          <a href="#ask">
            Create your first draft <ArrowUpRight size={16} />
          </a>
        </div>
      ) : (
        <div className="grid max-h-90 gap-3 overflow-auto">
          {drafts.map((d) => (
            <article
              className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 [&>div]:min-w-0 [&>div]:flex-1 [&_h3]:text-xs [&_h3]:font-medium [&_h3]:wrap-anywhere [&_h3]:leading-relaxed [&_p]:mt-1.5 [&_p]:text-[11px] [&_p]:wrap-anywhere [&_p]:text-muted"
              key={d.id}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-tint text-accent">
                <FileText size={20} />
              </span>
              <div>
                <h3>{d.prompt}</h3>
                <p>
                  {d.chartName || "Text prompt"} · Local preview, not analyzed
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-[10px] text-accent">
                <Clock3 size={13} />
                Draft
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
