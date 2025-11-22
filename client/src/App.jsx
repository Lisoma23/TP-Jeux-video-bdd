import { useState } from "react";
import "./App.css";
import { serverUrl } from "./main.jsx";
import { useEffect } from "react";

export default function App() {
  const [termine, setTermine] = useState(false);
  const [games, setGames] = useState([]);
  const [idGameToUpdate, setIdGameToUpdate] = useState(null);
  const [idGameOpened, setIdGameOpened] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    const genres = [];
    const plateformes = [];
    const gameData = [];

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

    Object.entries(data).forEach(([key, value]) => {
      gameData.push({ [key]: value });
    });

    gameData.push({ genre: genres });
    gameData.push({ plateforme: plateformes });
    gameData.push({ termine: termine });
    const objectData = Object.assign({}, ...gameData);

    if (idGameToUpdate) {
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

      putGame(objectData);
    } else {
      postGame(objectData);
    }
  };

  const postGame = async (gameData) => {
    fetch(serverUrl + "api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    }).then((res) => {
      if (res.status == 500) throw new Error();
      else if (res.status == 200) {
        alert("Jeu ajouté avec succès !");
        getGames();
        return res.json();
      }
    });
    // .catch(() => {
    //   setErrorMessage("Error while connecting. Please try later");
    // });
  };

  const getGames = async () => {
    fetch(serverUrl + "api/games", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status == 500) throw new Error();
        else if (res.status == 200) {
          return res.json();
        }
      })
      .then((data) => {
        setGames(data.message);
      });
    // .catch(() => {
    //   setErrorMessage("Error while connecting. Please try later");
    // });
  };

  useEffect(() => {
    getGames();
  }, []);

  const putGame = async (gameData) => {
    fetch(serverUrl + "api/games/" + idGameToUpdate, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    }).then((res) => {
      if (res.status == 500) throw new Error();
      else if (res.status == 200) {
        alert("Jeu modifié avec succès !");
        getGames();
        setIdGameToUpdate(null);
        return res.json();
      }
    });
    // .catch(() => {
    //   setErrorMessage("Error while connecting. Please try later");
    // });
  };

  const deleteGame = async (id) => {
    fetch(serverUrl + "api/games/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status == 500) throw new Error();
      else if (res.status == 200) {
        alert("Jeu supprimé avec succès !");
        getGames();
        return res.json();
      }
    });
    // .catch(() => {
    //   setErrorMessage("Error while connecting. Please try later");
    // });
  };

  const getGame = async (id) => {
    setIdGameOpened(id);
    fetch(serverUrl + "api/games/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status == 500) throw new Error();
        else if (res.status == 200) {
          return res.json();
        }
      })
      .then((data) => {
        setCurrentGame(data.message);
        return data.message;
      });
    // .catch(() => {
    //   setErrorMessage("Error while connecting. Please try later");
    // });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="">Bibliothèque de gestion de jeux videos</h1>

      <div>
        <p>Bienvenue dans votre bibliothèque de gestion de jeux vidéo !</p>
        <p>
          Ici, vous pouvez organiser, suivre et découvrir vos jeux vidéo
          préférés.
        </p>
        <p>
          Commencez par ajouter vos jeux à la bibliothèque et profitez de
          fonctionnalités telles que les listes de souhaits, les critiques et
          bien plus encore.
        </p>
      </div>

      <div>
        <h3>Ajouter un Jeu</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="titre" placeholder="Titre du jeu" required />
          <input
            type="text"
            name="genre1"
            placeholder="Genre du jeu"
            required
          />
          <input type="text" name="genre2" placeholder="Genre du jeu" />
          <input type="text" name="genre3" placeholder="Genre du jeu" />
          <input
            type="text"
            name="plateforme1"
            placeholder="Plateforme"
            required
          />
          <input type="text" name="plateforme2" placeholder="Plateforme" />
          <input type="text" name="plateforme3" placeholder="Plateforme" />
          <input type="text" name="editeur" placeholder="Editeur du jeu" />
          <input
            type="text"
            name="developpeur"
            placeholder="Developpeur du jeu"
          />
          <input
            type="number"
            name="annee_sortie"
            placeholder="Année de sortie"
            min="1950"
            max="2025"
          />
          <input
            type="number"
            name="metacritic_score"
            placeholder="Score Metacritic"
            min="0"
            max="100"
          />
          <input
            type="number"
            name="temps_jeu_heures"
            placeholder="Temps de Jeu en heures"
          />
          <p>Terminé</p>
          <input
            type="checkbox"
            name="termine"
            checked={termine}
            onChange={(e) => setTermine(e.target.checked)}
          />

          <button type="submit">Ajouter le jeu</button>
        </form>
      </div>

      <div>
        <h3>Liste des Jeux</h3>
        <ul>
          {games.map((game, index) =>
            idGameToUpdate != game._id ? (
              <li key={index}>
                <button onClick={() => getGame(game._id)}>Ouvrir</button>
                <h4>{game.titre}</h4>
                <p>Genres: {game.genre.join(", ")}</p>
                <p>Plateformes: {game.plateforme.join(", ")}</p>
                <p>Terminé: {game.termine ? "Oui" : "Non"}</p>

                {idGameOpened === game._id && currentGame && (
                  <>
                    <p>Éditeur: {currentGame.editeur}</p>
                    <p>Développeur: {currentGame.developpeur}</p>
                    <p>Année de sortie: {currentGame.annee_sortie}</p>
                    <p>Score Metacritic: {currentGame.metacritic_score}</p>
                    <p>Temps de jeu (heures): {currentGame.temps_jeu_heures}</p>
                    <p>Date de création: {currentGame.date_ajout}</p>
                    <p>
                      Dernière modification: {currentGame.date_modification}
                    </p>
                    <button onClick={() => setIdGameOpened(null)}>
                      Fermer
                    </button>
                  </>
                )}
                <button onClick={() => setIdGameToUpdate(game._id)}>
                  Modifier le jeu
                </button>
                <button onClick={() => deleteGame(game._id)}>
                  Supprimer le jeu
                </button>
              </li>
            ) : (
              game._id === idGameToUpdate && (
                <form onSubmit={handleSubmit} key={index}>
                  <input
                    type="text"
                    name="titre"
                    defaultValue={game.titre}
                    placeholder="Titre du jeu"
                    required
                  />
                  <input
                    type="text"
                    name="genre1"
                    defaultValue={game.genre[0]}
                    placeholder="Genre du jeu"
                    required
                  />
                  <input
                    type="text"
                    name="genre2"
                    defaultValue={game.genre[1]}
                    placeholder="Genre du jeu"
                  />
                  <input
                    type="text"
                    name="genre3"
                    defaultValue={game.genre[2]}
                    placeholder="Genre du jeu"
                  />
                  <input
                    type="text"
                    name="plateforme1"
                    defaultValue={game.plateforme[0]}
                    placeholder="Plateforme"
                    required
                  />
                  <input
                    type="text"
                    name="plateforme2"
                    defaultValue={game.plateforme[1]}
                    placeholder="Plateforme"
                  />
                  <input
                    type="text"
                    name="plateforme3"
                    defaultValue={game.plateforme[2]}
                    placeholder="Plateforme"
                  />
                  <input
                    type="text"
                    name="editeur"
                    defaultValue={game.editeur}
                    placeholder="Editeur du jeu"
                  />
                  <input
                    type="text"
                    name="developpeur"
                    defaultValue={game.developpeur}
                    placeholder="Developpeur du jeu"
                  />
                  <input
                    type="number"
                    name="annee_sortie"
                    defaultValue={game.annee_sortie}
                    placeholder="Année de sortie"
                    min="1950"
                    max="2025"
                  />
                  <input
                    type="number"
                    name="metacritic_score"
                    defaultValue={game.metacritic_score}
                    placeholder="Score Metacritic"
                    min="0"
                    max="100"
                  />
                  <input
                    type="number"
                    name="temps_jeu_heures"
                    defaultValue={game.temps_jeu_heures}
                    placeholder="Temps de Jeu en heures"
                  />
                  <p>Terminé</p>
                  <input
                    type="checkbox"
                    name="termine"
                    checked={game.termine}
                    onChange={(e) => setTermine(e.target.checked)}
                  />

                  <button type="submit">Modifier le jeu</button>
                  <button
                    onClick={() => {
                      setIdGameToUpdate(null);
                    }}
                  >
                    Annuler
                  </button>
                </form>
              )
            )
          )}
        </ul>
      </div>
    </div>
  );
}
