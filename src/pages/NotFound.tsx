import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
      <div className="soft-surface rounded-[2.5rem] border border-white/60 bg-white/85 p-10 text-center dark:border-white/12 dark:bg-slate-900/75">
        <p className="text-xs uppercase tracking-[0.28em] text-primary">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">This route is not part of the Smart EHR demo</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">Return to authentication and continue with a Patient, Doctor, or Admin workflow.</p>
        <Button asChild className="mt-8 rounded-2xl">
          <Link to="/auth">Go to auth</Link>
        </Button>
      </div>
    </main>
  );
}
