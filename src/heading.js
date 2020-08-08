const MARKDOWN_CHAR = "#";

/**
 * Regex to find ATX heading styles based on a range of heading levels. The content is grouped with the following indexes:
 *    0 = entire match, 1 = opening markdown characters. 2 = link including image,
 *    3 = entire section numbering, 4 = Number only part of section numbering (excludes space), 5 = text, 6 = closing markdown characters.
 *
 * The raw regex would look something like this:
 * ^(\s*\#{1,6}\s*)(\[.*\]\(.*?\)\s*)(\d+\.)+\s)*(.*?)(\s?#{0,6}\s*)$
 * @param {number} fromLevel - Heading level
 * @param {number} toLevel - Heading level.
 * @param {string} flags - The flags that you pass to a regex e.g. g for global. Optional.
 */
function getGroupedRegex(fromLevel, toLevel, flags = "") {
  return new RegExp(
    // eslint-disable-next-line prefer-template
    "^(\\s*" +
      MARKDOWN_CHAR +
      "{" +
      fromLevel +
      "," +
      toLevel +
      "}" +
      "\\s+?)(\\[.*\\]\\(.*?\\)\\s*)*((\\d+\\.)+\\s)*(.*?)(\\s?" +
      MARKDOWN_CHAR +
      "{0,6}\\s*)$",
    flags
  );
}

/**
 * Regex to find ATX heading styles based on a range of heading levels.
 * @param {number} fromLevel - Heading level
 * @param {number} toLevel - Heading level.
 * @param {string} flags - The flags that you pass to a regex e.g. g for global. Optional.
 */
function getRegex(fromLevel, toLevel, flags = "") {
  return new RegExp(`^${MARKDOWN_CHAR}{${fromLevel},${toLevel}}\\s.*`, flags);
}

function getLevel(heading) {
  const regex = new RegExp(`^${MARKDOWN_CHAR}{1,6}\\s`);
  const result = regex.exec(heading.trim());
  let level = 0;

  if (result !== null && result[0].length > 0) {
    level = result[0].length - 1;
  }

  return level;
}

function stripMarkdown(heading) {
  const regex = new RegExp(
    `^(\\${MARKDOWN_CHAR}{1,6})(\\s)(.*?)(\\s?${MARKDOWN_CHAR}{0,6}\\s*)$`
  );
  const result = regex.exec(heading.trim());
  let text = "";

  if (result !== null) {
    // eslint-disable-next-line prefer-destructuring
    text = result[3];
  }

  return text;
}

module.exports = {
  getGroupedRegex,
  getRegex,
  getLevel,
  stripMarkdown,
};
