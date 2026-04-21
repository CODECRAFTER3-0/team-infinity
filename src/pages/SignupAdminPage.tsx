import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { SignupShell } from "@/components/site/SignupShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const adminHighlights = [
  "Admin records capture the minimum fields needed for governance access",
  "Department and admin ID help with audit trail clarity",
  "After signup, the account lands in the admin dashboard immediately",
];

export default function SignupAdminPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [department, setDepartment] = useState("");
  const [adminId, setAdminId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role: "admin",
        age: Number(age) || 0,
        contactNumber: contact.trim(),
        department: department.trim(),
        adminId: adminId.trim()
      });

      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupShell
      eyebrow="Admin Signup"
      title="Register an admin profile for oversight and governance"
      description="This form keeps the admin onboarding lightweight while still capturing the details required for audit visibility."
      highlights={adminHighlights}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="admin-name">Full name</Label>
            <Input id="admin-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Admin User" className="h-12 rounded-2xl border-white/70 bg-background/70 dark:border-white/10" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-age">Age</Label>
            <Input id="admin-age" type="number" min="0" value={age} onChange={(event) => setAge(event.target.value)} placeholder="38" className="h-12 rounded-2xl border-white/70 bg-background/70 dark:border-white/10" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@hospital.org" className="h-12 rounded-2xl border-white/70 bg-background/70 dark:border-white/10" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" className="h-12 rounded-2xl border-white/70 bg-background/70 dark:border-white/10" required minLength={6} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-contact">Contact number</Label>
            <Input id="admin-contact" value={contact} onChange={(event) => setContact(event.target.value)} placeholder="+91 90000 12345" className="h-12 rounded-2xl border-white/70 bg-background/70 dark:border-white/10" required />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="admin-department">Department</Label>
            <Input id="admin-department" value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="Hospital Administration" className="h-12 rounded-2xl border-white/70 bg-background/70 dark:border-white/10" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-id">Admin ID</Label>
            <Input id="admin-id" value={adminId} onChange={(event) => setAdminId(event.target.value)} placeholder="ADM-001" className="h-12 rounded-2xl border-white/70 bg-background/70 dark:border-white/10" required />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold border border-destructive/20">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading} className="h-12 w-full rounded-2xl text-sm font-semibold">
          {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Create admin account"}
        </Button>
      </form>
    </SignupShell>
  );
}
