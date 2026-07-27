const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const GITHUB_USERNAME = "randyp2";
const CACHE_MAX_AGE_SECONDS = 21_600;
const CACHE_STALE_SECONDS = 86_400;
const CONTRIBUTION_RANGE_DAYS = 364;

type ContributionLevel = 0 | 1 | 2 | 3 | 4;

interface ApiRequest {
  method?: string;
}

interface ApiResponse {
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
  status: (statusCode: number) => ApiResponse;
}

interface GitHubContributionDay {
  contributionCount: number;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
  date: string;
}

interface GitHubGraphQlResponse {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: GitHubContributionDay[];
          }[];
        };
      };
      repositories: {
        nodes: (GitHubRepositoryNode | null)[];
      };
    } | null;
  };
  errors?: { message: string }[];
}

interface GitHubRepositoryNode {
  description: string | null;
  forkCount: number;
  isArchived: boolean;
  isFork: boolean;
  name: string;
  primaryLanguage: {
    name: string;
  } | null;
  pushedAt: string | null;
  repositoryTopics: {
    nodes: {
      topic: {
        name: string;
      };
    }[];
  };
  stargazerCount: number;
  url: string;
}

type ActiveGitHubRepositoryNode = GitHubRepositoryNode & {
  pushedAt: string;
};

const normalizeRepository = (
  repository: ActiveGitHubRepositoryNode,
) => ({
  description: repository.description,
  forks: repository.forkCount,
  language: repository.primaryLanguage?.name ?? null,
  name: repository.name,
  pushedAt: repository.pushedAt,
  stars: repository.stargazerCount,
  topics: repository.repositoryTopics.nodes.map(
    ({ topic }) => topic.name,
  ),
  url: repository.url,
});

const CONTRIBUTION_LEVELS: Record<
  GitHubContributionDay["contributionLevel"],
  ContributionLevel
> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const CONTRIBUTION_QUERY = `
  query PortfolioContributions(
    $login: String!
    $from: DateTime!
    $to: DateTime!
  ) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              contributionLevel
              date
            }
          }
        }
      }
      repositories(
        first: 10
        ownerAffiliations: OWNER
        privacy: PUBLIC
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        nodes {
          description
          forkCount
          isArchived
          isFork
          name
          primaryLanguage {
            name
          }
          pushedAt
          repositoryTopics(first: 5) {
            nodes {
              topic {
                name
              }
            }
          }
          stargazerCount
          url
        }
      }
    }
  }
`;

/**
 * Returns Randy's normalized GitHub contribution calendar.
 */
export default async function githubActivityHandler(
  request: ApiRequest,
  response: ApiResponse,
): Promise<void> {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    response.status(503).json({
      error: "GitHub activity is not configured.",
    });
    return;
  }

  const to = new Date();
  const from = new Date(
    to.getTime() - CONTRIBUTION_RANGE_DAYS * 24 * 60 * 60 * 1000,
  );

  try {
    const githubResponse = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "randypahangii-portfolio",
      },
      body: JSON.stringify({
        query: CONTRIBUTION_QUERY,
        variables: {
          from: from.toISOString(),
          login: GITHUB_USERNAME,
          to: to.toISOString(),
        },
      }),
    });

    if (!githubResponse.ok) {
      throw new Error(
        `GitHub returned status ${githubResponse.status}.`,
      );
    }

    const githubPayload =
      (await githubResponse.json()) as GitHubGraphQlResponse;
    const calendar =
      githubPayload.data?.user?.contributionsCollection
        .contributionCalendar;
    const repositories = githubPayload.data?.user?.repositories.nodes;

    if (!calendar || !repositories || githubPayload.errors?.length) {
      throw new Error("GitHub returned incomplete portfolio data.");
    }

    const days = calendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        count: day.contributionCount,
        date: day.date,
        level: CONTRIBUTION_LEVELS[day.contributionLevel],
      })),
    );
    const latestActiveDay = days.findLast((day) => day.count > 0);
    const recentRepositories = repositories
      .filter(
        (repository): repository is ActiveGitHubRepositoryNode =>
          repository !== null &&
          !repository.isArchived &&
          !repository.isFork &&
          repository.pushedAt !== null,
      )
      .slice(0, 2)
      .map(normalizeRepository);

    response.setHeader(
      "Cache-Control",
      `s-maxage=${CACHE_MAX_AGE_SECONDS}, stale-while-revalidate=${CACHE_STALE_SECONDS}`,
    );
    response.status(200).json({
      days,
      latestActivityDate: latestActiveDay?.date ?? null,
      latestRepository: recentRepositories[0] ?? null,
      recentRepositories,
      range: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
      source: "contributions",
      total: calendar.totalContributions,
      username: GITHUB_USERNAME,
    });
  } catch (error: unknown) {
    console.error("Unable to load GitHub activity.", error);
    response.status(502).json({
      error: "GitHub activity is temporarily unavailable.",
    });
  }
}
