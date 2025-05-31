import logo from "../assets/logo.png";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";

const Navbar = () => {
  return (
    <nav className="mb-10 md:mb-20 flex items-start justify-between py-4 px-4 md:px-6">
      {/* Logo */}
      <div className="w-12 md:w-16 flex flex-shrink-0 pt-4 md:pt-6">
        <img src={logo} alt="logo" className="object-contain w-full"/>
      </div>

      {/* Center and Right buttons */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between w-full md:ml-8 gap-3 pt-4 md:pt-6">
        {/* Resume Button - Centered on desktop */}
        <div className="flex-1 flex justify-center">
          <button
            type="button"
            className="flex items-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            <a
              href="https://drive.google.com/file/d/1SVBA9iM1LrEDmA5PWn5ZtJryDHDjDeo-/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <IoDocumentText className="mr-2 text-lg" />
              Resume
            </a>
          </button>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4 text-2xl">
          <a href="https://github.com/M-J-7" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/mihirjha7/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            <FaLinkedin />
          </a>
          <a href="https://x.com/MihirJha007" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            <FaSquareXTwitter />
          </a>
        </div>
      </div>

      {/* Empty div for balance */}
      <div className="w-12 md:w-16"></div>
    </nav>
  );
};

export default Navbar;
