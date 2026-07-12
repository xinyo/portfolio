import { useParams } from "react-router";

import { factoryProductsById } from "@/apps/factory/store";

export function useCurrentFactoryProduct() {
  const { productId } = useParams();

  return {
    productId,
    product: productId ? factoryProductsById[productId] : undefined,
  };
}
