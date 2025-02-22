import express from "express";
import { addComment, delComments, getComments, getUserComments } from "../controllers/commentController.js";
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/user/:userId', authMiddleware, getUserComments);
router.get("/:idMovie/:idUser", getComments);
router.post("/:idMovie/:idUser", authMiddleware, addComment);
router.delete("/:id", authMiddleware, delComments);

export default router;
