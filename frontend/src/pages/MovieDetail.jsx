import { useParams } from "react-router-dom";
import { useFetch } from "../hook/useFetch";
import { getImageUrl, getMovieDetails, getMovieVideos } from "../services/tmdb";
import { BeatLoader } from "react-spinners";
import CommentSection from "../components/CommentSection";
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const MovieDetail = () => {
    const { id } = useParams();
    const { data: movie, loading, error } = useFetch(() => getMovieDetails(id), [id]);
    const [trailer, setTrailer] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchTrailer = async () => {
            try {
                const videos = await getMovieVideos(id);
                const trailer = videos.results.find(
                    video => video.type === "Trailer" && video.site === "YouTube"
                );
                setTrailer(trailer);
            } catch (error) {
                console.error("Error fetching trailer:", error);
            }
        };

        if (id) fetchTrailer();
    }, [id]);

    if (loading) return <BeatLoader color="#0369a1" />;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="relative w-full h-[600px] mb-8 rounded-lg overflow-hidden">
                <img 
                    src={getImageUrl(movie?.backdrop_path, "original")} 
                    alt={movie?.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/3">
                        <img
                            src={getImageUrl(movie?.poster_path)}
                            alt={movie?.title}
                            className="w-full h-auto"
                        />
                    </div>
                    <div className="md:w-2/3 p-6">
                        <h1 className="text-3xl font-bold text-sky-950 mb-4">{movie.title}</h1>
                        <p className="text-gray-600 mb-4">{movie.overview}</p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="font-semibold">Fecha de estreno:</p>
                                <p>{movie.release_date}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Valoración:</p>
                                <p>⭐ {movie.vote_average.toFixed(1)}</p>
                            </div>
                        </div>
                        
                        {/* Trailer Section moved here */}
                        <div className="relative pt-[56.25%]">
                            {trailer ? (
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                                    src={`https://www.youtube.com/embed/${trailer.key}`}
                                    title="Movie Trailer"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="absolute top-0 left-0 w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                                    <p className="text-gray-600">No hay trailer disponible</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {user && <CommentSection movieId={id} />}
            </div>
        </div>
    );
};

export default MovieDetail;

