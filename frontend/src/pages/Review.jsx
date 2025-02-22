

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { getImageUrl } from '../services/tmdb';

const Review = () => {
    const [userComments, setUserComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchUserComments = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/comments/user/${user._id}`, {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Error al cargar comentarios');
                const data = await response.json();
                setUserComments(data);
            } catch (err) {
                setError('Error al cargar tus comentarios');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserComments();
        }
    }, [user]);

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setUserComments(userComments.filter(comment => comment._id !== commentId));
            }
        } catch (error) {
            console.error('Error al eliminar comentario:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <BeatLoader color="#0369a1" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-sky-950 mb-8">Mis Comentarios</h1>
            {userComments.length === 0 ? (
                <div className="text-center text-gray-600 py-10">
                    <p className="text-xl">No has hecho ningún comentario aún</p>
                    <p className="mt-2">¡Explora películas y comparte tu opinión!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {userComments.map(comment => (
                        <div key={comment._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="md:flex">
                                <div className="md:w-1/4">
                                    <Link to={`/movie/${comment.movieId}`}>
                                        <img
                                            src={getImageUrl(comment.movie?.poster_path)}
                                            alt={comment.movie?.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    </Link>
                                </div>
                                <div className="p-6 md:w-3/4">
                                    <div className="flex justify-between items-start">
                                        <Link 
                                            to={`/movie/${comment.movieId}`}
                                            className="text-xl font-bold text-sky-950 hover:text-sky-700"
                                        >
                                            {comment.movie?.title}
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteComment(comment._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-2">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="mt-4">{comment.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Review;