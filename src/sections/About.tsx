import React from "react";
import SectionCard from "../components/SectionCard";

const About: React.FC = () => {
    return (
        <SectionCard sectionKey="about" title="About Me">
        <div className="space-y-4">
            <p className="text-lg leading-relaxed">
            {/* TODO: Add your bio */}
            I'm a passionate developer with a love for creating innovative solutions
            to complex problems. With a strong foundation in computer science and
            hands-on experience in software engineering, I enjoy turning ideas into
            reality through clean, efficient code.
            </p>
            <p className="text-lg leading-relaxed">
            When I'm not coding, you can find me exploring new technologies,
            contributing to open-source projects, or learning about the latest trends
            in software development.
            </p>
        </div>
        </SectionCard>
    );
}

export default About;