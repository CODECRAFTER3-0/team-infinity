import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  const { session } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.role === 'admin') {
      apiFetch('/admin/audit-logs')
        .then(data => setLogs(data))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  if (loading) return <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Admin Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Audit logs for data access, timestamps, and performed actions</h1>
      </section>

      <section className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
        <div className="overflow-hidden rounded-[1.75rem] border border-white/70 dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-background/80">
              <tr>
                <th className="px-5 py-4 font-semibold">Who accessed data</th>
                <th className="px-5 py-4 font-semibold">Timestamp</th>
                <th className="px-5 py-4 font-semibold">Action performed</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr><td colSpan={3} className="px-5 py-4 text-muted-foreground text-center">No audit logs found.</td></tr>
              )}
              {logs.map((log: any) => (
                <tr key={log._id} className="border-t border-white/60 bg-white/60 dark:border-white/10 dark:bg-slate-950/20">
                  <td className="px-5 py-4 font-medium">{log.userId?.name || 'Unknown User'} ({log.role})</td>
                  <td className="px-5 py-4 text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-5 py-4 text-muted-foreground">{log.action} {log.details ? `- ${log.details}` : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
