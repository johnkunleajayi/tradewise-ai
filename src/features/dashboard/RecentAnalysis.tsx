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
    <section className="recent-section" id="recent">
      <SectionHeading
        title="Recent analysis"
        subtitle="Your ideas, insights and next steps. All in one place."
        action={<span className="count-badge">{drafts.length} drafts</span>}
      />
      {drafts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">
            <ChartNoAxesCombined size={28} />
          </span>
          <h3>A clearer picture starts with one question.</h3>
          <p>
            Your analysis will live here. Start with a question
            <br className="desktop-break" /> or bring a chart you’d like to
            explore.
          </p>
          <a href="#ask">
            Create your first draft <ArrowUpRight size={16} />
          </a>
        </div>
      ) : (
        <div className="draft-list">
          {drafts.map((d) => (
            <article className="draft-row" key={d.id}>
              <span className="mini-icon">
                <FileText size={20} />
              </span>
              <div>
                <h3>{d.prompt}</h3>
                <p>
                  {d.chartName || "Text prompt"} · Local preview, not analyzed
                </p>
              </div>
              <span className="draft-status">
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
