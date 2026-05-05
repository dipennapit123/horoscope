import Link from "next/link";
import { zodiacSigns } from "@/src/content/site";
import { ZodiacAvatar } from "./ZodiacAvatar";

/** 4-column responsive grid of all 12 zodiac signs (selector for `/horoscope`). */
export function ZodiacGrid() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {zodiacSigns.map((sign) => (
        <li key={sign.slug}>
          <Link
            href={`/horoscope/${sign.slug}`}
            className="glass-card group flex h-full min-h-[140px] flex-col items-center justify-center gap-2 rounded-2xl px-3 py-4 text-center transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] sm:min-h-0 sm:gap-3 sm:rounded-3xl sm:px-4 sm:py-6 sm:hover:-translate-y-1 sm:hover:border-primary/40 sm:hover:shadow-2xl sm:hover:shadow-primary/10"
            aria-label={`Open ${sign.label} horoscope`}
          >
            <ZodiacAvatar sign={sign} size="md" />
            <div>
              <h3 className="font-headline text-lg font-bold tracking-tight text-on-surface transition-colors group-hover:text-primary sm:text-xl">
                {sign.label}
              </h3>
              <p className="mt-0.5 px-1 text-[11px] font-medium leading-tight text-on-surface-variant sm:mt-1 sm:text-xs">
                {sign.dateRange}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
