import React from "react";

const Intro:React.FC = () => {
    return (
        <div className="absolute flex flex-col justify-center align-middle text-center 
         font-alfa w-full text-[100px] top-1/2 -translate-y-1/2 ">
            <span className=" text-white [text-shadow:_0_0_4px_white]">HEY, I'M RANDY</span>
            <span className="-mt-5 text-border "> I LIKE TO BUILD AND DEPLOY WEBSITES</span>
            <span className="-mt-5 text-white [text-shadow:_0_0_4px_white]">HEY, I'M RANDY</span>
        </div>
    );
}


export default Intro;