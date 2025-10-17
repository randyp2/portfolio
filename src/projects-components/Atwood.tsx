import React from "react";

const Atwood: React.FC = () => { 
    return (
        <div>
            {/* Main container */}
            <div className="relative w-full max-w-6xl h-screen flex items-start justify-center pt-20">
            
                {/* Pulley system */}
                <div className="relative h-full">
                
                    {/* Mounting bracket */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-gray-700 to-gray-600 shadow-lg"></div>
                    
                    {/* Pulley - larger */}
                    <div className="relative w-40 h-40 mx-auto">
                        {/* Outer ring with glow */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl">
                        <div className="absolute inset-0 rounded-full border-2 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.3)]"></div>
                        </div>
                        
                        {/* Inner circle */}
                        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-gray-900 to-black border border-white/10"></div>
                        
                        {/* Center hub */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.4)]"></div>
                        
                        {/* Spokes */}
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                        <div
                            key={angle}
                            className="absolute top-1/2 left-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            style={{
                            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                            transformOrigin: 'center'
                            }}
                        ></div>
                        ))}
                    </div>
                
                    {/* String on the right side - starts from edge of pulley */}
                    <div className="absolute top-20 left-1/2 translate-x-20 w-0.5 h-24 bg-gradient-to-b from-white/60 to-white/40 shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
                    
                    {/* String on the left side - starts from edge of pulley, goes to floor */}
                    <div className="absolute top-20 left-1/2 -translate-x-20 w-0.5 bg-gradient-to-b from-white/60 to-white/40 shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ height: 'calc(100vh - 200px)' }}></div>
                
                    {/* Mass on the right (larger, near top, transparent with drop zone) */}
                    <div className="absolute top-20 left-1/2 translate-x-20">
                        <div className="relative w-50 h-40 rounded-2xl bg-white/5 backdrop-blur-sm border-2 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center group hover:border-white/40 transition-all duration-300" style={{ transform: 'translateX(-50%)' }}>
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent"></div>
                        
                        {/* Drop zone indicator */}
                        <div className="absolute inset-4 border-2 border-dashed border-white/10 rounded-xl"></div>
                        
                        {/* Mass label */}
                        <div className="relative z-10 text-white/60 font-light text-sm tracking-wider">
                            DROP ZONE
                        </div>
                        
                        {/* Connection point at top */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.6)]"></div>
                        </div>
                    </div>
                
                    {/* Mass on the left (smaller, at floor) */}
                    <div className="absolute left-1/2 -translate-x-20" style={{ bottom: '120px' }}>
                        <div className="relative w-20 h-24 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center" style={{ transform: 'translateX(-50%)' }}>
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-white/5 to-transparent"></div>
                        
                        {/* Mass details */}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                            <div className="w-12 h-0.5 bg-white/20"></div>
                            <div className="w-12 h-0.5 bg-white/20"></div>
                            <div className="w-12 h-0.5 bg-white/20"></div>
                        </div>
                        
                        {/* Connection point at top */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.6)]"></div>
                        </div>
                        
                        {/* Floor line */}
                        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-40 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    </div>
            
                </div>
        
                {/* Ambient glow effects */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
}

export default Atwood;
