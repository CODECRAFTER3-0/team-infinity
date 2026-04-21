import { Activity, ClipboardPlus, FileHeart, QrCode, ShieldAlert, Stethoscope } from "lucide-react";
import { Sidebar } from "@/components/site/Sidebar";
import { SectionHeading } from "@/components/site/SectionHeading";

const doctorActions = [
  {
    title: "Access patient ONLY after QR scan",
    description: "Chart access opens only after a patient-approved visit QR is scanned.",
  },
  {
    title: "View medical history + AI summary",
    description: "Diagnoses, allergies, medications, and a quick AI brief appear together.",
  },
  {
    title: "Write prescriptions",
    description: "Prescriptions are written directly inside the authorized encounter flow.",
  },
  {
    title: "Get drug interaction alerts",
    description: "Real-time checks flag unsafe medication combinations before sign-off.",
  },
];

const doctorSteps = [
  {
    title: "Login as doctor",
    description: "The verified doctor enters the secure clinical portal.",
  },
  {
    title: "Scan patient QR",
    description: "The patient shares a QR that grants temporary logged access.",
  },
  {
    title: "View profile",
    description: "The full profile, timeline, summary, and alerts become visible.",
  },
  {
    title: "Write prescription",
    description: "The prescription is completed with safety checks and visit documentation.",
  },
];

const workflowCards = [
  {
    icon: QrCode,
    title: "Controlled access",
    text: "Records stay locked until the patient presents a valid QR authorization token.",
  },
  {
    icon: FileHeart,
    title: "AI-supported review",
    text: "Summaries highlight allergies, chronic disease, recent admissions, and current medication context.",
  },
  {
    icon: ClipboardPlus,
    title: "Safer prescribing",
    text: "Medication decisions are checked against known interactions before issue and documentation.",
  },
];

export default function DoctorsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="For Doctors"
        title="Clinical access designed for speed, accountability, and patient consent"
        description="Doctors receive a streamlined workflow for reviewing records, understanding the patient story, and prescribing confidently once a patient QR authorizes the encounter."
      />

      <section className="mt-14 grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-4">
          <Sidebar
            title="Doctor workspace"
            subtitle="Clinical modules"
            items={[
              { label: "QR authorization", detail: "Start each consultation by scanning the patient QR for controlled access.", icon: "QrCode" },
              { label: "AI patient brief", detail: "Review the condensed medical picture before opening full records.", icon: "ClipboardList" },
              { label: "Prescription safety", detail: "Catch drug interactions before orders are finalized.", icon: "BellRing" },
              { label: "Longitudinal trends", detail: "Use visual analytics to review disease control and adherence patterns.", icon: "Activity" },
            ]}
          />

          <div className="soft-surface rounded-[2rem] border border-red-200/70 bg-red-50/80 p-6 dark:border-red-500/20 dark:bg-red-500/10">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-red-700 dark:text-red-300">Doctors cannot access patient data without QR authorization.</p>
                <p className="mt-2 text-sm leading-6 text-red-700/80 dark:text-red-200/85">
                  This rule applies before chart review, prescription writing, and detailed history access. Every scan and view
                  is also tracked in the administrative audit system.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75 xl:col-span-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Stethoscope className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">What doctors can do</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            {doctorActions.map((action) => (
              <div key={action.title} className="rounded-[1.5rem] border border-white/70 bg-background/75 p-5 dark:border-white/10">
                <p className="text-sm font-semibold leading-6 text-foreground">{action.title}</p>
                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{action.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75 xl:col-span-4">
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
          <div className="mt-6 space-y-4">
            {doctorSteps.map((step, index) => (
              <div key={step.title} className="flex items-start gap-4 rounded-[1.5rem] border border-white/70 bg-background/75 p-5 dark:border-white/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <div className="pt-1">
                  <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75 xl:col-span-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Clinical Flow</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Doctor view stays dense and task-focused</h2>
            </div>
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/70 bg-background/75 p-5 dark:border-white/10">
              <p className="text-sm font-semibold text-foreground">Before access</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Only the doctor identity and scan action are available. No patient history is shown yet.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/70 bg-background/75 p-5 dark:border-white/10">
              <p className="text-sm font-semibold text-foreground">After access</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">AI summary, medical timeline, medication context, and risk alerts appear in one controlled view.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["12 sec", "Typical unlock time after scan"],
              ["AI brief", "Ready before chart opens"],
              ["100%", "Encounter access logged"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[1.5rem] border border-white/70 bg-background/75 p-5 dark:border-white/10">
                <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75 xl:col-span-4">
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Visit Readiness</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Every consultation starts with complete, reviewable context</h2>
          <div className="mt-6 space-y-4">
            {[
              "QR permission confirms that the patient has actively approved this specific encounter.",
              "AI summaries reduce chart-hunting and bring urgent medication or allergy details forward.",
              "Prescription support helps doctors act confidently while keeping the care trail auditable.",
            ].map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-white/70 bg-background/75 p-5 text-sm leading-6 text-muted-foreground dark:border-white/10">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 xl:col-span-12">
          {workflowCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="soft-surface rounded-[2rem] border border-white/60 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
