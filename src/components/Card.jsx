import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../context/ModalContext";

const MovieCard = ({ image, title, backdrop_path, description, id, media_type, vote_average, release_date, first_air_date, original_language, popularity, vote_count }) => {
  const navigate = useNavigate();
  const { openModal } = useModal();

  const handleCardClick = () => {
    openModal({
      title,
      name: title,
      backdrop_path,
      poster_path: image,
      overview: description,
      id,
      media_type,
      vote_average,
      release_date,
      first_air_date,
      original_language,
      popularity,
      vote_count
    });
  };

  return (
    <>
      {/* Movie Card */}
      <div
        onClick={handleCardClick}
        className="relative group overflow-hidden rounded-xl cursor-pointer bg-white/5 border border-white/10 backdrop-blur-sm w-full h-auto shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-white/20 card"
      >
        {/* Glass Shine Effect */}
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-cyan-300/70 backdrop-blur-sm opacity-40 group-hover:animate-[shine_1s_infinite]" />

        <img
          src={image}
          alt={title}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
          <h2 className="text-white text-lg font-bold mb-2">{title}</h2>
          <p className="text-gray-300 text-sm line-clamp-2 mb-4">{description}</p>
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent opening dialog
              navigate(`/player/${media_type}/${id}`);
            }}
            className="bg-blue-900 text-white font-semibold py-2 rounded-lg 
            text-center hover:bg-blue-800 transition-all duration-300 
            shadow-lg transform hover:scale-105 active:scale-95"

          >
            Watch Now
          </button>
        </div>
      </div>
    </>
  );
};

export default MovieCard;
