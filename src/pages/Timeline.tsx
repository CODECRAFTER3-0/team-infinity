import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, FileText, FlaskConical, Filter } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getPatientById } from "@/lib/store";

export default function Timeline() {
  const navigate = useNavigate();
  const session = getSession();
  
  if (!session) {
      navigate('/login');
      return null;
  }

  // Support both Doctor viewing a patient, or Patient viewing themselves
  const patientId = session.role === "patient" ? session.patientId : "PAT-2024-001";
  const patient = getPatientById(patientId!);

  const [filter, setFilter] = useState("all");

  if (!patient) return <div className="p-10 text-center">Patient not found</div>;

  // Combine events
  const events = [
    ...patient.visits.map(v => ({ type: 'visit', date: v.date, title: `Visit with ${v.doctor}`, desc: v.reason, icon: Clock, color: "text-blue-500" })),
    ...patient.reports.map(r => ({ type: 'report', date: r.date, title: `${r.type} Report`, desc: r.name, icon: FileText, color: "text-purple-500" })),
    ...patient.tests.map(t => ({ type: 'test', date: t.date, title: `Lab Test: ${t.name}`, desc: `Result: ${t.result}`, icon: FlaskConical, color: "text-orange-500" }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredEvents = filter === "all" ? events : events.filter(e => e.type === filter);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 clay-sm rounded-xl hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Medical History</h1>
              <p className="text-sm text-muted-foreground">{patient.name}'s Timeline</p>
            </div>
          </div>
          
          <div className="flex bg-card clay-inset rounded-lg p-1">
              {(["all", "visit", "report", "test"] as const).map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 text-sm capitalize rounded-md transition-all ${filter === f ? 'bg-white shadow text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                      {f}
                  </button>
              ))}
          </div>
        </header>

        <div className="clay p-8">
            <div className="relative border-l-2 border-primary/20 ml-4 py-4 space-y-12">
               {filteredEvents.map((evt, idx) => {
                   const Icon = evt.icon;
                   return (
                    <div key={idx} className="relative pl-8">
                        <div className={`absolute -left-[21px] bg-background border-4 border-background p-2 rounded-full clay-sm shadow-glow ${evt.color}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div className="clay-sm p-5 border border-border/50 hover:border-primary/30 transition-all group">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">{evt.title}</h3>
                                <div className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">{evt.date}</div>
                            </div>
                            <p className="text-muted-foreground">{evt.desc}</p>
                        </div>
                    </div>
                   );
               })}

               {filteredEvents.length === 0 && (
                   <div className="text-center text-muted-foreground py-10">
                       No events found for this filter.
                   </div>
               )}
            </div>
        </div>
      </div>
    </div>
  );
}
