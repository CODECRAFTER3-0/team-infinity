import { FilePlus2, Files, QrCode, ShieldCheck } from "lucide-react";
import { QrAccessCard } from "@/components/site/QrAccessCard";
import { Sidebar } from "@/components/site/Sidebar";
import { SectionHeading } from "@/components/site/SectionHeading";

const patientActions = ["Store records", "Generate QR", "Share data securely", "View prescriptions"];

const patientSteps = ["Sign up", "Add health info", "Generate QR", "Share with doctor"];

export default function PatientsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="For Patients"
        title="A clear and secure way to carry your health story between providers"
        description="Patients control when doctors see their records, while still benefiting from a complete timeline, clear prescriptions, and easy sharing during visits."
      />

      <section className="mt-14 grid gap-8 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Files className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">What patients can do</h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {patientActions.map((action) => (
                <div key={action} className="rounded-[1.5rem] border border-white/70 bg-background/75 p-5 dark:border-white/10">
                  <p className="text-sm font-medium leading-6 text-foreground">{action}</p>
                </div>
              ))}
            </div>
          </div>

          <QrAccessCard patientName="Anaya Joseph" qrValue="smart-ehr://patient-share/ANAYA-JOSEPH-APR-2026" />

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Consent first",
                text: "You approve each encounter before a doctor can open your records.",
              },
              {
                icon: FilePlus2,
                title: "Simple updates",
                text: "Add lab results, allergies, and medication changes without losing prior history.",
              },
              {
                icon: QrCode,
                title: "Fast clinic handoff",
                text: "A scan replaces paper forms and repeated explanations during appointments.",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-6 dark:border-white/12 dark:bg-slate-900/75">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <Sidebar
            title="Patient privacy panel"
            subtitle="Protected sharing"
            items={[
              { label: "Record storage", detail: "Keep diagnoses, lab results, scans, and prescriptions in one secure timeline.", icon: "FileCheck2" },
              { label: "Dynamic QR access", detail: "Generate a fresh QR whenever you are ready to share your chart during a visit.", icon: "QrCode" },
              { label: "Controlled sharing", detail: "Decide who can view your information and for how long.", icon: "Shield" },
              { label: "Prescription review", detail: "Open your medication history and instructions after each appointment.", icon: "ClipboardList" },
            ]}
          />

          <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
            <h2 className="text-2xl font-semibold tracking-tight">Patient journey</h2>
            <div className="mt-6 space-y-4">
              {patientSteps.map((step, index) => (
                <div key={step} className="flex items-start gap-4 rounded-[1.5rem] border border-white/70 bg-background/75 p-5 dark:border-white/10">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <p className="pt-2 text-sm font-medium text-foreground">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="soft-surface rounded-[2rem] border border-primary/15 bg-primary/5 p-7 dark:border-primary/20 dark:bg-primary/10">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Your data stays shareable, not exposed</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Smart EHR is built so patients can move across clinics, specialists, and emergency care without
                repeatedly rebuilding their medical story or surrendering broad permanent access. The platform keeps
                consent in the patient's hands while still making every visit faster and more informed.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  "Generate a fresh QR code whenever you choose to share your records.",
                  "Keep prescriptions, history, and lab results connected in one timeline.",
                ].map((item) => (
                  <div key={item} className="rounded-[1.5rem] border border-white/70 bg-white/50 p-4 text-sm leading-6 text-foreground dark:border-white/10 dark:bg-slate-950/20">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                ["Private by default", "Doctors only see information after your QR approval."],
                ["Ready across visits", "Your records stay organized for clinics, specialists, and emergencies."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-[1.5rem] border border-white/70 bg-white/50 p-5 dark:border-white/10 dark:bg-slate-950/20">
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
