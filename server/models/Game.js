import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, "Veuillez fournir un titre"],
  },
  genre: {
    type: [String],
    required: [true, "Veuillez fournir au moins un genre"],
  },
  plateforme: {
    type: [String],
    required: [true, "Veuillez fournir au moins une plateforme"],
  },
  editeur: {
    type: String,
    required: [false],
  },
  developpeur: {
    type: String,
    required: [false],
  },
  annee_sortie: {
    type: Number,
    required: [false],
  },
  metacritic_score: {
    type: Number,
    required: [false],
  },
  temps_jeu_heures: {
    type: Number,
    required: [false],
  },
  termine: {
    type: Boolean,
    required: [false],
  },
  date_ajout: {
    type: Date,
    required: [true],
  },
  date_modification: {
    type: Date,
    required: [true],
  },
});

const Game = mongoose.model("Game", GameSchema);
export default Game;
