import { PAGE_SIZE } from "@/utils/constants";
import Pagination from "@mui/material/Pagination";

interface BreakdownPaginationProps {
  page: number;
  totalRows: number;
  onChange: (page: number) => void;
}

function BreakdownPagination({
  page,
  totalRows,
  onChange,
}: BreakdownPaginationProps) {
  const pageCount = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
  const shown = Math.min(
    PAGE_SIZE,
    Math.max(0, totalRows - (page - 1) * PAGE_SIZE),
  );

  return (
    <div className="mt-3 flex items-center justify-between">
      <span className="text-xs text-muted" aria-live="polite">
        {shown} of {totalRows} rows
      </span>
      <Pagination
        size="small"
        shape="rounded"
        color="primary"
        count={pageCount}
        page={page}
        onChange={(_, next) => onChange(next)}
        sx={{
          "& .MuiPaginationItem-root": { color: "var(--text)" },
        }}
      />
    </div>
  );
}

export default BreakdownPagination;
