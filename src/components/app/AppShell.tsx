import { Activity, ClipboardList, FileText, LayoutDashboard, LogOut, Menu, Moon, QrCode, Shield, Sun, UserRound } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/site/ThemeProvider";
import { useAuth } from "@/context/AuthContext";

const roleNavigation = {
  patient: [
    { to: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/patient/profile", label: "Profile", icon: UserRound },
    { to: "/patient/history", label: "Medical History", icon: ClipboardList },
    { to: "/patient/prescriptions", label: "Prescriptions", icon: FileText },
    { to: "/patient/graphs", label: "Health Graphs", icon: Activity },
  ],
  doctor: [
    { to: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/doctor/scan", label: "Scan QR", icon: QrCode },
    { to: "/doctor/profile", label: "Profile", icon: UserRound },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Audit Logs", icon: Shield },
  ],
} as const;

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { session, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!session) return null;

  const items = roleNavigation[session.role];

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="soft-surface sticky top-6 hidden h-[calc(100vh-3rem)] w-72 shrink-0 flex-col rounded-[2rem] border border-white/60 bg-white/80 p-5 dark:border-white/12 dark:bg-slate-900/75 lg:flex">
          <Link to={items[0].to} className="flex items-center gap-3 rounded-[1.5rem] px-2 py-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-primary/80">SMART EHR</p>
              <p className="text-xs text-muted-foreground capitalize">{session.role} workspace</p>
            </div>
          </Link>

          <nav className="mt-6 space-y-2">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-[1.25rem] px-4 py-3 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-[0_10px_30px_hsl(var(--primary)/0.22)]"
                        : "text-muted-foreground hover:bg-background/80 hover:text-foreground",
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto rounded-[1.75rem] border border-white/70 bg-background/70 p-4 dark:border-white/10">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Access rule</p>
            <p className="mt-2 text-sm leading-6 text-foreground">
              {session.role === "doctor"
                ? "Doctors use the QR scan screen to review the chart and write prescriptions after verification."
                : session.role === "patient"
                  ? "Patients can view history and prescriptions, but cannot add prescriptions."
                  : "Admins can audit system activity but cannot edit patient care data."}
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="soft-surface sticky top-6 z-20 flex items-center justify-between rounded-[2rem] border border-white/60 bg-white/80 px-4 py-4 dark:border-white/12 dark:bg-slate-900/75">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen((open) => !open)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-background/70 lg:hidden dark:border-white/10"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-sm text-muted-foreground">Signed in as</p>
                <p className="font-semibold capitalize">{session.name} • {session.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-2xl border-white/70 bg-background/70 dark:border-white/10"
                onClick={toggleTheme}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl border-white/70 bg-background/70 dark:border-white/10"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </header>

          {mobileOpen && (
            <div className="soft-surface mt-4 rounded-[2rem] border border-white/60 bg-white/80 p-4 dark:border-white/12 dark:bg-slate-900/75 lg:hidden">
              <nav className="space-y-2">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-[1.25rem] px-4 py-3 text-sm font-medium transition-all",
                          isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-background/80 hover:text-foreground",
                        )
                      }
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )}

          <main className="pt-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
