import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, toApiAssetUrl } from "@/lib/api";
import { FileText, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

const MAX_REPORT_FILE_SIZE = 8 * 1024 * 1024;

export default function PatientHistoryPage() {
  const { session } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const loadHistory = async () => {
    const data = await apiFetch("/patients/history");
    setHistory(data);
  };

  useEffect(() => {
    if (session?.role === "patient") {
      loadHistory().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] || null;

    if (nextFile && nextFile.size > MAX_REPORT_FILE_SIZE) {
      setSelectedFile(null);
      setMessage("Please choose a report smaller than 8MB.");
      event.target.value = "";
      return;
    }

    setMessage("");
    setSelectedFile(nextFile);
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");

    if (!title.trim() || !selectedFile) {
      setMessage("Please add a title and choose a report file.");
      return;
    }

    if (selectedFile.size > MAX_REPORT_FILE_SIZE) {
      setMessage("Please choose a report smaller than 8MB.");
      return;
    }

    setUploading(true);

    try {
      const fileContent = await readFileAsDataUrl(selectedFile);

      await apiFetch("/patients/reports", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          date: reportDate || undefined,
          fileName: selectedFile.name,
          mimeType: selectedFile.type,
          fileContent,
        }),
      });

      await loadHistory();
      setTitle("");
      setDescription("");
      setReportDate("");
      setSelectedFile(null);
      const fileInput = document.getElementById("patient-report-file") as HTMLInputElement | null;
      if (fileInput) {
        fileInput.value = "";
      }
      setMessage("Report uploaded successfully.");
    } catch (err: any) {
      setMessage(err.message || "Failed to upload report.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Medical History</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Appointments, tests, reports, and diagnoses in one timeline</h1>
      </div>

      <form onSubmit={handleUpload} className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Upload New Report</h2>
            <p className="text-sm text-muted-foreground">Upload a PDF or image so your doctor can review it after QR verification.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="patient-report-title">Report title</Label>
            <Input id="patient-report-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="CBC Lab Result" className="h-12 rounded-2xl border-white/70 bg-background/70 dark:border-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-report-date">Report date</Label>
            <Input id="patient-report-date" type="date" value={reportDate} onChange={(event) => setReportDate(event.target.value)} className="h-12 rounded-2xl border-white/70 bg-background/70 dark:border-white/10" />
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <Label htmlFor="patient-report-description">Description</Label>
          <Textarea id="patient-report-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add notes for the doctor reviewing this report." className="min-h-28 rounded-2xl border-white/70 bg-background/70 dark:border-white/10" />
        </div>

        <div className="mt-5 space-y-2">
          <Label htmlFor="patient-report-file">File</Label>
          <Input id="patient-report-file" type="file" accept=".pdf,image/png,image/jpeg,image/webp" onChange={handleFileChange} className="h-12 rounded-2xl border-white/70 bg-background/70 file:mr-4 file:border-0 file:bg-transparent file:text-sm file:font-medium dark:border-white/10" />
          <p className="text-xs text-muted-foreground">Supported formats: PDF, JPG, PNG, WEBP. Max file size: 8MB.</p>
        </div>

        {message && <div className="mt-4 rounded-2xl bg-background/80 p-4 text-sm font-medium">{message}</div>}

        <Button type="submit" disabled={uploading} className="mt-6 h-12 rounded-2xl px-6 text-sm font-semibold">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload Report"}
        </Button>
      </form>

      <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-7 dark:border-white/12 dark:bg-slate-900/75">
        <div className="space-y-5">
          {history.length === 0 && <p className="text-muted-foreground">No medical history records found.</p>}
          {history.map((item) => (
            <div key={item._id} className="grid gap-4 rounded-[1.75rem] border border-white/70 bg-background/75 p-5 dark:border-white/10 md:grid-cols-[0.22fr_0.78fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{item.type}</p>
                <p className="mt-1 text-sm font-semibold">{new Date(item.date).toLocaleDateString()}</p>
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs font-semibold text-muted-foreground">{item.doctorName}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                {item.reportFile && (
                  <a
                    href={toApiAssetUrl(item.reportFile)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                  >
                    <FileText className="h-4 w-4" />
                    View {item.reportFileName || "report"}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
