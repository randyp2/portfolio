import type React from "react";
interface Project {
    id: string;
    image: string;
    title: string;
    description?: string;
    tags?: string[];
    status?: "In Development" | "Finished" | "Archived";
    link?: string;
}
interface AnimatedFolderProps {
    title: string;
    projects: Project[];
    className?: string;
    isColliding?: boolean;
    isDisabled?: boolean;
}
export declare const AnimatedFolder: React.ForwardRefExoticComponent<AnimatedFolderProps & React.RefAttributes<HTMLDivElement>>;
interface ProjectCardProps {
    image: string;
    title: string;
    delay: number;
    isVisible: boolean;
    index: number;
    onClick: () => void;
    isSelected: boolean;
}
export declare const ProjectCard: React.ForwardRefExoticComponent<ProjectCardProps & React.RefAttributes<HTMLDivElement>>;
export {};
