export type ProjectStatus =
  | "In Development"
  | "Finished"
  | "Archived"
  | "Current Internship"
  | "1st Place";

export interface ProjectLink {
  href: string;
  includeOnCard: boolean;
  includeInReadMore?: boolean;
  label: string;
}

export interface Project {
  id: string;
  image: string;
  embedUrl?: string;
  title: string;
  description: string;
  details: string;
  tags: readonly string[];
  status: ProjectStatus;
  links: readonly ProjectLink[];
}

export const PERSONAL_PROJECTS: readonly Project[] = [
  {
    id: "p1",
    image: "/media/portrn.mp4",
    title: "PortRN",
    description:
      "A social platform for showcasing, generating, and connecting external portfolios.",
    details:
      "PortRN is a social space where people can showcase their work and discover other portfolios. Users can generate a portfolio directly from their information or connect an existing external portfolio, giving creators one place to build a presence and share it with others.",
    tags: [
      "Next.js",
      "TailwindCSS",
      "Java",
      "Spring Boot",
      "Docker",
      "AWS",
    ],
    status: "Finished",
    links: [
      {
        label: "Live site",
        href: "https://www.portrn.com",
        includeOnCard: true,
      },
      {
        label: "How it works",
        href: "https://www.portrn.com/docs/how-it-works",
        includeOnCard: false,
      },
      {
        label: "GitHub repository",
        href: "https://github.com/randyp2/website-generator",
        includeOnCard: true,
        includeInReadMore: false,
      },
    ],
  },
  {
    id: "p2",
    image: "/media/dsa_prev.mp4",
    title: "DSA Visualizer",
    description:
      "Visualizes sorting and linked-list algorithms alongside comparisons and runtime.",
    details:
      "This was one of my first projects with a real graphical interface instead of output that lived entirely in the terminal. Building something I could see and interact with made the project especially rewarding. It also introduced me to asynchronous programming as I learned how to animate each step of an algorithm without freezing the interface. Coordinating the visualization, controls, comparisons, and runtime data taught me how application state and timing work together in an interactive program.",
    tags: ["C#", ".NET Framework"],
    status: "Finished",
    links: [
      {
        label: "GitHub repository",
        href: "https://github.com/randyp2/DSA_Visualizer",
        includeOnCard: true,
        includeInReadMore: false,
      },
    ],
  },
  {
    id: "p3",
    image: "/media/conway_prev.mp4",
    title: "Conway's Game of Life",
    description:
      "An interactive cellular-automaton simulation built with C++ and Raylib.",
    details:
      "A visual implementation of Conway's Game of Life focused on fast grid updates and direct experimentation. Users can seed the board, run generations, and watch complex patterns emerge from a small set of rules.",
    tags: ["C++", "Raylib"],
    status: "Finished",
    links: [
      {
        label: "GitHub repository",
        href: "https://github.com/randyp2/conways-game-of-life-cpp",
        includeOnCard: true,
        includeInReadMore: false,
      },
    ],
  },
  {
    id: "p4",
    image:
      "https://img.youtube.com/vi/wKgFKEe0dm4/maxresdefault.jpg",
    embedUrl:
      "https://www.youtube.com/embed/wKgFKEe0dm4?si=-lQRzIRb-l__CkSB",
    title: "HotelGuard",
    description:
      "Our first-place project from RebelHacks 2026, built to help hotel teams identify potential trafficking risks.",
    details:
      "HotelGuard uses weighted risk scoring to help hotel staff monitor rooms for patterns associated with potential human trafficking. When cameras detect unusual activity around a high-risk room, footage can be sent to an AI model to summarize suspicious behavior. I focused on rendering a 3D hotel floor plan that displays room risk through a heat map, and I helped connect our computer-vision pipeline to Gemini so flagged footage could be reduced to meaningful keyframes. Building it under a hackathon deadline pushed me into unfamiliar computer-vision work and made the first-place win especially rewarding.",
    tags: [
      "Computer Vision",
      "Gemini",
      "3D Visualization",
      "Risk Scoring",
    ],
    status: "1st Place",
    links: [
      {
        label: "View on Devpost",
        href: "https://devpost.com/software/hotel-guard",
        includeOnCard: true,
      },
    ],
  },
];

export const WORK_PROJECTS: readonly Project[] = [
  {
    id: "w1",
    image: "/media/crj_prev.mp4",
    title: "CRJ Website",
    description:
      "A redesigned client website and online booking experience for a local accountant.",
    details:
      "I led a team of developers building a full-stack web presence and booking flow for a local accounting business. The work covered the customer-facing experience, content and service organization, data integration, and a deployment workflow the client could continue using.",
    tags: ["Next.js", "Supabase", "Vercel"],
    status: "Finished",
    links: [
      {
        label: "Project preview",
        href: "https://example.com",
        includeOnCard: true,
      },
    ],
  },
  {
    id: "w2",
    image: "/media/stars.png",
    title: "STARS Solution",
    description:
      "A look at my current software engineering internship and the team behind ZenithAI.",
    details:
      "STARS is where I currently work as a software engineering intern. The company helps service members navigate the transition into civilian life, and I help lead development of ZenithAI, its core career-guidance agent. This internship introduced me to the fast, constantly changing pace of a startup and gave me the chance to build across the product while learning directly from the people using it.",
    tags: [
      "Next.js",
      "Spring Boot",
      "FastAPI",
      "AWS",
      "PostgreSQL",
      "RabbitMQ",
      "Redis",
    ],
    status: "Current Internship",
    links: [
      {
        label: "STARS website",
        href: "https://www.starsol.ai",
        includeOnCard: true,
      },
    ],
  },
];

export const LEARNING_PROJECTS: readonly Project[] = [
  {
    id: "l1",
    image: "/media/chess-knight.png",
    title: "Chess",
    description:
      "A modern C++ chess project where I am learning SFML, CMake, and game architecture.",
    details:
      "I am using this project to move beyond small, single-file C++ programs and learn how a larger interactive application should be organized. Building chess gives me a practical reason to separate game rules, board state, rendering, input, and resources into clear systems. Along the way, I am learning SFML for the visual layer, CMake for a repeatable build setup, and modern C++ patterns for ownership, boundaries, and code that remains understandable as the project grows.",
    tags: ["C++", "CMake", "SFML"],
    status: "In Development",
    links: [
      {
        label: "GitHub repository",
        href: "https://github.com/randyp2/chess",
        includeOnCard: true,
        includeInReadMore: false,
      },
    ],
  },
];
