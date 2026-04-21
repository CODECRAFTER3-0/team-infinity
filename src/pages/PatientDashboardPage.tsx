import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function PatientDashboardPage() {
  const { session } = useAuth();
  const [data, setData] = useState<{ profile: any, history: any[], prescriptions: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.role === 'patient') {
      Promise.all([
        apiFetch('/patients/dashboard'),
        apiFetch('/patients/history'),
        apiFetch('/patients/prescriptions')
      ]).then(([profile, history, prescriptions]) => setData({ profile, history, prescriptions }))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  if (loading) return <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;
  if (!data?.profile) return <div className="p-10 text-center">Patient not found</div>;

  const patient = data.profile;
  const medsCount = data.prescriptions.reduce((acc: number, p: any) => acc + p.medicines.length, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Patient Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">A clear overview of ongoing care, appointments, and current health status</h1>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-6 md:grid-cols-2">
            <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-6 dark:border-white/12 dark:bg-slate-900/75">
              <p className="text-sm text-muted-foreground">Active Prescriptions</p>
              <p className="mt-4 text-3xl font-semibold">{medsCount}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Total medicines prescribed</p>
            </div>
            <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-6 dark:border-white/12 dark:bg-slate-900/75">
              <p className="text-sm text-muted-foreground">Recent Visits</p>
              <p className="mt-4 text-3xl font-semibold">{data.history.length}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Medical history records</p>
            </div>
            <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-6 dark:border-white/12 dark:bg-slate-900/75">
              <p className="text-sm text-muted-foreground">Major Health Issues</p>
              <p className="mt-4 text-3xl font-semibold">{patient.majorIssues?.length || 0}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Recorded conditions</p>
            </div>
        </div>

        <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Patient QR Access</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Unique QR for doctor authorization</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            This QR proves identity for {patient.userId?.name}. Doctors use it to unlock your encrypted medical history and securely write prescriptions.
          </p>
          <div className="mt-6 flex flex-col items-center rounded-[2rem] border border-white/70 bg-background/75 p-6 dark:border-white/10">
            <QRCodeSVG value={patient.qrCode} size={180} bgColor="transparent" fgColor="currentColor" className="text-slate-900 dark:text-white" />
            <p className="mt-5 text-center text-xs uppercase tracking-[0.22em] text-muted-foreground">SECURE TOKEN ID</p>
            <p className="mt-2 break-all text-center text-sm font-medium text-foreground">{patient.qrCode}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
