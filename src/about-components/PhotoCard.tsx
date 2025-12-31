import { motion } from "framer-motion";
import { FaGithubSquare } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import React, { useRef, useState } from "react";


interface PhotoCardProps {
    imgSrc: string;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ imgSrc }) => {
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const cardRef = useRef<HTMLDivElement>(null);

    type Rotation = {x: number, y: number};
    const [rotation, setRotation] = useState<Rotation>({x: 0, y: 0});
    

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const card = cardRef.current;
        if (!card) return;

        const rect: DOMRect = card.getBoundingClientRect();
        const cardX: number = e.clientX - rect.left; // X position within the card
        const cardY: number = e.clientY - rect.top;  // Y position within the card

        const rotateX: number = ((cardY - rect.height / 2) / rect.height) * -20; // invert vertical
        const rotateY: number = ((cardX - rect.width / 2) / rect.width) * 20;

        setRotation({x: rotateX, y: rotateY});
    }

    // Reset rotation when mouse leaves
    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    }

    // Set flip to flip other side of card
    const handleFlip = () => {
        setIsFlipped(!isFlipped);
        if(!isFlipped) {
            setRotation({ x: 0, y: 0 });
        }
    }

    return (
        <div
            style={{
            perspective: "800px",
            }}
        >
            <motion.div
                ref={cardRef}
                onMouseMove={!isFlipped ? handleMouseMove : undefined}
                onMouseLeave={!isFlipped ? handleMouseLeave : undefined}
                animate={{
                    rotateX: rotation.x,
                    rotateY: rotation.y,
                }}
                transition={{
                    type: "tween",  // immediate interpolation, not physics-based
                    ease: "linear",
                    duration: 0.01, // short, almost instant
                }}
            >
                <div className="relative group perspective-1000" style={{ perspective: '1000px' }}>

                    {/* Glow effect */}
                    <motion.div 
                    className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-white/5 rounded-3xl blur-xl"
                    animate={{
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    />
                    
                    {/* Card Container with 3D flip */}
                    <motion.div
                        className="relative w-80 h-96 cursor-pointer"
                        onClick={handleFlip}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >

                        {/* Front of card */}
                        <div 
                            className="absolute inset-0 rounded-3xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-2xl"
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            {/* Image container */}
                            <div className="relative h-full w-full p-4">
                            <div className="h-full w-full rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900">
                                {/* Placeholder image - replace with actual image */}
                                <img 
                                src={imgSrc}
                                className="w-full h-full object-cover"
                                />
                            </div>
                            </div>
                            
                            {/* Subtle reflection effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50"></div>
                            
                            {/* Edge glow */}
                            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10"></div>
                        </div>

                        {/* Back of card */}
                        <motion.div 
                            className="absolute inset-0 rounded-3xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-2xl pointer-events-auto"
                            style={{ 
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                            }}

                        >
                            <div className="relative h-full w-full p-8 flex flex-col justify-center items-center text-white">
                            <div className="space-y-4 text-center">
                                <h3 className="text-2xl font-light tracking-wide">Socials</h3>
                                <div className="w-12 h-px bg-white/30 mx-auto"></div>

                                {/* Icons */}
                                <div className="flex flex-row justify-center text-[50px]  gap-2 ">
                                    <FaGithubSquare className="text-white/70 hover:text-white/10 z-10"/>
                                    <FaLinkedin className="text-white/70 hover:text-white/10 z-10"/>
                                    <FaSquareInstagram className="text-white/70 hover:text-white/10 z-10"/>
                                </div>
                            </div>
                            </div>
                            
                            {/* Subtle reflection effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50"></div>
                            
                            {/* Edge glow */}
                            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10"></div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}


export default PhotoCard;