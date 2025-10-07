import React from "react";
import SectionCard from "../components/SectionCard";

const Home: React.FC = () => {

    return(
        <SectionCard sectionKey="home" title="Welcome">
        <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white">
            {/* TODO: Add your name */}
            Your Name
            </h1>
            <p className="text-2xl text-white/90">
            {/* TODO: Add your title */}
            Computer Science Student & Software Engineer
            </p>
            <p className="text-lg text-white/70 mt-4">
            {/* TODO: Add your tagline */}
            Building the future, one line of code at a time.
            </p>
        </div>
        </SectionCard>
    );
}

export default Home;