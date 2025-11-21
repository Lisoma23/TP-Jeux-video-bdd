import Game from "../models/Game.js";

export async function addGame(req, res) {
  try {
    const {
      titre,
      editeur,
      developpeur,
      annee_sortie,
      metacritic_score,
      temps_jeu_heures,
      genre,
      plateforme,
      termine,
    } = req.body;
    const date_ajout = new Date();
    const date_modification = new Date();

    // Check for existing game with the same title
    try {
      const game = await Game.findOne({ titre });
      if (game != null) {
        return res.status(409).json({ error: "Game already exists" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Server error" });
    }

    const games = new Game({
      titre,
      genre,
      plateforme,
      editeur,
      developpeur,
      annee_sortie,
      metacritic_score,
      temps_jeu_heures,
      termine,
      date_ajout,
      date_modification,
    });

    try {
      await games.save();
    } catch (err) {
      if (err.name === "ValidationError") {
        const errors = {};
        for (const [field, errorObj] of Object.entries(err.errors)) {
          errors[field] = errorObj.message;
        }
        return res.status(400).json({ errors });
      }
    }
    res.status(201).json({ message: "Game created" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}
