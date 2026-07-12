import { beforeEach, describe, expect, it } from "vitest";

import {
  defaultNavigationSections,
  getFactoryLeftPanelModel,
  getProductIdFromPathname,
  getProductNavigationSections,
} from "@/apps/factory/components/navigation-model";
import {
  createEmptyProductConfiguration,
  factoryProductsById,
  factorySuppliers,
  useFactoryStore,
} from "@/apps/factory/store";
import {
  getPricedSuppliers,
  removeUnavailablePreferredSupplier,
} from "@/apps/factory/views/product/model";

describe("factory product navigation", () => {
  it("detects product detail paths and builds all contextual destinations", () => {
    const pathname = "/apps/factory/product/prod-1/product-options";

    expect(getProductIdFromPathname(pathname)).toBe("prod-1");
    expect(getProductNavigationSections("prod-1")[1]?.items.map((item) => item.to))
      .toEqual([
        "/apps/factory/product/prod-1/product-options",
        "/apps/factory/product/prod-1/buying",
        "/apps/factory/product/prod-1/pricing",
      ]);
    expect(getFactoryLeftPanelModel(pathname).sections).toEqual(
      getProductNavigationSections("prod-1"),
    );
  });

  it("keeps list routes on the default navigation", () => {
    expect(getProductIdFromPathname("/apps/factory/product-categories")).toBeNull();
    expect(getFactoryLeftPanelModel("/apps/factory/product-categories").sections)
      .toBe(defaultNavigationSections);
  });
});

describe("factory product configuration", () => {
  beforeEach(() => {
    useFactoryStore.setState({ productConfigurations: {} });
  });

  it("starts with empty product options and buying selections", () => {
    expect(createEmptyProductConfiguration()).toEqual({
      buyItem: false,
      sellItem: false,
      trackStock: false,
      trackCostsAndMarkups: false,
      taxFree: false,
      quantityUnit: null,
      categoryId: null,
      materialIds: [],
      supplierIds: [],
      preferredSupplierId: null,
    });
  });

  it("indexes products and commits saved configurations by product id", () => {
    const configuration = {
      ...createEmptyProductConfiguration(),
      supplierIds: ["supp-1"],
      preferredSupplierId: "supp-1",
    };

    expect(factoryProductsById["prod-1"]?.id).toBe("prod-1");
    useFactoryStore.getState().saveProductConfiguration("prod-1", configuration);
    expect(useFactoryStore.getState().productConfigurations["prod-1"]).toEqual(
      configuration,
    );
  });

  it("clears a preferred supplier that is removed from the selection", () => {
    expect(removeUnavailablePreferredSupplier(["supp-2"], "supp-1")).toBeNull();
    expect(removeUnavailablePreferredSupplier(["supp-1"], "supp-1")).toBe(
      "supp-1",
    );
  });
});

describe("factory product pricing", () => {
  it("returns only selected suppliers with a price for the product", () => {
    const result = getPricedSuppliers(
      factorySuppliers,
      factorySuppliers.map((supplier) => supplier.id),
      "prod-1",
    );

    expect(result.length).toBeGreaterThan(0);
    expect(result.every(({ supplier }) =>
      supplier.suppliedProducts.some((item) => item.productId === "prod-1"),
    )).toBe(true);
    expect(result.every(({ supplyPrice }) => supplyPrice > 0)).toBe(true);
  });

  it("returns an empty state model when no saved supplier has a price", () => {
    expect(getPricedSuppliers(factorySuppliers, [], "prod-1")).toEqual([]);
  });
});
