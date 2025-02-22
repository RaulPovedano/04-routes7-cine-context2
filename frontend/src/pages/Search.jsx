

import { useState } from 'react';
import MovieCard from '../components/MovieCard';
import { searchMovies } from '../services/tmdb';

const Search = () => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        
        setLoading(true);
        try {
            const data = await searchMovies(query, page);
            setMovies(data.results);
            setTotalPages(data.total_pages);
            setLoading(false);
        } catch (error) {
            console.error('Error searching movies:', error);
            setLoading(false);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(prev => prev - 1);
            handleSearch(new Event('submit'));
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(prev => prev + 1);
            handleSearch(new Event('submit'));
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <form onSubmit={handleSearch} className="mb-8">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar películas..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                    >
                        Buscar
                    </button>
                </div>
            </form>

            {loading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
                </div>
            ) : (
                <>
                    {movies.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {movies.map(movie => (
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
                                    Página {page} de {totalPages}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={page === totalPages}
                                    className={`px-4 py-2 rounded-lg ${
                                        page === totalPages
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-sky-500 hover:bg-sky-600 text-white'
                                    }`}
                                >
                                    Siguiente
                                </button>
                            </div>
                        </>
                    ) : (
                        query && <p className="text-center text-gray-600">No se encontraron películas</p>
                    )}
                </>
            )}
        </div>
    );
};

export default Search;