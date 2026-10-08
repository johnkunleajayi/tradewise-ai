export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
};

export type AuthState =
  | { status: "loading" | "anonymous"; user: null }
  | { status: "error"; user: null }
  | { status: "authenticated"; user: AuthUser };
