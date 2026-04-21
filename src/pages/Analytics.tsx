import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Activity, Heart, Droplet, TrendingDown, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import { getPatientById } from "@/lib/store";
import { getSession } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const visitData = [
  { month: "Jan", visits: 8 },
  { month: "Feb", visits: 12 },
  { month: "Mar", visits: 9 },
  { month: "Apr", visits: 14 },
  { month: "May", visits: 11 },
  { month: "Jun", visits: 16 },
];

export default function Analytics() {
  const navigate = useNavigate();
  const session = getSession();
  
  useEffect(() => {
     if (!session) {
         navigate("/login");
     }
  }, [session, navigate]);

  const p = getPatientById(session?.patientId || "PAT-2024-001");

  if (!p) return <div className="p-10 text-center">Patient data not found.</div>;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Health Analytics</div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Trends & Insights</h1>
          <p className="text-muted-foreground mt-1">Last 6 months · Patient: {p.name}</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Heart, label: "Avg BP", val: "131/85", trend: "↓ 7%", positive: true },
            { icon: Droplet, label: "Avg Glucose", val: "131", unit: "mg/dL", trend: "↓ 16%", positive: true },
            { icon: Activity, label: "Resting HR", val: "72", unit: "bpm", trend: "↓ 4%", positive: true },
            { icon: TrendingUp, label: "Adherence", val: "94%", trend: "↑ 8%", positive: true },
          ].map((s) => (
            <div key={s.label} className="clay-sm p-5">
              <s.icon className="w-5 h-5 text-primary mb-3" />
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-extrabold mt-1">
                {s.val}{s.unit && <span className="text-xs font-medium text-muted-foreground ml-1">{s.unit}</span>}
              </div>
              <div className={`text-xs mt-1 font-semibold flex items-center gap-1 ${s.positive ? "text-success" : "text-destructive"}`}>
                <TrendingDown className="w-3 h-3" /> {s.trend}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Blood Pressure */}
          <div className="clay p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2"><Heart className="w-5 h-5 text-destructive" /> Blood Pressure</h3>
                <div className="text-xs text-muted-foreground mt-0.5">Systolic / Diastolic (mmHg)</div>
              </div>
              <span className="text-xs px-2 py-1 rounded-lg bg-success/15 text-success font-semibold">Improving</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={p.vitals.bp}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Line type="monotone" dataKey="systolic" stroke="hsl(var(--destructive))" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="diastolic" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Glucose */}
          <div className="clay p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2"><Droplet className="w-5 h-5 text-primary" /> Blood Sugar</h3>
                <div className="text-xs text-muted-foreground mt-0.5">Fasting glucose (mg/dL)</div>
              </div>
              <span className="text-xs px-2 py-1 rounded-lg bg-success/15 text-success font-semibold">Trending down</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={p.vitals.sugar}>
                <defs>
                  <linearGradient id="glucoseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#glucoseGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Visits */}
          <div className="clay p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-primary" /> Clinic Visits</h3>
              <span className="text-xs px-2 py-1 rounded-lg bg-accent text-accent-foreground font-semibold">Last 6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}
