import React from "react";
import SectionCard from "../components/SectionCard";

const ThankYou: React.FC = () => {
    return (
        <SectionCard sectionKey="thankyou" title="Let's Connect">
        <div className="space-y-4">
            <p className="text-lg leading-relaxed">
            Thanks for exploring my portfolio! I'm always excited to connect with
            fellow developers, potential collaborators, or anyone interested in
            technology.
            </p>
            <p className="text-lg leading-relaxed">
            Feel free to reach out if you'd like to discuss projects, opportunities,
            or just chat about code.
            </p>
            <div className="mt-6 pt-6 border-t border-white/20">
            {/* TODO: Add your contact links */}
            <p className="text-white/70">
                Email: your.email@example.com
            </p>
            <p className="text-white/70">
                GitHub: github.com/yourusername
            </p>
            <p className="text-white/70">
                LinkedIn: linkedin.com/in/yourprofile
            </p>
            </div>
        </div>
        </SectionCard>
    );
}

export default ThankYou;