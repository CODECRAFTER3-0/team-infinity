import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function PatientProfilePage() {
  const { session } = useAuth();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.role === 'patient') {
      apiFetch('/patients/dashboard')
        .then(profile => setPatient(profile))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  if (loading) return <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;
  if (!patient) return <div className="p-10 text-center">Patient not found</div>;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] animate-fade-in">
      <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Profile</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{patient.userId?.name}</h1>
        <div className="mt-6 space-y-4">
          {[
            ["Age", String(patient.age)],
            ["Gender", patient.gender],
            ["Blood Group", patient.bloodGroup],
            ["Contact", patient.contactNumber],
            ["Email", patient.userId?.email],
            ["Address", patient.address],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[1.5rem] border border-white/70 bg-background/75 px-4 py-3 dark:border-white/10">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
              <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Major Health Issues</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {(!patient.majorIssues || patient.majorIssues.length === 0) && (
            <p className="text-sm text-muted-foreground col-span-2">No active health issues tracked.</p>
          )}
          {patient.majorIssues?.map((issue: string) => (
            <div key={issue} className="rounded-[1.5rem] border border-white/70 bg-background/75 p-5 dark:border-white/10">
              <p className="font-semibold text-foreground">{issue}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Actively tracked in the medical history and ongoing care plan.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
