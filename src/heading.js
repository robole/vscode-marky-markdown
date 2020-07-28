const vscode = require("vscode");
const markdown = require("./markdown");
const util = require("./util");
const settings = require("./settings");

const MARKDOWN_CHAR = "#";

module.exports = {
  getGlobalGroupedRegex,
  getGroupedRegex,
  getRegex,
  getLevel,
  stripMarkdown,
};

/**
 * Global, multiline regex to find ATX heading styles based on a range of heading levels. The content is grouped:
 *    group 0 = entire match, group 1 = opening markdown characters, group 2 = link including image.
 *    group 3 = text, group 4 = optional closing markdown characters.
 *
 * The raw regex would look something like this:
 * /^(\s*#{1,6}\s*)(\[.*\]\(.*?\))(.*?)(\\s?#{0,6}\s*)$/gm
 * @param {number} fromLevel - Heading level
 * @param {number} toLevel - Heading level.
 */
function getGlobalGroupedRegex(fromLevel, toLevel) {
  return new RegExp(
    "^(\\s*" +
      MARKDOWN_CHAR +
      "{" +
      fromLevel +
      "," +
      toLevel +
      "}" +
      "\\s+?)(\\[.*\\]\\(.*?\\)\\s*)*(.*?)(\\s?" +
      MARKDOWN_CHAR +
      "{0,6}\\s*)$",
    "gm"
  );
}

/**
 * Regex to find ATX heading styles based on a range of heading levels. The content is grouped:
 *    group 0 = entire match, group 1 = opening markdown characters, group 2 = link including image.
 *    group 3 = text, group 4 = optional closing markdown characters.
 *
 * The raw regex would look something like this:
 * ^(\s*\#{1,6}\s*)(\[.*\]\(.*?\))(.*?)(\s?#{0,6}\s*)$
 * @param {number} fromLevel - Heading level
 * @param {number} toLevel - Heading level.
 */
function getGroupedRegex(fromLevel, toLevel) {
  return new RegExp(
    "^(\\s*" +
      MARKDOWN_CHAR +
      "{" +
      fromLevel +
      "," +
      toLevel +
      "}" +
      "\\s+?)(\\[.*\\]\\(.*?\\)\\s*)*(.*?)(\\s?" +
      MARKDOWN_CHAR +
      "{0,6}\\s*)$"
  );
}

function getRegex(fromLevel, toLevel) {
  return new RegExp(`^${MARKDOWN_CHAR}{${fromLevel},${toLevel}}\\s.*`, "gm");
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
    text = result[3];
  }

  return text;
}
