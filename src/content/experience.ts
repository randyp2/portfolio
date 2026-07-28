export interface ExperiencePathItem {
  organization: string;
  period: string;
  role: string;
  summary: string;
  details: readonly string[];
  tags: readonly string[];
}

/**
 * Recent roles displayed along the non-linear experience path.
 */
export const EXPERIENCE_PATH: readonly ExperiencePathItem[] = [
  {
    organization: "Nevada Help Desk",
    period: "Summer 2022",
    role: "Frontend Intern",
    summary:
      "Learned mobile and web development while creating websites for local churches.",
    details: [
      "Developed an early foundation in Apple Swift and mobile application development.",
      "Built websites for local churches using HTML, CSS, JavaScript, and WordPress.",
    ],
    tags: [
      "Swift",
      "Mobile development",
      "HTML / CSS / JS",
      "WordPress",
    ],
  },
  {
    organization: "UNLV Academic Success Center",
    period: "2024 - 2025",
    role: "Computer Science Tutor",
    summary:
      "Helped UNLV students work through challenging computer science concepts while strengthening my communication skills.",
    details: [
      "Adapted explanations to different learning styles and made technical concepts easier to approach.",
      "Tutored students in C++, automata, data structures, algorithms, and related coursework.",
    ],
    tags: [
      "C++",
      "Data structures",
      "Algorithms",
      "Automata",
      "Communication",
    ],
  },
  {
    organization: "CRJ Services LLC",
    period: "2024 - 2025",
    role: "Lead Full-Stack Developer",
    summary:
      "Led a team of more than five developers building an online booking website for a local accounting firm.",
    details: [
      "Coordinated development across a five-plus-person team and kept implementation moving toward a shared release.",
      "Directed development of the firm’s customer-facing website and online appointment-booking workflow.",
    ],
    tags: [
      "Team leadership",
      "Full-stack development",
      "Online booking",
      "Client delivery",
    ],
  },
  {
    organization: "STARS Solution LLC",
    period: "Nov 2025 - Present",
    role: "Software Engineer Intern",
    summary:
      "Led development of ZenithAI, a career-guidance system helping Las Vegas-area National Guard members transition into civilian life.",
    details: [
      "Developed Spring Boot and FastAPI services deployed through AWS ECS and Fargate for a planned 3.5K+ user pilot.",
      "Redesigned ZenithAI plan generation as an asynchronous RabbitMQ workflow that streams progress through Server-Sent Events.",
      "Reduced institution-search latency from 110ms to 37ms with a version-aware Redis cache and database fallback.",
      "Improved generated recommendations by separating structured and semantic memory, then reranking context before generation.",
    ],
    tags: [
      "Spring Boot",
      "FastAPI",
      "Next.js",
      "AWS",
      "RabbitMQ",
      "Redis",
      "PostgreSQL",
      "CloudWatch",
    ],
  },
  {
    organization: "JT4, LLC • Las Vegas, NV",
    period: "May 2026 - Present",
    role: "Software / Systems Engineering Intern — Telemetry Team",
    summary:
      "Built real-time telemetry simulation and monitoring tools that let engineers validate flight-test pipelines in the office.",
    details: [
      "Created a C++ IRIG-106 Chapter 10 simulator that replaced an estimated $30K of hardware-dependent testing.",
      "Streamed generated packets at live flight-test rates so ingestion tools could be checked before consuming range time.",
      "Delivered a PySide6 and Qt dashboard monitoring more than 100 simulated telemetry channels in real time.",
      "Compared simulator output with recorded range data to establish confidence and support adoption by telemetry teams.",
    ],
    tags: [
      "C++",
      "PySide6",
      "IRIG-106",
      "Telemetry",
    ],
  },
] as const;
