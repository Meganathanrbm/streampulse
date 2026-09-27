import { METRIC_META, type MetricKey } from "@/api/types";
import MetricEmpty from "./MetricEmpty";
import MetricError from "./MetricError";
import MetricSkeleton from "./MetricSkeleton";
import MetricValue from "./MetricValue";
import clsx from "clsx";
import { NavLink, useLocation } from "react-router-dom";

interface MetricPanelProps {
  metric: MetricKey;
  present?: number;
  past?: number;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  onRetry?: () => void;
}

function MetricPanel({
  metric,
  present,
  past,
  isLoading,
  isError,
  isEmpty,
  onRetry,
}: MetricPanelProps) {
  const { label } = METRIC_META[metric];
  const { search } = useLocation();
  let body;
  if (isError) {
    body = <MetricError onRetry={onRetry} />;
  } else if (isLoading || present === undefined || past === undefined) {
    body = <MetricSkeleton label={METRIC_META[metric].label} />;
  } else if (isEmpty) {
    body = <MetricEmpty />;
  } else {
    body = <MetricValue metric={metric} present={present} past={past} />;
  }
  return (
    <NavLink
      to={{ pathname: `/${metric}`, search }}
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
      {body}
    </NavLink>
  );
}

export default MetricPanel;
