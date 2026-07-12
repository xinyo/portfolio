import { Temporal } from "temporal-polyfill";

import mockData from "@/apps/factory/mock.json";

export type FactoryInvoiceStatus = "paid";

type FactoryBillingSource = Omit<typeof mockData.billing, "invoices"> & {
  invoices: Array<
    Omit<(typeof mockData.billing.invoices)[number], "status"> & {
      status: string;
    }
  >;
};

export type FactoryBillingModel = Omit<FactoryBillingSource, "invoices"> & {
  invoices: Array<
    Omit<FactoryBillingSource["invoices"][number], "status"> & {
      status: FactoryInvoiceStatus;
    }
  >;
};

function isFactoryInvoiceStatus(status: string): status is FactoryInvoiceStatus {
  return status === "paid";
}

export function createFactoryBillingModel(
  source: FactoryBillingSource,
): FactoryBillingModel {
  return {
    ...source,
    invoices: source.invoices.map((invoice) => {
      if (!isFactoryInvoiceStatus(invoice.status)) {
        throw new Error(`Unsupported factory invoice status: ${invoice.status}`);
      }

      return { ...invoice, status: invoice.status };
    }),
  };
}

export const factoryBilling = createFactoryBillingModel(mockData.billing);

export function formatFactoryBillingDate(isoDate: string, locale = "en-AU") {
  return Temporal.PlainDate.from(isoDate).toLocaleString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatFactoryBillingAmount(
  amountCents: number,
  currency: string,
  locale = "en-AU",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amountCents / 100);
}
