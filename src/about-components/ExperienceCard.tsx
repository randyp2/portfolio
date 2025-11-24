import React from "react";

interface EducationCardProps {
    title: string;
    company: string;
    year: string;
    children: React.ReactNode;
}

const EducationCard: React.FC<EducationCardProps> = ({ title, company, year, children} ) => {

    return (
        <div className="space-y-3 max-w-[500px]">
            <div className="relative group bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent border border-white/10 rounded-2xl p-4 overflow-hidden">
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-bold text-base bg-gradient-to-r from-white to-white/80 bg-clip-text">
                    {title}
                </h3>
                <span className="text-xs text-gray-400/80 bg-white/5 px-2 py-1 rounded-md">{year}</span>
                </div>
                <p className="text-xs bg-gradient-to-r from-[#c5f9f5] to-[#c5f9f5]/60 bg-clip-text text-transparent font-medium mb-2">
                {company}
                </p>
                <p className="text-sm text-gray-300/90 leading-relaxed">
                    {children}
                </p>
            </div>
            </div>
        </div>
    );
}

export default EducationCard;