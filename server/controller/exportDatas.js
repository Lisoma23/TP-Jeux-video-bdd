import Game from "../models/Game.js";

export async function exportDatas(req, res) {
  try {
    const games = await Game.find();
    res.status(200).json({ message: games });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}
