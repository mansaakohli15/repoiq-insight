import { createFileRoute } from "@tanstack/react-router";
import { Github, Trash2 } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — RepoIQ" },
      {
        name: "description",
        content: "Manage your RepoIQ account, notifications, integrations and billing.",
      },
      { property: "og:title", content: "Settings — RepoIQ" },
      { property: "og:description", content: "Account, notification and integration settings." },
    ],
  }),
  component: SettingsPage,
});

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Manage your account and workspace preferences">
      <div className="max-w-3xl">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-5 space-y-4">
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-base font-semibold">Profile details</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" defaultValue="Ava Kirchner" className="bg-surface" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="ava@northwind.dev" className="bg-surface" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    className="resize-none bg-surface"
                    defaultValue="Platform engineer focused on API gateways and developer tooling."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select defaultValue="cet">
                    <SelectTrigger className="bg-surface">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cet">Europe/Berlin (CET)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="pst">America/Los_Angeles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default analysis depth</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger className="bg-surface">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quick">Quick</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="deep">Deep</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button>Save changes</Button>
                <Button variant="ghost">Cancel</Button>
              </div>
            </section>

            <section className="rounded-xl border border-destructive/30 bg-card p-6">
              <h2 className="font-display text-base font-semibold text-destructive">Danger zone</h2>
              <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6">
                <p className="min-w-0 text-xs leading-relaxed text-muted-foreground">
                  Deleting your account removes all analyses, chats and workspace history. This
                  cannot be undone.
                </p>
                <Button variant="destructive" size="sm" className="gap-1.5">
                  <Trash2 className="h-3.5 w-3.5" /> Delete account
                </Button>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="notifications" className="mt-5">
            <section className="rounded-xl border border-border bg-card px-6 py-2">
              <Row
                title="Analysis completed"
                description="Email me when a repository analysis finishes."
              >
                <Switch defaultChecked />
              </Row>
              <Separator />
              <Row
                title="Health score drops"
                description="Alert me when a repository loses more than 10 points."
              >
                <Switch defaultChecked />
              </Row>
              <Separator />
              <Row title="Weekly digest" description="A Monday summary of workspace activity.">
                <Switch />
              </Row>
              <Separator />
              <Row title="Product updates" description="Occasional news about new RepoIQ features.">
                <Switch />
              </Row>
            </section>
          </TabsContent>

          <TabsContent value="integrations" className="mt-5">
            <section className="rounded-xl border border-border bg-card px-6 py-2">
              <Row title="GitHub" description="Connected as @avakirchner · 24 repositories">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-success/40 text-success">
                    Connected
                  </Badge>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Github className="h-3.5 w-3.5" /> Manage
                  </Button>
                </div>
              </Row>
              <Separator />
              <Row title="Slack" description="Post analysis results into a channel.">
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </Row>
              <Separator />
              <Row title="Linear" description="Turn improvement suggestions into issues.">
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </Row>
              <Separator />
              <Row title="Webhooks" description="Send analysis events to your own endpoint.">
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </Row>
            </section>
          </TabsContent>

          <TabsContent value="billing" className="mt-5 space-y-4">
            <section className="rounded-xl border border-primary/30 bg-card p-6 shadow-glow">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-base font-semibold">Team plan</h2>
                    <Badge variant="outline" className="border-primary/40 text-primary">
                      Trial
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    9 days left · renews at $29 per user / month
                  </p>
                </div>
                <Button size="sm">Upgrade now</Button>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-base font-semibold">Invoices</h2>
              <div className="mt-4 space-y-1">
                {[
                  ["Jul 2026", "$174.00", "Paid"],
                  ["Jun 2026", "$174.00", "Paid"],
                  ["May 2026", "$145.00", "Paid"],
                ].map(([month, amount, status]) => (
                  <div
                    key={month}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-lg px-3 py-3 hover:bg-surface-2/60"
                  >
                    <span className="truncate text-sm">{month}</span>
                    <span className="flex shrink-0 items-center gap-4 text-sm">
                      {amount}
                      <Badge variant="outline" className="border-success/40 text-success">
                        {status}
                      </Badge>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
