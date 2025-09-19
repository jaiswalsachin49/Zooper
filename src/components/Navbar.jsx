import React, { useState, useContext } from "react";
import { Menu, X } from "lucide-react";
import Search from "../assets/search.png";
import { Link,NavLink } from "react-router-dom";
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
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10 w-[92%] flex justify-between items-center p-3 rounded-3xl backdrop-blur-[1rem] bg-black/75 ring-[0.75px] ring-gray-200 header_font">
      <Link to={"/"}>
        <div className="text-white text-2xl font-bold flex items-center gap-2 px-1 sm:text-[1.5rem]">
          <img src="/logo_white.png" alt="logo" className="w-8" />
          ZOOPER
        </div>
      </Link>

      <div className="md:flex items-center md:space-x-12 space-x-4 sm:w-[45vw] ml-4 justify-between">
        <div className="flex items-center bg-white/20 rounded-3xl px-2 py-3 md:w-50 ml-5 sm:w-40">
          <img src={Search} alt="Search" className="w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={handleSearch}
            className="bg-transparent outline-none text-white placeholder-white/70 text-sm w-full ml-2"
          />
        </div>

        <div className="space-x-12 hidden md:flex text-white text-[1.2vw] p-[0.8vw]">
          <NavLink to={"/"}>
            <div className="hover:text-gray-300 cursor-pointer">Home</div>
          </NavLink>
          <NavLink to={"/TV-Shows"}>
            <div className="hover:text-gray-300 cursor-pointer">TV-Shows</div>
          </NavLink>
          <NavLink to={"/films"}>
            <div className="hover:text-gray-300 cursor-pointer">Films</div>
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
        </div>
      )}
    </div>
  );
};

export default Navbar;
