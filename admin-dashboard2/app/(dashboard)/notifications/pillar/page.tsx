"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Card } from "@/components/ui";

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

export default function PillarNotificationsPage() {
  const [nextPillar, setNextPillar] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<NotificationSnapshot | null>(null);
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
      setNextPillar(snap?.nextPillar ?? null);
    } catch {
      setNextPillar(null);
      setSnapshot(null);
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      await loadSnapshotOnly();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const sendPillar = async () => {
    setSending(true);
    setMsg(null);
    try {
      const res = await api.post<{
        sent: number;
        pillar: string;
        nextPillar: string;
        expoTicketsAccepted: number;
        expoTicketErrors: string[];
      }>("/admin/notifications/pillar", {});
      const d = res.data;
      const errNote =
        d?.expoTicketErrors?.length > 0
          ? `\n\nExpo push tickets: ${d.expoTicketsAccepted ?? 0} accepted, ${d.expoTicketErrors.length} error(s):\n${d.expoTicketErrors.slice(0, 5).join("\n")}${d.expoTicketErrors.length > 5 ? "\n…" : ""}`
          : "";
      setMsg(
        `Queued ${d?.sent ?? 0} notification(s) for pillar ${d?.pillar ?? "—"}. Expo accepted ${d?.expoTicketsAccepted ?? 0} ticket(s). Next pillar: ${d?.nextPillar ?? "—"}.${errNote}`,
      );
      setNextPillar(d?.nextPillar ?? null);
      await loadSnapshotOnly();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed to send.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Pillar notifications
        </h1>
        <p className="text-sm text-muted-foreground">
          Send horoscope pillar snippets (wealth, love, health rotation) to users
          with a push token and zodiac set.
        </p>
      </div>
      {msg && (
        <p className="text-sm text-emerald-400/90 whitespace-pre-wrap">{msg}</p>
      )}
      <Card className="p-6 border-[#7f13ec]/25">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium">Pillar campaign status</h2>
            <p className="text-sm text-muted-foreground">
              What is stored in the database for pillar rotation right now.
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
                Next pillar send
              </dt>
              <dd className="mt-1 text-lg font-semibold text-foreground">
                {snapshot.nextPillar}
              </dd>
              <p className="mt-1 text-xs text-slate-500">
                Rotates wealth → love → health after each pillar send.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/20 px-4 py-3">
              <dt className="text-muted-foreground font-medium">
                Campaign state last updated
              </dt>
              <dd className="mt-1 text-slate-200">
                {fmtWhen(snapshot.campaignUpdatedAt)}
              </dd>
              <p className="mt-1 text-xs text-slate-500">
                Updates when a pillar notification is sent successfully.
              </p>
            </div>
            <div className="sm:col-span-2 rounded-lg border border-white/10 bg-black/20 px-4 py-3">
              <dt className="text-muted-foreground font-medium">
                Eligible for pillar push
              </dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                {snapshot.usersEligibleForPillarPush}
              </dd>
              <p className="mt-1 text-xs text-slate-500">
                Has token + zodiac; horoscope text must exist for the pillar or
                they are skipped.
              </p>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-muted-foreground">
            Could not load notification status.
          </p>
        )}
      </Card>
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-2">Send pillar notification</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Next send uses:{" "}
          <strong className="text-foreground">
            {loading ? "…" : nextPillar ?? "—"}
          </strong>
          . Each successful send advances wealth → love → health.
        </p>
        <button
          type="button"
          onClick={() => void sendPillar()}
          disabled={sending}
          className="rounded-lg bg-[#7f13ec] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send pillar notification"}
        </button>
      </Card>
    </div>
  );
}
