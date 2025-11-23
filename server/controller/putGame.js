import Game from "../models/Game.js";

export async function putGame(req, res) {
  try {
    const updates = req.body;
    const idGame = req.params.id;

    //s'assurer que c'est bien l'user qui modifie son contact
    const game = await Game.findById(idGame);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    const updatedGame = await Game.findByIdAndUpdate(
      idGame,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedGame) {
      return res.status(304).json({ message: "Contact not modified" });
    }
    res.status(200).json(updatedGame);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}
