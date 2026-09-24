import { rangeEndingNow, useSummary } from "@/api/hooks";
import { DATE_PRESETS, METRIC_KEYS } from "@/api/types";
import MetricPanel from "@/components/panel/MetricPanel";
import Navbar from "@/components/navbar/Header";


const DEFAULT_RANGE = rangeEndingNow(DATE_PRESETS[1].durationSec);

function App() {
  const summary = useSummary(DEFAULT_RANGE);

  return (
    <div className="mx-auto w-screen h-screen overflow-hidden flex max-w-360 flex-col gap-(--gap) p-(--page-pad)">
      <Navbar />
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

export default App;
