import type { ReactNode } from "react";
export function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mt-1 mb-5 flex items-center justify-between gap-3 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:tracking-tight [&_p]:mt-2 [&_p]:text-[11px] [&_p]:leading-relaxed [&_p]:text-muted">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
