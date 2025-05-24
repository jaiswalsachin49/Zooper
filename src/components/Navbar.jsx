import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Search from "../assets/search.png";
import { Link } from "react-router-dom";
import GenreDropdown from "./Genres";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[92%] flex justify-between items-center p-4 rounded-3xl backdrop-blur-[1rem] bg-white/10 header_font">
      <div className="text-white text-2xl font-bold">ZOOPER</div>

      <div className="md:flex items-center md:space-x-12 space-x-4">
        <div className="flex items-center bg-white/10 rounded-3xl px-2 py-3 w-56 ml-4">
          <img src={Search} alt="Search" className="w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search here..."
            className="bg-transparent outline-none text-white placeholder-white-400 text-sm w-full seach_input ml-2"
          />
        </div>
        <div className="space-x-12 hidden md:flex text-white text-[1.2vw] p-[0.8vw]">
            <Link to={"/"} ><div className="hover:text-gray-300">Home</div></Link>
            <Link to={"/TV-Shows"} ><div className="hover:text-gray-300">TV-Shows</div></Link>
            <Link to={"/films"} ><div className="hover:text-gray-300">Films</div></Link>
            <GenreDropdown />
        </div>
      </div>
      <button
        className="md:hidden text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {menuOpen && (
        <div className="absolute top-[80px] right-0 bg-black/80 backdrop-blur-xl rounded-xl p-4 flex flex-col space-y-4 text-white md:hidden w-[200px] h-[100vh]">
            <Link to={"/"} ><div className="hover:text-gray-300">Home</div></Link>
            <Link to={"/TV-Shows"} ><div className="hover:text-gray-300">TV-Shows</div></Link>
            <Link to={"/films"} ><div className="hover:text-gray-300">Films</div></Link>
            <GenreDropdown />
        </div>
      )}
    </div>
  );
};

export default Navbar;
