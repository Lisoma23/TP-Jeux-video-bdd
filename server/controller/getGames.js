import Game from "../models/Game.js";

export async function getGames(req, res) {
  try {
    const games = await Game.find({}, 'titre genre plateforme termine favorite');
    res.status(200).json({ message: games });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}
