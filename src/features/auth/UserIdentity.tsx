import { useState } from "react";
import { LoaderCircle, LogOut } from "lucide-react";
import type { AuthUser } from "../../types/auth";

function Avatar({ user }: { user: AuthUser }) {
  const [failed, setFailed] = useState(false);
  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  return (
    <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-raised text-[11px] font-medium text-accent">
      {user.avatar_url && !failed ? (
        <img
          className="size-full object-cover"
          src={user.avatar_url}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        initials
      )}
    </span>
  );
}

export function UserIdentity({
  user,
  onLogout,
  busy,
}: {
  user: AuthUser;
  onLogout: () => void;
  busy: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 border-l border-line pl-2 text-xs sm:gap-2.5 sm:pl-3.5 lg:pl-5">
      <span className="flex min-w-0 items-center gap-2.5" title={user.name}>
        <Avatar key={user.avatar_url} user={user} />
        <span className="hidden max-w-36 truncate lg:inline">{user.name}</span>
      </span>
      <button
        className="grid size-9 shrink-0 place-items-center rounded-lg text-muted hover:bg-raised hover:text-ink"
        onClick={onLogout}
        disabled={busy}
        aria-label={busy ? "Signing out" : "Sign out"}
        title="Sign out"
      >
        {busy ? (
          <LoaderCircle size={17} className="motion-safe:animate-spin" />
        ) : (
          <LogOut size={17} />
        )}
      </button>
    </div>
  );
}
