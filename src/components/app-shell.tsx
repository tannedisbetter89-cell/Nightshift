import { useEffect, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, BookOpen, Factory, Library, LineChart, Settings, Store } from "lucide-react";
import { useNightshift } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsDialog } from "@/components/settings-dialog";

const NAV = [
  { href: "/", label: "Floor", icon: Activity },
  { href: "/factory", label: "Factory", icon: Factory },
  { href: "/vault", label: "Vault", icon: Library },
  { href: "/shop", label: "Shop", icon: Store },
  { href: "/ledger", label: "Revenue", icon: LineChart },
] as const;

function pathActive(path: string, href: string) {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}

export function AutopilotRuntime() {
  const autopilot = useNightshift((s) => s.autopilot);
  const tick = useNightshift((s) => s.tick);
  const hydrated = useNightshift((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated || !autopilot) return;
    const id = window.setInterval(() => tick(), 1000);
    return () => window.clearInterval(id);
  }, [autopilot, tick, hydrated]);

  return null;
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const shopMode = path === "/shop" || path.startsWith("/shop/");
  const deskOpen = useNightshift((s) => s.deskOpen);
  const setDeskOpen = useNightshift((s) => s.setDeskOpen);

  useEffect(() => {
    const result = Promise.resolve(useNightshift.persist.rehydrate());
    void result.then(() => {
      useNightshift.getState().setHydrated();
    });
  }, []);

  return (
    <TooltipProvider>
      <AutopilotRuntime />
      <SettingsDialog open={deskOpen} onOpenChange={setDeskOpen} />
      {shopMode ? (
        <StorefrontFrame onSettings={() => setDeskOpen(true)}>{children}</StorefrontFrame>
      ) : (
        <OperatorFrame path={path} onSettings={() => setDeskOpen(true)}>
          {children}
        </OperatorFrame>
      )}
    </TooltipProvider>
  );
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-baseline gap-2 no-underline">
      <span className="font-display text-2xl leading-none tracking-tight text-foreground">
        Nightshift
      </span>
      {!compact ? (
        <span className="hidden text-[11px] tracking-[0.18em] text-muted-foreground uppercase sm:inline">
          After hours
        </span>
      ) : null}
    </Link>
  );
}

function OperatorFrame({
  path,
  onSettings,
  children,
}: {
  path: string;
  onSettings: () => void;
  children: ReactNode;
}) {
  const autopilot = useNightshift((s) => s.autopilot);

  return (
    <div className="flex min-h-dvh min-w-0 flex-col overflow-x-clip lg:flex-row">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border px-4 py-6 lg:flex">
        <BrandMark />
        <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className={cn(
              "size-1.5 rounded-full",
              autopilot ? "live-dot bg-success" : "bg-muted-foreground/50",
            )}
          />
          {autopilot ? "Factory running" : "Factory idle"}
        </p>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <NavLink key={item.href} {...item} active={pathActive(path, item.href)} />
          ))}
          <Link
            to="/playbook"
            className={cn(
              "mt-4 flex h-11 items-center gap-2.5 rounded-md px-3 text-sm transition-colors duration-150",
              pathActive(path, "/playbook")
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
            )}
          >
            <BookOpen className="size-4" />
            Playbook
          </Link>
        </nav>
        <Button variant="ghost" className="mt-4 w-full justify-start px-3" onClick={onSettings}>
          <Settings className="size-4" />
          Desk settings
        </Button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 lg:hidden">
          <BrandMark compact />
          <div className="flex items-center gap-1">
            <span className="mr-2 hidden items-center gap-2 text-[11px] text-muted-foreground sm:flex">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  autopilot ? "live-dot bg-success" : "bg-muted-foreground/50",
                )}
              />
              {autopilot ? "Running" : "Idle"}
            </span>
            <Button variant="ghost" size="icon-sm" onClick={onSettings} aria-label="Desk settings">
              <Settings className="size-4" />
            </Button>
          </div>
        </header>
        <main className="min-w-0 flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-10 lg:py-8 lg:pb-8">{children}</main>
        <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] lg:hidden">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathActive(path, item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex h-14 min-h-11 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] transition-colors duration-150",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: (typeof NAV)[number]["href"];
  label: string;
  icon: typeof Activity;
  active: boolean;
}) {
  return (
    <Link
      to={href}
      className={cn(
        "flex h-11 items-center gap-2.5 rounded-md px-3 text-sm transition-colors duration-150",
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}

function StorefrontFrame({
  children,
  onSettings,
}: {
  children: ReactNode;
  onSettings: () => void;
}) {
  const shopName = useNightshift((s) => s.settings.shopName);
  const operatorName = useNightshift((s) => s.settings.operatorName);

  return (
    <div className="min-h-dvh min-w-0 overflow-x-clip">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              Nightshift shop
            </p>
            <p className="font-display text-2xl leading-tight">{shopName}</p>
            <p className="text-sm text-muted-foreground">By {operatorName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">Floor</Link>
            </Button>
            <Button variant="outline" size="icon-sm" onClick={onSettings} aria-label="Desk settings">
              <Settings className="size-4" />
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
