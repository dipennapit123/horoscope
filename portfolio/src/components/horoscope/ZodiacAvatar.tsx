import Image from "next/image";
import type { ZodiacEntry } from "@/src/content/site";

interface Props {
  sign: ZodiacEntry;
  size?: "sm" | "md" | "lg";
}

const SIZE: Record<NonNullable<Props["size"]>, { wrap: string; glyph: string; image: number }> = {
  sm: { wrap: "h-16 w-16", glyph: "text-3xl", image: 64 },
  md: { wrap: "h-24 w-24", glyph: "text-5xl", image: 96 },
  lg: { wrap: "h-32 w-32", glyph: "text-6xl", image: 128 },
};

/**
 * Circular zodiac avatar.
 *
 * - If `sign.imageSrc` is set, renders the PNG (drop them into
 *   `public/horoscope/<slug>.png` and set `imageSrc` in `site.ts`).
 * - Otherwise renders a cosmic gradient backdrop with the sign's Unicode glyph,
 *   so the page looks finished even before artwork is shipped.
 */
export function ZodiacAvatar({ sign, size = "md" }: Props) {
  const dims = SIZE[size];
  const hasImage = "imageSrc" in sign && typeof sign.imageSrc === "string" && sign.imageSrc.length > 0;

  return (
    <div
      className={`relative ${dims.wrap} shrink-0 overflow-hidden rounded-full ring-2 ring-white/10`}
    >
      {hasImage ? (
        <Image
          src={sign.imageSrc as string}
          alt={`${sign.label} zodiac sign`}
          width={dims.image}
          height={dims.image}
          className="h-full w-full object-cover"
          unoptimized
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/40 via-secondary/30 to-primary-container/60">
          <span
            className={`${dims.glyph} font-headline font-extrabold text-on-surface`}
            aria-hidden
          >
            {sign.glyph}
          </span>
        </div>
      )}
    </div>
  );
}
