import { SignInPanel } from "./SignInPanel";
import { LandingPage } from "../landing/LandingPage";

export function SignInScreen(props: {
  status: "loading" | "anonymous" | "error";
  onRetry: () => void;
}) {
  return <LandingPage signIn={<SignInPanel {...props} />} />;
}
