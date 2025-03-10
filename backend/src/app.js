import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import connectDB from "./data/db.js";
import authRoutes from './routes/authRouter.js';
import userRoutes from './routes/userRoutes.js';
import moviesRoutes from './routes/moviesRouter.js';
import favoritesRoutes from './routes/favoritesRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use('/api/comments', commentRoutes);

app.get("/", (req, res) => {
    res.json({ message: "API Pelis funcionando" });
});

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ message: 'Algo salió mal!' });
});

export default app;