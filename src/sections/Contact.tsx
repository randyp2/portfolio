import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FADE_RADIUS, type COLLIDERES_RECT } from "../typesConstants";
import { Github, Linkedin, Mail, Check, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactProps {
  centerX: number;
  ballX: number;
  ballY?: number;
  cameraX: number;
  viewportCenterX: number;
  onBoundsChange?: (bounds: COLLIDERES_RECT) => void;
}

const Contact: React.FC<ContactProps> = ({
  centerX,
  ballX,
  cameraX,
  viewportCenterX,
  onBoundsChange,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sectionWidth, setSectionWidth] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const handleResize = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setSectionWidth(rect.width);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Report container bounds for collision detection
  useEffect(() => {
    if (!containerRef.current || !onBoundsChange) return;

    const rect = containerRef.current.getBoundingClientRect();
    const worldLeft = cameraX - viewportCenterX + rect.left;
    const worldRight = cameraX - viewportCenterX + rect.right;

    onBoundsChange({
      title: "Contact-Container",
      x1: worldLeft,
      x2: worldRight,
      y1: rect.top,
      y2: rect.bottom,
    });
  }, [ballX, cameraX, viewportCenterX, onBoundsChange]);

  const leftEdge = centerX;
  const rightEdge = centerX + sectionWidth - 600;

  let opacity = 1;
  if (ballX < leftEdge) {
    const diff = leftEdge - ballX;
    opacity = Math.max(0, 1 - diff / FADE_RADIUS);
  } else if (ballX > rightEdge) {
    const diff = ballX - rightEdge;
    opacity = Math.max(0, 1 - diff / FADE_RADIUS);
  }
  const scale: number = 0.96 + 0.04 * opacity;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("rpahang2@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = "mailto:rpahang2@gmail.com";
    }
  };

  // Respect Vite base (/portfolio/) so images resolve in prod
  const githubPreviewImage = `${import.meta.env.BASE_URL}images/github-photo.png`;
  const linkedinPreviewImage = `${import.meta.env.BASE_URL}images/linkedin-photo.png`;
  const resumePreviewImage = `${import.meta.env.BASE_URL}images/resume-photo.png`;
  const resumeUrl = `${import.meta.env.BASE_URL}files/resume.pdf`; // place your PDF at public/files/resume.pdf

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/randyp2",
      hoverBg: "#000",
      hoverShadow: "0 0 25px rgba(0, 0, 0, 0.45)",
      iconColor: "#fff",
      previewUrl: "https://github.com/randyp2",
      previewImage: githubPreviewImage,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://linkedin.com/in/randypahangii",
      hoverBg: "#0077b5",
      hoverShadow: "0 0 25px rgba(0, 119, 181, 0.6)",
      iconColor: "#fff",
      previewUrl: "https://linkedin.com/in/randypahangii",
      previewImage: linkedinPreviewImage,
    },
    {
      name: "Resume",
      icon: FileDown,
      href: resumeUrl,
      hoverBg: "#084f92", // even darker blue
      hoverShadow: "0 0 25px rgba(8, 79, 146, 0.65)",
      iconColor: "#fff",
      previewUrl: resumeUrl,
      download: true,
      previewImage: resumePreviewImage,
    },
    {
      name: "Email",
      icon: copied ? Check : Mail,
      href: "#",
      onClick: handleCopyEmail,
      hoverBg: "#ea4335",
      hoverShadow: "0 0 25px rgba(234, 67, 53, 0.5)",
      iconColor: "#fff",
      previewUrl: "mailto:rpahang2@gmail.com",
    },
  ];

  // Track mouse position for preview tooltip
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Get the current hovered link data
  const hoveredLink = socialLinks.find((link) => link.name === hoveredIcon);

  return (
    <motion.div
      ref={sectionRef}
      className="min-w-screen h-screen flex flex-col justify-center items-center absolute top-0"
      style={{
        left: `${centerX}px`,
        width: "100vw",
        paddingBottom: "120px",
      }}
      animate={{
        opacity,
        scale,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.5,
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Animated background orbs - zinc tones */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(161,161,170,0.3) 0%, transparent 70%)",
            left: "10%",
            top: "20%",
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(113,113,122,0.4) 0%, transparent 70%)",
            right: "15%",
            bottom: "25%",
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, rgba(82,82,91,0.4) 0%, transparent 70%)",
            left: "50%",
            top: "10%",
            transform: "translateX(-50%)",
          }}
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center mb-12">
        {/* Heading with gradient */}
        <motion.h1
          className="text-6xl md:text-7xl font-alfa mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 via-white to-zinc-400">
            LET'S
          </span>{" "}
          <span className="text-white" style={{ textShadow: "0 0 30px rgba(255,255,255,0.4)" }}>
            CONNECT
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-xl text-zinc-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Join me on my journey. I'm open to opportunities, collaborations, and new connections.
        </motion.p>
      </div>

      {/* 3D Glowing Container - This is the collider */}
      <motion.div
        ref={containerRef}
        className="relative w-full max-w-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div
          className="rounded-3xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/90 border border-zinc-700/50 shadow-2xl backdrop-blur-xl overflow-hidden p-8 transition-all duration-500 hover:scale-[1.02]"
          style={{
            boxShadow: "0 0 50px rgba(161, 161, 170, 0.15), 0 0 80px rgba(113, 113, 122, 0.1)",
          }}
        >
          <div className="flex flex-wrap justify-center gap-8">
            {socialLinks.map((link, index) => {
              const isHovered = hoveredIcon === link.name;
              const IconComponent = link.icon;

              const content = (
                <div
                  className="flex flex-col items-center"
                  onMouseEnter={() => setHoveredIcon(link.name)}
                  onMouseLeave={() => setHoveredIcon(null)}
                >
                  <motion.div
                    className={cn(
                      "flex items-center justify-center w-20 h-20 rounded-full",
                      "bg-white/5 backdrop-blur-sm border border-white/10",
                      "transition-all duration-300"
                    )}
                    animate={{
                      y: isHovered ? -10 : 0,
                      scale: isHovered ? 1.1 : 1,
                    }}
                    style={{
                      background: isHovered
                        ? link.hoverBg
                        : "rgba(255, 255, 255, 0.05)",
                      boxShadow: isHovered ? link.hoverShadow : "0 8px 32px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <motion.div
                      animate={isHovered ? { rotate: [0, -5, 5, -5, 5, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <IconComponent className="w-8 h-8 text-white" strokeWidth={1.5} />
                    </motion.div>
                  </motion.div>
                  <motion.span
                    className="mt-3 text-white font-medium"
                    animate={{
                      opacity: isHovered ? 1 : 0.7,
                      y: isHovered ? 5 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {link.name === "Email" && copied ? "Copied!" : link.name}
                  </motion.span>
                </div>
              );

              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                >
                  {link.onClick ? (
                    <button
                      onClick={link.onClick}
                      className="cursor-pointer focus:outline-none"
                    >
                      {content}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                      download={link.download}
                    >
                      {content}
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Glow effect underneath */}
        <div
          className="absolute inset-0 -z-10 rounded-3xl blur-3xl opacity-30"
          style={{
            background: "radial-gradient(ellipse at center, rgba(161, 161, 170, 0.3) 0%, transparent 70%)",
            transform: "translateY(20px)",
          }}
        />
      </motion.div>

      {/* Email display */}
      <motion.p
        className="text-zinc-500 text-sm mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        rpahang2@gmail.com
      </motion.p>

      {/* Cursor-following link preview */}
      <AnimatePresence>
        {hoveredIcon &&
          hoveredLink &&
          hoveredLink.previewImage &&
          hoveredLink.name !== "Email" && (
          <motion.div
            className="fixed pointer-events-none z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            style={{
              left: mousePos.x-90,
              top: mousePos.y+10,
              transform: "translate(-50%, 0)",
            }}
          >
            <div
              className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-xl shadow-2xl overflow-hidden"
              style={{
                width: "280px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Preview content - just the image */}
              <div className="overflow-hidden rounded-lg border border-zinc-800/60">
                <img
                  src={hoveredLink.previewImage}
                  alt={`${hoveredLink.name} preview`}
                  className="w-full h-40 object-cover"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Contact;
