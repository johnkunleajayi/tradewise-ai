import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      className="flex min-h-9 shrink-0 items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-[11px] font-medium hover:border-accent hover:bg-tint sm:text-xs"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
      <span className="hidden min-[400px]:inline">
        {theme === "dark" ? "Light" : "Dark"} mode
      </span>
    </button>
  );
}
