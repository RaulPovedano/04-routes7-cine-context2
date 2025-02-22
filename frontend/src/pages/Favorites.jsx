import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MovieCard } from '../components/MovieCard';
import { BeatLoader } from 'react-spinners';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/favorites/${user._id}`, {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Error al cargar favoritos');
                const data = await response.json();
                setFavorites(data);
            } catch (err) {
                setError('Error al cargar tus películas favoritas');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchFavorites();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <BeatLoader color="#0369a1" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-sky-950 mb-8">Mis Películas Favoritas</h1>
            {favorites.length === 0 ? (
                <div className="text-center text-gray-600 py-10">
                    <p className="text-xl">No tienes películas favoritas aún</p>
                    <p className="mt-2">¡Explora películas y añade las que más te gusten!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {favorites.map(movie => (
                        <MovieCard 
                            key={movie.movieId} 
                            movie={{
                                id: movie.movieId,
                                title: movie.title,
                                poster_path: movie.poster_path,
                                vote_average: movie.vote_average,
                                release_date: movie.release_date
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;