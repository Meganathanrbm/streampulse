import { lazy, memo, Suspense, useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";

import { useTimeSeries } from "@/api/hooks";
import {
  DIMENSION_LABELS,
  DIMENSIONS,
  METRIC_META,
  type DimensionKey,
  type Filters,
  type MetricKey,
  type TimeRange,
} from "@/api/types";
import { formatBucket, formatDimensionValue } from "@/utils/formats";
import { PanelEmpty, PanelError } from "../common/PanelStates";
import FilterSelect from "../filters/FilterSelect";

import ChartSkeleton from "./ChartSkeleton";
import { useSearchParams } from "react-router-dom";
const Chart = lazy(() => import("./Chart"));

interface TimeSeriesChartProps {
  metric: MetricKey;
  range: TimeRange;
  filters: Filters;
}

const NONE = "none";
const GROUP_BY = "groupBy";
const GROUP_BY_OPTIONS = [
  { value: NONE, label: "None" },
  ...DIMENSIONS.map((d) => ({ value: d, label: DIMENSION_LABELS[d] })),
];

const isGroupBy = (s: string | null) => DIMENSIONS.includes(s as DimensionKey);

function TimeSeriesChart({ metric, range, filters }: TimeSeriesChartProps) {
  const [searchQuery, setSearchQuery] = useSearchParams();
  const groupByQuery = searchQuery.get(GROUP_BY);
  const groupBy: DimensionKey | null = isGroupBy(groupByQuery)
    ? (groupByQuery as DimensionKey)
    : null;
  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } =
    useTimeSeries({ range, metric, groupBy, filters });

  const meta = METRIC_META[metric];
  const series = data?.series ?? [];

  const rows = useMemo(() => {
    const byTs = new Map<number, Record<string, number>>();
    for (const s of data?.series ?? [])
      for (const p of s.points)
        byTs.set(p.ts, { ...byTs.get(p.ts), ts: p.ts, [s.name]: p.value });
    return [...byTs.values()].sort((a, b) => a.ts - b.ts);
  }, [data]);

  const subtitle = [
    data && `${formatBucket(data.granularitySec)} buckets`,
    ...DIMENSIONS.flatMap((d) => {
      const selected = filters[d];
      return selected?.length
        ? [`${selected.map((v) => formatDimensionValue(d, v)).join(", ")} only`]
        : [];
    }),
  ]
    .filter(Boolean)
    .join(" · ");

  const setGroupBy = (val: string) => {
    setSearchQuery((prev) => {
      const next = new URLSearchParams(prev);
      if (isGroupBy(val)) next.set(GROUP_BY, val);
      else next.delete(GROUP_BY);
      return next;
    });
  };

  let body;
  if (isError) {
    body = (
      <PanelError title="Could not load this chart" onRetry={() => refetch()} />
    );
  } else if (isPending) {
    body = <ChartSkeleton label={meta.label} />;
  } else if (rows.length === 0) {
    body = (
      <PanelEmpty
        title="No data for these filters"
        message="Try widening the date range or clearing a filter."
      />
    );
  } else {
    body = (
      <Suspense fallback={<ChartSkeleton label={meta?.label} />}>
        <Chart
          rows={rows}
          series={series}
          meta={meta}
          sec={data?.granularitySec ?? 3600}
          groupBy={groupBy}
          stale={isPlaceholderData}
        />
      </Suspense>
    );
  }

  return (
    <section className="min-w-0 rounded-card border border-line bg-surface p-4">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="m-0 text-base font-semibold">{meta.label} over time</h2>
        <div className="flex items-center gap-3">
          {isFetching && !isPending && (
            <span
              role="status"
              className="flex items-center gap-2 text-sm text-muted"
            >
              <CircularProgress size={14} thickness={5} color="inherit" />
              Updating…
            </span>
          )}
          <FilterSelect
            label="Group by"
            value={groupBy ?? NONE}
            options={GROUP_BY_OPTIONS}
            onChange={setGroupBy}
          />
        </div>
      </div>
      {subtitle && <p className="m-0 mb-3 text-sm text-muted">{subtitle}</p>}
      {body}
    </section>
  );
}

export default memo(TimeSeriesChart);
