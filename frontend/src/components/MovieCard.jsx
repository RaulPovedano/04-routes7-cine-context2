
import { Link } from "react-router-dom";
import { getImageUrl } from "../services/tmdb";
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export const MovieCard = ({ movie, onFavoriteChange }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/favorites/${movie.id}/${user._id}`, {
          credentials: 'include'
        });
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    if (user) checkFavorite();
  }, [movie.id, user]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch(`http://localhost:3000/api/favorites/${movie.id}/${user._id}`, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          movieId: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date
        })
      });

      if (response.ok) {
        const newFavoriteStatus = !isFavorite;
        setIsFavorite(newFavoriteStatus);
        if (onFavoriteChange) {
          onFavoriteChange(movie, newFavoriteStatus);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <Link to={`/movie/${movie.id}`} className="bg-cyan-200 rounded rounded-md">
      <article className="card transform transition-transform duration-300 hover:scale-105">
        <div className="relative aspect-[2/3]">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
          {user && (
            <button
              onClick={handleFavoriteClick}
              className={`absolute top-2 left-2 p-2 rounded-full transition-colors duration-200 ${
                isFavorite 
                  ? 'bg-amber-400 text-sky-950' 
                  : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill={isFavorite ? "currentColor" : "none"}
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
            </button>
          )}
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white py-1 px-2 rounded">
            ⭐ {rating}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg line-clamp-2 text-black">{movie.title}</h3>
          <p className="text-sm text-gray-800 line-clamp-2" >
            {movie.release_date}
          </p>
        </div>
      </article>
    </Link>
  );
};
export default MovieCard;
