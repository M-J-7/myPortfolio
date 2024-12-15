import React from 'react';
import { RiReactjsLine } from "react-icons/ri";
import { FaNode } from "react-icons/fa";
import { SiMongodb, SiExpress, SiMysql } from "react-icons/si";
import { motion } from 'framer-motion';

const iconVariants = (duration) => ({
  initial: { y: -10 },
  animate: {
    y: [10, -10],
    transition: {
      duration: duration,
      ease: "linear",
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
});


const Technologies = () => {
  return (
    <div className="border-b border-neutral-800 pb-24">
      <h1 className="my-20 text-center text-4xl">Technologies</h1>
      <div className="flex flex-wrap items-center justify-center gap-8">
        {/* React */}
        <motion.div
        variants={iconVariants(2.5)}
        initial="initial"
        animate="animate"
        className="flex items-center justify-center rounded-lg border border-neutral-700 p-3">
          <RiReactjsLine className="text-7xl text-blue-400" />
        </motion.div>

        {/* Node.js */}
        <motion.div 
        variants={iconVariants(3)}
        initial="initial"
        animate="animate"
        className="flex items-center justify-center rounded-lg border border-neutral-700 p-3">
          <FaNode className="text-7xl text-green-500" />
        </motion.div>

        {/* MongoDB */}
        <motion.div
        variants={iconVariants(3.5)}
        initial="initial"
        animate="animate"
        className="flex items-center justify-center rounded-lg border border-neutral-700 p-3">
          <SiMongodb className="text-7xl text-green-400" />
        </motion.div>

        {/* Express.js */}
        <motion.div
        variants={iconVariants(4)}
        initial="initial"
        animate="animate"
        className="flex items-center justify-center rounded-lg border border-neutral-700 p-3">
          <SiExpress className="text-7xl text-gray-300" />
        </motion.div>

        {/* MySQL */}
        <motion.div
        variants={iconVariants(4.5)}
        initial="initial"
        animate="animate"
        className="flex items-center justify-center rounded-lg border border-neutral-700 p-3">
          <SiMysql className="text-7xl text-blue-500" />
        </motion.div>
      </div>
    </div>
  );
};

export default Technologies;
