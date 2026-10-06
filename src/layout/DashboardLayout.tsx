import type { ReactNode } from "react";
import {
  ArrowUpRight,
  LayoutDashboard,
  History,
  Sparkles,
  Sun,
  Moon,
  ShieldCheck,
} from "lucide-react";
import { Brand } from "../ui/Brand";
import { useTheme } from "../hooks/useTheme";
export function DashboardLayout({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className="sidebar">
        <Brand />
        <div className="workspace-label">YOUR WORKSPACE</div>
        <nav aria-label="Main navigation">
          <a className="nav-item active" href="#dashboard">
            <LayoutDashboard size={19} />
            Overview
            <span className="nav-dot" />
          </a>
          <a className="nav-item" href="#ask">
            <Sparkles size={19} />
            AI workspace
          </a>
          <a className="nav-item" href="#recent">
            <History size={19} />
            Recent analysis
          </a>
        </nav>
        <div className="sidebar-bottom">
          <div className="mindset-card">
            <span className="mini-icon">
              <ShieldCheck size={20} />
            </span>
            <h3>Your edge starts here.</h3>
            <p>
              Build better habits.
              <br />
              Make more informed trades.
            </p>
            <a href="#ask">
              Explore your workspace <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="sidebar-foot">
            <span className="tiny-logo">TW</span>
            <span>
              Thoughtful trading.
              <br />
              <small>Powered by your curiosity.</small>
            </span>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>Overview</strong>
          </div>
          <div className="header-actions">
            <span className="demo-badge">FRONTEND PREVIEW</span>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
              <span>{theme === "dark" ? "Light" : "Dark"} mode</span>
            </button>
            <div className="profile" title="Demo profile">
              <span className="avatar">JD</span>
              <span>Demo trader</span>
            </div>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="page-footer">
          <span>Built for a clearer trading journey.</span>
          <span>
            TradeWise AI <span className="footer-dot">•</span> Frontend v0.1
          </span>
        </footer>
      </div>
    </div>
  );
}
