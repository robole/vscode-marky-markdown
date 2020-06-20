const markdown = require("./markdown");
const util = require("./util");
const vscode = require("vscode");

const _markdownCharacter = "#";
let _linkText = "";
let _linkImagePath = "";
let _startingLevel = 2;
let _slugifyMode = "";

module.exports = {
  addLinks: addLinks,
  addLinksToActiveEditor: addLinksToActiveEditor,
  removeLinks: removeLinks,
  removeLinksFromActiveEditor: removeLinksFromActiveEditor,
};

function _getConfigValues() {
  // load the values from the configuration
  let config = vscode.workspace.getConfiguration("markyMarkdown");
  _linkText = config.get("headingLinkText");
  _linkImagePath = config.get("headingLinkImagePath");
  _slugifyMode = config.get("headingSlugifyMode");
  _startingLevel = parseInt(config.get("headingStartingLevel"));
}

/*
    atx heading style: 
    group 1 = opening markdown characters. 
    group 2 = link including image. 
    group 3 = text. 
    group 4 = optional closing markdown characters.

  ^(\s*\#{1,6}\s*)(\[.*\]\(.*?\))(.*?)(*\#{0,6}\s*)$
*/
function _getRegex(level) {
  return new RegExp(
    "^(\\s*\\" +
      _markdownCharacter +
      "{" +
      level +
      ",6}\\s*)(\\[.*\\]\\(.*?\\)\\s*)*(.*?)(\\" +
      _markdownCharacter +
      "{0,6}\\s*)$"
  );
}

function addLinksToActiveEditor() {
  var editor = vscode.window.activeTextEditor;

  if (!editor) {
    return; // No open text editor
  }

  _getConfigValues();

  let selection = util.getSelectionActiveEditor();
  let lines = util.getTextActiveEditor();
  let updatedLines = addLinks(lines, _linkImagePath, _linkText, _slugifyMode, _startingLevel);

  editor.edit(function (editBuilder) {
    var resultText = updatedLines.join("\n");
    editBuilder.replace(
      new vscode.Range(selection.start, selection.end),
      resultText
    );
  });
}

//expects string array
function addLinks(lines, imagePath, linkText, slugifyMode, startingLevel) {
  let regex = _getRegex(startingLevel);

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

  if (!editor) {
    return; // No open text editor
  }

  _getConfigValues();

  let selection = util.getSelectionActiveEditor();
  let lines = util.getTextActiveEditor();
  let updatedLines = removeLinks(lines, _startingLevel);

  editor.edit(function (editBuilder) {
    var resultText = updatedLines.join("\n");
    editBuilder.replace(
      new vscode.Range(selection.start, selection.end),
      resultText
    );
  });
}

//expects string array
function removeLinks(lines, startingLevel) {
  let regex = _getRegex(startingLevel);

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
