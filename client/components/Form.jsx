import { useRef, useState } from "react";

export default function Form({
  styleInput,
  termine,
  setTermine,
  post,
  setAddGame,
  game = null,
  idGameToUpdate = null,
  setIdGameToUpdate = null,
  put,
  games,
  errorMessage = "",
  setErrorMessage,
}) {
  const formRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    const genres = [];
    const plateformes = [];
    const gameData = [];

    if (!data.titre || data.titre.trim() === "") {
      setErrorMessage("Merci de fournir le titre");
      return;
    }

    for (let i = 1; i <= 3; i++) {
      if (data[`genre${i}`]) {
        genres.push(data[`genre${i}`]);
        delete data[`genre${i}`];
      }
      if (data[`plateforme${i}`]) {
        plateformes.push(data[`plateforme${i}`]);
        delete data[`plateforme${i}`];
      }
    }

    if (genres.length === 0) {
      setErrorMessage("Merci de fournir au moins un genre");
      return;
    }

    if (plateformes.length === 0) {
      setErrorMessage("Merci de fournir au moins une plateforme");
      return;
    }

    Object.entries(data).forEach(([key, value]) => {
      gameData.push({ [key]: value });
    });

    gameData.push({ genre: genres });
    gameData.push({ plateforme: plateformes });
    gameData.push({ termine: termine });

    if (idGameToUpdate) {
      gameData.push({ date_modification: new Date().toISOString() });
      const objectData = Object.assign({}, ...gameData);
      const game = games.find((g) => g._id === idGameToUpdate);

      const fieldsToNormalize = [
        "annee_sortie",
        "metacritic_score",
        "temps_jeu_heures",
      ];

      Object.entries(objectData).forEach(([key, value]) => {
        let normalizedValue = value;

        // Pour les champs qui sont des NUMBER dans la base de données
        if (fieldsToNormalize.includes(key)) {
          if (value === "") {
            normalizedValue = null;
          } else if (typeof value === "string" && value !== "") {
            normalizedValue = Number(value); // Ex: Convertit "20" en 20
          }
        }

        const gameValue = game[key];

        // Vérifie si les valeurs sont identiques entre game et objectData et supprime la clé si c'est le cas
        if (JSON.stringify(normalizedValue) === JSON.stringify(gameValue)) {
          delete objectData[key];
        }
      });

      put(objectData);
    } else {
      const objectData = Object.assign({}, ...gameData);
      post(objectData);
      formRef.current?.reset();
      setTermine(false);
      setErrorMessage("");
    }
  };

  const isEditMode = game !== null;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-4">
      <div className="grid grid-cols-2 gap-3 mx-2">
        <input
          className={styleInput}
          type="text"
          name="titre"
          defaultValue={game?.titre}
          placeholder="Titre du jeu"
        />
        <input
          className={styleInput}
          type="text"
          name="genre1"
          defaultValue={game?.genre?.[0]}
          placeholder="Genre 1"
        />
        <input
          className={styleInput}
          type="text"
          name="genre2"
          defaultValue={game?.genre?.[1]}
          placeholder="Genre 2"
        />
        <input
          className={styleInput}
          type="text"
          name="genre3"
          defaultValue={game?.genre?.[2]}
          placeholder="Genre 3"
        />
        <input
          className={styleInput}
          type="text"
          name="plateforme1"
          defaultValue={game?.plateforme?.[0]}
          placeholder="Plateforme 1"
        />
        <input
          className={styleInput}
          type="text"
          name="plateforme2"
          defaultValue={game?.plateforme?.[1]}
          placeholder="Plateforme 2"
        />
        <input
          className={styleInput}
          type="text"
          name="plateforme3"
          defaultValue={game?.plateforme?.[2]}
          placeholder="Plateforme 3"
        />
        <input
          className={styleInput}
          type="text"
          name="editeur"
          defaultValue={game?.editeur}
          placeholder="Editeur"
        />
        <input
          className={styleInput}
          type="text"
          name="developpeur"
          defaultValue={game?.developpeur}
          placeholder="Développeur"
        />
        <input
          className={styleInput}
          type="number"
          name="annee_sortie"
          defaultValue={game?.annee_sortie}
          placeholder="Année de sortie"
          min="1950"
          max="2025"
        />
        <input
          className={styleInput}
          type="number"
          name="metacritic_score"
          defaultValue={game?.metacritic_score}
          placeholder="Score Metacritic"
          min="0"
          max="100"
        />
        <input
          className={styleInput}
          type="number"
          name="temps_jeu_heures"
          defaultValue={game?.temps_jeu_heures}
          placeholder="Temps de jeu (h)"
        />
      </div>
      <div className="flex items-center gap-3 p-3 rounded-lg mt-3">
        <input
          type="checkbox"
          name="termine"
          id="termine"
          checked={termine}
          onChange={(e) => setTermine(e.target.checked)}
          className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
        />
        <label
          htmlFor="termine"
          className="text-purple-700 font-medium cursor-pointer"
        >
          Terminé
        </label>
      </div>

      {errorMessage && (
        <div
          className=" text-xs font-bold text-center"
          style={{ color: "DarkRed" }}
        >
          {errorMessage}
        </div>
      )}

      <div className="flex pt-2 mt-4 mx-2">
        <button
          type="submit"
          className="text-white font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
          style={{
            backgroundColor: isHovered ? "#7c0dd4" : "#9810fa",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isEditMode ? "Modifier le jeu" : "Ajouter le jeu"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (isEditMode && setIdGameToUpdate) {
              setIdGameToUpdate(null);
            } else {
              setAddGame(false);
              setTermine(false);
              setErrorMessage("");
            }
          }}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors mx-2 cursor-pointer"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
