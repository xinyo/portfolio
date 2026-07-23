import { useEffect, useMemo, useState } from "react";
import { Temporal } from "temporal-polyfill"; // Adjust import based on your package

interface UseFormattedTemporalDateOptions {
  locale?: string | string[];
  relativeTimeStyle?: "long" | "short" | "narrow";
  absoluteFormat?: Intl.DateTimeFormatOptions;
  timeZone?: string;
  updateIntervalMs?: number;
}

interface FormattedTemporalResult {
  relative: string; // e.g., "2 hours ago", "in 1 year"
  absolute: string; // e.g., "Jan 15, 2026, 10:30 AM"
  instant: Temporal.Instant | null; // Raw Temporal object
  isFuture: boolean;
}

export function useFormattedTemporalDate(
  isoString: string | null | undefined,
  options: UseFormattedTemporalDateOptions = {},
): FormattedTemporalResult | null {
  const {
    locale = navigator.language,
    relativeTimeStyle = "long",
    timeZone,
    absoluteFormat = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
    updateIntervalMs = 60000,
  } = options;

  const [now, setNow] = useState(() => Temporal.Now.instant());

  // Auto-update the "now" instant so relative times stay accurate
  useEffect(() => {
    if (!isoString) return; // isoString example: "2026-01-15T10:30:00Z"

    const interval = setInterval(() => {
      setNow(Temporal.Now.instant());
    }, updateIntervalMs);

    return () => clearInterval(interval);
  }, [isoString, updateIntervalMs]);

  return useMemo(() => {
    if (!isoString) return null;

    let targetInstant: Temporal.Instant;
    try {
      // Temporal.Instant.from is STRICT. It will throw if the ISO string is invalid.
      // No more NaN dates or silent browser-specific parsing failures!
      targetInstant = Temporal.Instant.from(isoString);
    } catch (e) {
      console.warn(
        `Invalid ISO 8601 string passed to useFormattedTemporalDate: ${isoString}. ${e}`,
      );
      return null;
    }

    // Using epochMilliseconds for absolute diff math is perfectly safe for Instants
    // because Instants are strictly UTC — no timezone/DST ambiguity.
    const diffMs = targetInstant.epochMilliseconds - now.epochMilliseconds;
    const isFuture = diffMs > 0;
    const absDiffSec = Math.abs(diffMs) / 1000;

    // Set up formatters
    const rtf = new Intl.RelativeTimeFormat(locale, {
      numeric: "auto",
      style: relativeTimeStyle,
    });

    // Temporal.Instant.toLocaleString is supported by the polyfill
    const absolute = targetInstant.toLocaleString(locale, {
      ...absoluteFormat,
      timeZone,
    });

    let relative: string;

    // Determine the best unit for relative time
    if (absDiffSec < 60) {
      relative = rtf.format(
        Math.round(absDiffSec) * (isFuture ? 1 : -1),
        "second",
      );
    } else if (absDiffSec < 3600) {
      relative = rtf.format(
        Math.round(absDiffSec / 60) * (isFuture ? 1 : -1),
        "minute",
      );
    } else if (absDiffSec < 86400) {
      relative = rtf.format(
        Math.round(absDiffSec / 3600) * (isFuture ? 1 : -1),
        "hour",
      );
    } else if (absDiffSec < 2592000) {
      relative = rtf.format(
        Math.round(absDiffSec / 86400) * (isFuture ? 1 : -1),
        "day",
      );
    } else if (absDiffSec < 31536000) {
      relative = rtf.format(
        Math.round(absDiffSec / 2592000) * (isFuture ? 1 : -1),
        "month",
      );
    } else {
      relative = rtf.format(
        Math.round(absDiffSec / 31536000) * (isFuture ? 1 : -1),
        "year",
      );
    }

    return {
      relative,
      absolute,
      instant: targetInstant,
      isFuture,
    };
  }, [isoString, now, locale, relativeTimeStyle, absoluteFormat, timeZone]);
}
