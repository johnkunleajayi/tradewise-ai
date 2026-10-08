import { DashboardLayout } from "./layout/DashboardLayout";
import { Dashboard } from "./features/dashboard/Dashboard";
import { SignInScreen } from "./features/auth/SignInScreen";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const auth = useAuth();
  if (auth.status !== "authenticated")
    return <SignInScreen status={auth.status} onRetry={auth.retry} />;
  return (
    <DashboardLayout
      user={auth.user}
      onLogout={() => void auth.logout()}
      signingOut={auth.signingOut}
    >
      {auth.logoutError && (
        <p
          role="alert"
          className="mx-5 mt-5 rounded-lg border border-line bg-raised px-4 py-3 text-sm sm:mx-7"
        >
          {auth.logoutError}
        </p>
      )}
      <Dashboard key={auth.user.id} name={auth.user.name} />
    </DashboardLayout>
  );
}
