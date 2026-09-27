import { useDashboardFilters } from "../filters/useDashboardFilters";

import { DIMENSION_LABELS, DIMENSIONS, METRIC_KEYS } from "@/api/types";
import Navbar from "../navbar/Header";
import MetricPanel from "../metricPanel/MetricPanel";
import TimeSeriesChart from "../chart/TimeSeriesChart";
import { Navigate, useLocation, useParams } from "react-router-dom";

import { ALL, DEFAULT_METRIC } from "@/utils/constants";
import { formatDimensionValue } from "@/utils/formats";
import { useSummary } from "@/api/hooks";
import { isMetricKey } from "@/utils/utils";
import BreakDown from "../breakdown/BreakDown";
import { Chip } from "@mui/material";

function Dashboard() {
  const {
    preset,
    selections,
    range,
    filters,
    setPreset,
    setDimension,
    toggleDimension,
    clearAll,
  } = useDashboardFilters();
  const { metric } = useParams();
  const { search } = useLocation();

  const summary = useSummary(range, filters);

  if (!isMetricKey(metric))
    return <Navigate to={{ pathname: `/${DEFAULT_METRIC}`, search }} replace />;

  return (
    <div className="mx-auto min-h-screen overflow-hidden flex max-w-360 flex-col gap-(--gap) p-(--page-pad)">
      <Navbar
        preset={preset}
        selections={selections}
        setPreset={setPreset}
        setDimension={setDimension}
      />
      <div className="flex gap-2 items-center">
        {DIMENSIONS.filter((d) => filters[d]?.length).map((d) => (
          <Chip
            key={d}
            label={`${DIMENSION_LABELS[d]}: ${filters[d]
              ?.map((v) => formatDimensionValue(d, v))
              .join(", ")}`}
            onDelete={() => setDimension(d, ALL)}
          />
        ))}
        {DIMENSIONS.filter((d) => filters[d]?.length).length > 0 && (
          <button
            className="cursor-pointer text-muted underline underline-blue"
            onClick={clearAll}
          >
            clear all
          </button>
        )}
      </div>
      <main className="flex flex-col gap-(--gap)">
        <div className="grid grid-cols-2 gap-(--gap) md:grid-cols-3 lg:grid-cols-6">
          {METRIC_KEYS.map((key) => (
            <MetricPanel
              key={key}
              metric={key}
              present={summary.data?.present[key]}
              past={summary.data?.past[key]}
              isLoading={summary.isPending}
              isError={summary.isError}
              isEmpty={summary.data?.present.plays === 0}
              onRetry={summary.refetch}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 mt-4 gap-(--gap) h-full lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <TimeSeriesChart metric={metric} range={range} filters={filters} />
          <BreakDown
            metric={metric}
            range={range}
            filters={filters}
            onRowSelect={toggleDimension}
          />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
