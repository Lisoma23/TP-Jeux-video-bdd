import { Router } from "express";
import { addGame } from "../controller/addGame.js";

const router = Router();

router.post("/", addGame);

export default router;
