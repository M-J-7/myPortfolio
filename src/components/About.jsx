import React from 'react';
import aboutImg from '../assets/aboutImg.png';
import { ABOUT_TEXT, ABOUT_TEXT_1, ABOUT_TEXT_2 } from '../constants/index.jsx';

const About = () => {
  return (
    <div className="border-b border-neutral-900 pb-8">
      {/* Section Title */}
      <h2 className="my-20 text-center text-4xl font-bold">
        About
        <span className="text-neutral-500"> Me</span>
      </h2>

      {/* About Section Content */}
      <div className="flex flex-wrap">
        {/* Left Column: Image */}
        <div className="w-full lg:w-1/2 lg:p-8">
          <div className="flex items-center justify-center">
            <img
              className="rounded-2xl w-4/5 lg:w-half"
              src={aboutImg}
              alt="About Me"
            />
          </div>
        </div>

        {/* Right Column: Text */}
        <div className="w-full lg:w-1/2 px-6 lg:px-8">
          <div className="text-neutral-300">
            <p className="my-4 max-w-xl">{ABOUT_TEXT}</p>
            <p className="my-4 max-w-xl">{ABOUT_TEXT_1}</p>
            <p className="my-4 max-w-xl">{ABOUT_TEXT_2}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
