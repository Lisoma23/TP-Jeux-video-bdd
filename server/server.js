import express from "express";
import connectMongo from "./config/mongoDBConfig.js";
import dotenv from "dotenv";
import cors from "cors";
import gameRoutes from "./routes/gameRoutes.js";
import statisticsRoutes from "./routes/statisticsRoutes.js";

dotenv.config({ path: ".env" });

const app = express();
const port = process.env.PORT || 3000;
const corsOrigin = process.env.corsOrigin;

app.use(express.json());
app.use(cors({ origin: `${corsOrigin}` }));

connectMongo();

app.get("/", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use("/api/games", gameRoutes);
app.use("/api/stats", statisticsRoutes);

app.listen(port, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + port
    );
  else console.log("Error occurred, server can't start", error);
});

export default app;
