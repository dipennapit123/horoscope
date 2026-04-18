"use client";

import { useMemo, useState } from "react";
import { site } from "@/src/content/site";

function encodeMailto(value: string) {
  return encodeURIComponent(value).replace(/%20/g, "+");
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-on-surface placeholder:text-outline outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/50";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const mailto = useMemo(() => {
    const subject = `${site.name} inquiry${name ? ` — ${name}` : ""}`;
    const body = [
      message ? message.trim() : "",
      "",
      "---",
      name ? `Name: ${name}` : "",
      email ? `Email: ${email}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    return `mailto:${site.contactEmail}?subject=${encodeMailto(
      subject,
    )}&body=${encodeMailto(body)}`;
  }, [email, message, name]);

  return (
    <form
      className="glass-panel relative z-10 rounded-2xl border border-outline-variant/15 p-8 shadow-2xl md:p-12"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = mailto;
      }}
    >
      <h2 className="mb-8 font-headline text-3xl font-bold">Send a Transmission</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="ml-1 font-label text-sm text-on-surface-variant">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Orion Pax"
              type="text"
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="ml-1 font-label text-sm text-on-surface-variant">
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="orion@nebula.io"
              type="email"
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="ml-1 font-label text-sm text-on-surface-variant">
            Your Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your cosmic journey..."
            rows={5}
            required
            className={`${inputClass} resize-none`}
          />
        </div>

        <button
          type="submit"
          className="cosmic-gradient-btn group flex w-full items-center justify-center gap-2 rounded-xl py-4 font-headline text-lg font-black text-on-primary-fixed shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          Send Message
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
            send
          </span>
        </button>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-outline-variant/10 pt-8 text-xs text-on-surface-variant">
        <p>Average response time: 2 light-hours</p>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
          <span>System Status: Optimal</span>
        </div>
      </div>
    </form>
  );
}
