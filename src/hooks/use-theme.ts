import { useEffect, useState } from "react";

export function useTheme(defaultIsDark = false) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return defaultIsDark;
    }

    const stored = window.localStorage.getItem("theme");
    return stored !== null ? stored === "dark" : defaultIsDark;
  });

  useEffect(() => {
    const html = document.documentElement;

    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, setIsDark };
}
