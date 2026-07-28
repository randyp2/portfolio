/**
 * A focused outcome worth surfacing within an experience story.
 */
export interface ExperienceHighlight {
  detail: string;
  title: string;
}

/**
 * Narrative content for one checkpoint on the experience journey.
 */
export interface ExperiencePathItem {
  highlights: readonly ExperienceHighlight[];
  organization: string;
  period: string;
  role: string;
  story: string;
  tags: readonly string[];
  thoughts: string;
}

/**
 * Recent roles displayed along the non-linear experience path.
 */
export const EXPERIENCE_PATH: readonly ExperiencePathItem[] = [
  {
    organization: "Nevada Help Desk",
    period: "Summer 2022",
    role: "Frontend Intern",
    story:
      "This was the first place where programming stopped feeling like a school exercise. I was learning Swift and web development at the same time, then using both to make practical things for people in the community.",
    highlights: [
      {
        title: "Built for real users",
        detail:
          "Created and updated church websites with HTML, CSS, JavaScript, and WordPress.",
      },
      {
        title: "Tried more than one lane",
        detail:
          "Explored Swift and mobile development while building my web foundation.",
      },
    ],
    thoughts:
      "Seeing someone actually use what I built was the hook. Software started to feel less like syntax and more like a way to turn an idea into something useful.",
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
    story:
      "Tutoring put me on the other side of the classroom. I worked with students on C++, automata, data structures, and algorithms, but the real challenge was finding an explanation that made sense to the person sitting across from me.",
    highlights: [
      {
        title: "Made hard ideas approachable",
        detail:
          "Adjusted examples and explanations to match how each student learned instead of repeating the textbook.",
      },
      {
        title: "Strengthened my own foundation",
        detail:
          "Teaching core computer science topics exposed weak spots in my understanding and pushed me to close them.",
      },
    ],
    thoughts:
      "This role taught me that knowing something and communicating it are different skills. The best explanation is usually the clearest one, not the most technical one.",
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
    story:
      "At CRJ, I helped turn a local accountant's needs into an online booking experience and coordinated the developers building it. It was my first time balancing implementation, team decisions, and a real client's expectations at once.",
    highlights: [
      {
        title: "Led a team of 5+ developers",
        detail:
          "Kept responsibilities clear and moved the group toward one consistent release.",
      },
      {
        title: "Turned a request into a workflow",
        detail:
          "Helped shape the customer-facing site and appointment flow around how the business actually operated.",
      },
    ],
    thoughts:
      "I learned that leadership is mostly clarity and follow-through. A good technical decision only helps when the team understands it and the client can see why it matters.",
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
    story:
      "STARS was my first real experience inside a startup, so I had to get comfortable moving quickly, working through ambiguity, and adapting as the product changed. I led development of ZenithAI, the platform's core agentic feature, and had a lot of fun learning directly from the National Guard members it was built to support.",
    highlights: [
      {
        title: "3x faster institution search",
        detail:
          "A Redis cache-aside layer brought lookup time from 110 ms to 37 ms while keeping a safe database fallback.",
      },
      {
        title: "Generation without the frozen screen",
        detail:
          "Moved plan generation into RabbitMQ workers and streamed progress with Server-Sent Events instead of holding one blocking request open.",
      },
    ],
    thoughts:
      "Working this closely with end users changed how I approach product engineering. Their feedback often revealed more than an architecture diagram could, and I learned to treat ambiguity as something to explore rather than something to wait out. It also showed me how much I enjoy building AI systems around real human needs.",
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
    role: "Software / Systems Engineering Intern | Telemetry Team",
    story:
      "At JT4, I work much closer to the hardware side of software. I built tools that simulate real flight-test telemetry and make the stream visible, so engineers can validate their pipelines in the office before spending time at a live range.",
    highlights: [
      {
        title: "An estimated $30K in hardware avoided",
        detail:
          "Built a C++ IRIG-106 Chapter 10 simulator that replaced hardware-dependent testing for common validation work.",
      },
      {
        title: "100+ channels made visible",
        detail:
          "Created a PySide6 and Qt dashboard for watching simulated channel health in real time.",
      },
    ],
    thoughts:
      "Telemetry reinforced that correctness needs evidence. Comparing generated output with recorded range data mattered just as much as writing the simulator because trust is what turns a tool into part of a team's workflow.",
    tags: [
      "C++",
      "PySide6",
      "IRIG-106",
      "Telemetry",
    ],
  },
] as const;
