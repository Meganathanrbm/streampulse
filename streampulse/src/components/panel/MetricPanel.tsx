import { METRIC_META, type MetricKey } from "@/api/types";
import MetricError from "./MetricError";
import MetricSkeleton from "./MetricSkeleton";
import MetricValue from "./MetricValue";
import clsx from "clsx";
import { NavLink } from "react-router-dom";

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
    <NavLink
      to={`/${metric}`}
      aria-label={label}
      className={({ isActive }) =>
        clsx(
          "block min-w-0 rounded-card border-2 bg-surface p-4",
          isActive ? "border-blue-500" : "border-line hover:border-blue-300",
        )
      }
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
    </NavLink>
  );
}

function PanelBody({
  metric,
  present,
  past,
  isLoading,
  isError,
  onRetry,
}: Omit<MetricPanelProps, "currenPanel">) {
  if (isError) return <MetricError onRetry={onRetry} />;

  if (isLoading || present === undefined || past === undefined) {
    return <MetricSkeleton label={METRIC_META[metric].label} />;
  }

  return <MetricValue metric={metric} present={present} past={past} />;
}

export default MetricPanel;
