import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type CommonProps = {
  variant?: ButtonVariant;
};

function classesForVariant(variant: ButtonVariant) {
  switch (variant) {
    case "secondary":
      return "bg-white/5 text-white ring-1 ring-white/15 hover:bg-white/10";
    case "ghost":
      return "bg-transparent text-zinc-900 hover:bg-zinc-900/5 dark:text-zinc-50 dark:hover:bg-white/10";
    case "primary":
    default:
      return "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200";
  }
}

export function ButtonLink({
  className,
  variant = "primary",
  ...props
}: ComponentPropsWithoutRef<typeof Link> & CommonProps) {
  return (
    <Link
      className={[
        "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
        classesForVariant(variant),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ComponentPropsWithoutRef<"button"> & CommonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
        classesForVariant(variant),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

