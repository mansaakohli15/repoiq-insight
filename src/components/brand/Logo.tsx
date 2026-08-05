import { Link } from "react-router-dom";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="group flex items-center gap-2.5">
      <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-primary" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Zm0 2.3 6.6 3.3-6.6 3.3-6.6-3.3L12 4.3ZM5 9.2l6 3v7.1l-6-3V9.2Zm8 10.1v-7.1l6-3v7.1l-6 3Z"
          />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">
        Repo<span className="text-primary">IQ</span>
      </span>
    </Link>
  );
}
