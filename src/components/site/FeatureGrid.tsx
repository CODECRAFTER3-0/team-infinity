import { Activity, BrainCircuit, ClipboardCheck, FileSearch, QrCode, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Patient Summary",
    description: "Surfaces diagnoses, allergies, medications, and last critical events in a fast doctor-ready summary.",
  },
  {
    icon: QrCode,
    title: "QR-Based Secure Access",
    description: "Every visit begins with a patient QR scan, keeping records invisible until consent is granted.",
  },
  {
    icon: ShieldCheck,
    title: "Drug Interaction Checker",
    description: "Flags contraindications, duplicate therapies, and unsafe combinations before a prescription is signed.",
  },
  {
    icon: FileSearch,
    title: "Duplicate Test Detection",
    description: "Identifies recently performed labs and imaging to reduce avoidable repeat testing across providers.",
  },
  {
    icon: Activity,
    title: "Health Analytics",
    description: "Tracks trends for chronic disease management, adherence, and risk scores with easy visual summaries.",
  },
  {
    icon: ClipboardCheck,
    title: "Audit Logs",
    description: "Gives administrators a timestamped trail of scans, data views, updates, and authorization windows.",
  },
];

export function FeatureGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div
            key={feature.title}
            className="soft-surface fade-up rounded-[2rem] border border-white/60 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">{feature.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
}
