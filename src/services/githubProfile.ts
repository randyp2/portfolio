const PUBLIC_ACTIVITY_DAYS = 35;
const GITHUB_API_PATH = "/api/github-activity";

export type ActivityLevel = 0 | 1 | 2 | 3 | 4;
export type ActivitySource = "contributions" | "public-events";

export interface ActivityDay {
  count: number;
  date: string;
  level: ActivityLevel;
}

export interface GitHubRepository {
  description: string | null;
  forks: number;
  language: string | null;
  name: string;
  pushedAt: string;
  stars: number;
  topics: string[];
  url: string;
}

export interface GitHubProfile {
  days: ActivityDay[];
  latestActivityDate: string | null;
  recentRepositories: GitHubRepository[];
  source: ActivitySource;
  total: number;
  username: string;
}

interface PublicGitHubEvent {
  created_at: string;
}

const profileRequests = new Map<
  string,
  Promise<GitHubProfile>
>();

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isActivityLevel = (value: unknown): value is ActivityLevel =>
  Number.isInteger(value) &&
  typeof value === "number" &&
  value >= 0 &&
  value <= 4;

const parseRepository = (
  value: unknown,
): GitHubRepository | null => {
  if (value === null) return null;

  if (
    !isRecord(value) ||
    (value.description !== null &&
      typeof value.description !== "string") ||
    typeof value.forks !== "number" ||
    (value.language !== null && typeof value.language !== "string") ||
    typeof value.name !== "string" ||
    typeof value.pushedAt !== "string" ||
    typeof value.stars !== "number" ||
    !Array.isArray(value.topics) ||
    !value.topics.every((topic) => typeof topic === "string") ||
    typeof value.url !== "string"
  ) {
    throw new Error("Invalid GitHub repository response.");
  }

  return {
    description: value.description,
    forks: value.forks,
    language: value.language,
    name: value.name,
    pushedAt: value.pushedAt,
    stars: value.stars,
    topics: value.topics,
    url: value.url,
  };
};

const parsePublicRepository = (
  value: unknown,
): GitHubRepository | null => {
  if (
    !isRecord(value) ||
    value.archived !== false ||
    value.fork !== false ||
    (value.description !== null &&
      typeof value.description !== "string") ||
    typeof value.forks_count !== "number" ||
    typeof value.html_url !== "string" ||
    (value.language !== null && typeof value.language !== "string") ||
    typeof value.name !== "string" ||
    typeof value.pushed_at !== "string" ||
    typeof value.stargazers_count !== "number" ||
    (typeof value.topics !== "undefined" &&
      (!Array.isArray(value.topics) ||
        !value.topics.every((topic) => typeof topic === "string")))
  ) {
    return null;
  }

  return {
    description: value.description,
    forks: value.forks_count,
    language: value.language,
    name: value.name,
    pushedAt: value.pushed_at,
    stars: value.stargazers_count,
    topics: value.topics ?? [],
    url: value.html_url,
  };
};

const parseProfileResponse = (value: unknown): GitHubProfile => {
  if (
    !isRecord(value) ||
    !Array.isArray(value.days) ||
    typeof value.total !== "number" ||
    typeof value.username !== "string" ||
    value.source !== "contributions"
  ) {
    throw new Error("Invalid GitHub profile response.");
  }

  const days = value.days.map((day): ActivityDay => {
    if (
      !isRecord(day) ||
      typeof day.count !== "number" ||
      typeof day.date !== "string" ||
      !isActivityLevel(day.level)
    ) {
      throw new Error("Invalid GitHub activity day.");
    }

    return {
      count: day.count,
      date: day.date,
      level: day.level,
    };
  });
  const legacyRepository = Array.isArray(value.recentRepositories)
    ? null
    : parseRepository(value.latestRepository);
  const recentRepositories = Array.isArray(value.recentRepositories)
    ? value.recentRepositories.map(parseRepository)
    : legacyRepository
      ? [legacyRepository]
      : [];

  if (recentRepositories.some((repository) => repository === null)) {
    throw new Error("Invalid recent GitHub repositories response.");
  }

  return {
    days,
    latestActivityDate:
      typeof value.latestActivityDate === "string"
        ? value.latestActivityDate
        : null,
    recentRepositories: recentRepositories.filter(
      (repository): repository is GitHubRepository =>
        repository !== null,
    ),
    source: value.source,
    total: value.total,
    username: value.username,
  };
};

const getActivityLevel = (count: number): ActivityLevel => {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
};

const createPublicActivityFallback = (
  events: PublicGitHubEvent[],
  recentRepositories: GitHubRepository[],
  username: string,
): GitHubProfile => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const rangeStart = new Date(today);
  rangeStart.setUTCDate(
    today.getUTCDate() -
      today.getUTCDay() -
      (PUBLIC_ACTIVITY_DAYS - 7),
  );

  const countsByDate = new Map<string, number>();
  events.forEach((event) => {
    const date = new Date(event.created_at);
    if (Number.isNaN(date.getTime())) return;

    const dateKey = date.toISOString().slice(0, 10);
    countsByDate.set(dateKey, (countsByDate.get(dateKey) ?? 0) + 1);
  });

  const days = Array.from(
    { length: PUBLIC_ACTIVITY_DAYS },
    (_, index): ActivityDay => {
      const date = new Date(rangeStart);
      date.setUTCDate(rangeStart.getUTCDate() + index);
      const dateKey = date.toISOString().slice(0, 10);
      const count = countsByDate.get(dateKey) ?? 0;

      return {
        count,
        date: dateKey,
        level: getActivityLevel(count),
      };
    },
  );
  const latestActivityDate =
    [...days].reverse().find((day) => day.count > 0)?.date ?? null;

  return {
    days,
    latestActivityDate,
    recentRepositories,
    source: "public-events",
    total: days.reduce((total, day) => total + day.count, 0),
    username,
  };
};

const fetchPublicEvents = async (
  username: string,
): Promise<PublicGitHubEvent[]> => {
  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(
      username,
    )}/events/public?per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Unable to load public GitHub activity.");
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Invalid public GitHub activity response.");
  }

  return payload.flatMap((event): PublicGitHubEvent[] => {
    if (
      !isRecord(event) ||
      typeof event.created_at !== "string"
    ) {
      return [];
    }
    return [{ created_at: event.created_at }];
  });
};

const fetchPublicRepositories = async (
  username: string,
): Promise<GitHubRepository[]> => {
  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(
      username,
    )}/repos?sort=pushed&direction=desc&per_page=10&type=owner`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!response.ok) {
    return [];
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .map(parsePublicRepository)
    .filter(
      (repository): repository is GitHubRepository =>
        repository !== null,
    )
    .slice(0, 2);
};

const fetchPublicProfile = async (
  username: string,
): Promise<GitHubProfile> => {
  const [events, recentRepositories] = await Promise.all([
    fetchPublicEvents(username),
    fetchPublicRepositories(username),
  ]);

  return createPublicActivityFallback(
    events,
    recentRepositories,
    username,
  );
};

const fetchGitHubProfile = async (
  username: string,
): Promise<GitHubProfile> => {
  try {
    const response = await fetch(GITHUB_API_PATH, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("GitHub portfolio data is unavailable.");
    }

    return parseProfileResponse(await response.json());
  } catch {
    return fetchPublicProfile(username);
  }
};

/**
 * Loads and deduplicates GitHub data shared by repository and activity previews.
 */
export const loadGitHubProfile = (
  username: string,
): Promise<GitHubProfile> => {
  const existingRequest = profileRequests.get(username);
  if (existingRequest) return existingRequest;

  const request = fetchGitHubProfile(username).catch(
    (error: unknown) => {
      profileRequests.delete(username);
      throw error;
    },
  );
  profileRequests.set(username, request);
  return request;
};
