import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pill, AlertTriangle, AlertOctagon, Plus, X, FlaskConical, ShieldCheck, FileEdit, Check } from "lucide-react";
import Layout from "@/components/Layout";
import { getPatientById, checkDrugInteractions, checkDuplicateTest, addPrescriptionToPatient, addTestToPatient } from "@/lib/store";
import { getSession } from "@/lib/auth";
import { toast } from "sonner";

export default function Prescription() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = getSession();
  
  if (!session) {
      navigate('/login');
      return null;
  }

  const patientId = (location.state as any)?.patientId || "PAT-2024-001";
  const patient = getPatientById(patientId);

  const [newDrug, setNewDrug] = useState("");
  const [dosage, setDosage] = useState("");
  const [prescriptions, setPrescriptions] = useState<{ name: string; dosage: string; frequency: string }[]>([]);
  const [alerts, setAlerts] = useState<{ drug: string; severity: "danger" | "warning"; message: string }[]>([]);

  const [newTest, setNewTest] = useState("");
  const [tests, setTests] = useState<string[]>([]);
  const [duplicateWarn, setDuplicateWarn] = useState<string | null>(null);

  if (!patient) return <div className="p-10 text-center">Patient not found</div>;

  const checkDrug = (val: string) => {
    setNewDrug(val);
    if (val.length > 2) {
      const allCurrent = [...patient.medications.map((m) => m.name), ...prescriptions.map((p) => p.name)];
      setAlerts(checkDrugInteractions(val, allCurrent));
    } else setAlerts([]);
  };

  const addDrug = () => {
    if (!newDrug.trim()) return;
    setPrescriptions([...prescriptions, { name: newDrug, dosage: dosage || "—", frequency: "As directed" }]);
    setNewDrug(""); setDosage(""); setAlerts([]);
    toast.success("Medication added to prescription");
  };

  const checkTest = (val: string) => {
    setNewTest(val);
    if (val.length > 2) {
      if (checkDuplicateTest(patientId, val)) {
        setDuplicateWarn(`Duplicate: "${val}" was already performed recently.`);
      } else {
        setDuplicateWarn(null);
      }
    } else setDuplicateWarn(null);
  };

  const addTest = () => {
    if (!newTest.trim()) return;
    if (duplicateWarn) {
      toast.warning("Duplicate test detected — please confirm");
    }
    setTests([...tests, newTest]);
    setNewTest(""); setDuplicateWarn(null);
  };

  const submit = () => {
    // Add to DB dynamically
    prescriptions.forEach(p => addPrescriptionToPatient(patientId, p));
    tests.forEach(t => addTestToPatient(patientId, { name: t, date: new Date().toISOString().split('T')[0], result: 'Pending' }));
    
    toast.success("Prescription signed and saved", { description: `${prescriptions.length} meds, ${tests.length} tests for ${patient.name}` });
    setPrescriptions([]); setTests([]);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">New Prescription</div>
            <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3"><FileEdit className="w-8 h-8 text-primary" /> Write Rx</h1>
            <p className="text-muted-foreground mt-1">For <span className="font-semibold text-foreground">{patient.name}</span> · <span className="font-mono text-xs">{patient.id}</span></p>
          </div>
          <div className="clay-sm px-4 py-2.5 flex items-center gap-2 text-sm">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span className="font-semibold">Drug Interaction Engine Active</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Medications */}
          <div className="clay p-6 space-y-5">
            <h2 className="font-bold text-lg flex items-center gap-2"><Pill className="w-5 h-5 text-primary" /> Medications</h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">DRUG NAME</label>
                <input
                  value={newDrug}
                  onChange={(e) => checkDrug(e.target.value)}
                  placeholder="e.g. Aspirin, Ibuprofen, Warfarin..."
                  className="w-full clay-inset px-4 py-3 mt-1.5 bg-transparent outline-none text-sm rounded-2xl"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">DOSAGE & FREQUENCY</label>
                <input
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g. 500mg, twice daily"
                  className="w-full clay-inset px-4 py-3 mt-1.5 bg-transparent outline-none text-sm rounded-2xl"
                />
              </div>

              {/* Interaction alerts */}
              {alerts.length > 0 && (
                <div className="space-y-2 animate-fade-in">
                  {alerts.map((a, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border-2 flex gap-3 ${
                        a.severity === "danger"
                          ? "bg-destructive/10 border-destructive/40"
                          : "bg-warning/10 border-warning/40"
                      }`}
                    >
                      {a.severity === "danger"
                        ? <AlertOctagon className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                        : <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />}
                      <div className="text-sm">
                        <div className="font-bold flex items-center gap-1.5">
                          {a.severity === "danger" ? "🔴 DANGEROUS INTERACTION" : "🟡 WARNING"}
                        </div>
                        <div className="mt-1">
                          <span className="font-semibold">{newDrug}</span> + <span className="font-semibold">{a.drug}</span>: {a.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={addDrug}
                className="w-full py-3 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold shadow-clay-sm hover:shadow-glow transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add to Prescription
              </button>
            </div>

            {/* Current meds context */}
            <div className="clay-inset p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">PATIENT'S CURRENT MEDS</div>
              <div className="flex flex-wrap gap-1.5">
                {patient.medications.map((m) => (
                  <span key={m.name} className="text-xs px-2 py-1 rounded-lg bg-accent text-accent-foreground">{m.name}</span>
                ))}
              </div>
            </div>

            {/* Added list */}
            {prescriptions.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">NEW PRESCRIPTIONS</div>
                <div className="space-y-2">
                  {prescriptions.map((p, i) => (
                    <div key={i} className="clay-inset p-3 flex items-center justify-between text-sm">
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.dosage}</div>
                      </div>
                      <button onClick={() => setPrescriptions(prescriptions.filter((_, j) => j !== i))}>
                        <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tests */}
          <div className="clay p-6 space-y-5">
            <h2 className="font-bold text-lg flex items-center gap-2"><FlaskConical className="w-5 h-5 text-primary" /> Lab Tests</h2>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">TEST NAME</label>
              <input
                value={newTest}
                onChange={(e) => checkTest(e.target.value)}
                placeholder="e.g. HbA1c, Lipid Panel, ECG..."
                className="w-full clay-inset px-4 py-3 mt-1.5 bg-transparent outline-none text-sm rounded-2xl"
              />
            </div>

            {duplicateWarn && (
              <div className="p-4 rounded-2xl bg-warning/10 border-2 border-warning/40 flex gap-3 animate-fade-in">
                <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-bold">🟡 Duplicate Test Detected</div>
                  <div className="mt-1">{duplicateWarn}</div>
                </div>
              </div>
            )}

            <button
              onClick={addTest}
              className="w-full py-3 rounded-2xl clay-sm font-semibold flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Order Test
            </button>

            <div className="clay-inset p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">RECENT TESTS ON FILE</div>
              <div className="space-y-1.5">
                {patient.tests.map((t) => (
                  <div key={t.name} className="text-xs flex justify-between">
                    <span className="font-semibold">{t.name}</span>
                    <span className="text-muted-foreground">{t.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {tests.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">ORDERED TESTS</div>
                <div className="space-y-2">
                  {tests.map((t, i) => (
                    <div key={i} className="clay-inset p-3 flex items-center justify-between text-sm">
                      <div className="font-semibold">{t}</div>
                      <button onClick={() => setTests(tests.filter((_, j) => j !== i))}>
                        <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="clay p-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span className="font-semibold">Digitally signed by Dr. Evelyn Chen</span>
            <span className="text-muted-foreground">· Encrypted & timestamped</span>
          </div>
          <button
            onClick={submit}
            disabled={prescriptions.length === 0 && tests.length === 0}
            className="px-6 py-3 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold shadow-clay-sm hover:shadow-glow transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Check className="w-4 h-4" /> Sign & Save Prescription
          </button>
        </div>
      </div>
    </Layout>
  );
}
