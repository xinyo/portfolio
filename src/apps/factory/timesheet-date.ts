import type { DateRange } from "react-day-picker";
import { Temporal } from "temporal-polyfill";

import type { FactoryTimezone } from "@/apps/factory/store";

export type FactoryTimesheetDateRange = {
  from: Temporal.PlainDate | null;
  to: Temporal.PlainDate | null;
};

export function resolveFactoryTimeZone(timezone: FactoryTimezone) {
  if (timezone === "UTC") {
    return "UTC";
  }

  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

export function comparePlainDate(
  left: Temporal.PlainDate,
  right: Temporal.PlainDate,
) {
  return Temporal.PlainDate.compare(left, right);
}

export function instantToPlainDate(isoString: string, timeZone: string) {
  return Temporal.Instant.from(isoString).toZonedDateTimeISO(timeZone).toPlainDate();
}

export function calendarDateToPlainDate(date: Date) {
  return new Temporal.PlainDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
}

export function plainDateToCalendarDate(date: Temporal.PlainDate) {
  return new Date(date.year, date.month - 1, date.day);
}

export function calendarRangeToTimesheetRange(
  range: DateRange | undefined,
): FactoryTimesheetDateRange {
  return {
    from: range?.from ? calendarDateToPlainDate(range.from) : null,
    to: range?.to ? calendarDateToPlainDate(range.to) : null,
  };
}

export function timesheetRangeToCalendarRange(
  range: FactoryTimesheetDateRange,
): DateRange | undefined {
  if (!range.from) {
    return undefined;
  }

  return {
    from: plainDateToCalendarDate(range.from),
    to: range.to ? plainDateToCalendarDate(range.to) : undefined,
  };
}

export function getCurrentMonthRange(
  timezone: FactoryTimezone,
): FactoryTimesheetDateRange {
  const today = Temporal.Now.zonedDateTimeISO(
    resolveFactoryTimeZone(timezone),
  ).toPlainDate();
  const from = new Temporal.PlainDate(today.year, today.month, 1);
  const to = from.add({ months: 1 }).subtract({ days: 1 });

  return { from, to };
}
