import React, { useEffect, useState, memo } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface GitHubEvent {
  created_at: string;
  type: string;
}

interface ChartData {
  date: string;
  count: number;
}

const GitHubActivityChart: React.FC<{ username: string }> = memo(({ username }) => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubActivity = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${username}/events?per_page=100`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch GitHub data");
        }

        const events: GitHubEvent[] = await response.json();

        // Group events by date
        const activityByDate: Record<string, number> = {};

        events.forEach((event) => {
          const date = new Date(event.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
          activityByDate[date] = (activityByDate[date] || 0) + 1;
        });

        // Convert to chart data format (last 30 data points)
        const chartData: ChartData[] = Object.entries(activityByDate)
          .map(([date, count]) => ({ date, count }))
          .reverse()
          .slice(0, 30);

        setData(chartData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    };

    fetchGitHubActivity();
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400">
        Loading activity...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400">
        Unable to load GitHub activity
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#dd7bbb" />
              <stop offset="33%" stopColor="#d79f1e" />
              <stop offset="66%" stopColor="#5a922c" />
              <stop offset="100%" stopColor="#4c7894" />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            stroke="#52525b"
            tick={{ fill: "#a1a1aa", fontSize: 10 }}
            tickLine={false}
          />
          <YAxis
            stroke="#52525b"
            tick={{ fill: "#a1a1aa", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "8px",
              color: "#fff",
            }}
            labelStyle={{ color: "#a1a1aa" }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="url(#lineGradient)"
            strokeWidth={2}
            dot={false}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default GitHubActivityChart;
