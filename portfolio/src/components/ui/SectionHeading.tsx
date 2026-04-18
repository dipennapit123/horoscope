import { type ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          {description}
        </p>
      ) : null}
    </div>
  );
}

