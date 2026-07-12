import type { FactorySupplier } from "@/apps/factory/store";

export function removeUnavailablePreferredSupplier(
  supplierIds: string[],
  preferredSupplierId: string | null,
) {
  return preferredSupplierId && supplierIds.includes(preferredSupplierId)
    ? preferredSupplierId
    : null;
}

export function getPricedSuppliers(
  suppliers: FactorySupplier[],
  supplierIds: string[],
  productId: string,
) {
  return suppliers.flatMap((supplier) => {
    if (!supplierIds.includes(supplier.id)) {
      return [];
    }
    const suppliedProduct = supplier.suppliedProducts.find(
      (item) => item.productId === productId,
    );
    return suppliedProduct
      ? [{ supplier, supplyPrice: suppliedProduct.supplyPrice }]
      : [];
  });
}
