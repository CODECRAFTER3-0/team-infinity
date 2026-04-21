import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, User, ShieldCheck, Lock, Mail } from "lucide-react";
import { login, Role } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [license, setLicense] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || (role === "doctor" ? "dr.chen@medicore.io" : "sarah@medicore.io"), role, license);
    navigate(role === "doctor" ? "/doctor" : "/patient");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-soft">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left: Branding */}
        <div className="hidden md:block space-y-6 px-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full clay-sm">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span className="text-xs font-semibold tracking-wide">HIPAA-COMPLIANT · ENCRYPTED</span>
          </div>
          <h1 className="text-5xl font-extrabold leading-tight">
            The future of <span className="text-gradient">healthcare</span> records.
          </h1>
          <p className="text-lg text-muted-foreground">
            Smart EHR with AI-powered summaries, real-time drug interaction alerts, and secure QR-based patient access.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { v: "256-bit", l: "Encryption" },
              { v: "<2s", l: "AI Summary" },
              { v: "99.9%", l: "Uptime" },
            ].map((s) => (
              <div key={s.l} className="clay-sm p-4 text-center">
                <div className="text-xl font-bold text-gradient">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div className="clay p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Stethoscope className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="font-extrabold text-xl">MediCore</div>
              <div className="text-xs text-muted-foreground">Sign in to your account</div>
            </div>
          </div>

          {/* Role toggle */}
          <div className="clay-inset p-1.5 grid grid-cols-2 gap-1 mb-6">
            {(["patient", "doctor"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize",
                  role === r ? "bg-gradient-primary text-primary-foreground shadow-clay-sm" : "text-muted-foreground"
                )}
              >
                {r === "doctor" ? <Stethoscope className="w-4 h-4" /> : <User className="w-4 h-4" />}
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">EMAIL</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === "doctor" ? "dr.chen@medicore.io" : "sarah@medicore.io"}
                  className="w-full clay-inset pl-11 pr-4 py-3.5 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary/30 rounded-2xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">PASSWORD</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full clay-inset pl-11 pr-4 py-3.5 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary/30 rounded-2xl"
                />
              </div>
            </div>

            {role === "doctor" && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">LICENSE NUMBER (Optional)</label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    placeholder="Enter 6+ chars for Verified Status"
                    className="w-full clay-inset pl-11 pr-4 py-3.5 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary/30 rounded-2xl"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold shadow-clay-sm hover:shadow-glow transition-all hover:scale-[1.01]"
            >
              Sign in as {role}
            </button>

            <div className="text-xs text-center text-muted-foreground pt-2 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-success" />
              Demo mode — any credentials work
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
