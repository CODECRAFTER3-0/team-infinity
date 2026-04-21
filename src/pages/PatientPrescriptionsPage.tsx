import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function PatientPrescriptionsPage() {
  const { session } = useAuth();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.role === 'patient') {
      apiFetch('/patients/prescriptions')
        .then(data => setPrescriptions(data))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  if (loading) return <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

  const allMeds = prescriptions.map(rx => ({
     _id: rx._id,
     date: rx.date,
     notes: rx.notes,
     medicines: rx.medicines
  }));

  return (
    <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75 animate-fade-in">
      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Prescriptions</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Current medications and dosage schedule</h1>
      
      {allMeds.length === 0 && <p className="mt-8 text-muted-foreground">No active prescriptions.</p>}
      
      {allMeds.map((rx: any) => (
        <div key={rx._id} className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/70 dark:border-white/10 mb-6">
          <div className="bg-primary/5 px-5 py-3 border-b border-primary/10">
            <p className="text-sm font-semibold">Prescribed on {new Date(rx.date).toLocaleDateString()}</p>
            {rx.notes && <p className="text-xs text-muted-foreground mt-1">{rx.notes}</p>}
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-background/80">
              <tr>
                <th className="px-5 py-4 font-semibold">Medicine</th>
                <th className="px-5 py-4 font-semibold">Dosage</th>
                <th className="px-5 py-4 font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody>
              {rx.medicines.map((item: any, idx: number) => (
                <tr key={idx} className="border-t border-white/60 bg-white/60 dark:border-white/10 dark:bg-slate-950/20">
                  <td className="px-5 py-4 font-medium">{item.name}</td>
                  <td className="px-5 py-4 text-muted-foreground">{item.dosage}</td>
                  <td className="px-5 py-4 text-muted-foreground">{item.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
