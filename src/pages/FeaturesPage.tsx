import { Activity, AlertTriangle, ClipboardList, FileSearch, QrCode, ScanText, ShieldCheck } from "lucide-react";
import { AlertStack } from "@/components/site/AlertStack";
import { AnalyticsCard } from "@/components/site/AnalyticsCard";
import { SectionHeading } from "@/components/site/SectionHeading";

const featureSections = [
  {
    icon: ScanText,
    title: "AI Patient Summary",
    description: "Pulls diagnoses, allergies, medications, recent admissions, and major treatment milestones into a clinician-friendly brief before consultation begins.",
  },
  {
    icon: QrCode,
    title: "QR-Based Secure Access",
    description: "Doctors must scan a patient QR to unlock records. The QR session is encounter-based, time-limited, and logged for privacy assurance.",
  },
  {
    icon: AlertTriangle,
    title: "Drug Interaction Checker",
    description: "Reviews new prescriptions against medication history and allergy data, surfacing red, yellow, and green risk states in real time.",
  },
  {
    icon: FileSearch,
    title: "Duplicate Test Detection",
    description: "Compares current clinical intent against recent labs and imaging to highlight likely repeat orders and reduce waste.",
  },
  {
    icon: Activity,
    title: "Health Analytics",
    description: "Transforms raw records into longitudinal trends so care teams can spot deterioration, adherence gaps, and improvement patterns quickly.",
  },
  {
    icon: ClipboardList,
    title: "Audit Logs",
    description: "Keeps a complete administrative history of QR scans, data views, changes, and export attempts for compliance and operational review.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Features"
        title="A modular clinical platform designed around access control and decision support"
        description="Every feature is focused on practical care delivery: faster review, fewer avoidable mistakes, and much tighter privacy controls for patient records."
      />

      <section className="mt-14 grid gap-6 lg:grid-cols-2">
        {featureSections.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className="soft-surface fade-up rounded-[2rem] border border-white/60 bg-white/80 p-7 dark:border-white/10 dark:bg-white/5"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight">{feature.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.description}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-16 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <AnalyticsCard />
        <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5">
          <div className="mb-6 inline-flex rounded-full border border-primary/15 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Safety Alerts
          </div>
          <h3 className="text-2xl font-semibold tracking-tight">Visual risk states for safer clinical decisions</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            The platform uses clear status treatments across medications, duplicate tests, and verification flows so
            care teams can act quickly without missing edge cases.
          </p>
          <div className="mt-8">
            <AlertStack />
          </div>
          <div className="mt-8 rounded-[1.75rem] border border-primary/15 bg-primary/5 p-4 text-sm leading-6 text-primary/90">
            <ShieldCheck className="mb-3 h-5 w-5" />
            Audit log visibility remains restricted to administrative roles, while clinicians only see the operational
            details relevant to the active patient encounter.
          </div>
        </div>
      </section>
    </main>
  );
}
