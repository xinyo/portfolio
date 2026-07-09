import { describe, expect, it } from "vitest";

import {
  factoryEmployees,
  factoryLocations,
  factoryTimesheetIndexes,
  factoryTimesheets,
  filterTimesheetEmployees,
  filterTimesheets,
  getTimesheetStatusVariant,
} from "@/apps/factory/store";

const allJulyMockDates = {
  from: new Date("2026-07-01T00:00:00"),
  to: new Date("2026-07-03T23:59:59"),
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
        from: new Date("2026-07-02T00:00:00"),
        to: new Date("2026-07-02T23:59:59"),
      },
      locationId: "all",
      selectedEmployeeId: null,
    });

    expect(result.map((timesheet) => timesheet.id)).toEqual([
      "ts-3",
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
          from: new Date("2026-07-04T00:00:00"),
          to: new Date("2026-07-04T23:59:59"),
        },
        locationId: "all",
        employeeQuery: "",
      },
    );

    expect(result.map((employee) => employee.id)).toEqual(["emp-9"]);
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
