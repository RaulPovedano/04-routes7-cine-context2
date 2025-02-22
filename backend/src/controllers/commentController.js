import Comment from '../models/Comment.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

export const getComments = async (req, res) => {
    try {
        const { idMovie } = req.params;
        const comments = await Comment.find({ movieId: idMovie })
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener comentarios' });
    }
};

export const getUserComments = async (req, res) => {
    try {
        const { userId } = req.params;
        const comments = await Comment.find({ userId })
            .sort({ createdAt: -1 });

        // Fetch movie details for each comment
        const commentsWithMovies = await Promise.all(
            comments.map(async (comment) => {
                try {
                    const response = await fetch(
                        `https://api.themoviedb.org/3/movie/${comment.movieId}?api_key=${process.env.VITE_API_TOKEN}&language=es-ES`
                    );
                    if (!response.ok) throw new Error('Error fetching movie');
                    const movieData = await response.json();
                    
                    return {
                        ...comment.toObject(),
                        movie: {
                            title: movieData.title,
                            poster_path: movieData.poster_path
                        }
                    };
                } catch (error) {
                    console.error(`Error fetching movie ${comment.movieId}:`, error);
                    return comment;
                }
            })
        );

        res.json(commentsWithMovies);
    } catch (error) {
        console.error('Error getting user comments:', error);
        res.status(500).json({ message: 'Error al obtener comentarios del usuario' });
    }
};

export const addComment = async (req, res) => {
    try {
        const { idMovie, idUser } = req.params;
        const { content } = req.body;

        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const comment = new Comment({
            movieId: idMovie,
            userId: idUser,
            username: user.username,
            content
        });

        await comment.save();
        res.status(201).json(comment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error al añadir comentario' });
    }
};

export const delComments = async (req, res) => {
    try {
        const { id } = req.params;
        await Comment.findByIdAndDelete(id);
        res.json({ message: 'Comentario eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar comentario' });
    }
};
