import clsx from "clsx";
import { METRIC_META, type MetricKey } from "@/api/types";
import { formatMetricValue, getTrend, type TrendTone } from "@/utils/formats";

const TONE_CLASS: Record<TrendTone, string> = {
  good: "text-good",
  bad: "text-bad",
  neutral: "text-muted",
};

const TONE_TEXT: Record<TrendTone, string> = {
  good: "better",
  bad: "worse",
  neutral: "no change",
};

const ARROW = { up: "▲", down: "▼", flat: "–" } as const;

interface MetricValueProps {
  metric: MetricKey;
  present: number;
  past: number;
}

function MetricValue({ metric, present, past }: MetricValueProps) {
  const meta = METRIC_META[metric];
  const trend = getTrend(present, past, meta);
  const percentText =
    trend.percent === null ? "N/A" : `${trend.percent.toFixed(1)}%`;

  return (
    <>
      <p className="m-0 mb-2 text-2xl font-bold leading-tight">
        {formatMetricValue(present, meta)}
        {meta.unit && (
          <span className="ml-1 text-sm font-medium text-muted">
            {meta.unit}
          </span>
        )}
      </p>

      <p className="m-0 mt-1 flex items-center gap-1.5 text-xs">
        <span className={clsx("font-semibold", TONE_CLASS[trend.tone])}>
          <span aria-hidden="true">{ARROW[trend.direction]}</span> {percentText}
          <span className="ml-1 font-normal">({TONE_TEXT[trend.tone]})</span>
        </span>
        <span className="text-muted">
          vs {formatMetricValue(past, meta)}
          {meta.unit && ` ${meta.unit}`}
        </span>
      </p>
    </>
  );
}

export default MetricValue;
