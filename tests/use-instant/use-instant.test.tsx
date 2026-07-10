import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Temporal } from "temporal-polyfill";

import { useFormattedTemporalDate } from "@/hooks/use-Instant";

// Fixed "now" for deterministic tests: 2026-07-09T12:00:00Z
const MOCK_NOW_INSTANT = Temporal.Instant.from("2026-07-09T12:00:00Z");

// ---------------------------------------------------------------------------
// Probe component – renders the hook and exposes its result via a callback
// ---------------------------------------------------------------------------

type ProbeProps = {
  isoString: string | null | undefined;
  locale?: string;
  relativeTimeStyle?: "long" | "short" | "narrow";
  absoluteFormat?: Intl.DateTimeFormatOptions;
  updateIntervalMs?: number;
  onResult: (result: ReturnType<typeof useFormattedTemporalDate>) => void;
};

function Probe({
  isoString,
  locale,
  relativeTimeStyle,
  absoluteFormat,
  updateIntervalMs,
  onResult,
}: ProbeProps) {
  const result = useFormattedTemporalDate(isoString, {
    locale,
    relativeTimeStyle,
    absoluteFormat,
    updateIntervalMs,
  });

  onResult(result);

  return null;
}

// ---------------------------------------------------------------------------
// Helper to capture the hook result in a single render
// ---------------------------------------------------------------------------

function renderHook(
  isoString: string | null | undefined,
  options?: {
    locale?: string;
    relativeTimeStyle?: "long" | "short" | "narrow";
    absoluteFormat?: Intl.DateTimeFormatOptions;
    updateIntervalMs?: number;
  },
) {
  let captured = null as ReturnType<typeof useFormattedTemporalDate>;

  renderToString(
    <Probe
      isoString={isoString}
      locale={options?.locale}
      relativeTimeStyle={options?.relativeTimeStyle}
      absoluteFormat={options?.absoluteFormat}
      updateIntervalMs={options?.updateIntervalMs}
      onResult={(r) => {
        captured = r;
      }}
    />,
  );

  return captured;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useFormattedTemporalDate", () => {
  beforeEach(() => {
    // Lock Temporal.Now.instant() to a fixed point in time
    vi.spyOn(Temporal.Now, "instant").mockReturnValue(MOCK_NOW_INSTANT);

    // Stub navigator.language to en-US for deterministic Intl output
    vi.stubGlobal("navigator", { language: "en-US" });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  // -----------------------------------------------------------------------
  // Null / invalid input
  // -----------------------------------------------------------------------

  describe("when isoString is null, undefined, or invalid", () => {
    it("returns null for null input", () => {
      expect(renderHook(null)).toBeNull();
    });

    it("returns null for undefined input", () => {
      expect(renderHook(undefined)).toBeNull();
    });

    it("returns null for an empty string", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      expect(renderHook("")).toBeNull();
      // Temporal.Instant.from("") may not throw on all polyfill versions;
      // the hook still gracefully returns null via the catch block when it does
      warnSpy.mockRestore();
    });

    it("returns null for a malformed ISO string", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      expect(renderHook("not-a-date")).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Invalid ISO 8601 string"),
      );
      warnSpy.mockRestore();
    });

    it("returns null for a non-ISO date string like 'Jan 1, 2026'", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      expect(renderHook("Jan 1, 2026")).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Invalid ISO 8601 string"),
      );
      warnSpy.mockRestore();
    });
  });

  // -----------------------------------------------------------------------
  // Valid input – past dates
  // -----------------------------------------------------------------------

  describe("with a past date", () => {
    it("detects isFuture is false", () => {
      const result = renderHook("2026-07-09T10:00:00Z");
      expect(result).not.toBeNull();
      expect(result!.isFuture).toBe(false);
    });

    it("returns a valid Temporal.Instant", () => {
      const result = renderHook("2026-07-09T10:00:00Z");
      expect(result!.instant).toBeInstanceOf(Temporal.Instant);
      expect(result!.instant!.toString()).toBe("2026-07-09T10:00:00Z");
    });

    it("formats relative time for a past time in hours", () => {
      const result = renderHook("2026-07-09T10:00:00Z");
      expect(result!.relative).toBe("2 hours ago");
    });

    it("formats relative time for a past time in minutes", () => {
      const result = renderHook("2026-07-09T11:30:00Z");
      expect(result!.relative).toBe("30 minutes ago");
    });

    it("formats relative time for a past time in seconds", () => {
      const result = renderHook("2026-07-09T11:59:15Z");
      expect(result!.relative).toBe("45 seconds ago");
    });

    it("formats relative time for a past time in days", () => {
      const result = renderHook("2026-07-07T12:00:00Z");
      expect(result!.relative).toBe("2 days ago");
    });

    it("formats relative time for a past time in months", () => {
      const result = renderHook("2026-06-09T12:00:00Z");
      expect(result!.relative).toBe("last month");
    });

    it("formats relative time for a past time in years", () => {
      const result = renderHook("2025-07-09T12:00:00Z");
      expect(result!.relative).toBe("last year");
    });

    it("generates an absolute formatted string containing date parts", () => {
      const result = renderHook("2026-07-09T10:00:00Z");
      // The time portion depends on the system's local timezone,
      // so we only assert the date and format shape are present
      expect(result!.absolute).toMatch(/Jul 9, 2026/);
      expect(result!.absolute).toMatch(/\d{1,2}:\d{2}\s[AP]M/);
    });
  });

  // -----------------------------------------------------------------------
  // Valid input – future dates
  // -----------------------------------------------------------------------

  describe("with a future date", () => {
    it("detects isFuture is true", () => {
      const result = renderHook("2026-07-09T14:00:00Z");
      expect(result).not.toBeNull();
      expect(result!.isFuture).toBe(true);
    });

    it("formats relative time for a future time in hours", () => {
      const result = renderHook("2026-07-09T15:00:00Z");
      expect(result!.relative).toBe("in 3 hours");
    });

    it("formats relative time for a future time in days", () => {
      const result = renderHook("2026-07-12T12:00:00Z");
      expect(result!.relative).toBe("in 3 days");
    });

    it("formats relative time for a future time in minutes", () => {
      const result = renderHook("2026-07-09T12:25:00Z");
      expect(result!.relative).toBe("in 25 minutes");
    });
  });

  // -----------------------------------------------------------------------
  // Exact same instant as "now"
  // -----------------------------------------------------------------------

  describe("with the exact same instant as now", () => {
    it("formats relative time as 'now' when diff is 0", () => {
      const result = renderHook("2026-07-09T12:00:00Z");
      // Intl.RelativeTimeFormat with numeric:"auto" returns "now" for zero diff
      expect(result!.relative).toBe("now");
      expect(result!.isFuture).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // Custom locale
  // -----------------------------------------------------------------------

  describe("with a custom locale", () => {
    it("formats absolute date in the given locale (de-DE)", () => {
      const result = renderHook("2026-07-09T10:00:00Z", {
        locale: "de-DE",
      });
      // Assert date portion; time varies by system timezone
      expect(result!.absolute).toMatch(/\d{1,2}\.\sJuli\s2026/);
    });

    it("formats relative time in the given locale (de-DE)", () => {
      const result = renderHook("2026-07-10T12:00:00Z", {
        locale: "de-DE",
      });
      // Intl.RelativeTimeFormat in de-DE uses natural forms like "morgen" for
      // "in 1 day". We just verify it returns a non-English string.
      expect(result!.relative).toBeTruthy();
      expect(result!.relative).not.toBe("in 1 day");
    });
  });

  // -----------------------------------------------------------------------
  // Custom relativeTimeStyle
  // -----------------------------------------------------------------------

  describe("with custom relativeTimeStyle", () => {
    it("supports 'short' style", () => {
      const result = renderHook("2026-07-09T15:00:00Z", {
        relativeTimeStyle: "short",
      });
      expect(result!.relative).toBe("in 3 hr.");
    });

    it("supports 'narrow' style", () => {
      const result = renderHook("2026-07-09T15:00:00Z", {
        relativeTimeStyle: "narrow",
      });
      expect(result!.relative).toBe("in 3h");
    });
  });

  // -----------------------------------------------------------------------
  // Custom absoluteFormat
  // -----------------------------------------------------------------------

  describe("with custom absoluteFormat", () => {
    it("uses the custom format options", () => {
      const result = renderHook("2026-07-09T10:00:00Z", {
        absoluteFormat: { year: "numeric", month: "long", day: "numeric" },
      });
      expect(result!.absolute).toBe("July 9, 2026");
    });
  });

  // -----------------------------------------------------------------------
  // Interval / cleanup
  // -----------------------------------------------------------------------

  describe("update interval", () => {
    it("accepts a custom updateIntervalMs without crashing", () => {
      const result = renderHook("2026-07-09T11:00:00Z", {
        updateIntervalMs: 1000,
      });
      expect(result).not.toBeNull();
      expect(result!.relative).toBe("1 hour ago");
    });

    it("does not set up an interval when isoString is null", () => {
      const setIntervalSpy = vi.spyOn(globalThis, "setInterval");
      renderHook(null, { updateIntervalMs: 1000 });
      // setInterval should not be called because isoString is null
      // (useEffect guard: if (!isoString) return)
      const intervalCalls = setIntervalSpy.mock.calls.filter(
        ([cb]) => typeof cb === "function",
      );
      expect(intervalCalls.length).toBe(0);
      setIntervalSpy.mockRestore();
    });
  });

  // -----------------------------------------------------------------------
  // Temporal.Instant object in result
  // -----------------------------------------------------------------------

  describe("returned instant object", () => {
    it("is the exact Temporal.Instant parsed from the ISO string", () => {
      const result = renderHook("2026-01-15T10:30:00Z");
      expect(result!.instant).toBeInstanceOf(Temporal.Instant);
      expect(result!.instant!.epochMilliseconds).toBe(
        Temporal.Instant.from("2026-01-15T10:30:00Z").epochMilliseconds,
      );
    });
  });
});
