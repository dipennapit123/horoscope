import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/src/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${site.name}.`,
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="relative z-10 overflow-hidden bg-black pb-24 pt-28 text-on-surface">
      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <p className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
          >
            <span aria-hidden>←</span> Back to Home
          </Link>
        </p>

        <header className="mb-16 text-center">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base text-white/60">
            Last updated: April 18, 2026
          </p>
        </header>

        <div className="space-y-14 text-left text-[15px] leading-relaxed text-white/80 md:text-base">
          {/* 1. Introduction */}
          <section>
            <h2 className="mb-4 font-headline text-xl font-bold text-white md:text-2xl">
              1. Introduction
            </h2>
            <p className="mb-4">
              Welcome to {site.name}. We are committed to protecting your
              personal information and being transparent about how we collect,
              use, and share data when you use our mobile application and
              related services.
            </p>
            <p className="mb-4">
              {site.name} is a daily horoscope application. Content is generated
              for <strong className="font-semibold text-white">entertainment</strong>{" "}
              purposes only—it is not a substitute for professional medical,
              legal, financial, or other advice.
            </p>
            <p>
              This Privacy Policy explains what we collect, why we collect it,
              and your choices. By using {site.name}, you agree to this policy.
              If you do not agree, please do not use the app.
            </p>
          </section>

          {/* 2. Information we collect */}
          <section>
            <h2 className="mb-4 font-headline text-xl font-bold text-white md:text-2xl">
              2. Information we collect
            </h2>

            <h3 className="mb-3 mt-8 font-headline text-lg font-semibold text-white">
              Personal information
            </h3>
            <p className="mb-3">
              We collect information you provide directly to us, such as when you
              create an account, sign in, choose your zodiac sign, or contact us
              for support. This may include:
            </p>
            <ul className="list-disc space-y-2 pl-6 marker:text-white/40">
              <li>Name, email address, and profile information from your sign-in provider</li>
              <li>
                Account credentials and authentication data when you sign in with
                Google (or other supported providers we may offer)
              </li>
              <li>
                Your selected <strong className="font-medium text-white/95">zodiac sign</strong>{" "}
                and preferences stored with your account (for example default day
                view or display settings)
              </li>
              <li>
                Messages you send us (for example support requests) and your
                contact details so we can respond
              </li>
            </ul>

            <h3 className="mb-3 mt-8 font-headline text-lg font-semibold text-white">
              Horoscope and usage data
            </h3>
            <p className="mb-3">
              To deliver and improve the service, we also process data related to
              how you use {site.name}, including:
            </p>
            <ul className="list-disc space-y-2 pl-6 marker:text-white/40">
              <li>
                Horoscope content associated with your account, including history
                of readings you have viewed
              </li>
              <li>
                Which days you view (for example yesterday, today, or tomorrow)
                and interactions with the horoscope screen (such as refresh)
              </li>
              <li>
                In-app activity we use to understand product usage and reliability
                (for example when the app is opened), in line with our legitimate
                interests and your settings where applicable
              </li>
              <li>
                AI-generated horoscope text and related metadata produced by our
                systems to personalize content to your sign
              </li>
            </ul>

            <h3 className="mb-3 mt-8 font-headline text-lg font-semibold text-white">
              Technical and device data
            </h3>
            <p className="mb-3">
              Like most apps, we automatically collect certain technical
              information, such as:
            </p>
            <ul className="list-disc space-y-2 pl-6 marker:text-white/40">
              <li>Device type, operating system version, and app version</li>
              <li>
                Approximate network or connection information needed to connect
                the app to our servers
              </li>
              <li>
                Diagnostic, crash, and performance data to fix bugs and improve
                stability
              </li>
              <li>
                Push notification tokens, if you enable notifications, so we can
                deliver messages you opt into
              </li>
            </ul>
            <p className="mt-4 text-sm text-white/55">
              We do not require your precise location, birth chart coordinates, or
              sensitive health data to use the core horoscope features. We do not
              use {site.name} to collect government ID numbers or payment card data
              unless we explicitly offer a paid feature that requires it—and we
              would describe that collection separately at the time of purchase.
            </p>
          </section>

          {/* 3. How we use information */}
          <section>
            <h2 className="mb-4 font-headline text-xl font-bold text-white md:text-2xl">
              3. How we use your information
            </h2>
            <p className="mb-3">We use the information above to:</p>
            <ul className="list-disc space-y-2 pl-6 marker:text-white/40">
              <li>Create and secure your account and keep you signed in</li>
              <li>
                Show daily horoscopes and related content for the zodiac sign you
                select
              </li>
              <li>
                Store your reading history and preferences across sessions
              </li>
              <li>
                Operate, maintain, and improve the app, including troubleshooting
                and analytics in aggregated or de-identified form where possible
              </li>
              <li>
                Communicate with you about support, security, or important updates
                to this policy or the service
              </li>
              <li>
                Comply with applicable law and respond to lawful requests from
                authorities
              </li>
            </ul>
            <p className="mt-4">
              We do <strong className="font-semibold text-white">not</strong> sell
              your personal information for third-party advertising as traditionally
              understood. We do not use your data to build advertising profiles for
              unrelated companies.
            </p>
          </section>

          {/* 4. AI processing */}
          <section>
            <h2 className="mb-4 font-headline text-xl font-bold text-white md:text-2xl">
              4. AI-generated content
            </h2>
            <p className="mb-4">
              Horoscope text may be created or refined using automated systems,
              including machine learning or large language models. Processing may
              involve sending limited inputs (such as your sign and date context)
              to our backend or subprocessors to generate text. Outputs are for
              entertainment and should not be relied on as factual or professional
              guidance.
            </p>
            <p>
              We implement safeguards appropriate to the service, including
              access controls and agreements with vendors where applicable. We may
              use aggregated or de-identified data to improve quality and safety.
            </p>
          </section>

          {/* 5. Sharing */}
          <section>
            <h2 className="mb-4 font-headline text-xl font-bold text-white md:text-2xl">
              5. How we share information
            </h2>
            <p className="mb-3">
              We share personal information only as needed to run {site.name}, or
              as required by law. This may include:
            </p>
            <ul className="list-disc space-y-2 pl-6 marker:text-white/40">
              <li>
                <strong className="font-medium text-white/95">Authentication providers</strong>{" "}
                (for example Google / Firebase) that process sign-in on our behalf
              </li>
              <li>
                <strong className="font-medium text-white/95">Cloud hosting and infrastructure</strong>{" "}
                providers that store data and serve our API
              </li>
              <li>
                <strong className="font-medium text-white/95">Analytics or crash reporting</strong>{" "}
                tools, configured to minimize personal data where we can
              </li>
              <li>
                Professional advisers, regulators, or law enforcement when we
                believe disclosure is necessary to protect rights, safety, or
                comply with legal process
              </li>
            </ul>
            <p className="mt-4">
              Each provider is required to use your information only for the
              purposes we specify and subject to appropriate safeguards.
            </p>
          </section>

          {/* 6. Retention */}
          <section>
            <h2 className="mb-4 font-headline text-xl font-bold text-white md:text-2xl">
              6. Data retention
            </h2>
            <p className="mb-4">
              We keep your information only as long as needed to provide the
              service, meet legal obligations, resolve disputes, and enforce our
              agreements. When data is no longer needed, we delete or anonymize it
              in line with our internal schedules, subject to backup and legal
              retention requirements.
            </p>
          </section>

          {/* 7. Security */}
          <section>
            <h2 className="mb-4 font-headline text-xl font-bold text-white md:text-2xl">
              7. Security
            </h2>
            <p>
              We use technical and organizational measures designed to protect
              your information against unauthorized access, loss, or misuse. No
              method of transmission over the internet is 100% secure; we
              encourage you to use a strong, unique password where applicable and
              to keep your device and sign-in methods secure.
            </p>
          </section>

          {/* 8. Your rights */}
          <section>
            <h2 className="mb-4 font-headline text-xl font-bold text-white md:text-2xl">
              8. Your rights and choices
            </h2>
            <p className="mb-3">
              Depending on where you live, you may have rights to:
            </p>
            <ul className="list-disc space-y-2 pl-6 marker:text-white/40">
              <li>Access or receive a copy of your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account or certain data</li>
              <li>Object to or restrict certain processing</li>
              <li>Withdraw consent where processing is based on consent</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at{" "}
              <a
                className="font-semibold text-primary underline-offset-2 hover:underline"
                href={`mailto:${site.contactEmail}`}
              >
                {site.contactEmail}
              </a>
              . We may need to verify your identity before fulfilling a request.
            </p>
          </section>

          {/* 9. Children */}
          <section>
            <h2 className="mb-4 font-headline text-xl font-bold text-white md:text-2xl">
              9. Children&apos;s privacy
            </h2>
            <p>
              {site.name} is not directed at children under 13 (or the minimum age
              required in your region). We do not knowingly collect personal
              information from children. If you believe we have collected data from
              a child, please contact us and we will take steps to delete it.
            </p>
          </section>

          {/* 10. International */}
          <section>
            <h2 className="mb-4 font-headline text-xl font-bold text-white md:text-2xl">
              10. International transfers
            </h2>
            <p>
              Your information may be processed in countries other than where you
              live, including where our servers or service providers operate. When
              we transfer data across borders, we use appropriate safeguards as
              required by applicable law (such as contractual clauses).
            </p>
          </section>

          {/* 11. Changes */}
          <section>
            <h2 className="mb-4 font-headline text-xl font-bold text-white md:text-2xl">
              11. Changes to this policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will post
              the new version on this page and update the &ldquo;Last updated&rdquo;
              date. If changes are material, we will provide additional notice as
              appropriate (for example, in-app or by email). Continued use of{" "}
              {site.name} after changes means you accept the updated policy.
            </p>
          </section>

          {/* 12. Contact */}
          <section className="rounded-xl border border-white/10 bg-black p-6 md:p-8">
            <h2 className="mb-3 font-headline text-xl font-bold text-white md:text-2xl">
              12. Contact us
            </h2>
            <p className="text-white/80">
              If you have questions about this Privacy Policy or our data
              practices, contact us at{" "}
              <a
                className="font-semibold text-primary underline-offset-2 hover:underline"
                href={`mailto:${site.contactEmail}`}
              >
                {site.contactEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
