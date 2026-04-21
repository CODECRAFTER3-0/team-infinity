import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Loader2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function DoctorDashboardPage() {
  const { session } = useAuth();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.role === 'doctor') {
      apiFetch('/doctors/dashboard')
        .then(data => setDoctor(data))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  if (loading) return <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;
  if (!doctor) return <div className="p-10 text-center">Doctor not found</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Doctor Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome, {doctor.userId?.name}</h1>
        <p className="mt-2 text-muted-foreground">{doctor.specialization} at {doctor.hospitalName}</p>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
          <h2 className="text-xl font-semibold">Patient Access</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Scan a patient's Secure QR code to verify their identity and unlock their encrypted medical records.</p>
          <div className="mt-6 flex justify-start">
            <Link to="/doctor/scan" className="rounded-2xl bg-primary text-primary-foreground px-6 py-3 font-semibold hover:opacity-90">
              Open QR Scanner
            </Link>
          </div>
        </div>

        <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> Schedule</h2>
          <div className="mt-6 space-y-4">
             <p className="text-muted-foreground text-sm">No upcoming appointments recorded for today.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
