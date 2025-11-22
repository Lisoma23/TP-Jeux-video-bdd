import Game from "../models/Game.js";

export async function getGame(req, res) {
  try {
    const gameId = req.params.id;
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.status(200).json({ message: game });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}
