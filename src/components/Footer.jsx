import React from 'react';
import { FaGithub, FaLinkedin, FaHeart } from 'react-icons/fa';

export default function Footer() {
    return (
        <>
        <div className="bg-yellow-600 text-white text-sm py-2 text-center px-4">
            Some ISPs block access to TMDB. If the site doesn't work, please connect to a VPN.
            We recommend&nbsp;
            <a
            href="https://1.1.1.1/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold hover:text-gray-300"
            >
            1.1.1.1 VPN
            </a>
        </div>

        <footer className="bg-gray-900 text-gray-300 py-6 mt-4">
            <div className="container mx-auto flex flex-col md:flex-row flex-wrap items-center justify-between gap-4 px-4">
            <p className="text-sm">&copy; {new Date().getFullYear()} Zooper. All rights reserved.</p>

            <div className="flex items-center gap-4">
                <a
                href="https://github.com/jaiswalsachin49"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
                >
                <FaGithub size={20} />
                </a>
                <a
                href="https://www.linkedin.com/in/sachin-jaiswal-005a38323/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
                >
                <FaLinkedin size={20} />
                </a>
            </div>

            <p className="text-sm flex items-center">
                Made with <FaHeart className="text-red-500 mx-1" /> by <a href='https://portfolioSachin49.vercel.app' target='blank' className='ml-1'> Sachin </a>
            </p>
            </div>
        </footer>
        </>
    );
    }
