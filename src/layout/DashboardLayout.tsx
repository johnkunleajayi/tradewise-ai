import type { ReactNode } from "react";
import {
  ArrowUpRight,
  LayoutDashboard,
  History,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Brand } from "../ui/Brand";
import { ThemeToggle } from "../ui/ThemeToggle";
import { UserIdentity } from "../features/auth/UserIdentity";
import type { AuthUser } from "../types/auth";
export function DashboardLayout({
  children,
  user,
  onLogout,
  signingOut,
}: {
  children: ReactNode;
  user: AuthUser;
  onLogout: () => void;
  signingOut: boolean;
}) {
  return (
    <div className="min-h-screen sm:flex">
      <a
        className="fixed -top-16 left-5 z-20 rounded-lg bg-accent p-3 text-canvas focus:top-3"
        href="#main"
      >
        Skip to content
      </a>
      <aside className="z-10 border-b border-line bg-sidebar px-5 pt-5 sm:fixed sm:inset-y-0 sm:left-0 sm:flex sm:w-[76px] sm:flex-col sm:border-r sm:border-b-0 sm:px-3 sm:py-7 lg:w-[210px] lg:px-4 xl:w-[242px] xl:px-5 xl:pt-8 [&>nav]:-mx-1 [&>nav]:mt-5 [&>nav]:flex [&>nav]:gap-1 sm:[&>nav]:mx-0 sm:[&>nav]:mt-9 sm:[&>nav]:block lg:[&>nav]:mt-0">
        <Brand />
        <div className="mx-3 mt-12 mb-4 hidden text-[10px] font-medium tracking-[0.16em] text-muted lg:block">
          YOUR WORKSPACE
        </div>
        <nav aria-label="Main navigation">
          <a
            className="my-0 flex flex-1 items-center justify-center gap-1.5 rounded-t-lg px-1.5 py-3.5 text-[10px] font-medium whitespace-normal sm:whitespace-nowrap border border-accent/20 bg-tint text-accent hover:bg-tint sm:my-1 sm:gap-0 sm:rounded-lg sm:px-2.5 sm:py-4 sm:text-[0px] lg:justify-start lg:gap-3 lg:px-3 lg:text-[13px] [&>svg]:w-4 sm:[&>svg]:w-[19px]"
            href="#dashboard"
          >
            <LayoutDashboard size={19} />
            Overview
            <span className="ml-auto hidden size-1.5 rounded-full bg-accent lg:block" />
          </a>
          <a
            className="my-0 flex flex-1 items-center justify-center gap-1.5 rounded-t-lg px-1.5 py-3.5 text-[10px] font-medium whitespace-normal sm:whitespace-nowrap text-muted hover:bg-raised hover:text-ink sm:my-1 sm:gap-0 sm:rounded-lg sm:px-2.5 sm:py-4 sm:text-[0px] lg:justify-start lg:gap-3 lg:px-3 lg:text-[13px] [&>svg]:w-4 sm:[&>svg]:w-[19px]"
            href="#ask"
          >
            <Sparkles size={19} />
            AI workspace
          </a>
          <a
            className="my-0 flex flex-1 items-center justify-center gap-1.5 rounded-t-lg px-1.5 py-3.5 text-[10px] font-medium whitespace-normal sm:whitespace-nowrap text-muted hover:bg-raised hover:text-ink sm:my-1 sm:gap-0 sm:rounded-lg sm:px-2.5 sm:py-4 sm:text-[0px] lg:justify-start lg:gap-3 lg:px-3 lg:text-[13px] [&>svg]:w-4 sm:[&>svg]:w-[19px]"
            href="#recent"
          >
            <History size={19} />
            Recent analysis
          </a>
        </nav>
        <div className="mt-auto hidden pt-12 lg:block">
          <div className="rounded-xl border border-line bg-linear-to-br from-tint to-transparent p-4 [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:text-[13px] [&>h3]:font-semibold [&>p]:text-xs [&>p]:leading-7 [&>p]:text-muted [&>a]:mt-5 [&>a]:flex [&>a]:items-center [&>a]:justify-between [&>a]:gap-2 [&>a]:text-[11px] [&>a]:font-medium [&>a]:text-accent">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-tint text-accent">
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
          <div className="mt-6 flex items-center gap-2.5 border-t border-line pt-5 text-[10px] leading-5 text-muted [&_small]:text-[9px]">
            <span className="rounded-md border border-line p-2 text-[10px]">
              TW
            </span>
            <span>
              Thoughtful trading.
              <br />
              <small>Powered by your curiosity.</small>
            </span>
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1 sm:ml-[76px] lg:ml-[210px] xl:ml-[242px]">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-line px-5 sm:h-[84px] sm:px-7 xl:px-10">
          <div className="text-[11px] text-muted sm:text-xs [&>span]:mx-2 [&>span]:text-line sm:[&>span]:mx-4 [&>strong]:font-medium [&>strong]:text-ink">
            <span className="max-[399px]:hidden">Workspace</span> <span>/</span>{" "}
            <strong>Overview</strong>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3.5 xl:gap-5">
            <span className="hidden text-[10px] font-medium tracking-widest text-muted xl:block">
              FRONTEND PREVIEW
            </span>
            <ThemeToggle />
            <UserIdentity user={user} onLogout={onLogout} busy={signingOut} />
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="mx-auto flex max-w-[1360px] justify-between gap-4 px-5 pb-6 text-[9px] leading-relaxed text-muted sm:px-7 sm:text-[10px] xl:px-10">
          <span>Built for a clearer trading journey.</span>
          <span>
            TradeWise AI <span className="px-2 text-accent">•</span> Frontend
            v0.1
          </span>
        </footer>
      </div>
    </div>
  );
}
