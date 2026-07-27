import { ExternalLink, GitFork, Star } from "lucide-react";
import { useEffect, useState } from "react";
import {
  loadGitHubProfile,
  type GitHubRepository,
} from "../services/githubProfile";

interface GitHubRecentRepositoriesProps {
  username: string;
}

const formatPushedAt = (pushedAt: string): string =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(pushedAt));

interface RepositoryCardProps {
  index: number;
  repository: GitHubRepository;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({
  index,
  repository,
}) => (
  <a
    className="github-repository-card"
    href={repository.url}
    target="_blank"
    rel="noreferrer"
  >
    <span className="github-repository-kicker">
      {index === 0 ? "Latest repository" : "Previous repository"}
    </span>

    <span className="github-repository-heading">
      <strong>{repository.name}</strong>
      <ExternalLink aria-hidden="true" />
    </span>

    <span className="github-repository-description">
      {repository.description ?? "No description provided."}
    </span>

    {repository.topics.length > 0 ? (
      <span className="github-repository-topics">
        {repository.topics.slice(0, 2).map((topic) => (
          <span key={topic}>{topic}</span>
        ))}
      </span>
    ) : null}

    <span className="github-repository-meta">
      {repository.language ? (
        <span>
          <i aria-hidden="true" />
          {repository.language}
        </span>
      ) : null}
      <span>
        <Star aria-hidden="true" />
        {repository.stars}
      </span>
      <span>
        <GitFork aria-hidden="true" />
        {repository.forks}
      </span>
    </span>

    <span className="github-repository-date">
      Pushed {formatPushedAt(repository.pushedAt)}
    </span>
  </a>
);

/**
 * Renders the two most recently pushed, non-fork GitHub repositories.
 */
const GitHubRecentRepositories: React.FC<
  GitHubRecentRepositoriesProps
> = ({ username }) => {
  const [repositories, setRepositories] = useState<
    GitHubRepository[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let disposed = false;

    void loadGitHubProfile(username)
      .then((profile) => {
        if (disposed) return;
        setRepositories(profile.recentRepositories);
        setIsLoading(false);
      })
      .catch(() => {
        if (disposed) return;
        setHasError(true);
        setIsLoading(false);
      });

    return () => {
      disposed = true;
    };
  }, [username]);

  if (isLoading) {
    return (
      <div className="github-repository-list">
        <div
          className="github-repository-card is-status"
          role="status"
        >
          Loading recent repositories
          <span className="terminal-cursor" />
        </div>
      </div>
    );
  }

  if (hasError || repositories.length === 0) {
    return (
      <div className="github-repository-list">
        <div
          className="github-repository-card is-status"
          role="status"
        >
          Recent repositories unavailable.
        </div>
      </div>
    );
  }

  return (
    <div className="github-repository-list">
      {repositories.slice(0, 2).map((repository, index) => (
        <RepositoryCard
          key={repository.url}
          index={index}
          repository={repository}
        />
      ))}
    </div>
  );
};

export default GitHubRecentRepositories;
