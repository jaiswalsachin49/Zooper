import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Search as SearchIcon } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import apiClient from "../services/api";

import { useModal } from "../context/ModalContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { openModal } = useModal();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);

    if (val.trim().length > 1) {
      try {
        const response = await apiClient.get("/search/multi", {
          params: { query: val }
        });
        setResults(response.data.results.slice(0, 5)); // Limit to 5
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error", error);
      }
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  };

  const handleResultClick = (item) => {
    setShowDropdown(false);
    setQuery("");
    openModal(item);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "TV Shows", path: "/TV-Shows" },
    { name: "Films", path: "/films" },
    { name: "Favorites", path: "/favorites" },
    { name: "Genres", path: "/genres" },
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 w-full px-6 py-4 bg-gradient-to-b from-[#0f1014] to-transparent/50 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1700px] mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to={"/"} className="flex items-center gap-2 z-50">
          <img src="/logo_white.png" alt="logo" className="w-8 h-8 object-contain" />
          <span className="text-white text-xl font-bold tracking-wide">ZOOPER</span>
        </Link>

        {/* Desktop Links - Center */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-300 ${isActive ? "text-white" : "text-gray-400 hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Right Side - Search */}
        <div className="flex items-center gap-4 relative" ref={searchRef}>
          <div className="relative group">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-2 w-40 md:w-64 focus-within:w-48 md:focus-within:w-72 focus-within:bg-black/50 focus-within:border-blue-500/50 transition-all duration-300">
              <SearchIcon size={16} className="text-gray-400 group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={handleSearch}
                onFocus={() => results.length > 0 && setShowDropdown(true)}
                className="bg-transparent border-none outline-none text-white text-sm ml-2 w-full placeholder-gray-500"
              />
            </div>

            {/* Search Dropdown */}
            {showDropdown && results.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-72 md:w-80 bg-[#16181f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[60]">
                {results.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleResultClick(item)}
                    className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                  >
                    <div className="w-10 h-14 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                      {item.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                          alt={item.title || item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium truncate">
                        {item.title || item.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{(item.release_date || item.first_air_date)?.slice(0, 4) || '—'}</span>
                        <span className="capitalize">{item.media_type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/95 z-40 flex flex-col items-center justify-center space-y-8 transition-all duration-300 md:hidden ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
      >
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `text-2xl font-bold ${isActive ? "text-blue-500" : "text-white"}`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
