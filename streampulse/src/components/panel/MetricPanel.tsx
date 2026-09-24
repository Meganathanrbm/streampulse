import { METRIC_META, type MetricKey } from "@/api/types";
import MetricError from "./MetricError";
import MetricSkeleton from "./MetricSkeleton";
import MetricValue from "./MetricValue";

interface MetricPanelProps {
  metric: MetricKey;
  present?: number;
  past?: number;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

function MetricPanel({
  metric,
  present,
  past,
  isLoading,
  isError,
  onRetry,
}: MetricPanelProps) {
  const { label } = METRIC_META[metric];

  return (
    <section
      className="min-w-0 rounded-card border-2 border-line bg-surface p-4 hover:border-blue-500 cursor-pointer"
      aria-label={label}
    >
      <h2 className="m-0 mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </h2>
      <PanelBody
        metric={metric}
        present={present}
        past={past}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
      />
     
    </section>
  );
}

function PanelBody({
  metric,
  present,
  past,
  isLoading,
  isError,
  onRetry,
}: MetricPanelProps) {
  if (isError) return <MetricError onRetry={onRetry} />;

  if (isLoading || present === undefined || past === undefined) {
    return <MetricSkeleton label={METRIC_META[metric].label} />;
  }

  return <MetricValue metric={metric} present={present} past={past} />;
}

export default MetricPanel;
