import unlvAsciiArtSource from "../assets/unlv-ascii-art.txt?raw";

const formatAsciiArt = (source: string): string => {
  const lines = source.replace(/\r/g, "").split("\n");

  while (lines[0]?.trim() === "") lines.shift();
  while (lines.at(-1)?.trim() === "") lines.pop();

  const contentLines = lines.filter((line) => line.trim().length > 0);
  if (contentLines.length === 0) return "";

  const commonIndent = Math.min(
    ...contentLines.map((line) => line.match(/^ */)?.[0].length ?? 0),
  );

  return lines
    .map((line) => line.slice(commonIndent).trimEnd())
    .join("\n");
};

/**
 * Trimmed UNLV ASCII artwork shared by static and reactive renderers.
 */
export const UNLV_ASCII_ART = formatAsciiArt(unlvAsciiArtSource);

/**
 * Individual lines of the formatted UNLV ASCII artwork.
 */
export const UNLV_ASCII_LINES = UNLV_ASCII_ART.split("\n");
