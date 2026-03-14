import type { DashboardStats } from "../types";
import { Card } from "./ui";

interface Props {
  stats: DashboardStats | null;
  loading: boolean;
}

export const StatsCards = ({ stats, loading }: Props) => {
  const skeleton = (
    <div className="h-16 w-full animate-pulse rounded-2xl bg-purple-900/30" />
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card className="p-4">
        <p className="text-xs text-muted-foreground">Total horoscopes</p>
        {loading || !stats ? (
          skeleton
        ) : (
          <p className="mt-2 text-2xl font-semibold">{stats.totalHoroscopes}</p>
        )}
      </Card>
      <Card className="p-4">
        <p className="text-xs text-muted-foreground">Published</p>
        {loading || !stats ? (
          skeleton
        ) : (
          <p className="mt-2 text-2xl font-semibold">
            {stats.publishedHoroscopes}
          </p>
        )}
      </Card>
      <Card className="p-4">
        <p className="text-xs text-muted-foreground">Drafts</p>
        {loading || !stats ? (
          skeleton
        ) : (
          <p className="mt-2 text-2xl font-semibold">
            {stats.draftHoroscopes}
          </p>
        )}
      </Card>
      <Card className="p-4">
        <p className="text-xs text-muted-foreground">Total users</p>
        {loading || !stats ? (
          skeleton
        ) : (
          <p className="mt-2 text-2xl font-semibold">{stats.totalUsers}</p>
        )}
      </Card>
    </div>
  );
};

