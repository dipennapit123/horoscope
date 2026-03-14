import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { api } from "../services/api";
import type { UserActivityResponse, UserActivityAction } from "../types";
import { Card } from "../components/ui";

const actionLabel: Record<UserActivityAction, string> = {
  APP_OPEN: "App open",
  HOROSCOPE_VIEW: "Horoscope view",
  ZODIAC_SELECTED: "Zodiac selected",
  SETTINGS_VIEW: "Settings view",
};

export const UserActivityPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [data, setData] = useState<UserActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/admin/users/${userId}/activity`, {
          params: { limit: 100 },
        });
        setData(res.data.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [userId]);

  if (!userId) {
    return (
      <div className="space-y-4">
        <Link to="/users" className="text-sm text-purple-400 hover:underline">
          ← Back to Users
        </Link>
        <p className="text-muted-foreground">Invalid user.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Link to="/users" className="text-sm text-purple-400 hover:underline">
          ← Back to Users
        </Link>
        <div className="h-48 animate-pulse rounded-xl bg-purple-900/20" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <Link to="/users" className="text-sm text-purple-400 hover:underline">
          ← Back to Users
        </Link>
        <p className="text-muted-foreground">User not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/users" className="text-sm text-purple-400 hover:underline">
          ← Back to Users
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">User activity</h1>
        <p className="text-sm text-muted-foreground">
          Activity for selected user (email: {data.user.email})
        </p>
      </div>

      <Card className="p-4">
        <h2 className="text-sm font-semibold text-muted-foreground mb-2">Profile</h2>
        <dl className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd>{data.user.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd>{data.user.fullName ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Zodiac sign</dt>
            <dd>{data.user.zodiacSign ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Timezone</dt>
            <dd>{data.user.timezone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Onboarded at</dt>
            <dd>{dayjs(data.user.onboardedAt).format("MMM D, YYYY HH:mm")}</dd>
          </div>
        </dl>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-purple-900/40 px-4 py-3">
          <h2 className="font-semibold">Activity log</h2>
          <p className="text-xs text-muted-foreground">
            Recent app opens, horoscope views and zodiac selections.
          </p>
        </div>
        {data.activities.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No activity recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-900/40 text-left text-muted-foreground">
                  <th className="p-3 font-medium">Time</th>
                  <th className="p-3 font-medium">Action</th>
                  <th className="p-3 font-medium">Session</th>
                  <th className="p-3 font-medium">Platform</th>
                  <th className="p-3 font-medium">App version</th>
                </tr>
              </thead>
              <tbody>
                {data.activities.map((a) => (
                  <tr key={a.id} className="border-b border-purple-900/20">
                    <td className="p-3 text-muted-foreground">
                      {dayjs(a.createdAt).format("MMM D, YYYY HH:mm:ss")}
                    </td>
                    <td className="p-3">{actionLabel[a.action]}</td>
                    <td className="p-3 text-muted-foreground font-mono text-xs">
                      {a.sessionId ? a.sessionId.slice(0, 12) + "…" : "—"}
                    </td>
                    <td className="p-3 text-muted-foreground">{a.platform ?? "—"}</td>
                    <td className="p-3 text-muted-foreground">{a.appVersion ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
