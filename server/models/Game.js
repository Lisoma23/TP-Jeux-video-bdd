import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
  titre: {
    type: String,
    minLength: 1,
    required: [true, "Veuillez fournir un titre"],
  },
  genre: {
    type: [String],
    minItems: 1,
    required: [true, "Veuillez fournir au moins un genre"],
  },
  plateforme: {
    type: [String],
    minItems: 1,
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
    min: 1970,
    max: new Date().getFullYear(),
    required: [false],
  },
  metacritic_score: {
    type: Number,
    min: 0,
    max: 100,
    required: [false],
  },
  temps_jeu_heures: {
    type: Number,
    min: 0,
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
  favorite: {
    type: Boolean,
    required: [true],
  },
});

const Game = mongoose.model("Game", GameSchema);
export default Game;
