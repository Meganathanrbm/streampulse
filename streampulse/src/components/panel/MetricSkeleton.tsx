interface SkeletonBarProps {
  lineClass: string;
  barClass: string;
}

function SkeletonBar({ lineClass, barClass }: SkeletonBarProps) {
  return (
    <div className={`flex items-center ${lineClass}`}>
      <div
        className={`animate-pulse rounded bg-line motion-reduce:animate-none ${barClass}`}
      />
    </div>
  );
}


function MetricSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading {label}</span>
      <div aria-hidden="true">
        <SkeletonBar lineClass="h-[1.875rem]" barClass="h-6 w-2/3" />
        <div className="mt-1">
          <SkeletonBar lineClass="h-4" barClass="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export default MetricSkeleton;
