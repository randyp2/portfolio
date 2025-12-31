import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Check, FileDown } from "lucide-react";

interface SocialButtonProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
  download?: boolean;
  copied?: boolean;
}

const SocialButton = ({
  icon: Icon,
  label,
  href,
  onClick,
  download,
  copied,
}: SocialButtonProps) => {
  const content = (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-950/90 active:bg-zinc-800/60 transition-colors">
      <Icon className="w-6 h-6 text-zinc-300" />
      <span className="text-white font-medium">
        {label === "Email" && copied ? "Copied!" : label}
      </span>
    </div>
  );

  if (onClick) {
    return (
      <motion.button
        onClick={onClick}
        className="w-full text-left"
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      download={download}
      className="block"
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.a>
  );
};

const MobileContact: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("rpahang2@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = "mailto:rpahang2@gmail.com";
    }
  };

  const resumeUrl = `${import.meta.env.BASE_URL}files/resume.pdf`;

  return (
    <section id="contact" className="py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">Let's Connect</h2>
        <p className="text-zinc-400 text-sm mb-6">
          Open to opportunities, collaborations, and new connections.
        </p>

        {/* Social links grid */}
        <div className="grid grid-cols-2 gap-3">
          <SocialButton
            icon={Github}
            label="GitHub"
            href="https://github.com/randyp2"
          />
          <SocialButton
            icon={Linkedin}
            label="LinkedIn"
            href="https://linkedin.com/in/randypahangii"
          />
          <SocialButton
            icon={FileDown}
            label="Resume"
            href={resumeUrl}
            download
          />
          <SocialButton
            icon={copied ? Check : Mail}
            label="Email"
            onClick={handleCopyEmail}
            copied={copied}
          />
        </div>

        {/* Email display */}
        <p className="text-zinc-500 text-sm text-center mt-6">
          rpahang2@gmail.com
        </p>
      </motion.div>
    </section>
  );
};

export default MobileContact;
