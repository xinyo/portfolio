import { describe, expect, it } from "vitest";

import {
  buildFactorySearchOptions,
  createFactoryListSearchHref,
  filterFactoryCustomers,
  filterFactorySalesOrders,
  filterFactorySearchOptions,
  filterFactorySuppliers,
  updateFactorySearchQuery,
} from "@/apps/factory/search-model";
import {
  factoryCategories,
  factoryCustomers,
  factoryEmployees,
  factoryIntegrationCategories,
  factoryIntegrations,
  factoryMaterials,
  factoryProductKits,
  factoryProducts,
  factorySalesOrders,
  factorySuppliers,
  factoryUser,
  useFactoryStore,
} from "@/apps/factory/store";

function createOptions() {
  return buildFactorySearchOptions({
    pages: [
      {
        id: "page:orders",
        title: "Sales Orders",
        subtitle: "Sales",
        href: "/apps/factory/sales-orders",
      },
    ],
    products: factoryProducts,
    productKits: factoryProductKits,
    categories: factoryCategories,
    customers: factoryCustomers,
    salesOrders: factorySalesOrders,
    materials: factoryMaterials,
    suppliers: factorySuppliers,
    user: factoryUser,
    employees: factoryEmployees,
    integrations: factoryIntegrations,
    integrationCategories: factoryIntegrationCategories,
  });
}

describe("factory global search", () => {
  it("returns no options for a blank query", () => {
    expect(filterFactorySearchOptions(createOptions(), "  ")).toEqual([]);
  });

  it("builds direct and filtered destinations with encoded labels", () => {
    const options = createOptions();

    expect(options.find((option) => option.id === "product:prod-1")?.href).toBe(
      "/apps/factory/product/prod-1/product-options",
    );
    expect(
      options.find((option) => option.id === "salesOrder:so-1")?.href,
    ).toBe("/apps/factory/sales-orders?q=SO-2024-001");
    expect(createFactoryListSearchHref("/items", "A&B Part")).toBe(
      "/items?q=A%26B+Part",
    );
  });

  it("searches secondary business fields", () => {
    const options = createOptions();

    expect(
      filterFactorySearchOptions(options, "BRK-304-SS")[0],
    ).toMatchObject({ kind: "product", title: "Steel Bracket 304" });
    expect(
      filterFactorySearchOptions(options, "john.anderson@buildcorp.example"),
    ).toContainEqual(
      expect.objectContaining({ kind: "contact", title: "John Anderson" }),
    );
    expect(filterFactorySearchOptions(options, "Priority")).toContainEqual(
      expect.objectContaining({ kind: "salesOrder", title: "SO-2024-001" }),
    );
  });

  it("ranks exact and prefix matches ahead of substring matches", () => {
    const results = filterFactorySearchOptions(
      [
        {
          id: "contains",
          kind: "material",
          title: "Sheet Steel",
          keywords: [],
          href: "/contains",
        },
        {
          id: "exact",
          kind: "product",
          title: "Steel",
          keywords: [],
          href: "/exact",
        },
        {
          id: "prefix",
          kind: "supplier",
          title: "Steel Supply",
          keywords: [],
          href: "/prefix",
        },
      ],
      "steel",
    );

    expect(results.map((result) => result.id)).toEqual([
      "exact",
      "prefix",
      "contains",
    ]);
  });

  it("limits each result kind to five", () => {
    const results = filterFactorySearchOptions(
      Array.from({ length: 7 }, (_, index) => ({
        id: `integration:${index}`,
        kind: "integration" as const,
        title: `Example ${index}`,
        keywords: [],
        href: `/integrations/${index}`,
      })),
      "example",
    );

    expect(results).toHaveLength(5);
  });

  it("only builds approved business-wide result kinds", () => {
    expect(new Set(createOptions().map((option) => option.kind))).toEqual(
      new Set([
        "page",
        "product",
        "productKit",
        "customer",
        "contact",
        "salesOrder",
        "material",
        "supplier",
        "teamMember",
        "integration",
      ]),
    );
  });

  it("includes records added to mutable Factory state", () => {
    const originalProducts = useFactoryStore.getState().products;
    const addedProduct = {
      id: "prod-search-test",
      name: "Searchable new product",
      code: "SEARCH-NEW",
      categoryId: factoryCategories[0].id,
      image: "",
    };

    try {
      useFactoryStore.setState({ products: [...originalProducts, addedProduct] });
      const state = useFactoryStore.getState();
      const options = buildFactorySearchOptions({
        pages: [],
        products: state.products,
        productKits: state.productKits,
        categories: state.categories,
        customers: state.customers,
        salesOrders: factorySalesOrders,
        materials: state.materials,
        suppliers: factorySuppliers,
        user: state.user,
        employees: state.employees,
        integrations: Object.values(state.integrationsById),
        integrationCategories: factoryIntegrationCategories,
      });

      expect(filterFactorySearchOptions(options, "SEARCH-NEW")).toContainEqual(
        expect.objectContaining({ id: "product:prod-search-test" }),
      );
    } finally {
      useFactoryStore.setState({ products: originalProducts });
    }
  });
});

describe("factory list search", () => {
  it("preserves unrelated parameters and removes a cleared query", () => {
    const updated = updateFactorySearchQuery(
      new URLSearchParams("category=steel&q=old"),
      "new value",
    );
    expect(updated.toString()).toBe("category=steel&q=new+value");

    const cleared = updateFactorySearchQuery(updated, " ");
    expect(cleared.toString()).toBe("category=steel");
  });

  it("filters customers, orders, and suppliers by secondary fields", () => {
    expect(filterFactoryCustomers(factoryCustomers, "12 345")).toHaveLength(1);
    expect(filterFactorySalesOrders(factorySalesOrders, "PO-88421")).toEqual([
      factorySalesOrders[0],
    ]);
    expect(
      filterFactorySuppliers(factorySuppliers, factoryProducts, "BRK-304-SS"),
    ).toContainEqual(factorySuppliers[0]);
  });
});
