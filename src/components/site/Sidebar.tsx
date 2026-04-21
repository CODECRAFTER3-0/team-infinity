import { Shield, QrCode, BellRing, ClipboardList, Activity, FileCheck2 } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarIcons = {
  Shield,
  QrCode,
  BellRing,
  ClipboardList,
  Activity,
  FileCheck2,
};

type SidebarItem = {
  label: string;
  detail: string;
  icon: keyof typeof sidebarIcons;
};

type SidebarProps = {
  title: string;
  subtitle: string;
  items: SidebarItem[];
};

export function Sidebar({ title, subtitle, items }: SidebarProps) {
  return (
    <aside className="soft-surface relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-6 dark:border-white/12 dark:bg-slate-900/75">
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-sky-500/10 via-cyan-400/10 to-teal-400/10" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{subtitle}</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h3>
        <div className="mt-6 space-y-3">
          {items.map((item, index) => {
            const Icon = sidebarIcons[item.icon];
            return (
              <div
                key={item.label}
                className={cn(
                  "soft-surface flex items-start gap-4 rounded-3xl border border-white/70 bg-white/75 p-4 dark:border-white/12 dark:bg-slate-950/70",
                  index === 0 && "ring-1 ring-primary/15",
                )}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{item.label}</div>
                  <div className="mt-1 text-sm leading-6 text-muted-foreground">{item.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
