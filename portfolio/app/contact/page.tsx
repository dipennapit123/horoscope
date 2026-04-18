import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/src/components/ContactForm";
import { site } from "@/src/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact the ${site.name} team.`,
  alternates: {
    canonical: "/contact",
  },
};

const NEBULA_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAIzZ45n4Dw_mtGctau7y1d6QLZwzZVR1ayo4-PtCX80p5KpCDtkM3sl_DxvOobjBtIpF0U-GNVxojWj5hAHRtxpPyGPlfJkqUIM75PRQuHlj2hSthqxPcxFKs1ez2IuJlR6XoYiwNQD9hZklnmyB3T0ty6o9O-9jWbAWXH9_lFt4iobr2RB47161eiqeKd1T_PhAdBQdY_J1UuhSfDRG4Z_eJ9U0DhlwcCHtewFxG5iB64WW8RPpJSRJ-_LY13NbQT_qeohiXVgQ";

export default function ContactPage() {
  return (
    <main className="relative z-10 flex min-h-[calc(100vh-8rem)] grow flex-col items-center justify-center overflow-hidden px-6 pb-12 pt-24">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
        <div className="absolute left-1/4 top-1/4 h-1 w-1 rounded-full bg-on-surface" />
        <div className="absolute left-1/3 top-3/4 h-2 w-2 rounded-full bg-primary/40 blur-sm" />
        <div className="absolute right-1/4 top-1/2 h-1 w-1 rounded-full bg-on-surface" />
        <div className="absolute right-1/3 top-1/4 h-1.5 w-1.5 rounded-full bg-tertiary/30 blur-[1px]" />
      </div>

      <div className="relative z-10 grid w-full max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div className="space-y-12">
          <div className="space-y-6">
            <h1 className="font-headline text-6xl font-extrabold leading-tight tracking-tighter text-on-surface md:text-7xl">
              Grounded in the <span className="text-primary">Cosmos</span>.
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-on-surface-variant">
              Whether you have a question about our features, pricing, or the
              mysteries of the universe, our team is here to guide you.
            </p>
          </div>

          <div className="space-y-8">
            <div className="group flex items-center gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-high text-primary transition-transform duration-300 group-hover:scale-110">
                <span className="material-symbols-outlined text-3xl">mail</span>
              </div>
              <div>
                <p className="font-label text-xs uppercase tracking-widest text-outline">
                  Support Email
                </p>
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="font-headline text-xl font-bold text-on-surface hover:text-primary"
                >
                  {site.contactEmail}
                </a>
              </div>
            </div>

            <div className="group flex items-center gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-high text-tertiary transition-transform duration-300 group-hover:scale-110">
                <span className="material-symbols-outlined text-3xl">public</span>
              </div>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/30 text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                  aria-label="Brand"
                >
                  <span className="material-symbols-outlined text-xl">
                    brand_awareness
                  </span>
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/30 text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                  aria-label="Share"
                >
                  <span className="material-symbols-outlined text-xl">share</span>
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/30 text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                  aria-label="Community"
                >
                  <span className="material-symbols-outlined text-xl">group</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <div className="inline-block rounded-2xl border border-white/10 bg-black p-1">
              <Image
                src={NEBULA_IMG}
                alt="Deep space nebula"
                width={640}
                height={192}
                className="h-48 w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="nebula-glow absolute -inset-10 rounded-full opacity-60 blur-3xl" />
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
