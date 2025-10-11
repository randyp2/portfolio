import React from "react";
import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { BiSolidCertification } from "react-icons/bi";


interface EducationTimelineProps {
  opacity?: number;
}

const timeline = [

    {
        year: "2022-2023",
        title: "App Development w/ Swift",
        instituition: "Nevada Help Desk",
        detail: "Completed 3-month program on iOS app development",
        icon: <BiSolidCertification />,
        type: "certification",

    },

    {
        year: "2023",
        title: "Valedictorian",
        institution: "Corall Academy of Science, Sandy Ridge High School",
        detail: "Ranked #1 in graduating class",
        icon: <FaGraduationCap className="text-[#c5f9f5]" />,
        type: "education",
    },

    {
        year: "2023",
        title: "CTE Computer Science",
        instituition: "Nevada Department of Education",
        detail: "Completed industry-aligned computer-science courses",
        icon: <BiSolidCertification />,
        type: "certification",
    },
 

    {
        year: "2025",
        title: "CS Student",
        institution: "University of Nevada, Las Vegas",
        detail: "4.0 GPA • Dean’s List",
        icon: <MdSchool className="text-[#c5f9f5]" />,
        type: "education",
    },
];

const EducationTimeline: React.FC<EducationTimelineProps> = ({ opacity = 1 }) => {
    return (
        <motion.div
        className="relative w-full max-w-[2000px] flex flex-col items-center justify-center text-white mt-6"
        style={{ opacity }}
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {/* Glowing horizontal line */}
            <motion.div
                className="relative w-full h-[2px] bg-gradient-to-r from-transparent via-[#c5f9f5] to-transparent shadow-[0_0_20px_#00fff0aa]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            />

            {/* Timeline milestones */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
                {
                    timeline.map((item, index) => {

                        const glowColor: string = item.type === "education" ? "#A9FCF8" : "#F5E36E";
                        const shadowColor: string = item.type === "education" ? 
                        "shadow-[0_0_15px_#00fff0aa]" : "shadow-[0_0_15px_#F5E778]";


                        return (
                            <motion.div
                                key={index}
                                className="mt-15 flex flex-col items-center text-center w-[220px]"
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                            >
                                {/* Icon + Glow */}
                                <div className="relative">
                                    <div 
                                        className={`absolute inset-0 rounded-full blur-md`}
                                        style={{ backgroundColor: `${glowColor}40`}}
                                    />
                                    <div className="text-3xl z-10" style={{color: glowColor}}>{item.icon}</div>
                                </div>

                                {/* Connector dot */}
                                <div 
                                    className={`mt-2 w-3 h-3 rounded-full ${shadowColor}`} 
                                    style={{backgroundColor: glowColor}}
                                
                                />

                                {/* Content */}
                                <div className="mt-3">
                                <h3 className="text-lg font-semibold text-white/95">
                                    {item.title}{" "} 
                                    <span 
                                        className="text-sm"
                                        style={{ color: glowColor}}
                                    >
                                        ({item.year})
                                    </span>
                                </h3>
                                <p className="text-white/80 text-sm">{item.institution}</p>
                                <p className="text-white/60 text-xs mt-1">{item.detail}</p>
                                </div>
                            </motion.div>
                        )
                    })
                }
            </div>
        </motion.div>
    );
};

export default EducationTimeline;