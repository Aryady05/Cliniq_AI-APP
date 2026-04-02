type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description
}: SectionHeaderProps) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
        {eyebrow}
      </p>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
