import { motion, type PanInfo } from "framer-motion";
import React, { useState } from "react";
import type { SimplePhysics, PhysicsEntity } from "../physics/SimplePhysics";


interface MassBlockProps {
    physics: SimplePhysics;
    entity: PhysicsEntity;   // reference to this block inside physics
    viewportCenterX: number;
    cameraX: number;
    onDrop?: (entity: PhysicsEntity, dropX: number, dropY: number) => void;
}


const MassBlock: React.FC<MassBlockProps> = ({ physics, entity, viewportCenterX, cameraX, onDrop }) => {

    const [impact, setImpact] = useState<boolean>(false); // Optional for styling
    const [dragging, setDragging] = useState<boolean>(false);

    // Coordinate of mass (in respect to WorldCanvas) - cameraX + viewportCenterX
    const screenX: number = entity.x + viewportCenterX - cameraX;
    const screenY: number = entity.y;


    const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => { 
        setImpact(false);

        // Compute drop coordinates
        const dropX = screenX + info.offset.x;
        const dropY = screenY + info.offset.y;

        // Report to parent (Projects)
        onDrop?.(entity, dropX, dropY); // If onDrop is defined
    }

    return (
        <motion.div
            drag
            dragMomentum = {false}
            onDragStart = {() => setDragging(true)}
            onDragEnd = {handleDragEnd}
            className={`absolute rounded-xl border flex items-center justify-center 
                        text-white font-semibold select-none ${dragging ? "hover:cursor-grabbing" : "hover:cursor-pointer"}`}
            style={{
                width: `${entity.width}px`,
                height: `${entity.height}px`,
                left: `${screenX - entity.width! / 2}px`,
                top: `${screenY - entity.height! / 2}px`,
                backgroundColor: impact ? "rgba(0,255,255,0.7)" : "rgba(0,255,255,0.4)",
                borderColor: "rgba(0,255,255,0.25)",
                boxShadow: impact
                ? "0 0 20px rgba(0,255,255,0.9)"
                : "0 0 12px rgba(0,255,255,0.5)",
            }}
            animate={{ scale: impact ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
            {entity.label}
        </motion.div>
  );
}

export default MassBlock;