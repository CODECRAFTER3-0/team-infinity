import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, Search, Users, FileText, AlertTriangle, ShieldCheck, X, ScanLine, Activity } from "lucide-react";
import Layout from "@/components/Layout";
import { getPatients, getAuditLogs } from "@/lib/store";
import { getSession } from "@/lib/auth";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const session = getSession();

  useEffect(() => {
     if (!session || session.role !== "doctor") {
         navigate("/login");
     }
  }, [session, navigate]);

  const [scanning, setScanning] = useState(false);
  const PATIENTS = getPatients();
  const AUDIT_LOG = getAuditLogs();

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      navigate(`/profile/${PATIENTS[0].id}`);
    }, 1800);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Doctor's Portal</div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Today's Overview</h1>
            <p className="text-muted-foreground mt-1">Tuesday, April 21 · 12 patients scheduled</p>
          </div>

          <button
            onClick={handleScan}
            className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold shadow-clay hover:shadow-glow transition-all hover:scale-[1.02]"
          >
            <QrCode className="w-5 h-5" />
            Scan Patient QR
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Active Patients", val: "248", color: "from-primary to-primary-glow" },
            { icon: FileText, label: "Today's Visits", val: "12", color: "from-primary to-primary-glow" },
            { icon: AlertTriangle, label: "Alerts", val: "3", color: "from-warning to-destructive" },
            { icon: Activity, label: "Pending Reports", val: "7", color: "from-primary to-primary-glow" },
          ].map((s) => (
            <div key={s.label} className="clay-sm p-5">
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-clay-sm`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl font-extrabold">{s.val}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Patient list */}
          <div className="lg:col-span-2 clay p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">My Patients</h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input placeholder="Search..." className="clay-inset pl-9 pr-3 py-2 text-sm bg-transparent outline-none rounded-xl" />
              </div>
            </div>
            <div className="space-y-3">
              {PATIENTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/profile/${p.id}`)}
                  className="w-full clay-inset p-4 flex items-center gap-4 hover:scale-[1.01] transition-transform text-left"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold shadow-clay-sm">
                    {p.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold flex items-center gap-2">
                      {p.name}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-success/15 text-success flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{p.id} · {p.age}y · {p.bloodType}</div>
                  </div>
                  <div className="hidden sm:flex flex-wrap gap-1 max-w-[200px] justify-end">
                    {p.conditions.slice(0, 2).map((c) => (
                      <span key={c} className="text-xs px-2 py-1 rounded-lg bg-accent text-accent-foreground">{c}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Audit log */}
          <div className="clay p-6">
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheck className="w-5 h-5 text-success" />
              <h2 className="font-bold text-lg">Audit Log</h2>
            </div>
            <div className="space-y-3">
              {AUDIT_LOG.map((a, i) => (
                <div key={i} className="text-sm border-l-2 border-primary/40 pl-3 py-1">
                  <div className="font-semibold">{a.user}</div>
                  <div className="text-xs text-muted-foreground">{a.action} · {a.patient}</div>
                  <div className="text-xs font-mono text-primary mt-0.5">{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scan modal */}
      {scanning && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="clay p-8 max-w-md w-full text-center relative">
            <button onClick={() => setScanning(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full clay-sm flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
            <div className="font-bold text-xl mb-2">Scanning patient QR...</div>
            <div className="text-sm text-muted-foreground mb-6">Hold steady</div>
            <div className="relative w-64 h-64 mx-auto clay-inset overflow-hidden">
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-glow"
                   style={{ animation: "scan 1.5s ease-in-out infinite" }} />
              <ScanLine className="w-32 h-32 text-primary/30 absolute inset-0 m-auto" />
            </div>
            <div className="mt-6 text-xs font-mono text-primary animate-pulse-soft">Verifying secure handshake...</div>
            <style>{`@keyframes scan { 0%,100%{top:10%} 50%{top:85%} }`}</style>
          </div>
        </div>
      )}
    </Layout>
  );
}
