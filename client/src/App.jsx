import { useState } from "react";
import "./App.css";
import { serverUrl } from "./main.jsx";

function App() {
  const [termine, setTermine] = useState(false);

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
    postData(objectData);
  };

  const postData = async (gameData) => {
    fetch(serverUrl + "api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    })
      .then((res) => {
        if (res.status == 500) throw new Error();
        else if (res.status == 200) {
          alert("Jeu ajouté avec succès !");
          return res.json();
        }
      })
      .catch(() => {
        setErrorMessage("Error while connecting. Please try later");
      });
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
    </div>
  );
}

export default App;
