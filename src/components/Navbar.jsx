import logo from "../assets/logo.png";

import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";

const Navbar = () => {
  return (
    <nav className="mb-20 flex items-center justify-between py-6">
      <div className="w-10 flex flex-shrink-0 items-center white-100">
        <img src={logo} alt="logo" className="object-contain"/>
      </div>

      <div className="m-8 flex items-center justify-center gap-4 text-2xl">
        <button
          type="button"
          className="flex items-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        >
          <a
            href="https://drive.google.com/file/d/1R01TzYXJarh2Hx5HFuitMda1au2IFcDz/view?usp=sharing" // Replace with your link
            target="_blank" // Optional: Open in a new tab
            rel="noopener noreferrer" // For security
            className="flex items-center"
          >
            <IoDocumentText className="mr-2 text-lg" />
            Resume
          </a>
        </button>
        <a href ="https://github.com/M-J-7" target="_blank" rel="">
        <FaGithub />
        </a>
        <a href ="https://www.linkedin.com/in/mihirjha7/" target="_blank" rel="">
        <FaLinkedin />
        </a>
        <a href ="https://x.com/MihirJha007" target="_blank" rel="">
        <FaSquareXTwitter />
        </a>
        
        
        
        
        
      </div>
    </nav>
  );
};

export default Navbar;
