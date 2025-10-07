import React from "react";
import SectionCard from "../components/SectionCard";

const Experience: React.FC = () => {
    
    return (<SectionCard sectionKey="experience" title="Experience">
      <div className="space-y-6">
        {/* TODO: Add your real experiences */}
        <div>
          <h3 className="text-xl font-semibold text-white">Software Engineering Intern</h3>
          <p className="text-white/60 text-sm mb-2">Tech Company • Summer 2024</p>
          <ul className="list-disc list-inside text-white/70 space-y-1">
            <li>Developed full-stack features using React and Node.js</li>
            <li>Improved application performance by 30%</li>
            <li>Collaborated with cross-functional teams</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Research Assistant</h3>
          <p className="text-white/60 text-sm mb-2">University CS Department • 2023-2024</p>
          <ul className="list-disc list-inside text-white/70 space-y-1">
            <li>Conducted research on machine learning algorithms</li>
            <li>Published paper at academic conference</li>
            <li>Mentored undergraduate students</li>
          </ul>
        </div>
      </div>
    </SectionCard>
  );
}

export default Experience;