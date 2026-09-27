const BAR_HEIGHTS = [38, 62, 46, 74, 52, 84, 68, 92, 58, 76];

function ChartSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading {label} chart</span>
      <div
        aria-hidden="true"
        className="flex h-94 items-end gap-3 px-1 pt-2"
      >
        {BAR_HEIGHTS.map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
            className="flex-1 animate-pulse rounded-md bg-line motion-reduce:animate-none"
          />
        ))}
      </div>
    </div>
  );
}

export default ChartSkeleton;
