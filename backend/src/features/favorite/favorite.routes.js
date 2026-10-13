import express from "express";
import {
    getMyFavorites,
    getFavoriteIds,
    addFavorite,
    removeFavorite,
} from "./favorite.controller.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyToken, getMyFavorites);
router.get("/ids", verifyToken, getFavoriteIds);
router.post("/:tourId", verifyToken, addFavorite);
router.delete("/:tourId", verifyToken, removeFavorite);

export default router;