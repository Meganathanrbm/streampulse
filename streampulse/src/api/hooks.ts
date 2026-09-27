import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchBreakdown,
  fetchDimensionValues,
  fetchSummary,
  fetchTimeSeries,
  type BreakdownParams,
  type TimeSeriesParams,
} from "./mock-api";
import type { DimensionKey, Filters, TimeRange } from "./types";

export function useDimensionValues(dimension: DimensionKey) {
  return useQuery({
    queryKey: ["dimensionValues", dimension],
    queryFn: ({ signal }) => fetchDimensionValues(dimension, signal),
    staleTime: Infinity,
  });
}

export function useSummary(range: TimeRange, filters: Filters = {}) {
  return useQuery({
    queryKey: ["summary", range, filters],
    queryFn: ({ signal }) => fetchSummary({ range, filters, signal }),
  });
}

export function useTimeSeries(params: Omit<TimeSeriesParams, "signal">) {
  return useQuery({
    queryKey: ["timeSeries", params],
    queryFn: ({ signal }) => fetchTimeSeries({ ...params, signal }),
    placeholderData: keepPreviousData,
  });
}

export function useBreakDown(params: Omit<BreakdownParams, "signal">) {
  return useQuery({
    queryKey: ["breakdown", params],
    queryFn: ({ signal }) => fetchBreakdown({ ...params, signal }),
    placeholderData: keepPreviousData,
  });
}
