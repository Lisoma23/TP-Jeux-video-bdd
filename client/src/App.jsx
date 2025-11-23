import { useState } from "react";
import "./App.css";
import { serverUrl } from "./main.jsx";
import { useEffect } from "react";
import Form from "../components/Form.jsx";
import {
  RiAddLine,
  RiArrowRightSLine,
  RiPencilLine,
  RiDeleteBinLine,
} from "@remixicon/react";
import Paragraph from "../components/Paragraph.jsx";

export default function App() {
  const [termine, setTermine] = useState(false);
  const [games, setGames] = useState([]);
  const [idGameToUpdate, setIdGameToUpdate] = useState(null);
  const [idGameOpened, setIdGameOpened] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);
  const [addGame, setAddGame] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const styleInput =
    "border border-purple-300 focus:border-purple-500 rounded px-4 py-2 outline-none bg-white mt-3";

  const styleInputModify =
    "border-b-2 border-purple-300 focus:border-purple-600 focus:bg-purple-50/20 px-3 py-2.5 outline-none bg-transparent transition-all duration-200";

  const styleParagraph = "text-purple-800 mb-1";
  const styleSpan = "font-semibold text-purple-700";

  const postGame = async (gameData) => {
    fetch(serverUrl + "api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    })
      .then((res) => {
        if (res.status == 500) throw new Error();
        else if (res.status == 201) {
          console.log("Jeu ajouté avec succès !");
          getGames();
          setAddGame(false);
          setTermine(false);
          return res.json();
        }
      })
      .catch(() => {
        setErrorMessage("Error while connecting. Please try later");
      });
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
        console.log("Jeu modifié avec succès !");
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
        console.log("Jeu supprimé avec succès !");
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

  const openCloseGameDetails = (id) => {
    if (idGameOpened === id) {
      setIdGameOpened(null);
      setCurrentGame(null);
    } else {
      getGame(id);
    }
  };

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    if (addGame && !isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [addGame]);

  return (
    <div className="flex flex-col min-h-screen p-6 rounded-lg bg-pink-50">
      <h1 className="text-4xl font-bold text-purple-800 text-center mt-2 mb-6">
        Bibliothèque de gestion de jeux videos
      </h1>

      <div className="bg-purple-50 border border-purple-300 rounded-lg p-4 mt-10 mb-6">
        <p className="text-purple-800 mb-2">
          Bienvenue dans votre bibliothèque de gestion de jeux vidéo !
        </p>
        <p className="text-purple-800 mb-2">
          Ici, vous pouvez organiser, suivre et découvrir vos jeux vidéo
          préférés.
        </p>
        <p className="text-purple-800 mb-2">
          Commencez par ajouter vos jeux à la bibliothèque et profitez de
          fonctionnalités telles que les favoris, le score et le filtrage.
        </p>
      </div>

      <div
        className={`fixed inset-0 bg-pink-100/75 flex items-center justify-center z-99 ${
          addGame ? "" : "hidden"
        }`}
      >
        <div className="w-[90%] md:w-[70%] bg-purple-50 border border-purple-300 rounded-lg p-4">
          <h3 className="text-purple-700 text-lg">Ajouter un Jeu</h3>
          <Form
            styleInput={styleInput}
            termine={termine}
            setTermine={setTermine}
            post={postGame}
            setAddGame={setAddGame}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          ></Form>
        </div>
      </div>

      <div>
        <div className="flex w-full justify-between">
          <h3 className="text-2xl font-bold text-purple-500 mb-6">
            Liste des Jeux
          </h3>
          <RiAddLine
            className="text-purple-600 w-8 h-8 mb-4 cursor-pointer"
            onClick={() => setAddGame(!addGame)}
          />
        </div>

        <ul className="grid grid-cols-2 gap-6">
          {games.map((game, index) =>
            idGameToUpdate != game._id ? (
              <li
                key={index}
                className="bg-purple-50 border-2 border-pink-300 rounded-lg p-5 mb-4 shadow-md relative self-start"
              >
                {idGameOpened === game._id ? (
                  <RiArrowRightSLine
                    className="absolute right-4 rotate-90"
                    onClick={() => openCloseGameDetails(game._id)}
                  />
                ) : (
                  <RiArrowRightSLine
                    className="absolute right-4"
                    onClick={() => openCloseGameDetails(game._id)}
                  />
                )}
                <h4 className="text-xl font-bold text-pink-600 mb-2 w-[90%]">
                  {game.titre}
                </h4>
                <Paragraph
                  categorie={"Genre(s)"}
                  text={game.genre.join(", ")}
                  styleParagraph={styleParagraph}
                  styleSpan={styleSpan}
                />
                <Paragraph
                  categorie={"Plateforme(s)"}
                  text={game.plateforme.join(", ")}
                  styleParagraph={styleParagraph}
                  styleSpan={styleSpan}
                />
                <Paragraph
                  categorie={"Terminé"}
                  text={game.termine ? "Oui" : "Non"}
                  styleParagraph={styleParagraph}
                  styleSpan={styleSpan}
                />

                {idGameOpened === game._id && currentGame && (
                  <>
                    <Paragraph
                      categorie={"Éditeur"}
                      text={currentGame.editeur || "N/A"}
                      styleParagraph={styleParagraph}
                      styleSpan={styleSpan}
                    />
                    <Paragraph
                      categorie={"Développeur"}
                      text={currentGame.developpeur || "N/A"}
                      styleParagraph={styleParagraph}
                      styleSpan={styleSpan}
                    />
                    <Paragraph
                      categorie={"Année de sortie"}
                      text={currentGame.annee_sortie || "N/A"}
                      styleParagraph={styleParagraph}
                      styleSpan={styleSpan}
                    />
                    <Paragraph
                      categorie={"Score Metacritic"}
                      text={
                        currentGame.metacritic_score !== null
                          ? currentGame.metacritic_score
                          : "N/A"
                      }
                      styleParagraph={styleParagraph}
                      styleSpan={styleSpan}
                    />
                    <Paragraph
                      categorie={"Temps de jeu (heures)"}
                      text={
                        currentGame.temps_jeu_heures !== null
                          ? currentGame.temps_jeu_heures
                          : "N/A"
                      }
                      styleParagraph={styleParagraph}
                      styleSpan={styleSpan}
                    />
                    <Paragraph
                      categorie={"Date de création"}
                      text={new Date(currentGame.date_ajout).toLocaleString(
                        "fr-FR"
                      )}
                      styleParagraph={styleParagraph}
                      styleSpan={styleSpan}
                    />
                    <Paragraph
                      categorie={"Dernière modification"}
                      text={new Date(
                        currentGame.date_modification
                      ).toLocaleString("fr-FR")}
                      styleParagraph={styleParagraph}
                      styleSpan={styleSpan}
                    />
                  </>
                )}
                <div className="flex gap-3 mt-4">
                  <button
                    className="group relative bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg transition-all hover:scale-110 cursor-pointer"
                    onClick={() => setIdGameToUpdate(game._id)}
                  >
                    <RiPencilLine size={15} />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Modifier
                    </span>
                  </button>
                  <button
                    className="group relative bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-lg transition-all hover:scale-110 cursor-pointer"
                    onClick={() => deleteGame(game._id)}
                  >
                    <RiDeleteBinLine size={15} />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Supprimer
                    </span>
                  </button>
                </div>
              </li>
            ) : (
              game._id === idGameToUpdate && (
                <div className="bg-purple-50 border-2 border-pink-300 rounded-lg px-2 pb-6 mb-4 shadow-md relative self-start">
                  <Form
                    key={index}
                    styleInput={styleInputModify}
                    termine={termine}
                    setTermine={setTermine}
                    post={postGame}
                    setAddGame={setAddGame}
                    game={game}
                    idGameToUpdate={idGameToUpdate}
                    setIdGameToUpdate={setIdGameToUpdate}
                    put={putGame}
                    games={games}
                  />
                </div>
              )
            )
          )}
        </ul>
      </div>
    </div>
  );
}
