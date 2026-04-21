import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BadgeCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type SignupShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  children: ReactNode;
};

export function SignupShell({ eyebrow, title, description, highlights, children }: SignupShellProps) {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="soft-surface overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/80 p-8 dark:border-white/12 dark:bg-slate-900/75">
          <div className="inline-flex rounded-full border border-primary/15 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {eyebrow}
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{description}</p>

          <div className="mt-8 space-y-4">
            {highlights.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-[1.5rem] border border-white/70 bg-background/75 px-4 py-3 text-sm text-foreground dark:border-white/10">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-primary/15 bg-primary/5 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
              <p className="text-sm leading-6 text-primary/90">
                All signups are stored locally for this demo and routed into the role-based dashboard immediately after registration.
              </p>
            </div>
          </div>

          <Button asChild variant="ghost" className="mt-8 rounded-full px-0 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground">
            <Link to="/auth">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Link>
          </Button>
        </section>

        <section className="soft-surface rounded-[2.5rem] border border-white/60 bg-white/85 p-8 dark:border-white/12 dark:bg-slate-900/75">
          {children}
        </section>
      </div>
    </main>
  );
}
