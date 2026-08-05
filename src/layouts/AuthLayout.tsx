import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/Logo";

export function AuthLayout({
  children,
  title,
  subtitle,
  footer,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-surface/50 p-12 lg:flex">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 hero-glow" />
        <div className="relative">
          <Logo />
        </div>
        <div className="relative max-w-md">
          <blockquote className="font-display text-2xl leading-snug">
            “RepoIQ cut our codebase onboarding from three weeks to four days. The health scores are
            the first thing we check in review.”
          </blockquote>
          <p className="mt-6 text-sm text-muted-foreground">
            Priya Raman · Director of Engineering, Northwind Labs
          </p>
        </div>
        <div className="relative grid grid-cols-3 gap-6 text-sm">
          {[
            ["18k+", "repos analyzed"],
            ["92%", "median health"],
            ["48s", "avg analysis"],
          ].map(([v, l]) => (
            <div key={l}>
              <p className="font-display text-xl font-semibold text-primary">{v}</p>
              <p className="text-xs text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col px-5 py-8 sm:px-10">
        <div className="lg:hidden">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm py-10">
            <h1 className="font-display text-2xl font-semibold">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <p className="mt-8 text-center text-sm text-muted-foreground">{footer}</p>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
