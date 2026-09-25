import Dashboard from "@/components/Dashboard/Dashboard";
import { DEFAULT_METRIC } from "@/utils/constants";

import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/:metric" element={<Dashboard />} />
      <Route
        path="*"
        element={<Navigate to={`/${DEFAULT_METRIC}`} replace />}
      />
    </Routes>
  );
}

export default App;
