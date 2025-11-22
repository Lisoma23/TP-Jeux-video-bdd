import { Router } from "express";
import { addGame } from "../controller/addGame.js";
import { getGames } from "../controller/getGames.js";
import { putGame } from "../controller/putGame.js";

const router = Router();

router.post("/", addGame);
router.get("/", getGames);
router.put("/:id", putGame);

export default router;
