import { QRCodeSVG } from "qrcode.react";
import { Heart, Pill, AlertTriangle, Calendar, ShieldCheck, Activity, TrendingDown, TrendingUp, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { session, loading: sessionLoading } = useAuth();
  
  const [data, setData] = useState<{
    profile: any;
    prescriptions: any[];
    history: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     if (!sessionLoading && (!session || session.role !== "patient")) {
         navigate("/login");
     }
  }, [session, sessionLoading, navigate]);

  useEffect(() => {
    if (session && session.role === "patient") {
      Promise.all([
        apiFetch('/patients/dashboard'),
        apiFetch('/patients/prescriptions'),
        apiFetch('/patients/history')
      ]).then(([profile, prescriptions, history]) => {
        setData({ profile, prescriptions, history });
      }).catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [session]);

  if (sessionLoading || loading) return (
    <Layout>
      <div className="p-20 flex flex-col items-center justify-center text-primary animate-pulse">
         <Loader2 className="w-10 h-10 animate-spin mb-4" />
         <span className="font-semibold text-lg">Loading Patient Portal...</span>
      </div>
    </Layout>
  );

  if (!data?.profile) return <div className="p-10 text-center">Patient data not found.</div>;

  const p = data.profile;
  const meds = data.prescriptions.flatMap(rx => rx.medicines);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Your health, today</div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Hello, {p.userId?.name?.split(" ")[0]} 👋</h1>
          <p className="text-muted-foreground mt-1">Here's a quick look at your health summary.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: stats + cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stat row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Heart, label: "Heart Rate", val: "72", unit: "bpm", trend: "↓ 3", color: "text-success" },
                { icon: Activity, label: "BP", val: "130/82", unit: "mmHg", trend: "↓ 5%", color: "text-success" },
                { icon: TrendingDown, label: "Glucose", val: "122", unit: "mg/dL", trend: "stable", color: "text-primary" },
                { icon: TrendingUp, label: "Weight", val: "68", unit: "kg", trend: "↓ 1.2", color: "text-success" },
              ].map((s) => (
                <div key={s.label} className="clay-sm p-5">
                  <s.icon className="w-5 h-5 text-primary mb-3" />
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="text-2xl font-extrabold mt-1">{s.val}<span className="text-xs font-medium text-muted-foreground ml-1">{s.unit}</span></div>
                  <div className={`text-xs mt-1 font-semibold ${s.color}`}>{s.trend}</div>
                </div>
              ))}
            </div>

            {/* Health summary */}
            <div className="clay p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg flex items-center gap-2"><Heart className="w-5 h-5 text-primary" /> Health Summary</h2>
                <Link to={`/patient/profile`} className="text-xs text-primary font-semibold hover:underline">View profile →</Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="clay-inset p-4">
                  <div className="text-xs text-muted-foreground mb-1">Age / Gender</div>
                  <div className="font-bold">{p.age} · {p.gender}</div>
                </div>
                <div className="clay-inset p-4">
                  <div className="text-xs text-muted-foreground mb-1">Blood Type</div>
                  <div className="font-bold text-destructive">{p.bloodGroup}</div>
                </div>
                <div className="clay-inset p-4">
                  <div className="text-xs text-muted-foreground mb-1">Conditions</div>
                  <div className="font-bold">{p.majorIssues?.length || 0} active</div>
                </div>
              </div>
            </div>

            {/* Medications + Allergies */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="clay p-6">
                <h3 className="font-bold flex items-center gap-2 mb-4"><Pill className="w-5 h-5 text-primary" /> Medications</h3>
                <ul className="space-y-3">
                  {meds.length === 0 && <div className="text-sm text-muted-foreground">No active medications.</div>}
                  {meds.map((m: any, i: number) => (
                    <li key={i} className="clay-inset p-3 flex items-center justify-between text-sm">
                      <div>
                        <div className="font-semibold">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.dosage} · {m.duration}</div>
                      </div>
                      <Pill className="w-4 h-4 text-primary" />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="clay p-6">
                <h3 className="font-bold flex items-center gap-2 mt-6 mb-3"><Calendar className="w-5 h-5 text-primary" /> Recent Visits</h3>
                <ul className="space-y-2">
                  {data.history.length === 0 && <div className="text-sm text-muted-foreground">No recent medical history.</div>}
                  {data.history.slice(0, 2).map((v: any, i: number) => (
                    <li key={i} className="text-sm">
                      <div className="font-semibold">{v.title}</div>
                      <div className="text-xs text-muted-foreground">{new Date(v.date).toLocaleDateString()} · {v.doctorName}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right column: QR */}
          <div className="space-y-6">
            <div className="clay-primary p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, white, transparent 60%)" }} />
              <div className="relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold mb-4">
                  <ShieldCheck className="w-3 h-3" /> SECURE PATIENT ID
                </div>
                <div className="bg-white p-5 rounded-2xl inline-block shadow-clay">
                  <QRCodeSVG value={p.qrCode} size={180} level="H" />
                </div>
                <div className="font-mono text-sm mt-4 opacity-90">{p.qrCode}</div>
                <div className="text-xs opacity-75 mt-1">Show this to your doctor for instant access</div>
              </div>
            </div>

            <div className="clay-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-success" />
                <div className="font-semibold text-sm">Privacy & Access</div>
              </div>
              <div className="text-xs text-muted-foreground space-y-2">
                <div>✓ End-to-end encrypted records</div>
                <div>✓ Audit trail of all accesses</div>
                <div>✓ Revoke doctor access anytime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
