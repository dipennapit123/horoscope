import { site } from "@/src/content/site";

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GooglePlayLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path fill="#00D9FF" d="M3.6 1.2 13.4 12 3.6 22.8c-.8-.5-1.3-1.4-1.3-2.4V3.6c0-1 .5-1.9 1.3-2.4z" />
      <path fill="#00F076" d="M16.3 7.2 5.1 1.1C5.5.8 6 .6 6.6.6c.5 0 1 .2 1.4.5l10.3 6-2 2.1z" />
      <path fill="#FFE500" d="M16.3 16.8 8 12l8.3-4.8 2 2.1-10.3 6c-.4.3-.9.5-1.4.5-.6 0-1.1-.2-1.5-.5z" />
      <path fill="#FF3A44" d="M3.6 22.8c-.8-.5-1.3-1.4-1.3-2.4v-.4l9.7 5.6c.4.3.9.5 1.4.5.6 0 1.1-.2 1.5-.5l-10.3-6z" />
    </svg>
  );
}

const btnBase =
  "group flex min-h-[52px] flex-1 items-center justify-center gap-3 rounded-xl border border-white/15 bg-neutral-900/80 px-4 py-3 text-white shadow-sm transition hover:border-white/25 hover:bg-neutral-800/90 sm:min-w-[200px]";

export function StoreBadgeButtons({ className }: { className?: string }) {
  return (
    <div
      className={`flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap ${className ?? ""}`}
    >
      <a
        href={site.storeLinks.ios}
        target="_blank"
        rel="noopener noreferrer"
        className={btnBase}
      >
        <AppleLogo className="h-8 w-8 shrink-0 text-white" />
        <span className="text-left leading-tight">
          <span className="block text-[11px] font-medium text-neutral-400">
            Download on the
          </span>
          <span className="block font-headline text-[15px] font-bold tracking-tight">
            App Store
          </span>
        </span>
      </a>
      <a
        href={site.storeLinks.android}
        target="_blank"
        rel="noopener noreferrer"
        className={btnBase}
      >
        <GooglePlayLogo className="h-8 w-8 shrink-0" />
        <span className="text-left leading-tight">
          <span className="block text-[11px] font-medium text-neutral-400">
            GET IT ON
          </span>
          <span className="block font-headline text-[15px] font-bold tracking-tight">
            Google Play
          </span>
        </span>
      </a>
    </div>
  );
}
