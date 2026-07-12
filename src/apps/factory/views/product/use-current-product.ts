import { useParams } from "react-router";

import { useFactoryStore } from "@/apps/factory/store";

export function useCurrentFactoryProduct() {
  const { productId } = useParams();
  const product = useFactoryStore((state) =>
    productId ? state.productsById[productId] : undefined,
  );

  return {
    productId,
    product,
  };
}
