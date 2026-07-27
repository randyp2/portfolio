/**
 * Identity details shared by static and interactive About layouts.
 */
export const ABOUT_IDENTITY = {
  name: "Randy Pahang II",
  education: "Computer Science Student @ UNLV",
  role: "SWE Full-Stack Developer",
} as const;

/**
 * Biography paragraphs shared by static and interactive About layouts.
 */
export const ABOUT_PARAGRAPHS = [
  "I've been programming since my sophomore year of high school, when I discovered I could create whatever I imagined. I fell in love with building, despite the bugs, broken projects, and frustration along the way.",
  "Now I continue to create, learn, and build. Away from the keyboard, I rock climb and play basketball. I'm also willing to 1v1 any CS major or software engineer on the basketball court. Connect with me. I'll take your ankles.",
] as const;

export const ABOUT_PANEL_OPTIONS = [
  { id: "now", label: "About" },
  { id: "education", label: "Education" },
  { id: "links", label: "Socials" },
] as const;

export type AboutPanelId = (typeof ABOUT_PANEL_OPTIONS)[number]["id"];

/**
 * Academic details displayed in the Education chamber view.
 */
export const ABOUT_EDUCATION = {
  degree: "B.S. Computer Science",
  expectedGraduation: "May 2027",
  honorsCollege: "UNLV Honors College",
  institution: "University of Nevada, Las Vegas",
  achievements: {
    deansList: "Dean's List",
    deansListFrequency: "Every semester",
    gpa: "4.0 GPA",
    hackathonPlacement: "1st Place",
    hackathonResult: "Rebel Hacks Hackathon 2026",
  },
  leadership: {
    affiliation: "UNLV student club",
    organization: "Bit to Byte (B2B)",
    role: "Co-founder",
    teamLeadership: "Led a team within the club",
    workshops: "Led web development workshops",
  },
} as const;

export const ABOUT_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/randyp2",
    detail: "@randyp2",
    newTab: true,
    usesBasePath: false,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/randypahangii",
    detail: "/in/randypahangii",
    newTab: true,
    usesBasePath: false,
  },
  {
    label: "Resume",
    href: "files/resume.pdf",
    detail: "View experience",
    newTab: true,
    usesBasePath: true,
  },
  {
    label: "Email",
    href: "mailto:rpahang2@gmail.com",
    detail: "rpahang2@gmail.com",
    newTab: false,
    usesBasePath: false,
  },
] as const;
