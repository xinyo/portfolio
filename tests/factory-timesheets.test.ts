import { describe, expect, it } from "vitest";
import { Temporal } from "temporal-polyfill";

import {
  factoryEmployees,
  factoryLocations,
  factoryTimesheetIndexes,
  factoryTimesheets,
  filterTimesheetEmployees,
  filterTimesheets,
  getTimesheetStatusVariant,
} from "@/apps/factory/store";
import {
  calendarDateToPlainDate,
  calendarRangeToTimesheetRange,
  plainDateToCalendarDate,
  timesheetRangeToCalendarRange,
} from "@/apps/factory/timesheet-date";

const allJulyMockDates = {
  from: Temporal.PlainDate.from("2026-07-01"),
  to: Temporal.PlainDate.from("2026-07-03"),
};

describe("factory timesheets", () => {
  it("resolves employee avatar image paths", () => {
    expect(factoryEmployees[0].image).toContain("agent_avatar_01");
    expect(factoryEmployees[0].image).not.toBe("agent_avatar_01.svg");
  });

  it("indexes employees, locations, and timesheets", () => {
    expect(factoryTimesheetIndexes.employeesById["emp-1"]?.name).toBe(
      "Alex Rivera",
    );
    expect(factoryTimesheetIndexes.locationsById["loc-1"]?.name).toBe(
      "Warehouse A",
    );
    expect(factoryTimesheetIndexes.timesheetsByEmployeeId["emp-1"]).toHaveLength(
      1,
    );
    expect(factoryTimesheetIndexes.timesheetsByLocationId["loc-1"]).toHaveLength(
      1,
    );
  });

  it("filters timesheets by date range", () => {
    const result = filterTimesheets(factoryTimesheets, {
      dateRange: {
        from: Temporal.PlainDate.from("2026-07-02"),
        to: Temporal.PlainDate.from("2026-07-02"),
      },
      locationId: "all",
      selectedEmployeeId: null,
      timeZone: "UTC",
    });

    expect(result.map((timesheet) => timesheet.id)).toEqual([
      "ts-4",
      "ts-5",
      "ts-6",
    ]);
  });

  it("filters timesheets by location and employee", () => {
    const result = filterTimesheets(factoryTimesheets, {
      dateRange: allJulyMockDates,
      locationId: "loc-2",
      selectedEmployeeId: "emp-2",
      timeZone: "UTC",
    });

    expect(result.map((timesheet) => timesheet.id)).toEqual(["ts-2"]);
  });

  it("filters eligible employees by date range, location, and query", () => {
    const result = filterTimesheetEmployees(
      factoryEmployees,
      factoryTimesheets,
      {
        dateRange: allJulyMockDates,
        locationId: "loc-1",
        employeeQuery: "alex",
        timeZone: "UTC",
      },
    );

    expect(result.map((employee) => employee.id)).toEqual(["emp-1"]);
  });

  it("excludes employees without matching timesheets for active filters", () => {
    const result = filterTimesheetEmployees(
      factoryEmployees,
      factoryTimesheets,
      {
        dateRange: {
          from: Temporal.PlainDate.from("2026-07-04"),
          to: Temporal.PlainDate.from("2026-07-04"),
        },
        locationId: "all",
        employeeQuery: "",
        timeZone: "UTC",
      },
    );

    expect(result.map((employee) => employee.id)).toEqual([]);
  });

  it("can filter the same instant into a different day for a configured timezone", () => {
    const utcResult = filterTimesheets(factoryTimesheets, {
      dateRange: {
        from: Temporal.PlainDate.from("2026-07-02"),
        to: Temporal.PlainDate.from("2026-07-02"),
      },
      locationId: "all",
      selectedEmployeeId: null,
      timeZone: "UTC",
    });
    const sydneyResult = filterTimesheets(factoryTimesheets, {
      dateRange: {
        from: Temporal.PlainDate.from("2026-07-02"),
        to: Temporal.PlainDate.from("2026-07-02"),
      },
      locationId: "all",
      selectedEmployeeId: null,
      timeZone: "Australia/Sydney",
    });

    expect(utcResult.map((timesheet) => timesheet.id)).not.toContain("ts-3");
    expect(sydneyResult.map((timesheet) => timesheet.id)).toContain("ts-3");
  });

  it("converts shadcn calendar dates to timesheet plain dates", () => {
    const plainDate = calendarDateToPlainDate(new Date(2026, 6, 2));

    expect(plainDate.toString()).toBe("2026-07-02");
  });

  it("converts timesheet plain dates to shadcn calendar dates", () => {
    const calendarDate = plainDateToCalendarDate(
      Temporal.PlainDate.from("2026-07-02"),
    );

    expect(calendarDate.getFullYear()).toBe(2026);
    expect(calendarDate.getMonth()).toBe(6);
    expect(calendarDate.getDate()).toBe(2);
  });

  it("converts date ranges across the shadcn calendar boundary", () => {
    const timesheetRange = calendarRangeToTimesheetRange({
      from: new Date(2026, 6, 1),
      to: new Date(2026, 6, 3),
    });
    const calendarRange = timesheetRangeToCalendarRange(timesheetRange);

    expect(timesheetRange.from?.toString()).toBe("2026-07-01");
    expect(timesheetRange.to?.toString()).toBe("2026-07-03");
    expect(calendarRange?.from?.getFullYear()).toBe(2026);
    expect(calendarRange?.from?.getMonth()).toBe(6);
    expect(calendarRange?.from?.getDate()).toBe(1);
    expect(calendarRange?.to?.getFullYear()).toBe(2026);
    expect(calendarRange?.to?.getMonth()).toBe(6);
    expect(calendarRange?.to?.getDate()).toBe(3);
  });

  it("maps timesheet statuses to UI variants", () => {
    expect(getTimesheetStatusVariant("Pending")).toBe("pending");
    expect(getTimesheetStatusVariant("Time Approved")).toBe("time");
    expect(getTimesheetStatusVariant("Pay Approved")).toBe("pay");
    expect(getTimesheetStatusVariant("Discarded")).toBe("muted");
  });

  it("uses the mock timesheet locations list", () => {
    expect(factoryLocations.map((location) => location.id)).toContain("loc-10");
  });
});
