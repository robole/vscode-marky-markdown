const vscode = require("vscode");
const heading = require("./heading");
const util = require("./util");
const settings = require("./settings");
const markdown = require("./markdown");

const MARKDOWN_LIST_ITEM = "-";
const REGEX_TOC_START = /(.*?)<!--\s*TOC\s*-->/gi;
const TOC_START = "<!-- TOC -->";
const REGEX_TOC_END = /\s*<!--\s*\/TOC\s*-->/gi;
const TOC_END = "<!-- /TOC -->";
const defaultEOL = "\r\n";

module.exports = {
  create: create,
  addToActiveEditor: addToActiveEditor,
  updateForActiveEditor: updateForActiveEditor,
  removeFromActiveEditor: removeFromActiveEditor,
  onWillSave: onWillSave,
  getCodeLens: getCodeLens,
};

/**
 * Get the range of the TOC.
 * If there is no TOC, return the current cursor position.
 * If the editor is not available, return undefined.
 */
function _getRange() {
  let editor = vscode.window.activeTextEditor;
  let doc = editor.document;
  let start = undefined,
    end = undefined;

  if (editor === undefined) {
    return undefined;
  }

  for (let lineNo = 0; lineNo < doc.lineCount; lineNo++) {
    let lineText = doc.lineAt(lineNo).text;
    let tocStart = REGEX_TOC_START.exec(lineText);

    if (start === undefined && tocStart !== null) {
      let beforeText = tocStart[1];
      let startPos = beforeText.length;
      start = new vscode.Position(lineNo, startPos);
    }

    if (start !== undefined && REGEX_TOC_END.test(lineText) === true) {
      end = new vscode.Position(lineNo, lineText.length);
      break;
    }
  }

  if (start === undefined) {
    let select = editor.selection;

    if (select.isReversed) {
      start = select.start;
      end = start;
    } else {
      start = select.end;
      end = start;
    }
  }

  if (start !== undefined && end === undefined) {
    return undefined; //TOC end delimiter was deleted
  }

  return new vscode.Range(start, end);
}

function create(text, upperLevel, slugifyMode, label, EOL) {
  let headings = heading.getAll(text, upperLevel);
  let toc = [];
  toc.push(TOC_START);

  if (label && label.length > 0) {
    toc.push(label);
  }

  for (const currHeading of headings) {
    let level = heading.getLevel(currHeading);
    let headingText = heading.stripMarkdown(currHeading);

    let id = util.slugify(headingText, slugifyMode);
    let link = markdown.link(headingText, "#" + id);
    let item = "";

    for (let i = upperLevel; i < level; i++) {
      item += "\t";
    }

    item = item + MARKDOWN_LIST_ITEM + " " + link;
    toc.push(item);
  }

  toc.push(TOC_END);

  let tocString = "";

  if (EOL && EOL.length > 0) {
    tocString = toc.join(EOL);
  } else {
    tocString = toc.join(defaultEOL);
  }

  return tocString;
}

async function addToActiveEditor() {
  let editor = vscode.window.activeTextEditor;

  if (util.isMarkdownEditor(editor) === false) {
    return; // No open markdown editor
  }

  let range = _getRange();

  if (range === undefined) {
    vscode.window.showErrorMessage("TOC block is not closed.");
    return;
  }

  var text = editor.document.getText();
  let config = settings.getWorkspaceConfig();
  let endOfLine = util.getEndOfLineActiveEditor();
  let toc = create(
    text,
    config.headingUpperLevel,
    config.headingSlugifyMode,
    config.tableOfContentsLabel,
    endOfLine
  );

  if (range.isEmpty) {
    //if the range is empty (start === end),the toc does not exist
    await editor.edit(function (editBuilder) {
      editBuilder.insert(range.start, toc + endOfLine);
    });
  } else {
    //exists already
    await editor.edit(function (editBuilder) {
      editBuilder.replace(range, toc);
    });
  }
}

async function updateForActiveEditor() {
  let editor = vscode.window.activeTextEditor;

  if (util.isMarkdownEditor(editor) === false) {
    return; // No open markdown editor
  }

  let range = _getRange();

  //if the range is empty (start === end),the toc does not exist
  if (range === undefined || range.isEmpty) {
    return;
  }

  var text = editor.document.getText();
  let config = settings.getWorkspaceConfig();
  let endOfLine = util.getEndOfLineActiveEditor();
  let toc = create(
    text,
    config.headingUpperLevel,
    config.headingSlugifyMode,
    config.tableOfContentsLabel,
    endOfLine
  );

  await editor.edit(function (editBuilder) {
    editBuilder.replace(range, toc);
  });
}

function removeFromActiveEditor() {
  let editor = vscode.window.activeTextEditor;

  if (util.isMarkdownEditor(editor) === false) {
    return; // No open markdown editor
  }

  let range = _getRange();

  if (range === undefined) {
    vscode.window.showErrorMessage("TOC block is not closed.");
    return;
  } else if (range.isEmpty) {
    return;
  }

  editor.edit(function (editBuilder) {
    editBuilder.delete(range);
  });
}

function onWillSave(textDocumentWillSaveEvent) {
  let config = settings.getWorkspaceConfig();
  if (config.tableOfContentsUpdateOnSave === false) return;
  if (textDocumentWillSaveEvent.document.languageId == "markdown") {
    textDocumentWillSaveEvent.waitUntil(updateForActiveEditor());
  }
}

function isUpToDate() {
  let range = _getRange();
  if (range.isEmpty) {
    return;
  }

  let editor = vscode.window.activeTextEditor;
  var currentToc = editor.document.getText(range);

  var text = editor.document.getText();
  let config = settings.getWorkspaceConfig();
  let endOfLine = util.getEndOfLineActiveEditor();
  let toc = create(
    text,
    config.headingUpperLevel,
    config.headingSlugifyMode,
    config.tableOfContentsLabel,
    endOfLine
  );

  return currentToc === toc;
}

function getCodeLens() {
  let range = _getRange();
  if (range.isEmpty) {
    return;
  }

  let upToDate = isUpToDate();
  let status = "";
  upToDate ? (status = "up to date :-)") : (status = "out of date :-(");

  let lens = new vscode.CodeLens(range, {
    title: status,
    command: "marky-markdown.addTableOfContents",
  });
  return [lens];
}
