import Game from "../models/Game.js";

export async function deleteGame(req, res) {
  try {
    const idGame = req.params.id;

    const game = await Game.findById(idGame);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    const deletedGame = await Game.findByIdAndDelete(idGame);

    if (!deletedGame)
      return res.status(404).json({ error: "Game not found" });

    res.status(200).json({ message: "Game deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}
