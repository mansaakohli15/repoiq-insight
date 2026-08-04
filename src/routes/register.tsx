import { createFileRoute, Link } from "@tanstack/react-router";
import { Github } from "lucide-react";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — RepoIQ" },
      {
        name: "description",
        content: "Create a free RepoIQ account and run your first AI repository analysis.",
      },
      { property: "og:title", content: "Create your account — RepoIQ" },
      { property: "og:description", content: "Run your first AI repository analysis for free." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Free forever for public repositories. No credit card needed."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <Button variant="outline" className="w-full gap-2">
          <Github className="h-4 w-4" /> Sign up with GitHub
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first">First name</Label>
              <Input id="first" placeholder="Ava" className="bg-surface" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last">Last name</Label>
              <Input id="last" placeholder="Kirchner" className="bg-surface" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" type="email" placeholder="ava@northwind.dev" className="bg-surface" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="At least 8 characters" className="bg-surface" />
          </div>
          <label className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <Checkbox id="terms" className="mt-0.5" />
            <span>
              I agree to the Terms of Service and Privacy Policy.
            </span>
          </label>
          <Button asChild className="w-full">
            <Link to="/dashboard">Create account</Link>
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
