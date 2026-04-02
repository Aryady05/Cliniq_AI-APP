import { Download, Smartphone } from "lucide-react";

export function PwaInstallCard() {
  return (
    <section className="rounded-[28px] bg-cyan-700 p-5 text-white shadow-xl shadow-cyan-900/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100/90">
              Progressive Web App
            </p>
            <h3 className="mt-1 text-xl font-semibold">
              Install Cliniq AI on tablets, kiosks, and triage desks
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-cyan-50/90">
              Offline-ready assets and app manifest are already wired so the frontend can evolve into a field-friendly clinical workstation.
            </p>
          </div>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-cyan-800 transition hover:-translate-y-0.5 hover:bg-cyan-50">
          <Download className="h-4 w-4" />
          Install app
        </button>
      </div>
    </section>
  );
}
