const vscode = require("vscode");
const markdown = require("./markdown");
const util = require("./util");
const settings = require("./settings");

const MARKDOWN_CHAR = "#";

module.exports = {
  addLinks,
  addLinksToActiveEditor,
  removeLinks,
  removeLinksFromActiveEditor,
  getAll,
  getAllGrouped,
  getAllFromActiveEditor,
  getLevel,
  stripMarkdown,
};

/**
 * Global, multiline regex to find ATX heading styles based on a range of heading levels. The content is grouped:
 *    group 0 = entire match, group 1 = opening markdown characters, group 2 = link including image.
 *    group 3 = text, group 4 = optional closing markdown characters.
 *
 * The raw regex would look something like this:
 * ^(\s*\#{1,6}\s*)(\[.*\]\(.*?\))(.*?)(*\#{0,6}\s*)$
 * @param {number} fromLevel - Heading level
 * @param {number} toLevel - Heading level.
 */
function _getGlobalGroupedRegex(fromLevel, toLevel) {
  return new RegExp(
    `^(\\s*${MARKDOWN_CHAR}{${fromLevel},${toLevel}}\\s+?)(\\[.*\\]\\(.*?\\)\\s*)*(.*?)(${MARKDOWN_CHAR}{0,6}\\s*)$`,
    "gm"
  );
}

/**
 * Regex to find ATX heading styles based on a range of heading levels. The content is grouped:
 *    group 0 = entire match, group 1 = opening markdown characters, group 2 = link including image.
 *    group 3 = text, group 4 = optional closing markdown characters.
 *
 * The raw regex would look something like this:
 * ^(\s*\#{1,6}\s*)(\[.*\]\(.*?\))(.*?)(*\#{0,6}\s*)$
 * @param {number} fromLevel - Heading level
 * @param {number} toLevel - Heading level.
 */
function _getGroupedRegex(fromLevel, toLevel) {
  return new RegExp(
    `^(\\s*${MARKDOWN_CHAR}{${fromLevel},${toLevel}}\\s+?)(\\[.*\\]\\(.*?\\)\\s*)*(.*?)(${MARKDOWN_CHAR}{0,6}\\s*)$`
  );
}

function _getRegex(fromLevel, toLevel) {
  return new RegExp(`^${MARKDOWN_CHAR}{${fromLevel},${toLevel}}\\s.*`, "gm");
}

function addLinksToActiveEditor() {
  const editor = vscode.window.activeTextEditor;

  if (util.isMarkdownEditor(editor) === false) {
    return; // No open markdown editor
  }

  const config = settings.getWorkspaceConfig();
  const lines = util.getLinesOfActiveEditor();
  const updatedLines = addLinks(
    lines,
    config.headingLinkImagePath,
    config.headingLinkText,
    config.headingSlugifyMode,
    config.headingFromLevel,
    config.headingToLevel
  );

  editor.edit(function (editBuilder) {
    const endOfLine = util.getEndOfLineActiveEditor();
    const resultText = updatedLines.join(endOfLine);
    const lineCount = updatedLines.length;
    const lastCharPos = updatedLines[lineCount - 1].length;
    const entireDoc = new vscode.Range(0, 0, lineCount, lastCharPos);

    editBuilder.replace(entireDoc, resultText);
  });
}

// expects string array
function addLinks(lines, imagePath, linkText, slugifyMode, fromLevel, toLevel) {
  const regex = _getGroupedRegex(fromLevel, toLevel);

  lines.forEach(function (line, i) {
    const result = regex.exec(line);

    if (result != null) {
      const openingMarkdown = result[1];
      const headingText = result[3];
      const closingMarkdown = result[4];
      const id = util.slugify(linkText + headingText, slugifyMode);

      const link = _createLink(id, linkText, imagePath);
      lines[i] = `${openingMarkdown + link} ${headingText}${closingMarkdown}`;
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

function removeLinksFromActiveEditor() {
  const editor = vscode.window.activeTextEditor;

  if (util.isMarkdownEditor(editor) === false) {
    return; // No open markdown editor
  }

  const config = settings.getWorkspaceConfig();
  const lines = util.getLinesOfActiveEditor();
  const updatedLines = removeLinks(
    lines,
    config.headingFromLevel,
    config.headingToLevel
  );

  editor.edit(function (editBuilder) {
    const endOfLine = util.getEndOfLineActiveEditor();
    const resultText = updatedLines.join(endOfLine);

    const lineCount = updatedLines.length;
    const lastCharPos = updatedLines[lineCount - 1].length;
    const entireDoc = new vscode.Range(0, 0, lineCount, lastCharPos);

    editBuilder.replace(entireDoc, resultText);
  });
}

// expects string array
function removeLinks(lines, fromLevel, toLevel) {
  const regex = _getGroupedRegex(fromLevel, toLevel);

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

function getAllFromActiveEditor() {
  const editor = vscode.window.activeTextEditor;

  if (util.isMarkdownEditor(editor) === false) {
    return; // No open markdown editor
  }

  const config = settings.getWorkspaceConfig();
  const text = util.getTextActiveEditor();
  const headings = getAll(text, config.headingFromLevel);

  return headings;
}

function getAll(text, fromLevel, toLevel) {
  if (toLevel === undefined) {
    toLevel = 6;
  }

  const regex = _getRegex(fromLevel, toLevel);
  const matches = text.match(regex);
  return matches;
}

function getAllGrouped(text, fromLevel, toLevel) {
  if (toLevel === undefined) {
    toLevel = 6;
  }

  const regex = _getGlobalGroupedRegex(fromLevel, toLevel);
  const matches = text.matchAll(regex);
  return [...matches];
}

function getLevel(text) {
  const regex = new RegExp(`^${MARKDOWN_CHAR}{1,6}\\s`);
  const result = regex.exec(text.trim());
  let level = 0;

  if (result !== null && result[0].length > 0) {
    level = result[0].length - 1;
  }

  return level;
}

function stripMarkdown(heading) {
  const regex = new RegExp(`^(\\${MARKDOWN_CHAR}{1,6})(\\s)(.*)`);
  const result = regex.exec(heading.trim());
  let text = "";

  if (result !== null && result.length === 4) {
    text = result[3];
  }
  const x = "hello";
  return text;
}
