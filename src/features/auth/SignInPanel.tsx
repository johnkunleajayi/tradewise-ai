import { useEffect, useState } from "react";
import { ArrowUpRight, LoaderCircle, ShieldCheck } from "lucide-react";
import { googleLoginUrl } from "./api";

export function SignInPanel({
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
    <section
      id="get-started"
      className="relative scroll-mt-8 overflow-hidden rounded-2xl border border-line bg-surface p-7 shadow-panel sm:p-10"
      aria-labelledby="signin-title"
      aria-busy={loading || leaving}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent" />
      <span className="mb-7 grid size-11 place-items-center rounded-xl border border-accent/20 bg-tint text-accent">
        <ShieldCheck size={22} />
      </span>
      <h2 id="signin-title" className="text-2xl font-semibold tracking-tight">
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
              <LoaderCircle size={18} className="motion-safe:animate-spin" />
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
  );
}
