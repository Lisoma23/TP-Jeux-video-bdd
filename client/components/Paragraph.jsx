export default function Paragraph({
  categorie,
  text,
  styleParagraph,
  styleSpan,
}) {
  return (
    <p className={styleParagraph}>
      <span className={styleSpan}>{categorie} :</span> {text}
    </p>
  );
}
