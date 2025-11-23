import { Router } from "express";
import { addGame } from "../controller/addGame.js";
import { getGames } from "../controller/getGames.js";
import { putGame } from "../controller/putGame.js";
import { deleteGame } from "../controller/deleteGame.js";
import { getGame } from "../controller/getGame.js";
import { exportDatas } from "../controller/exportDatas.js";

const router = Router();

router.post("/", addGame);
router.get("/", getGames);
router.put("/:id", putGame);
router.delete("/:id", deleteGame);
router.get("/export", exportDatas);
router.get("/:id", getGame);

export default router;
