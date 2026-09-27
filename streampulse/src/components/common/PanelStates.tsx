interface PanelErrorProps {
  title: string;
  message?: string;
  onRetry: () => void;
}

export function PanelError({ title, message, onRetry }: PanelErrorProps) {
  return (
    <div
      role="alert"
      className="flex min-h-56 flex-col items-center justify-center gap-1 text-center"
    >
      <span aria-hidden="true" className="text-xl text-bad">
        ⚠
      </span>
      <p className="m-0 text-sm font-semibold">{title}</p>
      <p className="m-0 text-xs text-muted">
        {message ?? "The rest of the page is unaffected."}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 cursor-pointer rounded-md border-0 bg-accent px-3 py-1 text-xs font-semibold text-bg"
      >
        Retry
      </button>
    </div>
  );
}

interface PanelEmptyProps {
  title: string;
  message: string;
}

export function PanelEmpty({ title, message }: PanelEmptyProps) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-1 text-center">
      <span aria-hidden="true" className="text-xl text-muted">
        ⌕
      </span>
      <p className="m-0 text-sm font-semibold">{title}</p>
      <p className="m-0 max-w-xs text-xs text-muted">{message}</p>
    </div>
  );
}
