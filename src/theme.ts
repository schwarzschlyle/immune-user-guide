import { useCallback, useState } from "react";

export type Theme = "light" | "dark";
const STORAGE_KEY = "immune-guide-theme";

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Private browsing: the choice lasts for this page only.
      }
      return next;
    });
  }, []);
  return [theme, toggle];
}
