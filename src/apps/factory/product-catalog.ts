import type {
  FactoryCategory,
  FactoryProduct,
  FactoryProductKit,
} from "@/apps/factory/store";

export type FactoryCatalogItem =
  | { type: "product"; item: FactoryProduct }
  | { type: "kit"; item: FactoryProductKit };

export function filterFactoryCatalog(
  products: FactoryProduct[],
  kits: FactoryProductKit[],
  query: string,
  categoryId: string,
): FactoryCatalogItem[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const items: FactoryCatalogItem[] = [
    ...products.map((item) => ({ type: "product" as const, item })),
    ...kits.map((item) => ({ type: "kit" as const, item })),
  ];

  return items.filter(
    ({ item }) =>
      (categoryId === "all" || item.categoryId === categoryId) &&
      (!normalizedQuery ||
        item.name.toLocaleLowerCase().includes(normalizedQuery)),
  );
}

export function getCatalogCategoryName(
  categories: FactoryCategory[],
  categoryId: string,
) {
  return categories.find((category) => category.id === categoryId)?.name;
}

export function validateProductInput(input: {
  name: string;
  code: string;
  categoryId: string;
}) {
  return {
    name: input.name.trim().length === 0,
    code: input.code.trim().length === 0,
    categoryId: input.categoryId.length === 0,
  };
}

export function validateProductKitInput(input: {
  name: string;
  categoryId: string;
  productIds: string[];
}) {
  return {
    name: input.name.trim().length === 0,
    categoryId: input.categoryId.length === 0,
    productIds: input.productIds.length === 0,
  };
}

export function validateCategoryInput(name: string) {
  return { name: name.trim().length === 0 };
}

export function hasValidationErrors(errors: Record<string, boolean>) {
  return Object.values(errors).some(Boolean);
}
