const markdown = require("./markdown");
const util = require("./util");
const settings = require("./settings");
const vscode = require("vscode");
const MARKDOWN_CHAR = "#";

module.exports = {
  addLinks: addLinks,
  addLinksToActiveEditor: addLinksToActiveEditor,
  removeLinks: removeLinks,
  removeLinksFromActiveEditor: removeLinksFromActiveEditor,
  getAll: getAll,
  getAllFromActiveEditor: getAllFromActiveEditor,
  getLevel: getLevel,
  stripMarkdown: stripMarkdown,
};

/*
    atx heading style: 
    group 1 = opening markdown characters. 
    group 2 = link including image. 
    group 3 = text. 
    group 4 = optional closing markdown characters.

  ^(\s*\#{1,6}\s*)(\[.*\]\(.*?\))(.*?)(*\#{0,6}\s*)$
*/
function _getGroupedRegex(upperLevel) {
  return new RegExp(
    "^(\\s*" +
      MARKDOWN_CHAR +
      "{" +
      upperLevel +
      ",6}\\s*)(\\[.*\\]\\(.*?\\)\\s*)*(.*?)(" +
      MARKDOWN_CHAR +
      "{0,6}\\s*)$"
  );
}

function _getRegex(upperLevel) {
  return new RegExp("^" + MARKDOWN_CHAR + "{" + upperLevel + ",6}\\s.*", "gm");
}

function addLinksToActiveEditor() {
  let editor = vscode.window.activeTextEditor;

  if (util.isMarkdownEditor(editor) === false) {
    return; // No open markdown editor
  }

  let config = settings.getWorkspaceConfig();
  let lines = util.getLinesOfActiveEditor();
  let updatedLines = addLinks(
    lines,
    config.headingLinkImagePath,
    config.headingLinkText,
    config.headingSlugifyMode,
    config.headingUpperLevel
  );

  editor.edit(function (editBuilder) {
    let endOfLine = util.getEndOfLineActiveEditor();
    let resultText = updatedLines.join(endOfLine);
    let lineCount = updatedLines.length;
    let lastCharPos = updatedLines[lineCount - 1].length;
    let entireDoc = new vscode.Range(0, 0, lineCount, lastCharPos);

    editBuilder.replace(entireDoc, resultText);
  });
}

//expects string array
function addLinks(lines, imagePath, linkText, slugifyMode, upperLevel) {
  let regex = _getGroupedRegex(upperLevel);

  lines.forEach(function (line, i) {
    let result = regex.exec(line);

    if (result != null) {
      let openingMarkdown = result[1];
      let headingText = result[3];
      let closingMarkdown = result[4];
      let id = util.slugify(linkText + headingText, slugifyMode);

      let link = _createLink(id, linkText, imagePath);
      lines[i] = openingMarkdown + link + " " + headingText + closingMarkdown;
    }
  });
  return lines;
}

function _createLink(id, text, imagePath) {
  let img = markdown.image("", imagePath);
  let link = "";

  if (img != null && text.length === 0) {
    link = markdown.link(img, "#" + id);
  } else if (img != null && text.length > 0) {
    link = markdown.link(img + " " + text, "#" + id);
  } else if (img === null && text.length === 0) {
    link = "";
  } else {
    link = markdown.link(text, "#" + id);
  }

  return link;
}

function removeLinksFromActiveEditor() {
  var editor = vscode.window.activeTextEditor;

  if (util.isMarkdownEditor(editor) === false) {
    return; // No open markdown editor
  }

  let config = settings.getWorkspaceConfig();
  let lines = util.getLinesOfActiveEditor();
  let updatedLines = removeLinks(lines, config.headingUpperLevel);

  editor.edit(function (editBuilder) {
    let endOfLine = util.getEndOfLineActiveEditor();
    let resultText = updatedLines.join(endOfLine);

    let lineCount = updatedLines.length;
    let lastCharPos = updatedLines[lineCount - 1].length;
    let entireDoc = new vscode.Range(0, 0, lineCount, lastCharPos);

    editBuilder.replace(entireDoc, resultText);
  });
}

//expects string array
function removeLinks(lines, upperLevel) {
  let regex = _getGroupedRegex(upperLevel);

  lines.forEach(function (line, i) {
    let result = regex.exec(line);

    if (result != null) {
      let openingMarkdown = result[1];
      let headingText = result[3];
      let closingMarkdown = result[4];

      lines[i] = openingMarkdown + headingText + closingMarkdown;
    }
  });
  return lines;
}

function getAllFromActiveEditor() {
  if (util.isMarkdownEditor(editor) === false) {
    return; // No open markdown editor
  }

  let config = settings.getWorkspaceConfig();
  const text = util.getTextActiveEditor();
  let headings = getAll(text, config.headingUpperLevel);
  return headings;
}

function getAll(text, upperLevel) {
  const regex = _getRegex(upperLevel);
  const matches = text.match(regex);
  return matches;
}

function getLevel(text) {
  let regex = new RegExp("^" + MARKDOWN_CHAR + "{1,6}");
  let result = regex.exec(text.trim());
  let level = 0;

  if (result !== null && result[0].length > 0) {
    level = result[0].length;
  }

  return level;
}

function stripMarkdown(heading) {
  let regex = new RegExp("^(\\" + MARKDOWN_CHAR + "{1,6})(\\s)(.*)");
  let result = regex.exec(heading.trim());
  let text = "";

  if (result !== null && result.length === 4) {
    text = result[3];
  }

  return text;
}
