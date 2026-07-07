import { describe, expect, it } from "vitest";

import {
  defaultNavigationSections,
  getCustomerIdFromPathname,
  getFactoryNavigationSections,
} from "@/apps/factory/components/navigation-model";

describe("factory navigation model", () => {
  it("uses the default navigation for list-level factory routes", () => {
    expect(getFactoryNavigationSections("/apps/factory")).toBe(
      defaultNavigationSections,
    );
    expect(getFactoryNavigationSections("/apps/factory/customers")).toBe(
      defaultNavigationSections,
    );
  });

  it("detects customer detail routes", () => {
    expect(
      getCustomerIdFromPathname(
        "/apps/factory/customers/customer-1/order-history",
      ),
    ).toBe("customer-1");
  });

  it("uses customer navigation for customer detail routes", () => {
    const sections = getFactoryNavigationSections(
      "/apps/factory/customers/customer-1/order-history",
    );

    expect(sections).not.toBe(defaultNavigationSections);
    expect(sections[0]?.items[0]).toMatchObject({
      labelKey: "factory.navigation.contextual.customers.back",
      to: "/apps/factory/customers",
      end: true,
      variant: "back",
    });
    expect(sections[1]?.items.map((item) => item.to)).toEqual([
      "/apps/factory/customers/customer-1/order-history",
      "/apps/factory/customers/customer-1/billing-address",
      "/apps/factory/customers/customer-1/delivery-address",
      "/apps/factory/customers/customer-1/contacts",
      "/apps/factory/customers/customer-1/settings",
    ]);
  });
});
