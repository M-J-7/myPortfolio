import React from 'react';
import { motion } from "framer-motion"
import { HERO_CONTENT_1 } from '../constants/index.jsx';
import heroPic from "../assets/hero_img.png";
const container = (delay) => ({
    hidden : {x: -100, opacity: 0},
    visible: {
        x:0,
        opacity:1,
        transition: {duration: 0.5, delay}
    }

})

const Hero = () => {
  return (
    <>
      <div className="border-b border-neutral-900 pb-4 lg:mb-35">
        <div className="flex flex-wrap">
          {/* Left Section */}
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col items-center lg:items-start">
            <motion.h1 
            variants={container(0)}
            initial="hidden"
            animate="visible"
            className="pb-10 text-6xl font-thin tracking-tight lg:mt-16 lg:text-8xl">
                Mihir Jha
              </motion.h1>
              <motion.span 
              variants={container(0.5)}
              initial="hidden"
              animate="visible"
              className="bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-4xl tracking-tight text-transparent">
                Web Developer
              </motion.span>
              <motion.p 
              variants={container(1)}
              initial="hidden"
              animate="visible"
              className="my-2 max-w-xl py-6 font-light tracking-tighter">
                My Goal is to write <strong className="font-bold">maintainable</strong>, <strong className="font-bold">clean</strong> and <strong className="font-bold">understandable</strong> code to ensure the development process is enjoyable.
                </motion.p>

            </div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-1/2 lg:p-8">
            <div className="flex justify-center">
              <img 
              
              className="hero-pic rounded-lg" src={heroPic} alt="mihrjha" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
