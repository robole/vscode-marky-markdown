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

// expects string array
function addBookmarks(
  lines,
  imagePath,
  linkText,
  slugifyMode,
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
      const id = util.slugify(linkText + headingText, slugifyMode);

      const link = _createLink(id, linkText, imagePath);
      lines[i] = `${openingMarkdown}${link} ${headingText}${closingMarkdown}`;
    }
  });
  return lines;
}

// expects string array
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

function getHeadings(text, fromLevel, toLevel) {
  if (toLevel === undefined) {
    toLevel = 6;
  }

  const regex = heading.getRegex(fromLevel, toLevel);
  const matches = text.match(regex);
  return matches;
}

function getGroupedHeadings(text, fromLevel, toLevel) {
  if (toLevel === undefined) {
    toLevel = 6;
  }

  const regex = heading.getGlobalGroupedRegex(fromLevel, toLevel);
  const matches = text.matchAll(regex);
  return [...matches];
}
