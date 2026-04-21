import { LockKeyhole, Smartphone, UserRound } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type QrAccessCardProps = {
  patientName: string;
  qrValue: string;
};

export function QrAccessCard({ patientName, qrValue }: QrAccessCardProps) {
  return (
    <div className="soft-surface rounded-[2rem] border border-white/60 bg-white/85 p-6 dark:border-white/12 dark:bg-slate-900/75">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-sm">
          <div className="inline-flex rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-primary">
            Patient QR Access
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight">One scan unlocks a time-bound chart review</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {patientName} shares a QR code generated inside the app. Doctors receive temporary, logged access
            only after the patient approves the encounter.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <UserRound className="h-4 w-4 text-primary" />
              Consent linked to a verified patient identity
            </div>
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4 text-primary" />
              QR rotates automatically for each new visit
            </div>
            <div className="flex items-center gap-3">
              <LockKeyhole className="h-4 w-4 text-primary" />
              Access events flow into admin audit logs
            </div>
          </div>
        </div>
        <div className="soft-surface scan-sweep relative mx-auto flex w-full max-w-[16rem] flex-col items-center rounded-[2rem] border border-white/70 bg-white p-5 dark:border-white/12 dark:bg-slate-950/85">
          <div className="rounded-[1.75rem] bg-slate-50 p-4 dark:bg-slate-900">
            <QRCodeSVG value={qrValue} size={172} bgColor="transparent" fgColor="currentColor" className="text-slate-900 dark:text-white" />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm font-semibold text-foreground">{patientName}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">Encounter Pass</p>
          </div>
        </div>
      </div>
    </div>
  );
}
