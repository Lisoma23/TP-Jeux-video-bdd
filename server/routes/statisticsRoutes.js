import { Router } from "express";
import { getStatistics } from "../controller/getStatistics.js";

const router = Router();

router.get("/", getStatistics);

export default router;
