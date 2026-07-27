import { ExternalLink, Youtube } from "lucide-react";

interface YouTubeVideo {
  embedUrl: string;
  href: string;
  id: string;
}

const YOUTUBE_VIDEOS: readonly YouTubeVideo[] = [
  {
    embedUrl:
      "https://www.youtube.com/embed/rrazy7TObhw?si=KlGeDGqXG0ADT8wu",
    href: "https://youtu.be/rrazy7TObhw?si=KlGeDGqXG0ADT8wu",
    id: "01",
  },
  {
    embedUrl:
      "https://www.youtube.com/embed/wuXumuGIS5s?si=BfnAggARCO5xXwWR",
    href: "https://youtu.be/wuXumuGIS5s?si=BfnAggARCO5xXwWR",
    id: "02",
  },
] as const;

interface YouTubeVideoCardProps {
  video: YouTubeVideo;
}

const YouTubeVideoCard: React.FC<YouTubeVideoCardProps> = ({
  video,
}) => (
  <article className="youtube-video-card">
    <header>
      <span>Video {video.id}</span>
      <span aria-label="Ready to play">
        <i aria-hidden="true" />
        Ready
      </span>
    </header>
    <div className="youtube-video-frame">
      <iframe
        src={video.embedUrl}
        title={`Randy Pahang YouTube video ${video.id}`}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
    <a href={video.href} target="_blank" rel="noreferrer">
      Watch on YouTube
      <ExternalLink aria-hidden="true" />
    </a>
  </article>
);

/**
 * Renders the channel introduction beneath the Find Me heading.
 */
export const YouTubeHeadingPreview: React.FC = () => (
  <a
    id="youtube-channel-card"
    className="youtube-heading-channel"
    href="https://www.youtube.com/@randypahang6873"
    target="_blank"
    rel="noreferrer"
  >
    <header>
      <span className="youtube-heading-channel-icon" aria-hidden="true">
        <Youtube />
      </span>
      <span>
        <small>YouTube channel</small>
        <strong>@randypahang6873</strong>
      </span>
      <ExternalLink aria-hidden="true" />
    </header>

    <p>
      I record my journey as I go, working through LeetCode, building
      projects, and practicing system design in public.
    </p>

    <span className="youtube-heading-channel-action">
      Visit channel <span aria-hidden="true">&gt;</span>
    </span>
  </a>
);

/**
 * Renders both featured videos below the social links.
 */
export const YouTubeChannelPreview: React.FC = () => (
  <section
    id="youtube-channel-preview"
    className="youtube-channel-preview"
    aria-label="Featured YouTube videos"
  >
    <div className="youtube-embedded-grid">
      {YOUTUBE_VIDEOS.map((video) => (
        <YouTubeVideoCard video={video} key={video.id} />
      ))}
    </div>
  </section>
);
