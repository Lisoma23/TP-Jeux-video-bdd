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
  RiStarLine,
  RiStarFill,
} from "@remixicon/react";
import GameDisplay from "../components/gameDisplay.jsx";

export default function App() {
  const [termine, setTermine] = useState(false);
  const [games, setGames] = useState([]);
  const [gamesFavorite, setGamesFavorite] = useState([]);
  const [idGameToUpdate, setIdGameToUpdate] = useState(null);
  const [idGameOpened, setIdGameOpened] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);
  const [addGame, setAddGame] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFavoriteOpen, setIsFavoriteOpen] = useState(true);
  const [isOtherGamesOpen, setIsOtherGamesOpen] = useState(true);

  const styleInput =
    "border border-purple-300 focus:border-purple-500 rounded px-4 py-2 outline-none bg-white mt-3";

  const styleInputModify =
    "border-b-2 border-purple-300 focus:border-purple-600 focus:bg-purple-50/20 px-3 py-2.5 outline-none bg-transparent transition-all duration-200";

  const styleParagraph = "text-purple-800 mb-1";
  const styleSpan = "font-semibold text-purple-700";
  const styleIconArrow =
    "absolute text-purple-600 right-4 mt-[3px] cursor-pointer";

  const postGame = async (gameData) => {
    await fetch(serverUrl + "api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    })
      .then((res) => {
        if (res.status === 409) {
          setErrorMessage("Le jeu existe déjà");
          return;
        } else if (res.status === 500) {
          setErrorMessage("Erreur lors de l'ajout");
          return;
        } else if (res.status === 201) {
          console.log("Jeu ajouté avec succès !");
          getGames();
          setAddGame(false);
          setTermine(false);
          return res.json();
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("Erreur de connexion au serveur");
      });
  };

  const getGames = async () => {
    await fetch(serverUrl + "api/games", {
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
        const allGames = data.message;

        const favorites = allGames.filter((game) => game.favorite === true);
        const nonFavorites = allGames.filter((game) => !game.favorite);

        setGames(nonFavorites);
        setGamesFavorite(favorites);
      })
      .catch((err) => {
        console.log({
          error: err + " Error while fetching games. Please try later",
        });
      });
  };

  useEffect(() => {
    getGames();
  }, []);

  const putGame = async (id, gameData) => {
    await fetch(serverUrl + "api/games/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    })
      .then((res) => {
        if (res.status == 500) throw new Error();
        else if (res.status == 200) {
          console.log("Jeu modifié avec succès !");
          getGames();
          setIdGameToUpdate(null);
          setErrorMessage("");
          return res.json();
        }
      })
      .catch((err) => {
        console.log({
          error: err + " Error while modifying game. Please try later",
        });
      });
  };

  const deleteGame = async (id) => {
    await fetch(serverUrl + "api/games/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status == 500) throw new Error();
        else if (res.status == 200) {
          console.log("Jeu supprimé avec succès !");
          getGames();
          return res.json();
        }
      })
      .catch((err) => {
        console.log({
          error: err + " Error while deleting game. Please try later",
        });
      });
  };

  const getGame = async (id) => {
    setIdGameOpened(id);
    await fetch(serverUrl + "api/games/" + id, {
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
      })
      .catch((err) => {
        console.log({
          error: err + " Error while getting game. Please try later",
        });
      });
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

  const setFavorite = (id, state) => {
    const favoriteState = { favorite: !state };
    console.log(favoriteState);

    putGame(id, favoriteState);
  };

  const openGameToUpdate = async (id) => {
    setCurrentGame(null);
    setIdGameOpened(null);
    setIdGameToUpdate(id);
    await getGame(id);
  };

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

        <div>
          <div className="flex items-center gap-4 mb-8 text-purple-900">
            <h4>Jeux Favoris ({gamesFavorite.length})</h4>
            <hr className="h-0 w-[88%] mt-1" />
            {isFavoriteOpen ? (
              <RiArrowRightSLine
                className={`${styleIconArrow} rotate-90`}
                style={{ color: "oklch(38.1% 0.176 304.987)" }}
                onClick={() => setIsFavoriteOpen(!isFavoriteOpen)}
              />
            ) : (
              <RiArrowRightSLine
                className={`${styleIconArrow}`}
                style={{ color: "oklch(38.1% 0.176 304.987)" }}
                onClick={() => setIsFavoriteOpen(!isFavoriteOpen)}
              />
            )}
          </div>

          {isFavoriteOpen && (
            <>
              {gamesFavorite.length === 0 ? (
                <p
                  className={`${styleParagraph} mb-8 text-sm`}
                  style={{ color: "oklch(59.2% 0.249 0.584)" }}
                >
                  Aucun jeu en favori
                </p>
              ) : (
                <ul className="grid grid-cols-2 gap-6 mb-5">
                  {gamesFavorite.map((game, index) =>
                    idGameToUpdate != game._id ? (
                      <li
                        key={index}
                        className="bg-purple-50 border-2 border-pink-300 rounded-lg p-5 mb-4 shadow-md relative self-start"
                      >
                        <RiStarFill
                          className="absolute text-purple-600 right-10 top-6.5 cursor-pointer"
                          onClick={() => setFavorite(game._id, game.favorite)}
                          size={18}
                        />

                        {idGameOpened === game._id ? (
                          <RiArrowRightSLine
                            className={`${styleIconArrow} rotate-90`}
                            onClick={() => openCloseGameDetails(game._id)}
                          />
                        ) : (
                          <RiArrowRightSLine
                            className={`${styleIconArrow}`}
                            onClick={() => openCloseGameDetails(game._id)}
                          />
                        )}
                        <GameDisplay
                          game={game}
                          styleParagraph={styleParagraph}
                          styleSpan={styleSpan}
                          idGameOpened={idGameOpened}
                          currentGame={currentGame}
                        />
                        <div className="flex gap-3 mt-4">
                          <button
                            className="group relative bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg transition-all hover:scale-110 cursor-pointer"
                            onClick={() => openGameToUpdate(game._id)}
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
                            game={currentGame || game}
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
              )}
            </>
          )}
        </div>

        <div>
          <div className="flex items-center gap-4 mb-8 text-purple-900">
            <h4>Autres jeux ({games.length})</h4>
            <hr className="h-0 w-[88.5%] mt-1" />
            {isOtherGamesOpen ? (
              <RiArrowRightSLine
                className={`${styleIconArrow} rotate-90`}
                style={{ color: "oklch(38.1% 0.176 304.987)" }}
                onClick={() => setIsOtherGamesOpen(!isOtherGamesOpen)}
              />
            ) : (
              <RiArrowRightSLine
                className={`${styleIconArrow}`}
                style={{ color: "oklch(38.1% 0.176 304.987)" }}
                onClick={() => setIsOtherGamesOpen(!isOtherGamesOpen)}
              />
            )}
          </div>
          {isOtherGamesOpen && (
            <>
              {games.length === 0 ? (
                <p
                  className={`${styleParagraph} text-sm mb-4`}
                  style={{ color: "oklch(59.2% 0.249 0.584)" }}
                >
                  Aucun jeu en favori
                </p>
              ) : (
                <ul className="grid grid-cols-2 gap-6">
                  {games.map((game, index) =>
                    idGameToUpdate != game._id ? (
                      <li
                        key={index}
                        className="bg-purple-50 border-2 border-pink-300 rounded-lg p-5 mb-4 shadow-md relative self-start"
                      >
                        <RiStarLine
                          className="absolute text-purple-600 right-10 top-6.5 cursor-pointer"
                          onClick={() => setFavorite(game._id, game.favorite)}
                          size={18}
                        />
                        {idGameOpened === game._id ? (
                          <RiArrowRightSLine
                            className={`${styleIconArrow} rotate-90`}
                            onClick={() => openCloseGameDetails(game._id)}
                          />
                        ) : (
                          <RiArrowRightSLine
                            className={`${styleIconArrow}`}
                            onClick={() => openCloseGameDetails(game._id)}
                          />
                        )}
                        <GameDisplay
                          game={game}
                          styleParagraph={styleParagraph}
                          styleSpan={styleSpan}
                          idGameOpened={idGameOpened}
                          currentGame={currentGame}
                        />
                        <div className="flex gap-3 mt-4">
                          <button
                            className="group relative bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg transition-all hover:scale-110 cursor-pointer"
                            onClick={() => openGameToUpdate(game._id)}
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
                            game={currentGame || game}
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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
