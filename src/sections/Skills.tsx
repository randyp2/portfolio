import React from "react";
import SectionCard from "../components/SectionCard";


const Skills: React.FC = () => {
    
    return(
        <SectionCard sectionKey="skills" title="Skills">
        <div className="space-y-6">
            {/* TODO: Customize your skills */}
            <div>
            <h3 className="text-xl font-semibold text-white mb-3">Languages</h3>
            <p className="text-white/70">JavaScript, TypeScript, Python, Java, C++, SQL</p>
            </div>
            <div>
            <h3 className="text-xl font-semibold text-white mb-3">Frameworks & Libraries</h3>
            <p className="text-white/70">React, Node.js, Express, Next.js, TailwindCSS, Redux</p>
            </div>
            <div>
            <h3 className="text-xl font-semibold text-white mb-3">Tools & Technologies</h3>
            <p className="text-white/70">Git, Docker, AWS, MongoDB, PostgreSQL, Firebase</p>
            </div>
        </div>
        </SectionCard>
    );
}

export default Skills;