interface MetricErrorProps {
  onRetry?: () => void;
}

function MetricError({ onRetry }: MetricErrorProps) {
  return (
    <p className="m-0 flex items-center gap-2 text-xs text-bad" role="alert">
      Failed to load
      {onRetry && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRetry();
          }}
          className="cursor-pointer rounded border border-line bg-transparent px-1.5 py-0.5 text-xs text-ink"
        >
          Retry
        </button>
      )}
    </p>
  );
}

export default MetricError;
