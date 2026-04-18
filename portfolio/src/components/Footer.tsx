import Link from "next/link";
import { Container } from "@/src/components/ui/Container";
import { site } from "@/src/content/site";

const product = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/screenshots", label: "Screenshots" },
  { href: "/demo", label: "Demo" },
] as const;

const support = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/contact", label: "Support" },
] as const;

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black py-16">
      <Container className="px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <span className="mb-4 block text-xl font-bold text-primary">
              {site.name}
            </span>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              Mapping the celestial infinite for modern minds. Your daily cosmic
              companion for clarity and growth.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-primary">Product</h4>
            <nav className="flex flex-col gap-2">
              {product.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-on-surface-variant transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-primary">Blog</h4>
            <nav className="flex flex-col gap-2">
              <Link
                href={site.blogUrl}
                className="text-sm text-on-surface-variant transition-colors hover:text-primary"
              >
                Articles
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-primary">Support</h4>
            <nav className="flex flex-col gap-2">
              {support.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-on-surface-variant transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              ))}
              <a
                href={`mailto:${site.contactEmail}`}
                className="text-sm text-on-surface-variant transition-colors hover:text-primary"
              >
                {site.contactEmail}
              </a>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-primary">Stay Connected</h4>
            <div className="flex gap-4">
              <a
                className="text-on-surface-variant transition-colors hover:text-primary"
                href="#"
                aria-label="Website"
              >
                <span className="material-symbols-outlined">public</span>
              </a>
              <a
                className="text-on-surface-variant transition-colors hover:text-primary"
                href={`mailto:${site.contactEmail}`}
                aria-label="Email"
              >
                <span className="material-symbols-outlined">mail</span>
              </a>
              <a
                className="text-on-surface-variant transition-colors hover:text-primary"
                href="#"
                aria-label="Share"
              >
                <span className="material-symbols-outlined">share</span>
              </a>
            </div>
            <p className="pt-4 text-xs text-on-surface-variant">
              © 2024 {site.name}. Grounded in the Cosmos.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

