import { beforeEach, describe, expect, it } from "vitest";

import {
  filterFactoryCatalog,
  getCatalogCategoryName,
  hasValidationErrors,
  validateCategoryInput,
  validateProductInput,
  validateProductKitInput,
} from "@/apps/factory/product-catalog";
import {
  factoryCategories,
  factoryProductKits,
  factoryProducts,
  factoryProductsById,
  useFactoryStore,
} from "@/apps/factory/store";

describe("factory product catalog filtering", () => {
  it("filters products and kits by name without case sensitivity", () => {
    const results = filterFactoryCatalog(
      factoryProducts,
      factoryProductKits,
      "FRAME",
      "all",
    );

    expect(results.map(({ type, item }) => `${type}:${item.name}`)).toEqual([
      "kit:Frame Assembly Kit A",
    ]);
  });

  it("combines category and name filters", () => {
    const categoryOnly = filterFactoryCatalog(
      factoryProducts,
      factoryProductKits,
      "",
      "cat-3",
    );
    const combined = filterFactoryCatalog(
      factoryProducts,
      factoryProductKits,
      "service",
      "cat-3",
    );

    expect(categoryOnly.length).toBeGreaterThan(combined.length);
    expect(combined.every(({ item }) => item.categoryId === "cat-3")).toBe(true);
    expect(combined.map(({ item }) => item.name)).toContain(
      "Gasket Service Kit",
    );
    expect(
      filterFactoryCatalog(
        factoryProducts,
        factoryProductKits,
        "does not exist",
        "cat-3",
      ),
    ).toEqual([]);
  });

  it("resolves category names and safely handles legacy ids", () => {
    expect(getCatalogCategoryName(factoryCategories, "cat-1")).toBe(
      "Structural Components",
    );
    expect(getCatalogCategoryName(factoryCategories, "legacy-category")).toBeUndefined();
  });
});

describe("factory catalog validation", () => {
  it("requires all product fields", () => {
    expect(
      hasValidationErrors(
        validateProductInput({ name: " ", code: "", categoryId: "" }),
      ),
    ).toBe(true);
    expect(
      validateProductInput({
        name: "Steel plate",
        code: "STL-1",
        categoryId: "cat-1",
      }),
    ).toEqual({ name: false, code: false, categoryId: false });
  });

  it("requires a kit name, category, and at least one product", () => {
    expect(
      validateProductKitInput({ name: "", categoryId: "", productIds: [] }),
    ).toEqual({ name: true, categoryId: true, productIds: true });
    expect(
      hasValidationErrors(
        validateProductKitInput({
          name: "Mounting kit",
          categoryId: "cat-2",
          productIds: ["prod-1"],
        }),
      ),
    ).toBe(false);
  });

  it("requires a category name", () => {
    expect(validateCategoryInput("  ")).toEqual({ name: true });
    expect(validateCategoryInput("Fasteners")).toEqual({ name: false });
  });
});

describe("factory catalog store", () => {
  beforeEach(() => {
    useFactoryStore.setState({
      products: [...factoryProducts],
      productsById: { ...factoryProductsById },
      productKits: [...factoryProductKits],
      categories: [...factoryCategories],
    });
  });

  it("adds a product and synchronizes its index", () => {
    const product = {
      id: "prod-test",
      name: "Test Product",
      code: "TEST-1",
      image: "https://picsum.photos/seed/test/80/80",
      categoryId: "cat-1",
    };

    useFactoryStore.getState().addProduct(product);

    expect(useFactoryStore.getState().products).toContainEqual(product);
    expect(useFactoryStore.getState().productsById[product.id]).toEqual(product);
  });

  it("adds kits and categories", () => {
    const category = { id: "cat-test", name: "Test Category" };
    const kit = {
      id: "kit-test",
      name: "Test Kit",
      categoryId: category.id,
      productIds: ["prod-1"],
    };

    useFactoryStore.getState().addCategory(category);
    useFactoryStore.getState().addProductKit(kit);

    expect(useFactoryStore.getState().categories).toContainEqual(category);
    expect(useFactoryStore.getState().productKits).toContainEqual(kit);
  });

  it("updates a product category in both collection and index", () => {
    useFactoryStore.getState().updateProductCategory("prod-1", "cat-5");

    expect(useFactoryStore.getState().productsById["prod-1"]?.categoryId).toBe(
      "cat-5",
    );
    expect(
      useFactoryStore.getState().products.find((item) => item.id === "prod-1")
        ?.categoryId,
    ).toBe("cat-5");
  });
});
