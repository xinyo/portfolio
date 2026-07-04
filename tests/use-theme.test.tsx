import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useTheme } from "@/hooks/use-theme";

type ThemeProbeProps = {
  defaultIsDark?: boolean;
  onValue: (isDark: boolean) => void;
};

function ThemeProbe({ defaultIsDark, onValue }: ThemeProbeProps) {
  const { isDark } = useTheme(defaultIsDark);

  onValue(isDark);

  return <span>{isDark ? "dark" : "light"}</span>;
}

function createWindowWithStoredTheme(storedTheme: string | null) {
  return {
    localStorage: {
      getItem: vi.fn(() => storedTheme),
      setItem: vi.fn(),
    },
  };
}

describe("useTheme", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses the provided default when window is unavailable", () => {
    let isDark: boolean | undefined;

    renderToString(
      <ThemeProbe defaultIsDark={false} onValue={(value) => (isDark = value)} />,
    );

    expect(isDark).toBe(false);
  });

  it("uses the provided default when localStorage does not contain a theme", () => {
    let isDark: boolean | undefined;
    const windowMock = createWindowWithStoredTheme(null);
    vi.stubGlobal("window", windowMock);

    renderToString(
      <ThemeProbe defaultIsDark={true} onValue={(value) => (isDark = value)} />,
    );

    expect(windowMock.localStorage.getItem).toHaveBeenCalledWith("theme");
    expect(isDark).toBe(true);
  });

  it("uses the stored theme when localStorage contains one", () => {
    let isDark: boolean | undefined;
    vi.stubGlobal("window", createWindowWithStoredTheme("light"));

    renderToString(
      <ThemeProbe defaultIsDark={true} onValue={(value) => (isDark = value)} />,
    );

    expect(isDark).toBe(false);
  });
});
