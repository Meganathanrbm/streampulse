import { describe, expect, it } from "vitest";
import { datasetEnd } from "@/api/mock-data";
import { METRIC_KEYS } from "@/api/types";
import { isMetricKey, rangeEndingNow } from "./utils";
import { DEFAULT_ORDER } from "./constants";

describe("rangeEndingNow", () => {
  it("ends at the dataset end and spans the given duration", () => {
    expect(rangeEndingNow(3600)).toEqual({
      from: datasetEnd - 3600,
      to: datasetEnd,
    });
  });
});

describe("isMetricKey", () => {
  it.each(METRIC_KEYS)("accepts %s", (key) => {
    expect(isMetricKey(key)).toBe(true);
  });

  it.each([undefined, "", "unknown", "Plays"])("rejects %j", (value) => {
    expect(isMetricKey(value)).toBe(false);
  });
});

describe("DEFAULT_ORDER", () => {
  it("sorts text ascending and numeric fields descending", () => {
    expect(DEFAULT_ORDER).toEqual({ key: "asc", value: "desc", plays: "desc" });
  });
});
