import React, { useEffect, useState, memo, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface GitHubEvent {
  created_at: string;
  type: string;
}

interface ChartData {
  date: string;
  count: number;
}

const GitHubActivityChart: React.FC<{ username: string }> = memo(
  ({ username }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchGitHubActivity = async () => {
        try {
          const response = await fetch(
            `https://api.github.com/users/${username}/events?per_page=100`,
          );

          if (!response.ok) {
            throw new Error("Failed to fetch GitHub data");
          }

          const events: GitHubEvent[] = await response.json();

          // Group events by date
          const activityByDate: Record<string, number> = {};

          events.forEach((event) => {
            const date = new Date(event.created_at).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
              },
            );
            activityByDate[date] = (activityByDate[date] || 0) + 1;
          });

          // Convert to chart data format (last 30 data points)
          const chartData: ChartData[] = Object.entries(activityByDate)
            .map(([date, count]) => ({ date, count }))
            .reverse()
            .slice(0, 30);

          // console.log("[GitHubActivityChart] fetched events", {
          //   username,
          //   eventsCount: events.length,
          //   chartPoints: chartData.length,
          // });
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

    // Guard against zero-size containers which Recharts treats as -1 width/height
    const containerRect = containerRef.current?.getBoundingClientRect();
    const hasSize =
      containerRect && containerRect.width > 0 && containerRect.height > 0;
    if (!hasSize) {
      console.warn(
        "[GitHubActivityChart] no measurable size, skipping render",
        {
          width: containerRect?.width,
          height: containerRect?.height,
        },
      );
    }

    return (
      <div ref={containerRef} className="w-full h-full min-h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
                <stop offset="50%" stopColor="rgba(255, 255, 255, 1)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
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
  },
);

export default GitHubActivityChart;
