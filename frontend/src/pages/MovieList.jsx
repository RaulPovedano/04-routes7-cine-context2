
import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { getPopularMovies } from '../services/tmdb';

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortedMovies, setSortedMovies] = useState([]);
    const [sortBy, setSortBy] = useState('newest');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await getPopularMovies(page);
                setMovies(data.results);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setLoading(false);
            }
        };
        fetchMovies();
    }, [page]);

    useEffect(() => {
        if (movies.length > 0) {
            const sorted = [...movies];
            switch (sortBy) {
                case 'newest':
                    sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
                    break;
                case 'rating':
                    sorted.sort((a, b) => b.vote_average - a.vote_average);
                    break;
                case 'popularity':
                    sorted.sort((a, b) => b.popularity - a.popularity);
                    break;
                default:
                    break;
            }
            setSortedMovies(sorted);
        }
    }, [movies, sortBy]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    const handlePrevPage = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        setPage(prev => prev + 1);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="mb-6">
                <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                    <option value="newest">Mas Recientes</option>
                    <option value="rating">Mejores Valoradas</option>
                    <option value="popularity">Mas Populares</option>
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortedMovies.map(movie => (
                    <div key={movie.id}>
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </div>
            
            {/* Pagination Controls */}
            <div className="flex justify-center gap-4 mt-8">
                <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-lg ${
                        page === 1 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-sky-500 hover:bg-sky-600 text-white'
                    }`}
                >
                    Anterior
                </button>
                <span className="flex items-center font-semibold">
                    Página {page}
                </span>
                <button
                    onClick={handleNextPage}
                    className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default MovieList;