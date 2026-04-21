import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, toApiAssetUrl } from "@/lib/api";
import { ExternalLink, FileText, Loader2, Sparkles } from "lucide-react";

export default function DoctorPatientViewPage() {
  const { doctorAccess } = useAuth();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!doctorAccess.patientId) {
        setLoading(false);
        return;
      }
      try {
        const [profile, history, prescriptions, summary] = await Promise.all([
          apiFetch(`/doctors/patient/${doctorAccess.patientId}/profile`),
          apiFetch(`/doctors/patient/${doctorAccess.patientId}/history`),
          apiFetch(`/doctors/patient/${doctorAccess.patientId}/prescriptions`),
          apiFetch(`/doctors/patient/${doctorAccess.patientId}/summary`)
        ]);

        setPatient({
          name: profile.userId?.name,
          age: profile.age,
          gender: profile.gender,
          bloodGroup: profile.bloodGroup,
          contact: profile.contactNumber,
          aiSummary: summary.summary,
          aiHighlights: summary.highlights || [],
          aiGeneratedAt: summary.generatedAt,
          medicalHistory: (history || []).map((h: any) => ({
             title: h.title,
             date: new Date(h.date).toLocaleDateString(),
             type: h.type,
             summary: h.description,
             reportFile: h.reportFile,
             reportFileName: h.reportFileName
          })),
          reports: (history || [])
            .filter((h: any) => h.reportFile)
            .map((h: any) => ({
              title: h.title,
              date: new Date(h.date).toLocaleDateString(),
              url: toApiAssetUrl(h.reportFile),
              fileName: h.reportFileName || "report"
            })),
          prescriptions: (prescriptions || []).flatMap((p: any) => p.medicines.map((m: any) => ({
             medicine: m.name,
             dosage: m.dosage,
             duration: m.duration
          })))
        });
      } catch (err) {
        console.error("Failed to fetch patient data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [doctorAccess.patientId]);

  if (loading) {
     return <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;
  }

  if (!patient) {
    return (
      <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-12 text-center dark:border-white/12 dark:bg-slate-900/75">
        <h2 className="text-xl font-semibold">No Patient Authorized</h2>
        <p className="mt-2 text-muted-foreground">Please scan a student/patient QR code to view their chart.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Patient Medical History View</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Authorized chart review for {patient.name}</h1>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
          <h2 className="text-xl font-semibold">Profile</h2>
          <div className="mt-6 space-y-3">
            {[
              ["Name", patient.name],
              ["Age", String(patient.age)],
              ["Gender", patient.gender],
              ["Blood Group", patient.bloodGroup],
              ["Contact", patient.contact],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.25rem] border border-white/70 bg-background/75 px-4 py-3 dark:border-white/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                <p className="mt-1 text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">AI Summary</h2>
              <p className="text-sm text-muted-foreground">Generated from profile data, timeline records, prescriptions, and uploaded reports.</p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.75rem] border border-primary/15 bg-primary/5 p-5 text-sm leading-7 text-foreground">
            {patient.aiSummary}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {patient.aiHighlights?.map((item: string) => (
              <span key={item} className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
          <h2 className="text-xl font-semibold">History</h2>
          <div className="mt-6 space-y-4">
            {patient.medicalHistory.length === 0 && <p className="text-sm text-muted-foreground">No historical records found.</p>}
            {patient.medicalHistory.map((item: any, idx: number) => (
              <div key={`${item.title}-${idx}`} className="rounded-[1.5rem] border border-white/70 bg-background/75 p-5 dark:border-white/10">
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.date} • {item.type}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.summary}</p>
                {item.reportFile && (
                  <a
                    href={toApiAssetUrl(item.reportFile)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary"
                  >
                    <FileText className="h-4 w-4" />
                    Open {item.reportFileName || "report"}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
            <h2 className="text-xl font-semibold">Uploaded Reports</h2>
            <div className="mt-6 space-y-4">
              {patient.reports.length === 0 && <p className="text-sm text-muted-foreground">No uploaded reports available.</p>}
              {patient.reports.map((item: any, idx: number) => (
                <a
                  key={`${item.title}-${idx}`}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-[1.5rem] border border-white/70 bg-background/75 p-5 dark:border-white/10"
                >
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.date}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{item.fileName}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-primary" />
                </a>
              ))}
            </div>
          </div>

          <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
            <h2 className="text-xl font-semibold">Current Prescriptions</h2>
            <div className="mt-6 space-y-4">
              {patient.prescriptions.length === 0 && <p className="text-sm text-muted-foreground">No active prescriptions.</p>}
              {patient.prescriptions.map((item: any, idx: number) => (
                <div key={`${item.medicine}-${idx}`} className="rounded-[1.5rem] border border-white/70 bg-background/75 p-5 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{item.medicine}</p>
                    <div className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">Active</div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.dosage} • {item.duration}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
