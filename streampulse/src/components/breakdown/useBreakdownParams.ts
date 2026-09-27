import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DIMENSIONS,
  type BreakdownSortField,
  type DimensionKey,
  type SortOrder,
} from "@/api/types";
import { DEBOUNCE_DURATION, DEFAULT_ORDER } from "@/utils/constants";
import { useDebounce } from "@/hooks/useDebounce";

export interface SortState {
  by: BreakdownSortField;
  order: SortOrder;
}

const PAGE = "page";
const DIMENSION = "dimension";
const DEFAULT_DIMENSION: DimensionKey = "device";
const SEARCH = "search";
const SORT_BY = "sortBy";
const SORT_ORDER = "sortOrder";
const INITIAL_SORT: SortState = { by: "value", order: "desc" };
const SORT_FIELDS: BreakdownSortField[] = ["key", "value", "plays"];
const SORT_ORDERS: SortOrder[] = ["asc", "desc"];

const isDimension = (v: string | null): v is DimensionKey =>
  DIMENSIONS.includes(v as DimensionKey);

const isSortField = (v: string | null): v is BreakdownSortField =>
  SORT_FIELDS.includes(v as BreakdownSortField);

const isSortOrder = (v: string | null): v is SortOrder =>
  SORT_ORDERS.includes(v as SortOrder);

function parseSort(by: string | null, order: string | null): SortState {
  return {
    by: isSortField(by) ? by : INITIAL_SORT.by,
    order: isSortOrder(order) ? order : INITIAL_SORT.order,
  };
}

interface ParamsPatch {
  page: number;
  dimension?: DimensionKey;
  sort?: SortState;
  search?: string;
}

function parsePage(raw: string | null): number {
  const n = Number(raw);
  return Number.isInteger(n) && n > 1 ? n : 1;
}

export function useBreakdownParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get(SEARCH) ?? "";
  const [search, setSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(search, DEBOUNCE_DURATION);
  const page = parsePage(searchParams.get(PAGE));
  const sort = parseSort(
    searchParams.get(SORT_BY),
    searchParams.get(SORT_ORDER),
  );
  const dimensionParam = searchParams.get(DIMENSION);
  const dimension = isDimension(dimensionParam)
    ? dimensionParam
    : DEFAULT_DIMENSION;

  const update = useCallback(
    ({
      page: nextPage,
      dimension: nextDimension,
      sort: nextSort,
      search: nextSearch,
    }: ParamsPatch) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (nextSearch !== undefined) {
            if (nextSearch === "") next.delete(SEARCH);
            else next.set(SEARCH, nextSearch);
          }
          if (nextDimension !== undefined) {
            if (nextDimension === DEFAULT_DIMENSION) next.delete(DIMENSION);
            else next.set(DIMENSION, nextDimension);
          }
          if (nextSort !== undefined) {
            if (nextSort.by === INITIAL_SORT.by) next.delete(SORT_BY);
            else next.set(SORT_BY, nextSort.by);
            if (nextSort.order === INITIAL_SORT.order) next.delete(SORT_ORDER);
            else next.set(SORT_ORDER, nextSort.order);
          }
          if (nextPage <= 1) next.delete(PAGE);
          else next.set(PAGE, String(nextPage));
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setPage = useCallback(
    (next: number) => {
      if (next !== page) update({ page: next });
    },
    [page, update],
  );

  const setDimension = useCallback(
    (next: DimensionKey) => {
      setSearch("");
      update({ page: 1, dimension: next, search: "" });
    },
    [update],
  );

  const lastSearch = useRef(debouncedSearch);

  useEffect(() => {
    if (debouncedSearch === lastSearch.current) return;
    lastSearch.current = debouncedSearch;
    update({ page: 1, search: debouncedSearch });
  }, [debouncedSearch, update]);

  const handleSort = useCallback(
    (field: BreakdownSortField) => {
      const nextSort: SortState =
        sort.by === field
          ? { by: field, order: sort.order === "asc" ? "desc" : "asc" }
          : { by: field, order: DEFAULT_ORDER[field] };
      update({ page: 1, sort: nextSort });
    },
    [sort.by, sort.order, update],
  );

  return {
    page,
    dimension,
    sort,
    search,
    searchQuery,
    setSearch,
    handleSort,
    setPage,
    setDimension,
  };
}
