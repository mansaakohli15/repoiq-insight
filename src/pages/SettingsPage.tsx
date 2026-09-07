import { CheckCircle2, Github, Shield, Sparkle, Trash2 } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/layouts/AppShell";
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
import { useAuth } from "@/context/AuthContext";

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

export function SettingsPage() {
  const { user } = useAuth();
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <AppShell title="Settings" subtitle="Manage your account and workspace preferences">
      <div className="max-w-3xl">
        {savedNotice ? (
          <div className="mb-4 rounded-md border border-success/40 bg-success/10 px-3 py-2 text-xs text-success flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Preferences saved successfully.
          </div>
        ) : null}

        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="billing">Plan & Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-5 space-y-4">
            <form onSubmit={handleSave} className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-base font-semibold">Profile details</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Username</Label>
                  <Input
                    id="name"
                    defaultValue={user?.username || "developer"}
                    className="bg-surface"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    defaultValue={user?.email || "developer@example.com"}
                    className="bg-surface"
                    readOnly
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    className="resize-none bg-surface"
                    defaultValue="Software engineer analyzing architecture and repository health with RepoIQ."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger className="bg-surface">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="ist">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="pst">America/Los_Angeles (PST)</SelectItem>
                      <SelectItem value="est">America/New_York (EST)</SelectItem>
                      <SelectItem value="cet">Europe/Berlin (CET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default analysis engine</Label>
                  <Select defaultValue="groq">
                    <SelectTrigger className="bg-surface">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="groq">Groq AI (LLaMA 3.3 70B Fast Inference)</SelectItem>
                      <SelectItem value="deterministic">Deterministic Health Scoring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button type="submit">Save changes</Button>
              </div>
            </form>

            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-base font-semibold">Security</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Your session is secured using standard JSON Web Tokens (JWT) with bcrypt password
                hashing.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-success">
                <Shield className="h-4 w-4" /> JWT Authenticated Session Active
              </div>
            </section>
          </TabsContent>

          <TabsContent value="notifications" className="mt-5">
            <section className="rounded-xl border border-border bg-card px-6 py-2">
              <Row
                title="Analysis completed"
                description="Email or toast notification when a repository analysis finishes."
              >
                <Switch defaultChecked />
              </Row>
              <Separator />
              <Row
                title="Health score changes"
                description="Notification when a repository health score is re-evaluated."
              >
                <Switch defaultChecked />
              </Row>
              <Separator />
              <Row
                title="Product updates"
                description="Updates regarding new RepoIQ features and model updates."
              >
                <Switch defaultChecked />
              </Row>
            </section>
          </TabsContent>

          <TabsContent value="integrations" className="mt-5">
            <section className="rounded-xl border border-border bg-card px-6 py-2">
              <Row
                title="GitHub Public REST API"
                description="Connected · Instant analysis of all public repositories"
              >
                <Badge variant="outline" className="border-success/40 text-success">
                  Connected
                </Badge>
              </Row>
              <Separator />
              <Row
                title="Groq Cloud Inference"
                description="Connected · High-throughput LLaMA 3.3 LLM analysis"
              >
                <Badge variant="outline" className="border-success/40 text-success">
                  Active
                </Badge>
              </Row>
              <Separator />
              <Row
                title="PostgreSQL Database"
                description="Connected · Persistent analysis & chat history storage"
              >
                <Badge variant="outline" className="border-success/40 text-success">
                  Connected
                </Badge>
              </Row>
            </section>
          </TabsContent>

          <TabsContent value="billing" className="mt-5 space-y-4">
            <section className="rounded-xl border border-primary/30 bg-card p-6 shadow-glow">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Sparkle className="h-4 w-4 text-primary" />
                    <h2 className="font-display text-base font-semibold">
                      Developer Community Plan
                    </h2>
                    <Badge variant="outline" className="border-success/40 text-success">
                      Free Forever
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    100% Free · Unlimited public repository imports · Deterministic health scoring ·
                    AI analysis powered by Groq
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-base font-semibold">Included Capabilities</h2>
              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span>Full deterministic GitHub health scoring algorithm</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span>AI-generated architectural summary and limitations report</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span>Automated professional Markdown README generator</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span>Targeted interview question generation (Easy / Medium / Hard)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span>Interactive repository chat with database history persistence</span>
                </div>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
