import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { useAuth } from "@/context/AuthContext";

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-6 dark:border-white/12 dark:bg-slate-900/75">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-6 h-72">{children}</div>
    </div>
  );
}

const mockMetrics = {
  bloodPressure: [
    { month: "Jan", systolic: 120, diastolic: 80 },
    { month: "Feb", systolic: 122, diastolic: 82 },
    { month: "Mar", systolic: 118, diastolic: 79 },
    { month: "Apr", systolic: 125, diastolic: 85 },
    { month: "May", systolic: 121, diastolic: 81 },
  ],
  sugarLevels: [
    { month: "Jan", fasting: 95 },
    { month: "Feb", fasting: 98 },
    { month: "Mar", fasting: 92 },
    { month: "Apr", fasting: 105 },
    { month: "May", fasting: 97 },
  ],
  wellness: [
    { month: "Jan", sleep: 7.5, activity: 45 },
    { month: "Feb", sleep: 7.2, activity: 50 },
    { month: "Mar", sleep: 8.0, activity: 40 },
    { month: "Apr", sleep: 6.8, activity: 60 },
    { month: "May", sleep: 7.4, activity: 55 },
  ],
};

export default function PatientGraphsPage() {
  const { session } = useAuth();
  
  if (!session) return null;

  return (
    <div className="space-y-6">
      <section className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75 animate-fade-in">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Health Graphs</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Blood pressure, sugar level, and wellness trends</h1>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Blood Pressure">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockMetrics.bloodPressure}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="systolic" stroke="hsl(var(--primary))" strokeWidth={3} />
              <Line type="monotone" dataKey="diastolic" stroke="#0f766e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Sugar Levels">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockMetrics.sugarLevels}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="fasting" stroke="#0891b2" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Other Metrics">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockMetrics.wellness}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sleep" stroke="#2563eb" strokeWidth={3} />
            <Line type="monotone" dataKey="activity" stroke="#14b8a6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
