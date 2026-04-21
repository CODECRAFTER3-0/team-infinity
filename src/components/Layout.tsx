import { type ReactNode, useEffect, useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import {
  Activity,
  BadgeCheck,
  FileText,
  LayoutDashboard,
  Lock,
  LogOut,
  Moon,
  Pill,
  QrCode,
  ShieldCheck,
  Stethoscope,
  Sun,
  User,
  WifiOff,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: ReactNode }) {
  const { session, loading, logout } = useAuth();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  if (loading) {
    return null;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  const navItems =
    session.role === "doctor"
      ? [
          { to: "/doctor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { to: "/doctor/scan", icon: QrCode, label: "Scan QR" },
          { to: "/doctor/patient-view", icon: FileText, label: "Patient View" },
          { to: "/doctor/profile", icon: User, label: "Profile" },
        ]
      : session.role === "admin"
        ? [{ to: "/admin/dashboard", icon: ShieldCheck, label: "Audit Logs" }]
        : [
            { to: "/patient/dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { to: "/patient/profile", icon: User, label: "My Profile" },
            { to: "/patient/history", icon: FileText, label: "Medical History" },
            { to: "/patient/prescriptions", icon: Pill, label: "Prescriptions" },
            { to: "/patient/graphs", icon: Activity, label: "Health Trends" },
          ];

  return (
    <div className="min-h-screen flex w-full bg-gradient-soft">
      <aside className="w-64 hidden md:flex flex-col p-5 gap-2 bg-sidebar/80 backdrop-blur-xl border-r border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-4 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Stethoscope className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <div className="font-extrabold text-lg leading-none">MediCore</div>
            <div className="text-xs text-muted-foreground mt-1">Smart EHR</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-gradient-primary text-primary-foreground shadow-clay-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto clay-sm p-4 flex items-start gap-3">
          <Lock className="w-4 h-4 text-success mt-0.5 shrink-0" />
          <div className="text-xs">
            <div className="font-semibold flex items-center gap-1">
              Encrypted Data <ShieldCheck className="w-3 h-3 text-success" />
            </div>
            <div className="text-muted-foreground mt-0.5">HIPAA-grade AES-256</div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-6 flex items-center justify-between bg-card/60 backdrop-blur-xl border-b border-border">
          <div className="flex items-center gap-3">
            <div className="md:hidden w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Welcome back,</div>
              <div className="font-semibold leading-tight flex items-center gap-2">
                {session.name}
                {session.role === "doctor" && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-success/15 text-success font-medium">
                    <BadgeCheck className="w-3 h-3" /> Verified Doctor
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOffline((value) => !value)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium clay-sm hover:scale-[1.02] transition-transform"
              title="Toggle offline simulation"
              type="button"
            >
              <span className={cn("w-2 h-2 rounded-full", offline ? "bg-warning" : "bg-success animate-pulse-soft")} />
              {offline ? "Offline" : "Synced"}
            </button>
            <button
              onClick={() => setDark((value) => !value)}
              className="w-10 h-10 rounded-xl clay-sm flex items-center justify-center hover:scale-105 transition-transform"
              type="button"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={logout}
              className="w-10 h-10 rounded-xl clay-sm flex items-center justify-center hover:scale-105 transition-transform text-destructive"
              type="button"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {offline && (
          <div className="bg-warning/15 border-b border-warning/30 px-6 py-2.5 flex items-center gap-2 text-sm">
            <WifiOff className="w-4 h-4 text-warning" />
            <span className="font-medium">You are offline</span>
            <span className="text-muted-foreground">- showing last synced data</span>
          </div>
        )}

        <main className="flex-1 p-6 md:p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
