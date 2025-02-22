import dotenv from 'dotenv';
import Movie from '../models/Movie.js';

dotenv.config();

const BASE_URL = process.env.MOVIE_API_URL;
const API_KEY = process.env.VITE_API_TOKEN;

export const getMovies = async (req, res) => {
    try {
        const response = await fetch(`${BASE_URL}?api_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error("Error en la URL de la API de películas");
        }
        const data = await response.json();

        await Movie.deleteMany({}); // Borra todas las películas antes de insertar nuevas

        const moviePromises = data.results.map(async (movie) => {
            return {
                id: movie.id,
                title: movie.title,
                original_title: movie.original_title,
                original_language: movie.original_language,
                overview: movie.overview,
                genre_ids: movie.genre_ids,
                release_date: movie.release_date,
                popularity: movie.popularity,
                vote_average: movie.vote_average,
                vote_count: movie.vote_count,
                adult: movie.adult,
                video: movie.video,
                backdrop_path: movie.backdrop_path,
                poster_path: movie.poster_path
            };
        });

        const movieDetails = await Promise.all(moviePromises);
        await Movie.insertMany(movieDetails);

        const movies = await Movie.find();
        res.status(200).json(movies);

    } catch (error) {
        console.error("Error al obtener las películas:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;

        const movie = await Movie.findOne({ id: parseInt(id) });

        if (!movie) {
            return res.status(404).json({ 
                mensaje: `Película con ID ${id} no encontrada` 
            });
        }

        res.json(movie);
    } catch (error) {
        console.error("Error en getMovieById:", error);
        res.status(500).json({ 
            mensaje: "Error al obtener la película", 
            error: error.message 
        });
    }
};
