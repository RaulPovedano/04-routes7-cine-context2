import express from "express";
import { addFavorite, checkFavorite, delFavorite, getFavorites } from "../controllers/favoriteController.js";
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/:idUser", getFavorites);
router.get("/:idMovie/:idUser", checkFavorite);
router.post("/:idMovie/:idUser", authMiddleware, addFavorite);
router.delete("/:idMovie/:idUser", authMiddleware, delFavorite);

export default router;
