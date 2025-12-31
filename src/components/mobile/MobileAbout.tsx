import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import GitHubActivityChart from "../GitHubActivityChart";
import InfiniteIconCarousel from "../InfiniteIconCarousel";
import { cn } from "@/lib/utils";

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
}

const MobileCard = ({ children, className }: MobileCardProps) => (
  <motion.div
    className={cn(
      "rounded-2xl border border-zinc-800 bg-zinc-950/90 backdrop-blur-sm p-6 mb-4",
      className
    )}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const MobileAbout: React.FC = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="about" className="py-12 px-4">
      {/* Bio Card */}
      <MobileCard>
        <h1 className="text-2xl text-white font-bold mb-2 tracking-tight">
          Randy Pahang II
        </h1>
        <p className="text-base text-zinc-300 mb-1">
          Computer Science Student @ UNLV
        </p>
        <p className="text-sm text-zinc-400 mb-5">SWE Full-Stack Developer</p>

        <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
          <p>
            I love building polished products that connect thoughtful design
            with reliable engineering. My recent work spans full stack projects,
            interactive visuals, and tooling that makes teams move faster.
          </p>
          <p>
            Outside of classes you can find me tutoring CS peers, experimenting
            with new frameworks, and contributing to collaborative projects that
            solve real problems for students and small businesses.
          </p>
        </div>
      </MobileCard>

      {/* Education Card */}
      <MobileCard>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg text-white font-medium">Education</h3>
            <p className="text-zinc-300">BS Computer Science @ UNLV</p>
            <p className="text-sm text-zinc-400">Minor in Accounting</p>
          </div>
          <div className="text-right">
            <p className="text-xl text-white font-bold">4.0 GPA</p>
            <p className="text-zinc-400 text-sm">Class of 2027</p>
          </div>
        </div>
      </MobileCard>

      {/* Languages Card */}
      <MobileCard className="overflow-hidden">
        <h3 className="text-lg text-white font-medium mb-3">Languages</h3>
        <div className="h-28 -mx-6">
          <InfiniteIconCarousel
            rows={[
              {
                label: "Languages",
                icons: [
                  "java",
                  "typescript",
                  "cpp",
                  "c",
                  "csharp",
                  "python",
                  "sql",
                  "swift",
                ],
              },
            ]}
          />
        </div>
        <button
          onClick={() => scrollToSection("skills")}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-zinc-800/60 border border-zinc-700 text-zinc-200 active:bg-zinc-700/60 transition-all duration-200 text-sm font-medium"
        >
          See More
          <ArrowRight className="w-4 h-4" />
        </button>
      </MobileCard>

      {/* GitHub Activity Card */}
      <MobileCard>
        <h3 className="text-lg text-white font-medium mb-3">GitHub Activity</h3>
        <div className="h-32">
          <GitHubActivityChart username="randyp2" />
        </div>
      </MobileCard>

      {/* Experience Card */}
      <MobileCard>
        <h3 className="text-lg text-white font-medium mb-4">Experience</h3>
        <div className="space-y-4">
          <div>
            <p className="text-white font-semibold">Tutor for UNLV CS</p>
            <p className="text-sm text-zinc-400">2024 - Present</p>
          </div>
          <div>
            <p className="text-white font-semibold">STARS</p>
            <p className="text-sm text-zinc-400">Nov 2025 - Present</p>
            <p className="text-xs text-zinc-500 mt-1">
              ML recommendation system
            </p>
          </div>
          <div>
            <p className="text-white font-semibold">CRJ Services</p>
            <p className="text-sm text-zinc-400">Sept - Dec 2025</p>
            <p className="text-xs text-zinc-500 mt-1">Admin dashboard</p>
          </div>
        </div>
      </MobileCard>
    </section>
  );
};

export default MobileAbout;
