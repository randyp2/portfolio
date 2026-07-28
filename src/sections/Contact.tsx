import { motion } from "framer-motion";
import { Check, Copy, Download, ExternalLink, Mail } from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FADE_RADIUS, type COLLIDERES_RECT } from "../typesConstants";

interface ContactProps {
  centerX: number;
  ballX: number;
  ballY?: number;
  cameraX: number;
  viewportCenterX: number;
  onBoundsChange?: (bounds: COLLIDERES_RECT) => void;
}

const CONTACT_EMAIL = "rpahang2@gmail.com";

const Contact: React.FC<ContactProps> = ({
  centerX,
  ballX,
  cameraX,
  viewportCenterX,
  onBoundsChange,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const copyResetTimerRef = useRef<number | null>(null);
  const [sectionWidth, setSectionWidth] = useState(0);
  const [copied, setCopied] = useState(false);

  useLayoutEffect(() => {
    const measureSection = () => {
      if (sectionRef.current) {
        setSectionWidth(sectionRef.current.getBoundingClientRect().width);
      }
    };

    measureSection();
    window.addEventListener("resize", measureSection);
    return () => window.removeEventListener("resize", measureSection);
  }, []);

  useEffect(() => {
    if (!resumePreviewRef.current || !onBoundsChange) return;

    const rect = resumePreviewRef.current.getBoundingClientRect();
    const worldLeft = cameraX - viewportCenterX + rect.left;
    const worldRight = cameraX - viewportCenterX + rect.right;

    onBoundsChange({
      title: "Contact-Resume",
      x1: worldLeft,
      x2: worldRight,
      y1: rect.top,
      y2: rect.bottom,
    });
  }, [ballX, cameraX, viewportCenterX, onBoundsChange]);

  useEffect(
    () => () => {
      if (copyResetTimerRef.current !== null) {
        window.clearTimeout(copyResetTimerRef.current);
      }
    },
    [],
  );

  const leftEdge = centerX;
  const rightEdge = centerX + sectionWidth - 600;

  let opacity = 1;
  if (ballX < leftEdge) {
    opacity = Math.max(0, 1 - (leftEdge - ballX) / FADE_RADIUS);
  } else if (ballX > rightEdge) {
    opacity = Math.max(0, 1 - (ballX - rightEdge) / FADE_RADIUS);
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);

      if (copyResetTimerRef.current !== null) {
        window.clearTimeout(copyResetTimerRef.current);
      }
      copyResetTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        copyResetTimerRef.current = null;
      }, 2000);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  const resumeUrl = `${import.meta.env.BASE_URL}files/resume.pdf`;
  const resumePreviewUrl = `${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

  return (
    <motion.section
      ref={sectionRef}
      className="contact-section absolute top-0 flex h-screen min-w-screen items-center"
      style={{
        left: `${centerX}px`,
        width: "100vw",
      }}
      animate={{
        opacity,
        scale: 0.96 + 0.04 * opacity,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.5,
      }}
    >
      <div className="contact-layout">
        <motion.div
          className="contact-intro"
          initial={{ opacity: 0, x: -36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="contact-kicker">05 // contact</p>
          <h1 className="contact-heading">
            LET&apos;S
            <br />
            TALK.
          </h1>
          <p className="contact-description">
            Have an opportunity, a project worth building, or a basketball
            score to settle? My inbox is open.
          </p>

          <div className="contact-email-line">
            <Mail aria-hidden="true" />
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label={copied ? "Email copied" : "Copy email address"}
            >
              {copied ? (
                <Check aria-hidden="true" />
              ) : (
                <Copy aria-hidden="true" />
              )}
              <span aria-live="polite">{copied ? "COPIED" : "COPY"}</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          className="contact-resume"
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12, duration: 0.55, ease: "easeOut" }}
        >
          <div className="contact-resume-toolbar">
            <div className="contact-resume-path">
              <span aria-hidden="true">▣</span>
              <span>~/files/resume.pdf</span>
            </div>
            <div className="contact-resume-actions">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink aria-hidden="true" />
                OPEN
              </a>
              <a href={resumeUrl} download>
                <Download aria-hidden="true" />
                DOWNLOAD
              </a>
            </div>
          </div>

          <div ref={resumePreviewRef} className="contact-resume-preview">
            <iframe
              src={resumePreviewUrl}
              title="Randy Pahang II resume PDF preview"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Contact;
