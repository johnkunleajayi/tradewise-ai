import { useCallback, useEffect, useRef, useState } from "react";
import { endSession, getCurrentUser } from "../features/auth/api";
import type { AuthState } from "../types/auth";

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    status: "loading",
    user: null,
  });
  const [signingOut, setSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const pending = useRef<AbortController | null>(null);
  const loggingOut = useRef(false);
  const mounted = useRef(false);

  const checkSession = useCallback(async () => {
    if (loggingOut.current) return;
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    try {
      const user = await getCurrentUser(controller.signal);
      if (controller.signal.aborted || !mounted.current) return;
      setState(
        user
          ? { status: "authenticated", user }
          : { status: "anonymous", user: null },
      );
    } catch {
      if (!controller.signal.aborted && mounted.current)
        setState({ status: "error", user: null });
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    // Synchronize with the server; state changes only after the request settles.
    // oxlint-disable-next-line react/set-state-in-effect
    void checkSession();
    const onVisible = () => {
      if (document.visibilityState === "visible") void checkSession();
    };
    window.addEventListener("pageshow", checkSession);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      mounted.current = false;
      pending.current?.abort();
      window.removeEventListener("pageshow", checkSession);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [checkSession]);

  const retry = () => {
    setState({ status: "loading", user: null });
    void checkSession();
  };

  const logout = async () => {
    if (loggingOut.current) return;
    loggingOut.current = true;
    pending.current?.abort();
    setSigningOut(true);
    setLogoutError(null);
    try {
      await endSession();
      if (mounted.current) setState({ status: "anonymous", user: null });
    } catch {
      if (mounted.current)
        setLogoutError("We couldn’t sign you out. Please try again.");
    } finally {
      loggingOut.current = false;
      if (mounted.current) setSigningOut(false);
    }
  };

  return { ...state, retry, logout, signingOut, logoutError };
}
