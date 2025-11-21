import Game from "../models/Game.js";

export async function getGames(req, res) {
  try {
    const gameContacts = await Game.find();
    res.status(200).json({ message: gameContacts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}
