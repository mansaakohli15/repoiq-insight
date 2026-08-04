import { createFileRoute, Link } from "@tanstack/react-router";
import { Github } from "lucide-react";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — RepoIQ" },
      { name: "description", content: "Sign in to your RepoIQ workspace to analyze repositories." },
      { property: "og:title", content: "Sign in — RepoIQ" },
      { property: "og:description", content: "Sign in to your RepoIQ workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue analyzing your repositories."
      footer={
        <>
          New to RepoIQ?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <Button variant="outline" className="w-full gap-2">
          <Github className="h-4 w-4" /> Continue with GitHub
        </Button>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" type="email" placeholder="ava@northwind.dev" className="bg-surface" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <span className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                Forgot?
              </span>
            </div>
            <Input id="password" type="password" placeholder="••••••••" className="bg-surface" />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox id="remember" /> Keep me signed in
          </label>
          <Button asChild className="w-full">
            <Link to="/dashboard">Sign in</Link>
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
