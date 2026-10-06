import { DashboardLayout } from "./layout/DashboardLayout";
import { Dashboard } from "./features/dashboard/Dashboard";
import "./styles/dashboard.css";
export default function App() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}
