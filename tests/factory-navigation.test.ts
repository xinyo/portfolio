import { describe, expect, it } from "vitest";
import { Undo2 } from "lucide-react";

import {
  defaultNavigationSections,
  getCustomerIdFromPathname,
  getFactoryLeftPanelModel,
} from "@/apps/factory/components/navigation-model";

describe("factory navigation model", () => {
  it("uses the default navigation for list-level factory routes", () => {
    expect(getFactoryLeftPanelModel("/apps/factory")).toMatchObject({
      sections: defaultNavigationSections,
      showSearch: true,
    });
    expect(getFactoryLeftPanelModel("/apps/factory/customers")).toMatchObject({
      sections: defaultNavigationSections,
      showSearch: true,
    });
  });

  it("detects customer detail routes", () => {
    expect(
      getCustomerIdFromPathname(
        "/apps/factory/customers/customer-1/order-history",
      ),
    ).toBe("customer-1");
  });

  it("uses customer navigation for customer detail routes", () => {
    const model = getFactoryLeftPanelModel(
      "/apps/factory/customers/customer-1/order-history",
    );
    const sections = model.sections;

    expect(sections).not.toBe(defaultNavigationSections);
    expect(model.showSearch).toBe(true);
    expect(model.customSection).toBeUndefined();
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

  it("uses planner custom content for the planners route", () => {
    const model = getFactoryLeftPanelModel("/apps/factory/planners");

    expect(model.showSearch).toBe(false);
    expect(model.customSection).toEqual({ id: "plannerCustomers" });
    expect(model.sections[0]?.items[0]).toMatchObject({
      labelKey: "factory.navigation.contextual.planners.back",
      to: "/apps/factory",
      end: true,
      variant: "back",
    });
    expect(model.sections[0]?.items[0]?.icon).toBe(Undo2);
  });

  it("uses workflow custom content for the workflow route", () => {
    const model = getFactoryLeftPanelModel("/apps/factory/workflow");

    expect(model.showSearch).toBe(false);
    expect(model.customSection).toEqual({ id: "workflowSidebar" });
    expect(model.sections[0]?.items[0]).toMatchObject({
      labelKey: "factory.navigation.contextual.workflow.back",
      to: "/apps/factory",
      end: true,
      variant: "back",
    });
    expect(model.sections[0]?.items[0]?.icon).toBe(Undo2);
    expect(model.sections[1]).toBeUndefined();
  });
});
