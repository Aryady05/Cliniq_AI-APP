import { CircleUserRound, ShieldCheck } from "lucide-react";
import { useEffect, useState, type PropsWithChildren } from "react";

const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Intake", href: "#intake" },
  { label: "Queue", href: "#queue" },
  { label: "Consultation", href: "#consultation" },
  { label: "Routing", href: "#routing" }
];

type AppShellProps = PropsWithChildren<{
  title?: string;
}>;

export function AppShell({ children }: AppShellProps) {
  const [activeHref, setActiveHref] = useState("#overview");

  useEffect(() => {
    const syncActiveHref = () => {
      setActiveHref(window.location.hash || "#overview");
    };

    syncActiveHref();
    window.addEventListener("hashchange", syncActiveHref);

    return () => {
      window.removeEventListener("hashchange", syncActiveHref);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7f6f3_0%,_#f2f2ef_52%,_#f8f7f5_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="relative mb-6 flex items-center justify-between gap-6 py-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Cliniq AI
            </h1>
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative px-1 pb-3 text-sm font-medium text-slate-600 transition hover:text-cyan-800"
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-cyan-700 transition-opacity ${
                    activeHref === item.href ? "opacity-100" : "opacity-0"
                  }`}
                />
              </a>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 sm:flex">
              <ShieldCheck className="h-4 w-4" />
              System online
            </div>
            <button className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50">
              <CircleUserRound className="h-5 w-5" />
            </button>
          </div>
        </header>

        <nav className="mb-6 flex flex-wrap items-center gap-6 px-1 py-1 md:hidden">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative px-1 pb-3 text-sm font-medium text-slate-600 transition hover:text-cyan-800"
            >
              {item.label}
              <span
                className={`absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-cyan-700 transition-opacity ${
                  activeHref === item.href ? "opacity-100" : "opacity-0"
                }`}
              />
            </a>
          ))}
        </nav>

        {children}
      </div>
    </div>
  );
}
