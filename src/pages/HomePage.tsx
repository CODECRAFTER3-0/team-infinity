import { ArrowRight, BrainCircuit, LockKeyhole, QrCode, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { AnalyticsCard } from "@/components/site/AnalyticsCard";
import { FeatureGrid } from "@/components/site/FeatureGrid";
import { QrAccessCard } from "@/components/site/QrAccessCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";

const howItWorks = [
  {
    title: "Create profile",
    description: "Patients securely add diagnoses, medications, allergies, history, and prior prescriptions.",
  },
  {
    title: "Generate QR",
    description: "A visit-specific QR code gives a doctor limited and logged access after consent is granted.",
  },
  {
    title: "Doctor scans",
    description: "The doctor sees the patient timeline, AI summary, and alerts needed for a safer consultation.",
  },
];

const highlights = [
  {
    icon: BrainCircuit,
    title: "AI summary at triage speed",
    description: "High-signal medical context appears in seconds so clinicians can focus on the patient conversation.",
  },
  {
    icon: QrCode,
    title: "QR-gated record sharing",
    description: "Patients control access at each encounter instead of relying on open portals or broad permissions.",
  },
  {
    icon: LockKeyhole,
    title: "Smart alerts before errors happen",
    description: "Medication conflicts and duplicate tests are surfaced before the care plan is finalized.",
  },
];

const securityItems = [
  "Encrypted records at rest and in transit",
  "Role-based permissions for hospitals and clinics",
  "Admin audit logs for every scan and chart review",
];

export default function HomePage() {
  return (
    <main>
      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="fade-up">
            <div className="inline-flex rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Smart EHR Platform
            </div>
            <h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Secure. Smart. Patient-Controlled Health Records.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Doctors access data only via patient QR for privacy and security. Smart EHR brings AI summaries,
              safer prescribing, and complete audit visibility into one calm clinical workflow.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to="/auth">
                  Launch portal
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="soft-surface rounded-full border-0 bg-white/70 px-7 dark:bg-white/5">
                <Link to="/features">Explore features</Link>
              </Button>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["98.7%", "secure encounter authorization rate"],
                ["< 12s", "average doctor chart unlock after QR scan"],
                ["24/7", "audit visibility for admins and compliance teams"],
              ].map(([value, label]) => (
                <div key={label} className="soft-surface rounded-[1.75rem] border border-white/60 bg-white/75 p-5 dark:border-white/10 dark:bg-white/5">
                  <div className="text-2xl font-semibold tracking-tight">{value}</div>
                  <div className="mt-2 text-sm leading-6 text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up lg:pl-8" style={{ animationDelay: "0.12s" }}>
            <div className="soft-surface pulse-glow relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5">
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-sky-500/10 via-cyan-400/10 to-teal-400/10" />
              <div className="relative space-y-5">
                <div className="flex items-center justify-between rounded-[1.75rem] border border-white/60 bg-background/80 px-4 py-3 dark:border-white/10">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Visit Access</p>
                    <p className="mt-1 text-lg font-semibold">St. Mary's Cardiology Unit</p>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    Authorized
                  </div>
                </div>
                <QrAccessCard patientName="Anaya Joseph" qrValue="smart-ehr://encounter/ANAYA-2026-APR-QR" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="A privacy-first care workflow that feels instant in the clinic"
          description="Patients remain in control from sign-up to consultation. Clinicians receive exactly the information they need, and only when the patient authorizes access."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {howItWorks.map((step, index) => (
            <div
              key={step.title}
              className="soft-surface fade-up rounded-[2rem] border border-white/60 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                0{index + 1}
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Key Highlights"
          title="Built to reduce friction for doctors without compromising patient control"
          description="Every interaction balances speed, clarity, and trust so providers can deliver safer decisions under time pressure."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="soft-surface fade-up rounded-[2rem] border border-white/60 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <AnalyticsCard />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Platform Security"
          title="Trusted architecture for encrypted, controlled clinical access"
          description="Smart EHR is designed to keep patient records protected throughout storage, transfer, and review, while preserving full administrative accountability."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight">Security trust section</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Hospitals need more than branding claims. This platform uses encryption, consent-based access, and
              timestamped oversight to support privacy-by-default operations.
            </p>
            <div className="mt-6 space-y-4">
              {securityItems.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/60 bg-background/70 px-4 py-3 dark:border-white/10">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <FeatureGrid />
        </div>
      </section>
    </main>
  );
}
