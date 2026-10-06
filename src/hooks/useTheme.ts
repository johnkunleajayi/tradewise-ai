import { useEffect, useState } from "react";
import type { Theme } from "../types/dashboard";
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem("tradewise-theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {
      /* Storage is optional. */
    }
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("tradewise-theme", theme);
    } catch {
      /* Keep theme usable without storage. */
    }
  }, [theme]);
  return {
    theme,
    toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };
}
