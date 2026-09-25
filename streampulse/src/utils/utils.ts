import { datasetEnd } from "@/api/mock-data";
import type { TimeRange } from "@/api/types";
import { METRIC_KEYS, type MetricKey } from "@/api/types";

export function rangeEndingNow(durationSec: number): TimeRange {
  return { from: datasetEnd - durationSec, to: datasetEnd };
}

export const isMetricKey = (value?: string) =>
  METRIC_KEYS.includes(value as MetricKey);
