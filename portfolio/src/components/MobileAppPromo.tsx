"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/src/content/site";

function GooglePlayLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#00D9FF" d="M3.6 1.2 13.4 12 3.6 22.8c-.8-.5-1.3-1.4-1.3-2.4V3.6c0-1 .5-1.9 1.3-2.4z" />
      <path fill="#00F076" d="M16.3 7.2 5.1 1.1C5.5.8 6 .6 6.6.6c.5 0 1 .2 1.4.5l10.3 6-2 2.1z" />
      <path fill="#FFE500" d="M16.3 16.8 8 12l8.3-4.8 2 2.1-10.3 6c-.4.3-.9.5-1.4.5-.6 0-1.1-.2-1.5-.5z" />
      <path fill="#FF3A44" d="M3.6 22.8c-.8-.5-1.3-1.4-1.3-2.4v-.4l9.7 5.6c.4.3.9.5 1.4.5.6 0 1.1-.2 1.5-.5l-10.3-6z" />
    </svg>
  );
}

/**
 * Full-width promo bar that slides down from behind the navbar on every visit,
 * advertising the AstraDaily mobile app. Always visible — no dismiss button.
 */
export function MobileAppPromo() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Tiny delay so the slide-in animation is observable on first paint.
    const t = setTimeout(() => setVisible(true), 180);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      role="region"
      aria-label={`${site.name} mobile app promotion`}
      className={[
        "fixed inset-x-0 top-[64px] z-40",
        "transition-transform duration-500 ease-out",
        visible ? "translate-y-0" : "-translate-y-full",
      ].join(" ")}
    >
      <div className="relative w-full border-b border-white/10 bg-linear-to-r from-black via-primary-container/20 to-black shadow-2xl shadow-primary/20 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:gap-6 sm:px-8 sm:py-6">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-5">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl ring-2 ring-primary/30 shadow-lg shadow-primary/20 sm:h-16 sm:w-16">
              <Image
                src="/icon.png"
                alt={`${site.name} app icon`}
                width={64}
                height={64}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <div className="flex min-w-0 flex-col leading-tight">
              <p className="font-headline text-base font-extrabold text-on-surface sm:text-xl">
                Get {site.name} on your phone
              </p>
              <p className="hidden text-sm text-on-surface-variant sm:block sm:text-base">
                Daily horoscopes, calm UI, no clutter — read your sign on the go.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <a
              href={site.storeLinks.android}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get it on Google Play"
              className="group flex items-center gap-2 rounded-xl border border-white/15 bg-neutral-900/80 p-2 text-white transition hover:border-white/30 hover:bg-neutral-800/90 sm:px-4 sm:py-2"
            >
              <GooglePlayLogo className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
              <span className="text-left leading-tight">
                <span className="hidden text-[10px] font-medium text-neutral-400 sm:block">
                  GET IT ON
                </span>
                <span className="font-headline text-sm font-bold tracking-tight">
                  Google Play
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
