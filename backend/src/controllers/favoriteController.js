import Favorite from '../models/Favorite.js';

export const getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.params.idUser });
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener favoritos' });
    }
};

export const addFavorite = async (req, res) => {
    try {
        const { movieId, title, poster_path, vote_average, release_date } = req.body;
        const userId = req.params.idUser;

        const existingFavorite = await Favorite.findOne({ userId, movieId });
        if (existingFavorite) {
            return res.status(400).json({ message: 'Ya está en favoritos' });
        }

        const favorite = new Favorite({
            userId,
            movieId,
            title,
            poster_path,
            vote_average,
            release_date
        });

        await favorite.save();
        res.status(201).json({ message: 'Añadido a favoritos', isFavorite: true });
    } catch (error) {
        res.status(500).json({ message: 'Error al añadir a favoritos' });
    }
};

export const delFavorite = async (req, res) => {
    try {
        const { idMovie, idUser } = req.params;
        await Favorite.findOneAndDelete({ userId: idUser, movieId: idMovie });
        res.json({ message: 'Eliminado de favoritos', isFavorite: false });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar de favoritos' });
    }
};

export const checkFavorite = async (req, res) => {
    try {
        const { idMovie, idUser } = req.params;
        const favorite = await Favorite.findOne({ userId: idUser, movieId: idMovie });
        res.json({ isFavorite: !!favorite });
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar favorito' });
    }
};
