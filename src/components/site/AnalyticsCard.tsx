import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const analyticsData = [
  { month: "Jan", adherence: 72, risk: 48 },
  { month: "Feb", adherence: 76, risk: 46 },
  { month: "Mar", adherence: 81, risk: 43 },
  { month: "Apr", adherence: 84, risk: 40 },
  { month: "May", adherence: 88, risk: 35 },
  { month: "Jun", adherence: 91, risk: 30 },
];

export function AnalyticsCard() {
  return (
    <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/75 p-6 dark:border-white/10 dark:bg-white/5">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Health analytics</p>
          <h3 className="text-xl font-semibold tracking-tight">Risk drops as adherence improves</h3>
        </div>
        <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          Updated hourly
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={analyticsData}>
            <defs>
              <linearGradient id="adherenceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                borderRadius: "1rem",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--card))",
              }}
            />
            <Area
              type="monotone"
              dataKey="adherence"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fill="url(#adherenceFill)"
            />
            <Area
              type="monotone"
              dataKey="risk"
              stroke="#f59e0b"
              strokeWidth={3}
              fill="url(#riskFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
