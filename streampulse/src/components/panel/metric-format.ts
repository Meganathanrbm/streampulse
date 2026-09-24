import type { MetricMeta } from "@/api/types";

export type TrendTone = "good" | "bad" | "neutral";

export interface Trend {
  percent: number | null;
  direction: "up" | "down" | "flat";
  tone: TrendTone;
}

export function formatMetricValue(value: number, meta: MetricMeta): string {
  if (!meta.unit) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);
  }
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
  const isImprovement =
    (direction === "up") !== meta.invertedLogic ? "good" : "bad";
  return { percent, direction, tone: isImprovement };
}
