import { AlertTriangle, BadgeCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const alerts = [
  {
    title: "Critical drug interaction",
    message: "Warfarin and fluconazole trigger a red alert before prescription finalization.",
    tone: "red",
    icon: ShieldAlert,
  },
  {
    title: "Follow-up recommended",
    message: "HbA1c trend shows a mild increase over 90 days and suggests a yellow review banner.",
    tone: "yellow",
    icon: AlertTriangle,
  },
  {
    title: "Records verified",
    message: "Recent imaging and discharge summary were synced successfully into the patient timeline.",
    tone: "green",
    icon: BadgeCheck,
  },
] as const;

export function AlertStack() {
  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const Icon = alert.icon;
        return (
          <div
            key={alert.title}
            className={cn(
              "soft-surface rounded-3xl border p-4",
              alert.tone === "red" && "border-red-200/70 bg-red-50/80 dark:border-red-500/20 dark:bg-red-500/10",
              alert.tone === "yellow" && "border-amber-200/70 bg-amber-50/80 dark:border-amber-500/20 dark:bg-amber-500/10",
              alert.tone === "green" && "border-emerald-200/70 bg-emerald-50/80 dark:border-emerald-500/20 dark:bg-emerald-500/10",
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl",
                  alert.tone === "red" && "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300",
                  alert.tone === "yellow" && "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
                  alert.tone === "green" && "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{alert.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{alert.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
