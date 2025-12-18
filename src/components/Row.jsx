import React, { useRef, useContext } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useMovieData from '../hooks/MovieData';
import MovieCard from './Card';
import CardSkeleton from './CardSkeleton';
import { GenresContext } from '../context/genres.context';

const Row = ({ title, genreId, movies, mediaType = "movie" }) => {
    const { data: fetchedMovies, loading, error } = genreId
        ? useMovieData(genreId, mediaType)
        : { data: [], loading: false, error: null };

    const displayMovies = movies || fetchedMovies;
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const { setGenre } = useContext(GenresContext);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleViewMore = () => {
        // Use mediaType to determine destination
        if (mediaType === "tv") {
            if (genreId) {
                setGenre(genreId);
            }
            navigate('/TV-Shows');
        } else {
            if (genreId) {
                setGenre(genreId);
            } else {
                setGenre(null);
            }
            navigate('/films');
        }
    };

    if (loading && !movies) {
        return (
            <div className="mb-8 px-6">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-4">{title}</h2>
                <div className="flex gap-4 overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="min-w-[200px] md:min-w-[240px]">
                            <CardSkeleton />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error && !movies) return null;
    if (!displayMovies || displayMovies.length === 0) return null;

    return (
        <div className="mb-10 px-6 group relative">
            <div className="flex justify-between items-end mb-4 px-4">
                <h2 className="text-xl md:text-2xl font-bold text-white border-l-4 border-blue-500 pl-4">
                    {title}
                </h2>
                <button
                    onClick={handleViewMore}
                    className="text-sm text-gray-400 hover:text-blue-500 font-semibold transition-colors flex items-center gap-1"
                >
                    View More <FaChevronRight size={12} />
                </button>
            </div>

            <div className="relative">
                {/* Scroll Left Button */}
                <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:bg-black/80 hidden md:block"
                    onClick={() => scroll('left')}
                >
                    <FaChevronLeft size={24} />
                </button>

                {/* Scroll Container */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth snap-x pl-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {displayMovies.map((movie) => (
                        movie.poster_path ? (
                            <div key={movie.id} className="min-w-[160px] md:min-w-[200px] snap-start">
                                <MovieCard
                                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    backdrop_path={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                                    {...movie}
                                    media_type={movie.media_type || mediaType}
                                />
                            </div>
                        ) : null
                    ))}
                </div>

                {/* Scroll Right Button */}
                <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:bg-black/80 hidden md:block"
                    onClick={() => scroll('right')}
                >
                    <FaChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default Row;
