import React from 'react';
import { FaInstagram, FaLinkedin, FaTwitter, FaGithub, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <>
            {/* VPN Notice Banner */}
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

            {/* Main Footer */}
            <footer className="relative bg-[#0a0a0a] text-gray-300 overflow-hidden">
                <div className="container mx-auto px-6 py-8 relative z-10">
                    {/* Upper Row: Social Icons & Navigation Links */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
                        {/* Social Icons */}
                        <div className="flex flex-col items-center md:items-start gap-3">
                            <span className="text-sm font-medium text-gray-400">Social</span>
                            <div className="flex items-center gap-4">
                                <a
                                    href="https://www.instagram.com/jaiswalsachin_49/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:border-white hover:text-white transition-all"
                                    aria-label="Instagram"
                                >
                                    <FaInstagram size={20} />
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/sachin-jaiswal-005a38323/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:border-white hover:text-white transition-all"
                                    aria-label="LinkedIn"
                                >
                                    <FaLinkedin size={20} />
                                </a>
                                <a
                                    href="https://x.com/weirdo_49"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:border-white hover:text-white transition-all"
                                    aria-label="Twitter"
                                >
                                    <FaTwitter size={20} />
                                </a>
                                <a
                                    href="https://github.com/jaiswalsachin49"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:border-white hover:text-white transition-all"
                                    aria-label="GitHub"
                                >
                                    <FaGithub size={20} />
                                </a>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
                            <Link
                                to="/"
                                className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600 rounded-full text-sm font-medium transition-all"
                            >
                                Home
                            </Link>
                            <Link
                                to="/films"
                                className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600 rounded-full text-sm font-medium transition-all"
                            >
                                Films
                            </Link>
                            <Link
                                to="/tv-shows"
                                className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600 rounded-full text-sm font-medium transition-all"
                            >
                                TV Shows
                            </Link>
                            <Link
                                to="/favorites"
                                className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600 rounded-full text-sm font-medium transition-all"
                            >
                                Favorites
                            </Link>
                            <Link
                                to="/genres"
                                className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600 rounded-full text-sm font-medium transition-all"
                            >
                                Genres
                            </Link>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-800 my-6"></div>

                    {/* Middle Row: Copyright & Attribution */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm mb-8">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <p>All copyrights ©{new Date().getFullYear()} Zooper</p>
                            <a href="#" className="hover:text-white transition-colors">
                                Terms and Conditions
                            </a>
                        </div>
                        <div className="absolute right-6 z-20">
                        <p className="text-xs md:text-sm flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                            <span className="text-gray-300">Made with</span>
                            <FaHeart className="text-red-500" size={12} />
                            <span className="text-gray-300">by</span>
                            <a
                                href='https://portfolioSachin49.vercel.app'
                                target='_blank'
                                rel="noopener noreferrer"
                                className='text-white font-medium'
                            >
                                Sachin
                            </a>
                        </p>
                    </div> 
                    </div>
                </div>

                {/* Large Branded Text Section */}
                {/* <div className="relative h-40 md:h-48 overflow-hidden"> */}
                    {/* Gradient Background */}
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-blue-800/10 to-transparent"></div> */}

                    {/* Large ZOOPER Text */}
                    {/* <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center px-6 pb-2">
                        <h2
                            className="text-[10rem] md:text-[14rem] lg:text-[20rem] font-black leading-none select-none uppercase"
                            style={{
                                background: 'linear-gradient(to bottom, #f0f0f0 0%, #b0b0b0 30%, #808080 60%, #505050 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.8)) drop-shadow(0 5px 15px rgba(0, 0, 0, 0.6))',
                                letterSpacing: '-0.08em',
                                fontWeight: '900'
                            }}
                        >
                            ZOOPER
                        </h2>
                    </div> */}

                    {/* Made with Love - positioned in corner */}
                    {/* <div className="absolute bottom-4 right-6 z-20">
                        <p className="text-xs md:text-sm flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                            <span className="text-gray-300">Made with</span>
                            <FaHeart className="text-red-500" size={12} />
                            <span className="text-gray-300">by</span>
                            <a
                                href='https://portfolioSachin49.vercel.app'
                                target='_blank'
                                rel="noopener noreferrer"
                                className='text-white hover:underline font-medium'
                            >
                                Sachin
                            </a>
                        </p>
                    </div>  */}
                {/* </div> */}
            </footer>
        </>
    );
}
