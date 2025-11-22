import { Router } from "express";
import { addGame } from "../controller/addGame.js";
import { getGames } from "../controller/getGames.js";
import { putGame } from "../controller/putGame.js";
import { deleteGame } from "../controller/deleteGame.js";

const router = Router();

router.post("/", addGame);
router.get("/", getGames);
router.put("/:id", putGame);
router.delete("/:id", deleteGame);

export default router;
