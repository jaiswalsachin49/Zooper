import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ image, title, description, id }) => {
  const navigate = useNavigate()
  return (
    <div className="relative group overflow-hidden rounded-xl cursor-pointer bg-black/20 backdrop-blur-md w-[15vw] h-auto shadow-lg transition-transform duration-300 hover:scale-105 card">
      <img
        src={image}
        alt={title}
        className="w-fit h-auto object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h2 className="text-white text-lg font-bold mb-2">{title}</h2>
        <p className="text-gray-300 text-sm line-clamp-2 mb-4">{description}</p>
        <p
          onClick={()=>{
            navigate(`/player/${media_type}/${id}`)
          }}
          className="bg-white text-black font-semibold py-2 rounded-lg text-center hover:bg-gray-200 transition-colors"
        >
          Watch Now
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
