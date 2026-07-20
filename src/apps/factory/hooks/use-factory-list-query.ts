import { useCallback } from "react";
import { useSearchParams } from "react-router";

import { updateFactorySearchQuery } from "@/apps/factory/search-model";

export function useFactoryListQuery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const setQuery = useCallback(
    (nextQuery: string) => {
      setSearchParams(updateFactorySearchQuery(searchParams, nextQuery), {
        replace: true,
      });
    },
    [searchParams, setSearchParams],
  );

  return [query, setQuery] as const;
}
