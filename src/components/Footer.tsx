import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-3 left-3 right-3 z-40 mx-auto max-w-[1240px] px-4 py-2.5">
      <div className="flex items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--terminal-muted)]">
        <div className="flex min-w-0 items-center gap-3">
          <span className="terminal-dot shrink-0" />
          <span className="truncate">
            drag orb → set vector → release to execute
          </span>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <span>physics: online</span>
          <span className="text-[var(--terminal-green)]">status: ready</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
