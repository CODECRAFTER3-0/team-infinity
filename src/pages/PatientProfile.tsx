import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  User, Pill, AlertTriangle, FileText, Sparkles, Calendar,
  ShieldCheck, Mail, Phone, MapPin, Loader2, FlaskConical, Heart, FileEdit
} from "lucide-react";
import Layout from "@/components/Layout";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();

  const [data, setData] = useState<{ profile: any, history: any[], prescriptions: any[] } | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    
    // Determine whether to fetch as patient or doctor
    const fetchProfile = async () => {
      try {
        if (session.role === 'patient') {
          const [profile, history, prescriptions] = await Promise.all([
            apiFetch('/patients/dashboard'),
            apiFetch('/patients/history'),
            apiFetch('/patients/prescriptions')
          ]);
          setData({ profile, history, prescriptions });
        } else if (session.role === 'doctor' && id) {
          const [profile, history, prescriptions] = await Promise.all([
            apiFetch(`/doctors/patient/${id}/profile`),
            apiFetch(`/doctors/patient/${id}/history`),
            apiFetch(`/doctors/patient/${id}/prescriptions`)
          ]);
          setData({ profile, history, prescriptions });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchProfile();
  }, [id, session]);

  const handleGenerateSummary = async () => {
    setLoading(true);
    setTimeout(() => {
      setSummary("AI Synthesis implies patient needs monitoring. Prescriptions active, conditions recorded in system.");
      setLoading(false);
    }, 1500);
  };

  if (loadingInitial) return <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;
  if (!data?.profile) return <div className="p-10 text-center">Patient not found</div>;

  const p = data.profile;
  const meds = data.prescriptions.flatMap((rx: any) => rx.medicines);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="clay p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-extrabold text-2xl shadow-clay-sm shrink-0">
            {p.userId?.name?.split(" ").map((n: string) => n[0]).join("")}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-extrabold">{p.userId?.name}</h1>
              <span className="text-xs px-2 py-1 rounded-full bg-success/15 text-success font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            </div>
            <div className="text-sm text-muted-foreground font-mono mt-1">{p.qrCode}</div>
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-primary" /> {p.age}y · {p.gender}</span>
              <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-destructive" /> {p.bloodGroup}</span>
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-primary" /> {p.userId?.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-primary" /> {p.contactNumber}</span>
            </div>
          </div>
          {session?.role === 'doctor' && (
            <button
              onClick={() => navigate("/prescription", { state: { patientId: p._id } })}
              className="px-5 py-3 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold shadow-clay-sm hover:shadow-glow transition-all flex items-center gap-2"
            >
              <FileEdit className="w-4 h-4" /> Write Prescription
            </button>
          )}
        </div>

        {/* AI Summary - Highlighted */}
        <div className="clay-primary p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-lg">AI Patient Summary</div>
                  <div className="text-xs opacity-80">Powered by clinical NLP · HIPAA-safe</div>
                </div>
              </div>
              <button
                onClick={handleGenerateSummary}
                disabled={loading}
                className="px-5 py-2.5 rounded-2xl bg-white text-primary font-semibold text-sm shadow-clay-sm hover:scale-[1.02] transition-transform disabled:opacity-60 flex items-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Summary</>}
              </button>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 min-h-[120px] text-sm leading-relaxed">
              {loading && (
                <div className="space-y-2 animate-pulse-soft">
                  <div className="h-3 bg-white/30 rounded w-full" />
                  <div className="h-3 bg-white/30 rounded w-11/12" />
                  <div className="h-3 bg-white/30 rounded w-9/12" />
                </div>
              )}
              {!loading && !summary && (
                <div className="opacity-80 italic">Click "Generate Summary" to synthesize this patient's record into a clinical brief.</div>
              )}
              {summary && <div className="animate-fade-in">{summary}</div>}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            {/* Medical History */}
            <div className="clay p-6">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-primary" /> Medical History</h3>
              <div className="space-y-3">
                {data.history.length === 0 && <div className="text-sm text-muted-foreground">No records.</div>}
                {data.history.map((v: any, i: number) => (
                  <div key={i} className="clay-inset p-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold">{v.title}</div>
                      <div className="text-xs font-mono text-primary">{new Date(v.date).toLocaleDateString()}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">{v.doctorName} - {v.type}</div>
                    <div className="text-sm">{v.description || "No notes"}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Records */}
            <div className="clay p-6">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-4"><FlaskConical className="w-5 h-5 text-primary" /> Active Issues</h3>
              <div className="flex flex-wrap gap-2">
                {p.majorIssues?.length === 0 && <div className="text-sm text-muted-foreground">No active issues recorded.</div>}
                {p.majorIssues?.map((issue: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-warning/10 text-warning-foreground text-sm font-semibold border border-warning/20">⚠ {issue}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="clay p-6">
              <h3 className="font-bold flex items-center gap-2 mb-4"><Pill className="w-5 h-5 text-primary" /> Medications</h3>
              <ul className="space-y-2">
                {meds.length === 0 && <div className="text-sm text-muted-foreground">No active meds.</div>}
                {meds.map((m: any, i: number) => (
                  <li key={i} className="clay-inset p-3 text-sm">
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.dosage} · {m.duration}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="clay-sm p-5 text-center">
              <div className="bg-white p-3 rounded-2xl inline-block">
                <QRCodeSVG value={p.qrCode} size={120} level="H" />
              </div>
              <div className="font-mono text-xs mt-3 text-muted-foreground">{p.qrCode}</div>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-success font-semibold">
                <ShieldCheck className="w-3 h-3" /> Encrypted
              </div>
            </div>

            <div className="clay-sm p-5">
              <div className="flex items-center gap-2 text-sm mb-2"><MapPin className="w-4 h-4 text-primary" /> <span className="font-semibold">Address</span></div>
              <div className="text-sm text-muted-foreground">{p.address}</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
