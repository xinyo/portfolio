import { Temporal } from "temporal-polyfill";

import mockData from "@/apps/factory/mock.json";

type OverviewOrder = (typeof mockData.salesOrders)[number];
type OverviewStatusOrder = Pick<
  OverviewOrder,
  "status" | "hoursEstimated" | "hoursWorked"
>;
type OverviewMonthlyOrder = Pick<
  OverviewOrder,
  "createdDate" | "total" | "cost"
>;

export const overviewStatusKeys = [
  "pending",
  "inProgress",
  "onHold",
  "completed",
] as const;

export type OverviewStatusKey = (typeof overviewStatusKeys)[number];

const overviewStatusByMockValue: Record<string, OverviewStatusKey> = {
  Pending: "pending",
  "In Progress": "inProgress",
  "On Hold": "onHold",
  Completed: "completed",
};

export type OverviewOrderStatusDatum = {
  status: OverviewStatusKey;
  orders: number;
  estimatedHours: number;
  actualHours: number;
};

export type OverviewMonthlyOrderDatum = {
  month: string;
  revenue: number;
  cost: number;
};

export function createOverviewOrderStatusData(
  orders: readonly OverviewStatusOrder[],
): OverviewOrderStatusDatum[] {
  const summaries = new Map<OverviewStatusKey, OverviewOrderStatusDatum>(
    overviewStatusKeys.map((status) => [
      status,
      { status, orders: 0, estimatedHours: 0, actualHours: 0 },
    ]),
  );

  for (const order of orders) {
    const status = overviewStatusByMockValue[order.status];
    if (!status) {
      continue;
    }

    const summary = summaries.get(status);
    if (!summary) {
      continue;
    }

    summary.orders += 1;
    summary.estimatedHours += order.hoursEstimated;
    summary.actualHours += order.hoursWorked;
  }

  return overviewStatusKeys.map((status) => summaries.get(status)!);
}

export function createOverviewMonthlyOrderData(
  orders: readonly OverviewMonthlyOrder[],
): OverviewMonthlyOrderDatum[] {
  const summaries = new Map<string, OverviewMonthlyOrderDatum>();

  for (const order of orders) {
    const month = Temporal.PlainDate.from(order.createdDate)
      .toPlainYearMonth()
      .toString();
    const summary = summaries.get(month) ?? { month, revenue: 0, cost: 0 };
    summary.revenue += order.total;
    summary.cost += order.cost;
    summaries.set(month, summary);
  }

  return [...summaries.values()].sort((left, right) =>
    left.month.localeCompare(right.month),
  );
}

export function formatOverviewDate(value: string, locale: string): string {
  return Temporal.PlainDate.from(value).toLocaleString(locale, {
    month: "short",
    day: "numeric",
  });
}

export function formatOverviewMonth(value: string, locale: string): string {
  return Temporal.PlainDate.from(`${value}-01`).toLocaleString(locale, {
    month: "short",
  });
}

export const overviewOrderStatusData = createOverviewOrderStatusData(
  mockData.salesOrders,
);

export const overviewMonthlyOrderData = createOverviewMonthlyOrderData(
  mockData.salesOrders,
);
