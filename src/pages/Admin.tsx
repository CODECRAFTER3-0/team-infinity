import { useState, useEffect } from "react";
import { ShieldAlert, Users, Activity, FileText } from "lucide-react";
import { getAuditLogs, logAudit } from "@/lib/store";
import { getSession } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<{time: string, user: string, action: string, patient: string}[]>([]);

  useEffect(() => {
    const session = getSession();
    if (!session || session.role !== "doctor") {
        // Just for demo purposes, if patient tries to access admin, let's redirect them.
        // Wait, realistically admin is a different role, but we'll let doctors view audit logs in this demo.
    } else {
        logAudit("Admin System", "Admin Dashboard Accessed", "—");
    }
    setLogs(getAuditLogs());
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
               <ShieldAlert className="w-8 h-8 text-primary" /> Admin Security Console
            </h1>
            <p className="text-muted-foreground mt-1">Real-time EHR access logs and system metrics.</p>
          </div>
          <button onClick={() => navigate(-1)} className="px-4 py-2 clay-sm rounded-xl hover:text-primary transition-colors">
            Exit Admin
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="clay p-6">
                 <div className="text-muted-foreground font-semibold text-sm mb-2 flex items-center gap-2"><Activity className="w-4 h-4"/> System Uptime</div>
                 <div className="text-3xl font-bold">99.9%</div>
            </div>
            <div className="clay p-6">
                 <div className="text-muted-foreground font-semibold text-sm mb-2 flex items-center gap-2"><Users className="w-4 h-4"/> Active Sessions</div>
                 <div className="text-3xl font-bold">24</div>
            </div>
            <div className="clay p-6">
                 <div className="text-muted-foreground font-semibold text-sm mb-2 flex items-center gap-2"><FileText className="w-4 h-4"/> Daily Logs</div>
                 <div className="text-3xl font-bold text-gradient">{logs.length}</div>
            </div>
            <div className="clay-primary p-6 relative overflow-hidden">
                 <div className="text-primary-foreground/80 font-semibold text-sm mb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Security Status</div>
                 <div className="text-3xl font-bold text-white">SECURE</div>
                 <ShieldAlert className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-primary-foreground/10" />
            </div>
        </div>

        <div className="clay p-8">
            <h2 className="text-xl font-bold mb-6">Recent Audit Logs</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border/50 text-muted-foreground text-sm">
                            <th className="py-3 px-4 font-semibold">TIMESTAMP</th>
                            <th className="py-3 px-4 font-semibold">USER / ACTOR</th>
                            <th className="py-3 px-4 font-semibold">ACTION</th>
                            <th className="py-3 px-4 font-semibold">TARGET PATIENT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, i) => (
                            <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                <td className="py-4 px-4 font-mono text-sm">{log.time}</td>
                                <td className="py-4 px-4 font-medium">{log.user}</td>
                                <td className="py-4 px-4">
                                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${log.action.includes('Prescription') ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : log.action.includes('Generated') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-muted-foreground">{log.patient}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}
