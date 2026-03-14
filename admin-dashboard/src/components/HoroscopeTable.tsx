import type { Horoscope } from "../types";
import dayjs from "dayjs";
import { Card, Button } from "./ui";
import { Link } from "react-router-dom";

interface Props {
  items: Horoscope[];
  loading: boolean;
  onView: (horoscope: Horoscope) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, isPublished: boolean) => void;
}

export const HoroscopeTable = ({
  items,
  loading,
  onView,
  onDelete,
  onTogglePublish,
}: Props) => {
  if (loading) {
    return (
      <Card className="p-4">
        <div className="h-28 animate-pulse rounded-2xl bg-purple-900/30" />
      </Card>
    );
  }

  if (!items.length) {
    return (
      <Card className="p-6 text-sm text-muted-foreground">
        No horoscopes found for the current filters.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-purple-900/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left">Zodiac</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((h) => (
            <tr key={h.id} className="border-t border-purple-900/30">
              <td className="px-4 py-3">{h.zodiacSign}</td>
              <td className="px-4 py-3">
                {dayjs(h.date).format("MMM D, YYYY")}
              </td>
              <td className="px-4 py-3">{h.title}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    h.isPublished
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-yellow-500/10 text-yellow-300"
                  }`}
                >
                  {h.isPublished ? "Published" : "Draft"}
                </span>
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                <Button
                  type="button"
                  className="px-3 py-1 text-xs bg-transparent border border-purple-400/50"
                  onClick={() => onView(h)}
                >
                  View
                </Button>
                <Link to={`/horoscopes/${h.id}`}>
                  <Button className="px-3 py-1 text-xs">Edit</Button>
                </Link>
                <Button
                  type="button"
                  className="px-3 py-1 text-xs bg-transparent border border-purple-400/50"
                  onClick={() => onTogglePublish(h.id, !h.isPublished)}
                >
                  {h.isPublished ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  type="button"
                  className="px-3 py-1 text-xs bg-transparent border border-red-400/50 text-red-200"
                  onClick={() => onDelete(h.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

