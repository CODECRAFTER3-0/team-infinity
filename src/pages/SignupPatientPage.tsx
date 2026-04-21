import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { SignupShell } from "@/components/site/SignupShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const patientHighlights = [
  "Profile fields cover the patient record shown inside the dashboard",
  "Major health issues are captured as a comma-separated list for easy review",
  "The account is linked to the patient dashboard immediately after signup",
];

export default function SignupPatientPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Female");
  const [bloodGroup, setBloodGroup] = useState("B+");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [majorHealthIssues, setMajorHealthIssues] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const issuesPreview = useMemo(
    () =>
      majorHealthIssues
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [majorHealthIssues],
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role: "patient",
        age: Number(age) || 0,
        gender,
        bloodGroup,
        contactNumber: contact.trim(),
        address: address.trim(),
        majorIssues: issuesPreview,
      });

      navigate("/patient/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupShell
      eyebrow="Patient Signup"
      title="Register a patient profile with the core medical details"
      description="This form captures the information that powers the patient profile, records, and chart summary views."
      highlights={patientHighlights}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="patient-name">Full name</Label>
            <Input id="patient-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Anaya Joseph" className="h-12 rounded-2xl border-white/70 bg-background/70 dark:border-white/10" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-age">Age</Label>
            <Input id="patient-age" type="number" min="0" value={age} onChange={(event) => setAge(event.target.value)} placeholder="34" className="h-12 rounded-2xl border-white/70 bg-background/70 dark:border-white/10" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-gender">Gender</Label>
            <Input id="patient-gender" value={gender} onChange={(event) => setGender(event.target.value)} placeholder="Female" className="h-12 rounded-2xl border-white/70 bg-background/70 dark:border-white/10" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-blood-group">Blood group</Label>
            <Input id="patient-blood-group" value={bloodGroup} onChange={(event) => setBloodGroup(event.target.value)} placeholder="B+" className="h-12 rounded-2xl border-white/70 bg-background/70 dark:border-white/10" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-contact">Contact number</Label>
            <Input id="patient-contact" value={contact} onChange={(event) => setContact(event.target.value)} placeholder="+91 98765 43210" className="h-12 rounded-2xl border-white/70 bg-background/70 dark:border-white/10" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-email">Email</Label>
            <Input id="patient-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="patient@example.com" className="h-12 rounded-2xl border-white/70 bg-background/70 dark:border-white/10" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-password">Password</Label>
            <Input id="patient-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" className="h-12 rounded-2xl border-white/70 bg-background/70 dark:border-white/10" required minLength={6} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="patient-address">Address</Label>
          <Textarea id="patient-address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="House, street, city, state" className="min-h-28 rounded-2xl border-white/70 bg-background/70 dark:border-white/10" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="patient-health-issues">Major health issues</Label>
          <Textarea
            id="patient-health-issues"
            value={majorHealthIssues}
            onChange={(event) => setMajorHealthIssues(event.target.value)}
            placeholder="Type 2 Diabetes, Hypertension, Seasonal Asthma"
            className="min-h-28 rounded-2xl border-white/70 bg-background/70 dark:border-white/10"
          />
          <p className="text-xs text-muted-foreground">Use commas to separate conditions. This will appear as the patient&apos;s tracked health issues.</p>
        </div>

        <div className="rounded-[1.75rem] border border-white/70 bg-background/70 p-4 dark:border-white/10">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Preview</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {issuesPreview.length ? (
              issuesPreview.map((issue) => (
                <span key={issue} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {issue}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No health issues added yet.</span>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold border border-destructive/20">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading} className="h-12 w-full rounded-2xl text-sm font-semibold">
          {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Create patient account"}
        </Button>
      </form>
    </SignupShell>
  );
}
