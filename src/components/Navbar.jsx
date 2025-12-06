import React, { useState, useContext } from "react";
import { Menu, X } from "lucide-react";
import Search from "../assets/search.png";
import { Link, NavLink } from "react-router-dom";
import GenreDropdown from "./Genres";
import { SearchContext } from "../context/search.context.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const navigate = useNavigate();

  function handleSearch(event) {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.trim() !== "") {
      navigate(`/search/${query}`);
    } else {
      navigate("/");
    }
  }

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex justify-between items-center px-8 py-4 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm transition-all duration-300">
      <Link to={"/"}>
        <div className="text-white text-2xl font-bold flex items-center gap-2 px-1 sm:text-[1.5rem]">
          <img src="/logo_white.png" alt="logo" className="w-8" />
          ZOOPER
        </div>
      </Link>

      <div className="md:flex items-center md:space-x-12 space-x-4 sm:w-[45vw] ml-4 justify-between">
        <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 md:w-64 ml-5 sm:w-40 transition-all focus-within:bg-white/10 focus-within:border-white/20">
          <img src={Search} alt="Search" className="w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={handleSearch}
            className="bg-transparent outline-none text-white placeholder-gray-400 text-sm w-full ml-2"
          />
        </div>

        <div className="space-x-12 hidden md:flex text-white text-[1.2vw] p-[0.8vw]">
          <NavLink to={"/"} className={({ isActive }) => isActive ? "text-white font-bold whitespace-nowrap" : "text-gray-400 hover:text-white transition-colors whitespace-nowrap"}>
            <div className="cursor-pointer">Home</div>
          </NavLink>
          <NavLink to={"/TV-Shows"} className={({ isActive }) => isActive ? "text-white font-bold whitespace-nowrap" : "text-gray-400 hover:text-white transition-colors whitespace-nowrap"}>
            <div className="cursor-pointer">TV-Shows</div>
          </NavLink>
          <NavLink to={"/films"} className={({ isActive }) => isActive ? "text-white font-bold whitespace-nowrap" : "text-gray-400 hover:text-white transition-colors whitespace-nowrap"}>
            <div className="cursor-pointer">Films</div>
          </NavLink>
          <NavLink to={"/favorites"} className={({ isActive }) => isActive ? "text-white font-bold whitespace-nowrap" : "text-gray-400 hover:text-white transition-colors whitespace-nowrap"}>
            <div className="cursor-pointer">Favorites</div>
          </NavLink>
          <GenreDropdown />
        </div>
      </div>

      <button
        className="md:hidden text-white focus:outline-none"
        aria-label="Toggle Menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {menuOpen && (
        <div className="absolute top-[80px] right-0 bg-black/80 backdrop-blur-xl rounded-xl p-4 flex flex-col space-y-4 text-white md:hidden w-[200px] max-h-[calc(100vh-100px)] overflow-auto">
          <Link to={"/"} onClick={() => setMenuOpen(false)}>
            <div className="hover:text-gray-300 cursor-pointer">Home</div>
          </Link>
          <Link to={"/TV-Shows"} onClick={() => setMenuOpen(false)}>
            <div className="hover:text-gray-300 cursor-pointer">TV-Shows</div>
          </Link>
          <Link to={"/films"} onClick={() => setMenuOpen(false)}>
            <div className="hover:text-gray-300 cursor-pointer">Films</div>
          </Link>
          <Link to={"/favorites"} onClick={() => setMenuOpen(false)}>
            <div className="hover:text-gray-300 cursor-pointer">Favorites</div>
          </Link>
          <Link to={"/watch-history"} onClick={() => setMenuOpen(false)}>
            <div className="hover:text-gray-300 cursor-pointer">Watch History</div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
