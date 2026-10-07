import { DashboardLayout } from "./layout/DashboardLayout";
import { Dashboard } from "./features/dashboard/Dashboard";
export default function App() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}
