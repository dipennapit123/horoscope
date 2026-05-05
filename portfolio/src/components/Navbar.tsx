"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Container } from "@/src/components/ui/Container";
import { site } from "@/src/content/site";

const nav = [
  { href: "/", label: "Home" },
  { href: "/horoscope", label: "Horoscope" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const items = useMemo(
    () =>
      nav.map((item) => ({
        ...item,
        isActive: item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href),
      })),
    [pathname],
  );

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/75 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <Container className="flex max-w-full items-center justify-between px-4 py-4 sm:px-6 md:px-8">
        <Link
          href="/"
          className="font-headline text-2xl font-black tracking-tighter text-primary"
        >
          {site.name}
        </Link>

        <div className="hidden items-center gap-8 font-body md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "text-sm font-bold uppercase tracking-widest transition-colors",
                item.isActive
                  ? "border-b-2 border-primary pb-1 text-primary"
                  : "text-white hover:text-primary",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
          >
            <span className="material-symbols-outlined">
              {open ? "close" : "menu"}
            </span>
          </button>
        </div>

        <Link
          href="/#download"
          className="pulsar-btn hidden rounded-full px-6 py-2 font-headline font-bold text-on-primary-fixed hover:opacity-80 transition-opacity duration-300 md:inline-flex"
        >
          Get App
        </Link>
      </Container>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden">
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-40 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="fixed left-0 right-0 top-[64px] z-50 border-b border-white/10 bg-black/95 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors",
                      item.isActive
                        ? "bg-primary/15 text-primary"
                        : "text-white hover:bg-white/5 hover:text-primary",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/#download"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 font-headline text-sm font-bold text-on-primary-fixed"
                >
                  Get App
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

