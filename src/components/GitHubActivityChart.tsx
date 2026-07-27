import {
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import {
  loadGitHubProfile,
  type GitHubProfile,
} from "../services/githubProfile";

interface GitHubActivityChartProps {
  username: string;
}

interface ActivityWaveStyle extends CSSProperties {
  "--github-activity-wave-delay": string;
}

const getActivityWaveStyle = (index: number): ActivityWaveStyle => {
  const column = Math.floor(index / 7);
  const row = index % 7;
  const waveCrest = Math.round(
    3 + Math.sin(column * 0.55) * 3,
  );
  const delay = 200 + column * 28 + Math.abs(row - waveCrest) * 12;

  return {
    "--github-activity-wave-delay": `${delay}ms`,
  };
};

const formatActivityDate = (date: string): string =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

/**
 * Renders a lazy-loaded, pixel-style GitHub activity calendar.
 */
const GitHubActivityChart: React.FC<GitHubActivityChartProps> = ({
  username,
}) => {
  const [activity, setActivity] = useState<GitHubProfile | null>(
    null,
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    let disposed = false;

    void loadGitHubProfile(username)
      .then((nextActivity) => {
        if (!disposed) setActivity(nextActivity);
      })
      .catch(() => {
        if (!disposed) setError(true);
      });

    return () => {
      disposed = true;
    };
  }, [username]);

  if (error) {
    return (
      <div className="github-activity-status" role="status">
        Activity unavailable. GitHub profile is still online.
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="github-activity-status" role="status">
        Loading GitHub activity<span className="terminal-cursor" />
      </div>
    );
  }

  const isContributionCalendar =
    activity.source === "contributions";
  const activityLabel = isContributionCalendar
    ? "contributions"
    : "public events";
  const rangeLabel = isContributionCalendar
    ? "Last 12 months"
    : "Last 5 weeks";
  const latestLabel = isContributionCalendar
    ? "Latest contribution"
    : "Latest public activity";

  return (
    <section className="github-activity-card" aria-live="polite">
      <header className="github-activity-header">
        <div>
          <p>GitHub activity</p>
          <small>{rangeLabel}</small>
        </div>
        <p className="github-activity-total">
          <strong>{activity.total.toLocaleString()}</strong>
          <span>{activityLabel}</span>
        </p>
      </header>

      <div className="github-activity-scroll">
        <div
          className="github-activity-grid"
          data-source={activity.source}
          role="img"
          aria-label={`${activity.total.toLocaleString()} ${activityLabel} in the ${rangeLabel.toLowerCase()}`}
        >
          {activity.days.map((day, index) => (
            <span
              key={day.date}
              className="github-activity-day"
              data-level={day.level}
              style={getActivityWaveStyle(index)}
              title={`${formatActivityDate(day.date)}: ${day.count} ${
                day.count === 1
                  ? activityLabel.replace(/s$/, "")
                  : activityLabel
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <footer className="github-activity-footer">
        <span>
          {activity.latestActivityDate
            ? `${latestLabel}: ${formatActivityDate(
                activity.latestActivityDate,
              )}`
            : "No recent public activity"}
        </span>
        <a
          href={`https://github.com/${encodeURIComponent(username)}`}
          target="_blank"
          rel="noreferrer"
        >
          View profile <span aria-hidden="true">&gt;</span>
        </a>
      </footer>
    </section>
  );
};

export default GitHubActivityChart;
