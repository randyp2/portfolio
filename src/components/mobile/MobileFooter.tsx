const MobileFooter: React.FC = () => {
  return (
    <footer className="py-8 px-4 border-t border-zinc-800">
      <p
        className="text-right text-sm font-medium text-emerald-400"
        style={{ textShadow: "0 0 10px rgba(52, 211, 153, 0.5)" }}
      >
        Last updated: 12/31/2025
      </p>
    </footer>
  );
};

export default MobileFooter;
