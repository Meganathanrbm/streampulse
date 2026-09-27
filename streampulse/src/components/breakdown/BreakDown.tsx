import { memo, useCallback } from "react";
import { useBreakDown } from "@/api/hooks";
import {
  DIMENSION_LABELS,
  METRIC_META,
  type DimensionKey,
  type Filters,
  type MetricKey,
  type TimeRange,
} from "@/api/types";
import { DIMENSION_OPTIONS, PAGE_SIZE } from "@/utils/constants";
import FilterSelect from "../filters/FilterSelect";
import { PanelEmpty, PanelError } from "../common/PanelStates";
import BreakdownPagination from "./BreakdownPagination";
import BreakdownSearch from "./BreakdownSearch";
import DimensionTable from "./DimensionTable";
import { useBreakdownParams } from "./useBreakdownParams";

interface BreakdownProps {
  metric: MetricKey;
  range: TimeRange;
  filters: Filters;
  onRowSelect: (dimension: DimensionKey, value: string) => void;
}

function BreakDown({ metric, range, filters, onRowSelect }: BreakdownProps) {
  const {
    page,
    dimension,
    sort,
    search,
    searchQuery,
    setSearch,
    handleSort,
    setPage,
    setDimension,
  } = useBreakdownParams();

  const { data, isPending, isError, isPlaceholderData, refetch } = useBreakDown(
    {
      metric,
      range,
      filters,
      dimension,
      search: searchQuery,
      sortBy: sort.by,
      sortOrder: sort.order,
      page,
      pageSize: PAGE_SIZE,
    },
  );

  const handleRowClick = useCallback(
    (key: string) => onRowSelect(dimension, key),
    [onRowSelect, dimension],
  );

  const handleDimensionChange = (value: string) => {
    setDimension(value as DimensionKey);
  };

  const dimensionLabel = DIMENSION_LABELS[dimension];

  const renderBody = () => {
    if (isError) {
      return (
        <PanelError
          title="Could not load this breakdown"
          onRetry={() => void refetch()}
        />
      );
    }

    if (data?.totalRows === 0) {
      return (
        <PanelEmpty
          title="No data for these filters"
          message={
            searchQuery
              ? `No ${dimensionLabel.toLowerCase()} matches "${searchQuery}". Try a different search.`
              : `No ${METRIC_META[metric].label.toLowerCase()} recorded for this selection. Try widening the date range.`
          }
        />
      );
    }

    return (
      <>
        <DimensionTable
          dimension={dimension}
          metric={metric}
          rows={isPending ? undefined : data?.rows}
          isRefreshing={isPlaceholderData}
          sortBy={sort.by}
          sortOrder={sort.order}
          selectedKey={filters[dimension]?.[0]}
          onSort={handleSort}
          onRowClick={handleRowClick}
        />
        <BreakdownPagination
          page={page}
          totalRows={data?.totalRows ?? 0}
          onChange={setPage}
        />
      </>
    );
  };

  return (
    <section className="min-w-0 rounded-card border border-line bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="m-0 text-base font-semibold">Breakdown</h2>
        <FilterSelect
          label=""
          value={dimension}
          options={DIMENSION_OPTIONS}
          onChange={handleDimensionChange}
        />
      </div>

      <BreakdownSearch
        value={search}
        label={dimensionLabel}
        onChange={setSearch}
      />

      {renderBody()}
    </section>
  );
}

export default memo(BreakDown);
