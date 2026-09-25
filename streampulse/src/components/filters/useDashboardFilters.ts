import { useCallback, useMemo, useState } from "react";
import { rangeEndingNow } from "@/utils/utils";
import {
  DATE_PRESETS,
  type DatePreset,
  type DimensionKey,
  type Filters,
  type TimeRange,
} from "@/api/types";


export const ALL = "all";

export type Selections = Record<DimensionKey, string>;

export interface DashboardFilters {
  preset: DatePreset;
  selections: Selections;
  range: TimeRange;
  filters: Filters;
  setPreset: (preset: DatePreset) => void;
  setDimension: (dimension: DimensionKey, value: string) => void;
}

export function useDashboardFilters(): DashboardFilters {
  const [preset, setPreset] = useState<DatePreset>("last-7-days");
  const [selections, setSelections] = useState<Selections>({
    device: ALL,
    country: ALL,
    cdn: ALL,
  });

  const setDimension = useCallback((dimension: DimensionKey, value: string) => {
    setSelections((current) => ({ ...current, [dimension]: value }));
  }, []);

  const range = useMemo(() => {
    const { durationSec } = DATE_PRESETS.find((p) => p.key === preset) ?? DATE_PRESETS[1];
    return rangeEndingNow(durationSec);
  }, [preset]);

  const filters = useMemo<Filters>(() => {
    const result: Filters = {};
    for (const [dimension, value] of Object.entries(selections)) {
      if (value !== ALL) result[dimension as DimensionKey] = [value];
    }
    return result;
  }, [selections]);

  return { preset, selections, range, filters, setPreset, setDimension };
}
