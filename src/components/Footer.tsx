import React from "react";

const Footer: React.FC = () => {

    return(
        <footer className="fixed bottom-0 left-0 right-0 z-40 py-7 bg-black/40 backdrop-blur-xl border-t border-white/15 shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            <div className="h-full flex items-center justify-center text-white/60 text-sm">
                Use the glowing ball to navigate • Drag and release to launch
            </div>
        </footer>
    );
}

export default Footer;