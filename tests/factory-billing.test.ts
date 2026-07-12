import { describe, expect, it } from "vitest";

import {
  createFactoryBillingModel,
  factoryBilling,
  formatFactoryBillingAmount,
  formatFactoryBillingDate,
} from "@/apps/factory/billing";
import translations from "@/locales/en/translation.json";

describe("factory billing", () => {
  it("builds the billing model from four unique paid invoices", () => {
    expect(factoryBilling.plan).toMatchObject({
      name: "Factory Pro",
      priceCents: 7900,
      currency: "AUD",
      seats: 8,
    });
    expect(factoryBilling.invoices).toHaveLength(4);
    expect(new Set(factoryBilling.invoices.map((invoice) => invoice.id)).size)
      .toBe(factoryBilling.invoices.length);
    expect(factoryBilling.invoices.every((invoice) => invoice.status === "paid"))
      .toBe(true);
  });

  it("rejects unsupported invoice statuses", () => {
    expect(() =>
      createFactoryBillingModel({
        ...factoryBilling,
        invoices: [
          {
            ...factoryBilling.invoices[0],
            status: "void",
          },
        ],
      }),
    ).toThrow("Unsupported factory invoice status: void");
  });

  it("formats plain dates without using JavaScript Date", () => {
    expect(formatFactoryBillingDate("2026-08-01", "en-AU")).toBe(
      "1 Aug 2026",
    );
  });

  it("formats invoice cents as Australian currency", () => {
    expect(formatFactoryBillingAmount(7900, "AUD", "en-AU")).toBe("$79.00");
  });

  it("provides translated accessible control labels", () => {
    expect(translations.factory.billingDialog).toMatchObject({
      close: "Close billing dialog",
      plan: { upgrade: "Upgrade plan" },
      payment: { edit: "Edit billing method" },
      email: { edit: "Edit billing email" },
      address: { edit: "Edit billing address" },
    });
  });
});
