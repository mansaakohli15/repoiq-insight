import { Logo } from "@/components/brand/Logo";

const groups = [
  { title: "Product", items: ["Repository analysis", "Health scores", "AI chat", "Changelog"] },
  { title: "Resources", items: ["Documentation", "API reference", "Guides", "Status"] },
  { title: "Company", items: ["About", "Careers", "Privacy", "Terms"] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-surface/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            AI-powered analysis for every repository you own, review, or inherit.
          </p>
        </div>
        {groups.map((g) => (
          <div key={g.title}>
            <h4 className="font-display text-sm font-semibold">{g.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {g.items.map((i) => (
                <li key={i}>
                  <span className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {i}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 RepoIQ Labs. All rights reserved.</span>
          <span>Built for engineering teams who read code for a living.</span>
        </div>
      </div>
    </footer>
  );
}
