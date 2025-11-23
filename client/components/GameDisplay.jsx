import Paragraph from "./Paragraph.jsx";

export default function GameDisplay({
  game,
  styleParagraph,
  styleSpan,
  idGameOpened,
  currentGame,
}) {
  return (
    <>
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
            text={new Date(currentGame.date_ajout).toLocaleString("fr-FR")}
            styleParagraph={styleParagraph}
            styleSpan={styleSpan}
          />
          <Paragraph
            categorie={"Dernière modification"}
            text={new Date(currentGame.date_modification).toLocaleString(
              "fr-FR"
            )}
            styleParagraph={styleParagraph}
            styleSpan={styleSpan}
          />
        </>
      )}
    </>
  );
}
