const vscode = require("vscode");
const heading = require("./heading");
const util = require("./util");
const markdown = require("./markdown");

module.exports = {
  addBookmarks,
  removeBookmarks,
  hasBookmarks,
  getHeadings,
  getGroupedHeadings,
};

/**
* Scans the contents of the text provided to check if it has bookmarks based on a range of heading levels.
* @param {string} text - Text to search
* @param {number} fromLevel - The beginning of the heading level range which you want to include (most important).
* @param {number} toLevel - The end of the heading level range which you want to include (least important).
* @returns {boolean}
*/
function hasBookmarks(text, fromLevel, toLevel) {
  const headings = getGroupedHeadings(text, fromLevel, toLevel);

  if (headings === null) {
    return false;
  }

  for (const heading of headings) {
    if (heading[2] !== undefined) {
      return true;
    }
  }
  return false;
}

/**
* Add bookmark links to the headings based on the provided parameters.
* @param {Array} lines - An array of the lines of the document
* @param {String} imagePath - The path of the image you want to provide. This is optional.
* @param {String} linkText - The text you would like to have for the bookmark link.
* @param {String} slugifyStyle - An enum value to specify the slug style e.g. "github".
* @param {number} fromLevel - The beginning of the heading level range which you want to include (most important).
* @param {number} toLevel - The end of the heading level range which you want to include (least important).
*/
function addBookmarks(
  lines,
  imagePath,
  linkText,
  slugifyStyle,
  fromLevel,
  toLevel
) {
  const regex = heading.getGroupedRegex(fromLevel, toLevel);

  lines.forEach(function (line, i) {
    const result = regex.exec(line);

    if (result != null) {
      const openingMarkdown = result[1];
      const headingText = result[3];
      const closingMarkdown = result[4];
      const id = util.slugify(linkText + headingText, slugifyStyle);

      const link = _createLink(id, linkText, imagePath);
      lines[i] = `${openingMarkdown}${link} ${headingText}${closingMarkdown}`;
    }
  });
  return lines;
}

/**
* Remove bookmark links from the array provided based on the heading range provided.
* @param {Array} lines - An array of the lines of the document
* @param {number} fromLevel - The beginning of the heading level range which you want to include (most important).
* @param {number} toLevel - The end of the heading level range which you want to include (least important).
*
*/
function removeBookmarks(lines, fromLevel, toLevel) {
  const regex = heading.getGroupedRegex(fromLevel, toLevel);

  lines.forEach(function (line, i) {
    const result = regex.exec(line);

    if (result != null) {
      const openingMarkdown = result[1];
      const headingText = result[3];
      const closingMarkdown = result[4];

      lines[i] = openingMarkdown + headingText + closingMarkdown;
    }
  });
  return lines;
}

/**
* Creates a markdown link based on the inputs.
* @param {string} id - The ID of the heading
* @param {string} text - The link text. One of text or imagePath is expected.
* @param {string} imagePath - The path to an image. One of text or imagePath is expected.
* @returns {string} The markdown link
*/
function _createLink(id, text, imagePath) {
  const img = markdown.image("", imagePath);
  let link = "";

  if (img != null && text.length === 0) {
    link = markdown.link(img, `#${id}`);
  } else if (img != null && text.length > 0) {
    link = markdown.link(`${img} ${text}`, `#${id}`);
  } else if (img === null && text.length === 0) {
    link = "";
  } else {
    link = markdown.link(text, `#${id}`);
  }

  return link;
}

/**
* Get an array of the headings from the text provided based on the range provided.
* @param {string} text - Text to search
* @param {number} fromLevel - The beginning of the heading level range which you want to include (most important).
* @param {number} toLevel - The end of the heading level range which you want to include (least important).
* @returns {Array} Array of headings found.
*/
function getHeadings(text, fromLevel, toLevel) {
  if (toLevel === undefined) {
    toLevel = 6;
  }

  const regex = heading.getRegex(fromLevel, toLevel);
  const matches = text.match(regex);
  return matches;
}

/**
* Get an 2D array of the headings from the text provided based on the range provided. The subarray contains entries
* representing the constituent parts of the heading: 0. the whole heading, 1. the opening markdown, 2. bookmark link,
* 3. text, 4. closing markdown if it exists
* @param {string} text - Text to search
* @param {number} fromLevel - The beginning of the heading level range which you want to include (most important).
* @param {number} toLevel - The end of the heading level range which you want to include (least important).
* @returns {Array} Array of headings found.
*/
function getGroupedHeadings(text, fromLevel, toLevel) {
  if (toLevel === undefined) {
    toLevel = 6;
  }

  const regex = heading.getGlobalGroupedRegex(fromLevel, toLevel);
  // @ts-ignore
  const matches = text.matchAll(regex);
  return [...matches];
}
