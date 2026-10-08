import type { AuthUser } from "../../types/auth";

const apiOrigin = (
  import.meta.env.VITE_API_ORIGIN || "http://localhost:8000"
).replace(/\/$/, "");

export function googleLoginUrl() {
  const url = new URL(`${apiOrigin}/api/auth/google/login`);
  url.searchParams.set("return_to", window.location.origin);
  return url.href;
}

export async function getCurrentUser(
  signal: AbortSignal,
): Promise<AuthUser | null> {
  const response = await fetch(`${apiOrigin}/api/auth/me`, {
    credentials: "include",
    cache: "no-store",
    signal: AbortSignal.any([signal, AbortSignal.timeout(12000)]),
  });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Session check failed");
  const user = await response.json();
  if (
    !user ||
    typeof user.id !== "string" ||
    typeof user.name !== "string" ||
    typeof user.email !== "string" ||
    (user.avatar_url !== null && typeof user.avatar_url !== "string")
  ) {
    throw new Error("Invalid session response");
  }
  return user as AuthUser;
}

export async function endSession() {
  const response = await fetch(`${apiOrigin}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error("Sign out failed");
}
