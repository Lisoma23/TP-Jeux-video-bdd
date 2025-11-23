import Game from "../models/Game.js";

export async function getStatistics(req, res) {
  try {
    const stats = await Game.aggregate([
      {
        $group: {
          _id: null,
          nombreTotal: { $sum: 1 },
          scoreMoyen: { $avg: "$metacritic_score" },
          tempsTotal: { $sum: "$temps_jeu_heures" },
          scoreMax: { $max: "$metacritic_score" },
          scoreMin: { $min: "$metacritic_score" },
        },
      },
      {
        $project: {
          _id: 0,
          nombreTotal: 1,
          scoreMoyen: { $round: ["$scoreMoyen", 2] },
          tempsTotal: 1,
          scoreMax: 1,
          scoreMin: 1,
        },
      },
    ]);

    if (!stats) {
      return res
        .status(404)
        .json({ error: "Error while trying to get statistics" });
    }
    res.status(200).json({ message: stats });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}
