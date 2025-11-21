import { Router } from "express";
import { addGame } from "../controller/addGame.js";
import { getGames } from "../controller/getGames.js";

const router = Router();

router.post("/", addGame);
router.get("/", getGames)

export default router;
