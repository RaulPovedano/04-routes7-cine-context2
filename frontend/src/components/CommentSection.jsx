import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BeatLoader } from 'react-spinners';

const CommentSection = ({ movieId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchComments();
    }, [movieId, user]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/comments/${movieId}/${user._id}`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Error al cargar comentarios');
            const data = await response.json();
            setComments(data);
        } catch (err) {
            setError('Error al cargar comentarios');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await fetch(`http://localhost:3000/api/comments/${movieId}/${user._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ content: newComment })
            });

            if (!response.ok) throw new Error('Error al añadir comentario');
            
            const addedComment = await response.json();
            setComments([...comments, addedComment]);
            setNewComment('');
        } catch (err) {
            setError('Error al añadir el comentario');
        }
    };

    const handleDelete = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Error al eliminar comentario');
            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (err) {
            setError('Error al eliminar el comentario');
        }
    };

    if (loading) return <BeatLoader color="#0369a1" />;

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold text-sky-950 mb-4">Comentarios</h3>
            
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-2">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe tu comentario..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-sky-500"
                        rows="2"
                        required
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-sky-800 text-white rounded-lg hover:bg-sky-900"
                    >
                        Comentar
                    </button>
                </div>
            </form>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="space-y-4">
                {comments.map(comment => (
                    <div key={comment._id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-sky-950">{comment.username}</p>
                                <p className="text-gray-600 text-sm">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </p>
                                <p className="mt-2">{comment.content}</p>
                            </div>
                            {user && user._id === comment.userId && (
                                <button
                                    onClick={() => handleDelete(comment._id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Eliminar
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <p className="text-gray-500 text-center">No hay comentarios aún. ¡Sé el primero en comentar!</p>
                )}
            </div>
        </div>
    );
};

export default CommentSection;