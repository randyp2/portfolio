import { motion } from "framer-motion";
import { Check, Copy, Download, ExternalLink, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CONTACT_EMAIL = "rpahang2@gmail.com";

const MobileContact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const copyResetTimerRef = useRef<number | null>(null);
  const resumeUrl = `${import.meta.env.BASE_URL}files/resume.pdf`;
  const resumePreviewImage = `${import.meta.env.BASE_URL}images/resume-photo.png`;

  useEffect(
    () => () => {
      if (copyResetTimerRef.current !== null) {
        window.clearTimeout(copyResetTimerRef.current);
      }
    },
    [],
  );

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

  return (
    <section id="contact" className="mobile-contact-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <p className="mobile-contact-kicker">05 // contact</p>
        <h2 className="mobile-contact-heading">
          LET&apos;S
          <br />
          TALK.
        </h2>
        <p className="mobile-contact-description">
          Have an opportunity, a project worth building, or a basketball score
          to settle? My inbox is open.
        </p>

        <div className="mobile-contact-email">
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
          </button>
        </div>

        <div className="mobile-contact-resume">
          <div className="mobile-contact-resume-toolbar">
            <span>~/files/resume.pdf</span>
            <div>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink aria-hidden="true" />
                OPEN
              </a>
              <a href={resumeUrl} download>
                <Download aria-hidden="true" />
                SAVE
              </a>
            </div>
          </div>
          <a
            className="mobile-contact-resume-preview"
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Randy Pahang II resume PDF"
          >
            <img src={resumePreviewImage} alt="Preview of Randy Pahang II resume" />
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default MobileContact;
