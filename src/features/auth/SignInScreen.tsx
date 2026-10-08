import { useEffect, useState } from "react";
import { ArrowUpRight, LoaderCircle, ShieldCheck } from "lucide-react";
import { Brand } from "../../ui/Brand";
import { ThemeToggle } from "../../ui/ThemeToggle";
import { googleLoginUrl } from "./api";

export function SignInScreen({
  status,
  onRetry,
}: {
  status: "loading" | "anonymous" | "error";
  onRetry: () => void;
}) {
  const [leaving, setLeaving] = useState(false);
  const [callbackFailed] = useState(() =>
    new URLSearchParams(window.location.search).has("auth_error"),
  );
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("auth_error")) {
      url.searchParams.delete("auth_error");
      window.history.replaceState(null, "", url);
    }
    const reset = () => setLeaving(false);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);
  const unavailable = status === "error";
  const loading = status === "loading";
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-6 sm:px-10 [&_a]:justify-start [&_a>span:last-child]:block">
        <Brand />
        <ThemeToggle />
      </header>
      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-6 py-12 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:py-20">
        <section>
          <p className="mb-6 text-[10px] font-semibold tracking-[0.2em] text-accent">
            A MORE THOUGHTFUL TRADING JOURNEY
          </p>
          <h1 className="max-w-xl text-4xl leading-[1.12] font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            Build your process.
            <br />
            <span className="text-accent">Find your perspective.</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-muted sm:text-base">
            A dedicated space to reflect, build disciplined habits, and approach
            the markets with a clearer mind.
          </p>
          <div className="mt-10 flex items-center gap-3 border-t border-line pt-6 text-xs text-muted">
            <span className="h-px w-8 bg-accent" /> Thoughtful trading starts
            with you.
          </div>
        </section>
        <section
          className="relative overflow-hidden rounded-2xl border border-line bg-surface p-7 shadow-panel sm:p-10"
          aria-labelledby="signin-title"
          aria-busy={loading || leaving}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent" />
          <span className="mb-7 grid size-11 place-items-center rounded-xl border border-accent/20 bg-tint text-accent">
            <ShieldCheck size={22} />
          </span>
          <h2
            id="signin-title"
            className="text-2xl font-semibold tracking-tight"
          >
            {loading
              ? "Getting things ready"
              : unavailable
                ? "Let’s reconnect"
                : "Welcome to TradeWise AI"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            {loading
              ? "Checking your session securely."
              : unavailable
                ? "We couldn’t reach your account. Check your connection and try again."
                : "Sign in to enter your personal trading workspace."}
          </p>
          {loading ? (
            <div
              role="status"
              className="mt-8 flex items-center gap-3 text-sm text-muted"
            >
              <LoaderCircle
                className="motion-safe:animate-spin text-accent"
                size={19}
              />{" "}
              Checking session…
            </div>
          ) : unavailable ? (
            <button
              className="mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-canvas hover:opacity-90"
              onClick={onRetry}
            >
              Try again <ArrowUpRight size={17} />
            </button>
          ) : (
            <>
              {callbackFailed && (
                <p
                  role="alert"
                  className="mt-6 rounded-lg border border-line bg-raised p-3 text-xs leading-6 text-ink"
                >
                  Google sign-in wasn’t completed. Please try again.
                </p>
              )}
              <button
                className="mt-8 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-line bg-ink px-5 py-3 font-semibold text-canvas hover:opacity-90"
                disabled={leaving}
                onClick={() => {
                  setLeaving(true);
                  window.location.assign(googleLoginUrl());
                }}
              >
                {leaving ? (
                  <LoaderCircle
                    size={18}
                    className="motion-safe:animate-spin"
                  />
                ) : (
                  <span aria-hidden="true" className="text-lg font-bold">
                    G
                  </span>
                )}
                {leaving ? "Opening Google…" : "Continue with Google"}
              </button>
              <p className="mt-5 text-center text-xs leading-6 text-muted">
                Secure sign-in with your Google account.
                <br />
                Your password stays with Google.
              </p>
            </>
          )}
        </section>
      </main>
      <footer className="px-6 py-6 text-center text-[11px] leading-6 text-muted">
        TradeWise AI · Built for learning and reflection. Not trading signals.
      </footer>
    </div>
  );
}
