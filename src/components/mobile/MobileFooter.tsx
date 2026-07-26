const MobileFooter: React.FC = () => {
  return (
    <footer className="border-t border-[var(--terminal-line)] px-4 py-8">
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--terminal-muted)]">
        <span>rjp@portfolio:~$</span>
        <span className="flex items-center gap-2 text-[var(--terminal-green)]">
          <span className="terminal-dot" />
          online
        </span>
      </div>
    </footer>
  );
};

export default MobileFooter;
