import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Parts } from "./pages/Parts";
import { Assets } from "./pages/Assets";
import { UtilizationPage } from "./pages/Utilization";
import { ROUTES } from "./constants";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.PARTS} element={<Parts />} />
          <Route path={ROUTES.ASSETS} element={<Assets />} />
          <Route path={ROUTES.UTILIZATION} element={<UtilizationPage />} />
          <Route
            path="*"
            element={<Navigate to={ROUTES.DASHBOARD} replace />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
