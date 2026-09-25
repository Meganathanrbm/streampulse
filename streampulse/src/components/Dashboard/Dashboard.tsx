import { useDashboardFilters } from "../filters/useDashboardFilters";

import { METRIC_KEYS } from "@/api/types";
import Navbar from "../navbar/Header";
import MetricPanel from "../panel/MetricPanel";
import { Navigate, useParams } from "react-router-dom";

import { DEFAULT_METRIC } from "@/utils/constants";
import { useSummary } from "@/api/hooks";
import { isMetricKey } from "@/utils/utils";

function Dashboard() {
  const { preset, selections, range, filters, setPreset, setDimension } =
    useDashboardFilters();
  const { metric } = useParams();
  const summary = useSummary(range, filters);

  if (!isMetricKey(metric))
    return <Navigate to={`/${DEFAULT_METRIC}`} replace />;

  return (
    <div className="mx-auto w-screen h-screen overflow-hidden flex max-w-360 flex-col gap-(--gap) p-(--page-pad)">
      <Navbar
        preset={preset}
        selections={selections}
        setPreset={setPreset}
        setDimension={setDimension}
      />
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
              onRetry={() => summary.refetch()}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-(--gap) lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/*// TODO */}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
