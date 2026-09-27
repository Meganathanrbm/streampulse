import { useCallback, useMemo } from "react";
import { rangeEndingNow } from "@/utils/utils";
import {
  DATE_PRESETS,
  type DatePreset,
  type DimensionKey,
  type Filters,
  type TimeRange,
} from "@/api/types";
import { ALL } from "@/utils/constants";
import { useSearchParams } from "react-router-dom";
import { DIMENSIONS } from "../../api/types";

export type Selections = Record<DimensionKey, string>;

export interface DashboardFilters {
  preset: DatePreset;
  selections: Selections;
  range: TimeRange;
  filters: Filters;
  setPreset: (preset: DatePreset) => void;
  setDimension: (dimension: DimensionKey, value: string) => void;
  toggleDimension: (dimension: DimensionKey, value: string) => void;
  clearAll: () => void;
}

const RANGE_KEY = "range";
const DEFAULT_PRESET = "last-7-days";

const isPreset = (v: string | null): v is DatePreset =>
  DATE_PRESETS.some((p) => p.key === v);

export function useDashboardFilters(): DashboardFilters {
  const [searchParams, setSearchParams] = useSearchParams();

  const rangeParams = searchParams.get(RANGE_KEY);
  const preset: DatePreset = isPreset(rangeParams)
    ? rangeParams
    : DEFAULT_PRESET;

  const selections = useMemo(
    () =>
      Object.fromEntries(
        DIMENSIONS.map((d) => [d, searchParams.get(d) ?? ALL]),
      ) as Selections,
    [searchParams],
  );

  const update = useCallback(
    (changes: Partial<Record<string, string>>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("page");
        for (const [key, value] of Object.entries(changes)) {
          const isDefault =
            value === null ||
            value === ALL ||
            (key === RANGE_KEY && value === DEFAULT_PRESET);
          if (isDefault || !value) next.delete(key);
          else next.set(key, value);
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const setPreset = useCallback(
    (p: DatePreset) => update({ [RANGE_KEY]: p }),
    [update],
  );

  const setDimension = useCallback(
    (dimension: DimensionKey, value: string) => update({ [dimension]: value }),
    [update],
  );

  const toggleDimension = useCallback(
    (dimension: DimensionKey, value: string) =>
      update({ [dimension]: selections[dimension] === value ? ALL : value }),
    [update, selections],
  );

  const range = useMemo(() => {
    const { durationSec } = DATE_PRESETS.find((p) => p.key === preset)!;
    return rangeEndingNow(durationSec);
  }, [preset]);

  const filters = useMemo<Filters>(() => {
    const result: Filters = {};
    for (const [dimension, value] of Object.entries(selections)) {
      if (value !== ALL) result[dimension as DimensionKey] = [value];
    }
    return result;
  }, [selections]);

  const clearAll = useCallback(() => {
    update(
      Object.fromEntries([RANGE_KEY, ...DIMENSIONS].map((k) => [k, undefined])),
    );
  }, [update]);
  return {
    preset,
    selections,
    range,
    filters,
    setPreset,
    setDimension,
    toggleDimension,
    clearAll,
  };
}
