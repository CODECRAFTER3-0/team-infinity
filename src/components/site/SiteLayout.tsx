import { Outlet } from "react-router-dom";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";

export function SiteLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10rem] top-[-8rem] h-80 w-80 rounded-full bg-cyan-300/25 blur-3xl dark:bg-cyan-500/15" />
        <div className="absolute right-[-8rem] top-24 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/15" />
        <div className="absolute bottom-[-10rem] left-1/3 h-96 w-96 rounded-full bg-teal-200/25 blur-3xl dark:bg-teal-500/10" />
        <div className="grid-pattern absolute inset-0 opacity-40 dark:opacity-20" />
      </div>

      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
