import { describe, expect, it } from "vitest";
import { METRIC_META } from "@/api/types";
import {
  formatCellValue,
  formatCompact,
  formatMetricValue,
  formatShare,
  formatTimeStamps,
  getTrend,
} from "../utils/formats";

const { plays, avgBitrateKbps, rebufferRatio, startupTimeMs, errorRate } =
  METRIC_META;

describe("formatMetricValue", () => {
  it("compacts unitless metrics", () => {
    expect(formatMetricValue(999, plays)).toBe("999");
    expect(formatMetricValue(1500, plays)).toBe("1.5K");
    expect(formatMetricValue(1_234_567, plays)).toBe("1.23M");
  });

  it("uses the meta decimals for metrics with a unit", () => {
    expect(formatMetricValue(3456.7, avgBitrateKbps)).toBe("3,457");
    expect(formatMetricValue(1.2, rebufferRatio)).toBe("1.20");
  });
});

describe("formatCellValue", () => {
  it("appends % without a space", () => {
    expect(formatCellValue(2.5, errorRate)).toBe("2.50%");
  });

  it("appends other units with a space", () => {
    expect(formatCellValue(1200, startupTimeMs)).toBe("1,200 ms");
  });

  it("leaves unitless metrics compact with no suffix", () => {
    expect(formatCellValue(1500, plays)).toBe("1.5K");
  });
});

describe("formatCompact / formatShare", () => {
  it("formats compact numbers to one digit", () => {
    expect(formatCompact(999)).toBe("999");
    expect(formatCompact(1234)).toBe("1.2K");
    expect(formatCompact(2_500_000)).toBe("2.5M");
  });

  it("formats a 0..1 share as a percentage", () => {
    expect(formatShare(0)).toBe("0.0%");
    expect(formatShare(0.1234)).toBe("12.3%");
    expect(formatShare(1)).toBe("100.0%");
  });
});

describe("getTrend", () => {
  it("reports an increase on a higher-is-better metric as good", () => {
    expect(getTrend(110, 100, plays)).toEqual({
      percent: 10,
      direction: "up",
      tone: "good",
    });
  });

  it("reports a decrease on a higher-is-better metric as bad", () => {
    expect(getTrend(90, 100, plays)).toEqual({
      percent: 10,
      direction: "down",
      tone: "bad",
    });
  });

  it("treats an increase on an inverted metric as a regression", () => {
    expect(getTrend(3, 2, rebufferRatio)).toMatchObject({
      direction: "up",
      tone: "bad",
    });
  });

  it("treats a decrease on an inverted metric as an improvement", () => {
    expect(getTrend(1, 2, errorRate)).toMatchObject({
      direction: "down",
      tone: "good",
    });
  });

  it("returns a null percent when the past value is zero", () => {
    expect(getTrend(5, 0, plays)).toEqual({
      percent: null,
      direction: "flat",
      tone: "neutral",
    });
  });

  it("is flat and neutral when nothing changed", () => {
    expect(getTrend(100, 100, plays)).toEqual({
      percent: 0,
      direction: "flat",
      tone: "neutral",
    });
  });

  it("keeps a null percent when both values are zero", () => {
    expect(getTrend(0, 0, plays)).toEqual({
      percent: null,
      direction: "flat",
      tone: "neutral",
    });
  });

  it("treats changes under 0.05% as flat", () => {
    expect(getTrend(100.01, 100, plays)).toEqual({
      percent: 0,
      direction: "flat",
      tone: "neutral",
    });
  });
});

describe("formatTimeStamps", () => {
  const ts = Date.UTC(2024, 0, 15, 14, 30) / 1000;
  const HOUR = 3600;
  const DAY = 24 * HOUR;

  it("shows only the date on axes for longer spans", () => {
    expect(formatTimeStamps(ts, 3 * HOUR)).toBe("Jan 15");
    expect(formatTimeStamps(ts, 7 * DAY)).toBe("Jan 15");
  });

  it("shows only the date in tooltips for spans of a day or more", () => {
    expect(formatTimeStamps(ts, DAY, true)).toBe("Jan 15");
  });
});
