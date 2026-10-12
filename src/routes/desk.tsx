import { createFileRoute, Link, Outlet, redirect, useLocation, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, ShoppingCart, Package, BookOpen, LogOut } from "lucide-react";
import { getDeskSession } from "@/lib/commerce/desk";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/desk")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/desk/login") return;
    const session = await getDeskSession();
    if (!session.authenticated) {
      throw redirect({ to: "/desk/login" });
    }
    return { session };
  },
  component: DeskLayout,
});

const NAV = [
  { to: "/desk", label: "Overview", icon: LayoutDashboard },
  { to: "/desk/orders", label: "Orders", icon: ShoppingCart },
  { to: "/desk/products", label: "Products", icon: Package },
  { to: "/desk/ledger", label: "Ledger", icon: BookOpen },
] as const;

function DeskLayout() {
  const navigate = useNavigate();
  const path = useLocation({ select: (s) => s.pathname });

  async function logout() {
    await fetch("/api/desk/logout", { method: "POST" });
    navigate({ to: "/desk/login" });
  }

  // The login page renders without the desk chrome.
  if (path === "/desk/login") return <Outlet />;

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            Nightshift desk
          </p>
          <h1 className="font-display text-2xl tracking-tight">Operator</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="size-4" />
          Sign out
        </Button>
      </header>
      <nav className="flex gap-1 overflow-x-auto border-b border-border">
        {NAV.map((item) => {
          const active = item.to === "/desk" ? path === "/desk" : path.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm transition-colors",
                active
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Outlet />
    </div>
  );
}
