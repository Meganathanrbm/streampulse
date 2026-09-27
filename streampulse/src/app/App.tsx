import Dashboard from "@/components/dashboard/Dashboard";
import { DIMENSIONS } from "@/api/types";
import { DEFAULT_METRIC } from "@/utils/constants";
import { isMetricKey } from "@/utils/utils";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";

const ALLOWED_PARAMS = new Set<string>([
  "range",
  "groupBy",
  "dimension",
  "search",
  "sortBy",
  "sortOrder",
  "page",
  ...DIMENSIONS,
]);

function RedirectToDefault() {
  return <Navigate to={`/${DEFAULT_METRIC}`} replace />;
}

function MetricRoute() {
  const { metric } = useParams();
  const { search } = useLocation();
  const hasUnknownParam = [...new URLSearchParams(search).keys()].some(
    (key) => !ALLOWED_PARAMS.has(key),
  );

  if (!isMetricKey(metric) || hasUnknownParam) return <RedirectToDefault />;
  return <Dashboard />;
}

function App() {
  return (
    <Routes>
      <Route path="/:metric" element={<MetricRoute />} />
      <Route path="*" element={<RedirectToDefault />} />
    </Routes>
  );
}

export default App;
