import React, { useRef } from "react";
import GlassCard from "../components/GlassCard";
import ExperienceCard from "./ExperienceCard";
import EducationCard from "./ExperienceCard";
import { motion } from "framer-motion";

interface ExperienceProps {
    opacity?: number;
    scale?: number;
}

const experiences = [
    {
        title: "Fontend Intern",
        company: "Nevada Help Desk",
        year: "Summer 2022",
        content: (
            <>
                <ul>
                    <li> - Collaborated with <span className="text-[#c5f9f5] font-semibold">5+ </span>developers to develop websites for local churches</li>
                    <li> - Increased user engagement.</li>
                    <li> - Participated in code reviews and performed sprint planning to help meet major milestones.</li>
                </ul>

                <span className="italic text-[#c5f9f5] font-semibold">Technologies Used: </span> Javascript, HTML, CSS, WordPress
            </>
        )
    }, 

    {
        title: "Computer Science Tutor",
        company: "Academic Success Center | UNLV",
        year: "2024-Present",
        content: (
            <>
                <ul>
                    <li> - Assist <span className="text-[#c5f9f5] font-semibold">50+ </span>students in understanding data structures, algorithms, and programming languages.</li>
                    <li> - Helped improve their coding skills and academic performance.</li>
                </ul>

                <span className="italic text-[#c5f9f5] font-semibold">Technologies Used: </span> C++, Python
            </>
        )
    }, 

    {
        title: "Fullstack lead developer",
        company: "CRJ Services",
        year: "2025-Present",
        content: (
            <>
                <ul>
                    <li> - Lead developer for a fullstack online booking website with admin and user priveleges for a local accounting firm to cater to 
                    <span className="text-[#c5f9f5] font-semibold"> 100+ </span>users. </li>
                    <li> - Optimized website by <span className="text-[#c5f9f5] font-semibold">Y%</span> by implementing <span className="text-[#c5f9f5] font-semibold">Z</span></li>
                </ul>

                <span className="italic text-[#c5f9f5] font-semibold">Technologies Used: </span> React, Tailwind, Java Spring Boot, Postgres, Docker, AWS, OAuth 2.0 

            </>
        )
    }
];

const Experience: React.FC<ExperienceProps> = ({ opacity, scale}) => {
    const cardRef = useRef<HTMLDivElement>(null);


    return (
        <GlassCard ref={cardRef} title="Work experience" opacity={opacity} scale={scale} className="w-full">
            <div className="flex flex-row justify-between flex-wrap">

                {
                    experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
                        >
                            <EducationCard title={exp.title} company={exp.company} year={exp.year}>
                                {exp.content}
                            </EducationCard>

                        </motion.div>
                    ))
                }
            </div>

        </ GlassCard>
    );
}


export default Experience;