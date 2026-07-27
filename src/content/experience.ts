export interface ExperienceTimelineItem {
  organization: string;
  period: string;
  role: string;
  summary: string;
  technologies: readonly string[];
}

/**
 * Temporary timeline copy based on the roles already represented in the portfolio.
 */
export const EXPERIENCE_TIMELINE: readonly ExperienceTimelineItem[] = [
  {
    organization: "CRJ Services",
    period: "2025 - Present",
    role: "Full-Stack Lead Developer",
    summary:
      "Leading development of a full-stack booking platform for a local accounting firm.",
    technologies: [
      "React",
      "Spring Boot",
      "PostgreSQL",
      "Docker",
    ],
  },
  {
    organization: "UNLV Academic Success Center",
    period: "2024 - Present",
    role: "Computer Science Tutor",
    summary:
      "Helping students build confidence in programming, data structures, and algorithms.",
    technologies: ["C++", "Python", "Data Structures"],
  },
  {
    organization: "Nevada Help Desk",
    period: "Summer 2022",
    role: "Frontend Intern",
    summary:
      "Collaborated with a development team to build websites for local organizations.",
    technologies: ["JavaScript", "HTML", "CSS", "WordPress"],
  },
] as const;
