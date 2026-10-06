import { Flame, Zap, Award, Check } from "lucide-react";
export function ProgressCards() {
  return (
    <section className="stats-grid" aria-label="Demo learning progress">
      <article className="stat-card">
        <div className="stat-title">
          <span>Learning streak</span>
          <Flame size={19} />
        </div>
        <div className="stat-value">
          3 <span>days</span>
        </div>
        <div className="week-days">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span
              key={i}
              className={i < 3 ? "completed" : ""}
              aria-label={`${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][i]}${i < 3 ? ", complete" : ""}`}
            >
              {i < 3 ? <Check size={12} /> : d}
            </span>
          ))}
          <small>Keep it going</small>
        </div>
      </article>
      <article className="stat-card">
        <div className="stat-title">
          <span>Total experience</span>
          <Zap size={19} />
        </div>
        <div className="stat-value">
          750 <span>XP</span>
        </div>
        <p className="stat-caption">A little learning. A lasting edge.</p>
        <div className="stat-line" />
      </article>
      <article className="stat-card">
        <div className="stat-title">
          <span>Your level</span>
          <Award size={19} />
        </div>
        <div className="level-row">
          <div className="stat-value">
            03 <span>Explorer</span>
          </div>
          <span className="level-symbol">III</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Progress to level 4"
          aria-valuenow={75}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span />
        </div>
        <div className="progress-caption">
          <span>750 / 1,000 XP</span>
          <span>Level 4</span>
        </div>
      </article>
    </section>
  );
}
