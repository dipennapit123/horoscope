"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Card } from "@/components/ui";

interface QuoteRow {
  id: string;
  body: string;
  isActive: boolean;
  createdAt: string;
}

interface NotificationSnapshot {
  nextPillar: string;
  campaignUpdatedAt: string | null;
  devicesWithPushToken: number;
  usersEligibleForPillarPush: number;
  activeQuote: {
    id: string;
    body: string;
    createdAt: string;
  } | null;
}

function fmtWhen(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function MotivationalNotificationsPage() {
  const [snapshot, setSnapshot] = useState<NotificationSnapshot | null>(null);
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [newQuote, setNewQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const loadSnapshotOnly = async () => {
    try {
      const stateRes = await api.get<NotificationSnapshot>(
        "/admin/notifications/state",
      );
      const snap = stateRes.data;
      setSnapshot(snap ?? null);
    } catch {
      setSnapshot(null);
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      await loadSnapshotOnly();
      const quotesRes = await api.get<QuoteRow[]>("/admin/quotes");
      const list = quotesRes.data;
      setQuotes(Array.isArray(list) ? list : []);
    } catch {
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const sendQuote = async () => {
    setSending(true);
    setMsg(null);
    try {
      const res = await api.post<{
        sent: number;
        expoTicketsAccepted: number;
        expoTicketErrors: string[];
      }>("/admin/notifications/quote", {});
      const d = res.data;
      const errNote =
        d?.expoTicketErrors?.length > 0
          ? `\n\nExpo push tickets: ${d.expoTicketsAccepted ?? 0} accepted, ${d.expoTicketErrors.length} error(s):\n${d.expoTicketErrors.slice(0, 5).join("\n")}${d.expoTicketErrors.length > 5 ? "\n…" : ""}`
          : "";
      setMsg(
        `Queued ${d?.sent ?? 0} motivational notification(s). Expo accepted ${d?.expoTicketsAccepted ?? 0} ticket(s).${errNote}`,
      );
      await loadSnapshotOnly();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed to send.");
    } finally {
      setSending(false);
    }
  };

  const addQuote = async () => {
    if (!newQuote.trim()) return;
    setMsg(null);
    try {
      await api.post("/admin/quotes", { body: newQuote.trim() });
      setNewQuote("");
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed to add quote.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Motivational notifications
        </h1>
        <p className="text-sm text-muted-foreground">
          Broadcast the active motivational quote to every registered Expo token
          (signed in or not).
        </p>
      </div>
      {msg && (
        <p className="text-sm text-emerald-400/90 whitespace-pre-wrap">{msg}</p>
      )}
      <Card className="p-6 border-[#7f13ec]/25">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium">Broadcast reach</h2>
            <p className="text-sm text-muted-foreground">
              Tokens that will receive motivational pushes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadSnapshotOnly()}
            disabled={loading}
            className="text-sm text-[#c4b5fd] underline-offset-2 hover:underline shrink-0 disabled:opacity-50"
          >
            Refresh status
          </button>
        </div>
        {loading && !snapshot ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : snapshot ? (
          <dl className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="rounded-lg border border-white/10 bg-black/20 px-4 py-3">
              <dt className="text-muted-foreground font-medium">
                Distinct push tokens
              </dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                {snapshot.devicesWithPushToken}
              </dd>
              <p className="mt-1 text-xs text-slate-500">
                Anonymous installs plus signed-in users (deduped).
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/20 px-4 py-3 sm:col-span-2">
              <dt className="text-muted-foreground font-medium">
                Active quote for broadcast
              </dt>
              <dd className="mt-2 text-slate-200 whitespace-pre-wrap">
                {snapshot.activeQuote ? (
                  <>
                    <span className="text-xs text-slate-500 block mb-1">
                      Added {fmtWhen(snapshot.activeQuote.createdAt)}
                    </span>
                    {snapshot.activeQuote.body.length > 400
                      ? `${snapshot.activeQuote.body.slice(0, 400)}…`
                      : snapshot.activeQuote.body}
                  </>
                ) : (
                  <span className="text-amber-400/90">
                    No active quote — add one below or activate a quote in the
                    database.
                  </span>
                )}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-muted-foreground">
            Could not load notification status.
          </p>
        )}
      </Card>
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-2">Send motivational notification</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Sends the latest active quote to all distinct tokens shown above.
        </p>
        <button
          type="button"
          onClick={() => void sendQuote()}
          disabled={sending}
          className="rounded-lg bg-[#7f13ec] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send motivational notification"}
        </button>
      </Card>
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Quotes library</h2>
        <div className="flex flex-col gap-3 md:flex-row md:items-start mb-4">
          <textarea
            value={newQuote}
            onChange={(e) => setNewQuote(e.target.value)}
            placeholder="New motivational quote…"
            className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 min-h-[88px] w-full"
          />
          <button
            type="button"
            onClick={() => void addQuote()}
            className="rounded-lg bg-[#7f13ec] px-4 py-2 text-sm font-medium text-white shrink-0"
          >
            Add quote
          </button>
        </div>
        <ul className="space-y-2 text-sm text-slate-400">
          {quotes.map((q) => (
            <li
              key={q.id}
              className="border-b border-white/5 pb-2 text-slate-300"
            >
              {q.body.length > 160 ? `${q.body.slice(0, 160)}…` : q.body}
            </li>
          ))}
          {quotes.length === 0 && !loading && (
            <li className="text-slate-500">No quotes yet.</li>
          )}
        </ul>
      </Card>
    </div>
  );
}
