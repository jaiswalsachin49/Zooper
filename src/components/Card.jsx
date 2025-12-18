import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../context/ModalContext";

const MovieCard = ({ image, title, backdrop_path, description, overview, id, media_type, vote_average, release_date, first_air_date, original_language, popularity, vote_count }) => {
  const navigate = useNavigate();
  const { openModal } = useModal();

  // Ensure description is populated
  const finalDescription = description || overview;

  const handleCardClick = () => {
    openModal({
      title,
      name: title,
      backdrop_path,
      poster_path: image,
      overview: finalDescription,
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
        className="relative group/card overflow-hidden rounded-xl cursor-pointer bg-white/5 border border-white/10 backdrop-blur-sm w-full h-auto shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-white/20 card"
      >
        {/* Glass Shine Effect */}
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-cyan-300/70 backdrop-blur-sm opacity-40 group-hover/card:animate-[shine_1s_infinite]" />

        <img
          src={image}
          alt={title}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover/card:scale-105"
        />

        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
          <h2 className="text-white text-lg font-bold mb-2 leading-tight">{title}</h2>
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
            <span className="text-green-400 font-bold">{Math.round(vote_average * 10)}% Match</span>
            <span>{(release_date || first_air_date)?.slice(0, 4)}</span>
          </div>
          <p className="text-gray-300 text-xs line-clamp-3 mb-4">{finalDescription}</p>
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent opening dialog
              navigate(`/player/${media_type?media_type:"tv"}/${id}`, { state: { movieData: { id, title, backdrop_path, poster_path: image, overview: finalDescription, vote_average, release_date, first_air_date, original_language, popularity, vote_count, media_type:media_type?media_type:"tv" } } });
            }}
            className="bg-white text-black font-bold py-2 rounded-lg 
            text-center hover:bg-gray-200 transition-all duration-300 
            shadow-lg transform active:scale-95 text-sm flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" /></svg>
            Watch Now
          </button>
        </div>
      </div>
    </>
  );
};

export default MovieCard;
