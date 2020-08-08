const heading = require("./heading");
const util = require("./util");
const markdown = require("./markdown");

/**
 * Scans the contents of the text to check if it has bookmarks based on the provided range of heading levels.
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

  // eslint-disable-next-line no-restricted-syntax
  for (const currHeading of headings) {
    if (currHeading[2] !== undefined) {
      return true;
    }
  }
  return false;
}

/**
 * Scans the contents of the text to check if it has section numbers based on the provided range of heading levels.
 * @param {string} text - Text to search
 * @param {number} fromLevel - The beginning of the heading level range which you want to include (most important).
 * @param {number} toLevel - The end of the heading level range which you want to include (least important).
 * @returns {boolean}
 */
function hasSectionNumbering(text, fromLevel, toLevel) {
  const headings = getGroupedHeadings(text, fromLevel, toLevel);

  if (headings === null) {
    return false;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const currHeading of headings) {
    if (currHeading[3] !== undefined) {
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
  // @ts-ignore
  const regex = heading.getGroupedRegex(fromLevel, toLevel);
  const updatedLines = [];

  lines.forEach(function (line) {
    const result = regex.exec(line);

    if (result === null) {
      updatedLines.push(line);
    } else {
      let [
        ,
        openingMarkdown,
        ,
        sectionNumber,
        ,
        headingText,
        closingMarkdown,
      ] = result;
      const id = util.slugify(linkText + headingText, slugifyStyle);
      const bookmark = createLink(id, linkText, imagePath);

      if (sectionNumber === undefined && bookmark.length === 0) {
        updatedLines.push(`${openingMarkdown}${headingText}${closingMarkdown}`);
      } else if (sectionNumber !== undefined && bookmark.length === 0) {
        updatedLines.push(
          `${openingMarkdown}${sectionNumber}${headingText}${closingMarkdown}`
        );
      } else if (sectionNumber === undefined && bookmark.length > 0) {
        updatedLines.push(
          `${openingMarkdown}${bookmark} ${headingText}${closingMarkdown}`
        );
      } else if (sectionNumber !== undefined && bookmark.length > 0) {
        updatedLines.push(
          `${openingMarkdown}${bookmark} ${sectionNumber}${headingText}${closingMarkdown}`
        );
      }
    }
  });
  return updatedLines;
}

/**
 * Remove bookmark links from the array provided based on the heading range provided.
 * @param {Array} lines - An array of the lines of the document
 * @param {number} fromLevel - The beginning of the heading level range which you want to include (most important).
 * @param {number} toLevel - The end of the heading level range which you want to include (least important).
 *
 */
function removeBookmarks(lines, fromLevel, toLevel) {
  // @ts-ignore
  const regex = heading.getGroupedRegex(fromLevel, toLevel);
  const updatedLines = [];

  lines.forEach(function (line) {
    const result = regex.exec(line);

    if (result != null) {
      let [
        ,
        openingMarkdown,
        ,
        numbering,
        ,
        headingText,
        closingMarkdown,
      ] = result;
      if (numbering) {
        updatedLines.push(
          `${openingMarkdown}${numbering}${headingText}${closingMarkdown}`
        );
      } else {
        updatedLines.push(`${openingMarkdown}${headingText}${closingMarkdown}`);
      }
    } else {
      updatedLines.push(line);
    }
  });
  return updatedLines;
}

/**
 * Add section numbering to the headings based on the provided parameters.
 * @param {Array} lines - An array of the lines of the document
 * @param {number} fromLevel - The beginning of the heading level range which you want to include (most important).
 * @param {number} toLevel - The end of the heading level range which you want to include (least important).
 */
function addSectionNumbering(lines, fromLevel, toLevel) {
  // @ts-ignore
  const regex = heading.getGroupedRegex(fromLevel, toLevel);
  const updatedLines = [];
  const sectionCount = [0, 0, 0, 0, 0, 0];

  lines.forEach(function (line) {
    const result = regex.exec(line);

    if (result === null) {
      updatedLines.push(line);
    } else {
      const level = heading.getLevel(line);
      sectionCount[level - 1] += 1;
      const sectionNumber = [...Array(level - fromLevel + 1).keys()]
        .map((num) => `${sectionCount[num + fromLevel - 1]}.`)
        .join("");

      let [
        ,
        openingMarkdown,
        bookmark,
        ,
        ,
        headingText,
        closingMarkdown,
      ] = result;

      if (bookmark) {
        updatedLines.push(
          `${openingMarkdown}${bookmark}${sectionNumber} ${headingText}${closingMarkdown}`
        );
      } else {
        updatedLines.push(
          `${openingMarkdown}${sectionNumber} ${headingText}${closingMarkdown}`
        );
      }
    }
  });
  return updatedLines;
}

/**
 * Remove section numbering from the headings based on the provided parameters.
 * @param {Array} lines - An array of the lines of the document.
 * @param {number} fromLevel - The beginning of the heading level range which you want to include (most important).
 * @param {number} toLevel - The end of the heading level range which you want to include (least important).
 */
function removeSectionNumbering(lines, fromLevel, toLevel) {
  // @ts-ignore
  const regex = heading.getGroupedRegex(fromLevel, toLevel);
  const updatedLines = [];

  lines.forEach(function (line) {
    const result = regex.exec(line);

    if (result === null) {
      updatedLines.push(line);
    } else {
      let [
        ,
        openingMarkdown,
        bookmark,
        ,
        ,
        headingText,
        closingMarkdown,
      ] = result;

      if (bookmark === undefined) {
        updatedLines.push(`${openingMarkdown}${headingText}${closingMarkdown}`);
      } else {
        updatedLines.push(
          `${openingMarkdown}${bookmark}${headingText}${closingMarkdown}`
        );
      }
    }
  });
  return updatedLines;
}

/**
 * Creates a markdown link based on the inputs.
 * @param {string} id - The ID of the heading
 * @param {string} text - The link text. One of text or imagePath is expected.
 * @param {string} imagePath - The path to an image. One of text or imagePath is expected.
 * @returns {string} The markdown link
 */
function createLink(id, text, imagePath) {
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
 * @param {number} toLevel - The end of the heading level range which you want to include
 * (least important). Optional. Default is 6.
 * @returns {Array} Array of headings found.
 */
function getHeadings(text, fromLevel, toLevel = 6) {
  let headings = [];

  const regex = heading.getRegex(fromLevel, toLevel, "gm");
  const result = text.match(regex);
  if (result !== null) {
    headings = result;
  }
  return headings;
}

/**
 * Get an 2D array of the headings from the text provided based on the range provided. The subarray contains entries
 * representing the constituent parts of the heading: 0. the whole heading, 1. the opening markdown, 2. bookmark link,
 * 3. text, 4. closing markdown if it exists
 * @param {string} text - Text to search
 * @param {number} fromLevel - The beginning of the heading level range which you want to include (most important).
 * @param {number} toLevel - The end of the heading level range which you want to include (least important).
 * This is optional. The default is 6.
 * @returns {Array} Array of headings found.
 */
function getGroupedHeadings(text, fromLevel, toLevel = 6) {
  const regex = heading.getGroupedRegex(fromLevel, toLevel, "gm");
  // @ts-ignore
  const matches = text.matchAll(regex);
  return [...matches];
}

/**
 * Get the number of words.
 *
 * @param {string} text Text for document.
 */
function getWordCount(text) {
  let matches = text.match(/\w+/g);

  if (matches === null) {
    return 0;
  }

  return matches.length;
}

/**
 * Get the reading time in minutes. It is based on a reading speed of 250 words per minute.
 *
 *  @param {string} text Text for document.
 */
function getReadingTime(text) {
  const words = getWordCount(text);

  if (words === 0) {
    return 0;
  }

  return Math.ceil(words / 250);
}

/**
 * Get the number of characters including new line characters.
 *
 * @param {string} text Text for document.
 */
function getCharacterCount(text) {
  return text.match(/[.\r\n]*/gm).length;
}

module.exports = {
  addBookmarks,
  removeBookmarks,
  hasBookmarks,
  addSectionNumbering,
  removeSectionNumbering,
  hasSectionNumbering,
  getHeadings,
  getGroupedHeadings,
  getWordCount,
  getCharacterCount,
  getReadingTime,
};
