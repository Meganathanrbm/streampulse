import type { Country, DimensionKey, MetricMeta } from "@/api/types";
import { COUNTRY_LABELS } from "./constants";

export function formatDimensionValue(
  dimension: DimensionKey,
  value: string,
): string {
  if (dimension === "country") return COUNTRY_LABELS[value as Country] ?? value;
  return value;
}

export type TrendTone = "good" | "bad" | "neutral";

export interface Trend {
  percent: number | null;
  direction: "up" | "down" | "flat";
  tone: TrendTone;
}

function compact(value: number, maxDigits: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: maxDigits,
  }).format(value);
}

export function formatMetricValue(value: number, meta: MetricMeta): string {
  if (!meta.unit) return compact(value, 2);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: meta.decimals,
    maximumFractionDigits: meta.decimals,
  }).format(value);
}

export function getTrend(
  present: number,
  past: number,
  meta: MetricMeta,
): Trend {
  if (past === 0) {
    return { percent: null, direction: "flat", tone: "neutral" };
  }

  const diff = present - past;
  const percent = past === 0 ? null : (Math.abs(diff) / Math.abs(past)) * 100;

  if (diff === 0 || (percent !== null && percent < 0.05)) {
    return {
      percent: percent === null ? null : 0,
      direction: "flat",
      tone: "neutral",
    };
  }

  const direction = diff > 0 ? "up" : "down";
  const tone = (direction === "up") !== meta.invertedLogic ? "good" : "bad";
  return { percent, direction, tone };
}

export function formatCellValue(value: number, meta: MetricMeta): string {
  const text = formatMetricValue(value, meta);

  if (!meta.unit) return text;
  return meta.unit === "%" ? `${text}%` : `${text} ${meta.unit}`;
}

export function formatCompact(value: number): string {
  return compact(value, 1);
}

export function formatShare(share: number): string {
  return `${(share * 100).toFixed(1)}%`;
}

export function formatBucket(sec: number): string {
  const units: [number, string][] = [
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [size, name] of units) {
    if (sec % size === 0) {
      const n = sec / size;
      return n === 1 ? `${name}ly`.replace("dayly", "daily") : `${n}-${name}`;
    }
  }
  return `${sec}-second`;
}

const DATE = { month: "short", day: "numeric" } as const;
const TIME = { hour: "numeric", minute: "2-digit" } as const;
const DAY = 86400;

export const formatTimeStamps = (ts: number, sec: number, tooltip = false) =>
  new Date(ts * 1000).toLocaleString(
    "en-US",
    tooltip
      ? sec < DAY
        ? { ...DATE, ...TIME }
        : DATE
      : sec < 3 * 3600
        ? TIME
        : DATE,
  );
