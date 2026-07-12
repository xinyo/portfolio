import { useCallback } from "react";

export function useRandomProductImage() {
  return useCallback(() => {
    const seed = crypto.randomUUID();
    return `https://picsum.photos/seed/${seed}/80/80`;
  }, []);
}
