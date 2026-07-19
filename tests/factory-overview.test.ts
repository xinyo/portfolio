import { describe, expect, it } from "vitest";

import {
  createOverviewMonthlyOrderData,
  createOverviewOrderStatusData,
  formatOverviewMonth,
  overviewMonthlyOrderData,
  overviewOrderStatusData,
} from "@/apps/factory/overview-model";

describe("factory overview charts", () => {
  it("summarizes mock orders by status for the bar and radar charts", () => {
    expect(overviewOrderStatusData).toEqual([
      {
        status: "pending",
        orders: 5,
        estimatedHours: 271,
        actualHours: 0,
      },
      {
        status: "inProgress",
        orders: 4,
        estimatedHours: 176,
        actualHours: 143,
      },
      {
        status: "onHold",
        orders: 2,
        estimatedHours: 22,
        actualHours: 20,
      },
      {
        status: "completed",
        orders: 4,
        estimatedHours: 114,
        actualHours: 108,
      },
    ]);
  });

  it("summarizes mock revenue and cost chronologically by month", () => {
    expect(overviewMonthlyOrderData).toEqual([
      { month: "2024-01", revenue: 29050, cost: 20100 },
      { month: "2024-02", revenue: 41000, cost: 28300 },
      { month: "2024-03", revenue: 73500, cost: 50700 },
      { month: "2024-04", revenue: 32000, cost: 22200 },
    ]);
  });

  it("returns zeroed known statuses and ignores unsupported statuses", () => {
    const statusData = createOverviewOrderStatusData([
      {
        status: "Unknown",
        hoursEstimated: 12,
        hoursWorked: 8,
      },
    ]);

    expect(statusData.every(({ orders }) => orders === 0)).toBe(true);
  });

  it("uses Temporal to group and format order months", () => {
    const monthlyData = createOverviewMonthlyOrderData([
      {
        createdDate: "2025-12-10",
        total: 100,
        cost: 60,
      },
      {
        createdDate: "2025-12-20",
        total: 50,
        cost: 20,
      },
    ]);

    expect(monthlyData).toEqual([
      { month: "2025-12", revenue: 150, cost: 80 },
    ]);
    expect(formatOverviewMonth("2025-12", "en-AU")).toBe("Dec");
  });
});
