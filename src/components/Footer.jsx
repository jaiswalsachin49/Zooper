import React from 'react';
import { FaGithub, FaLinkedin, FaHeart } from 'react-icons/fa';

export default function Footer() {
    return (
            <footer className="bg-gray-900 text-gray-300 py-6 mt-8">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
                <p className="text-sm">&copy; {new Date().getFullYear()} MovieVerse. All rights reserved.</p>

                <div className="flex items-center gap-4 mt-4 md:mt-0">
                <a href="https://github.com/jaiswalsachin49" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    <FaGithub size={20} />
                </a>
                <a href="https://www.linkedin.com/in/sachin-jaiswal-005a38323/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    <FaLinkedin size={20} />
                </a>
                </div>

                <p className="text-sm mt-4 md:mt-0 flex items-center">
                Made with <FaHeart className="text-red-500 mx-1" /> by Sachin
                </p>
            </div>
            </footer>
    );
}
