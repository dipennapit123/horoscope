"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/75 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <Container className="flex max-w-full items-center justify-between px-8 py-4">
        <Link
          href="/"
          className="font-headline text-2xl font-black tracking-tighter text-primary"
        >
          {site.name}
        </Link>

        <div className="hidden items-center gap-8 font-body md:flex">
          {nav.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "text-sm font-bold uppercase tracking-widest transition-colors",
                  isActive
                    ? "border-b-2 border-primary pb-1 text-primary"
                    : "text-white hover:text-primary",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <a
          href="/#download"
          className="pulsar-btn rounded-full px-6 py-2 font-headline font-bold text-on-primary-fixed hover:opacity-80 transition-opacity duration-300"
        >
          Get App
        </a>
      </Container>
    </nav>
  );
}

