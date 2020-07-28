const vscode = require("vscode");
const doc = require("./document");
const settings = require("./settings");
const util = require("./util");
const toc = require("./toc");
const document = require("./document");

module.exports = {
  addBookmarks,
  removeBookmarks,
  hasBookmarks,
  getHeadings,
  addTableOfContents,
  removeTableOfContents,
  getTableOfContentsCodeLens,
  onWillSave
};

function addBookmarks() {
  const editor = vscode.window.activeTextEditor;

  if (isMarkdownEditor() === false) {
    return;
  }

  const config = settings.getWorkspaceConfig();
  const lines = util.getLinesOfActiveEditor();
  const updatedLines = doc.addBookmarks(
    lines,
    config.bookmarksLinkImagePath,
    config.bookmarksLinkText,
    config.slugifyMode,
    config.bookmarksFromLevel,
    config.bookmarksToLevel
  );

  editor.edit(function (editBuilder) {
    const endOfLine = util.getEndOfLine(editor);
    const resultText = updatedLines.join(endOfLine);
    const lineCount = updatedLines.length;
    const lastCharPos = updatedLines[lineCount - 1].length;
    const entireDoc = new vscode.Range(0, 0, lineCount, lastCharPos);

    editBuilder.replace(entireDoc, resultText);
  });
}

function removeBookmarks() {
  const editor = vscode.window.activeTextEditor;

  if (isMarkdownEditor() === false) {
    return;
  }

  const config = settings.getWorkspaceConfig();
  const lines = util.getLinesOfActiveEditor();
  const updatedLines = doc.removeBookmarks(
    lines,
    config.bookmarksFromLevel,
    config.bookmarksToLevel
  );

  editor.edit(function (editBuilder) {
    const endOfLine = util.getEndOfLine(editor);
    const resultText = updatedLines.join(endOfLine);

    const lineCount = updatedLines.length;
    const lastCharPos = updatedLines[lineCount - 1].length;
    const entireDoc = new vscode.Range(0, 0, lineCount, lastCharPos);

    editBuilder.replace(entireDoc, resultText);
  });
}

function hasBookmarks() {
  const editor = vscode.window.activeTextEditor;
  const text = editor.document.getText();
  const config = settings.getWorkspaceConfig();

  return doc.hasBookmarks(text, config.bookmarksFromLevel, config.bookmarksToLevel);
}

function getHeadings(fromLevel, toLevel) {
  const editor = vscode.window.activeTextEditor;

  if (isMarkdownEditor() === false) {
    return;
  }

  const config = settings.getWorkspaceConfig();
  const text = util.getTextActiveEditor();
  const headings = doc.getHeadings(
    text,
    fromLevel,
    toLevel
  );

  return headings;
}

async function addTableOfContents() {
  const editor = vscode.window.activeTextEditor;

  if (isMarkdownEditor() === false) {
    return;
  }

  const range = toc.getRange(editor);

  if (range === undefined) {
    vscode.window.showErrorMessage("TOC block is not closed.");
    return;
  }

  var text = editor.document.getText();
  let config = settings.getWorkspaceConfig();
  let endOfLine = util.getEndOfLine(editor);

  let tocString = toc.create(
    text,
    config.tableOfContentsFromLevel,
    config.tableOfContentsToLevel,
    config.slugifyMode,
    config.tableOfContentsLabel,
    endOfLine
  );

  if (range.isEmpty) {
    //if the range is empty (start === end),the toc does not exist
    await editor.edit(function (editBuilder) {
      editBuilder.insert(range.start, tocString + endOfLine);
    });
  } else {
    //exists already
    await editor.edit(function (editBuilder) {
      editBuilder.replace(range, tocString);
    });
  }
}

async function updateTableOfContents() {
  const editor = vscode.window.activeTextEditor;

  if (isMarkdownEditor() === false) {
    return;
  }

  let range = toc.getRange(editor);

  //if the range is empty (start === end),the toc does not exist
  if (range === undefined || range.isEmpty) {
    return;
  }

  var text = editor.document.getText();
  let config = settings.getWorkspaceConfig();
  let endOfLine = util.getEndOfLine(editor);

  let tocString = toc.create(
    text,
    config.tableOfContentsFromLevel,
    config.tableOfContentsToLevel,
    config.slugifyMode,
    config.tableOfContentsLabel,
    endOfLine
  );

  await editor.edit(function (editBuilder) {
    editBuilder.replace(range, tocString);
  });
}

function removeTableOfContents() {
  const editor = vscode.window.activeTextEditor;

  if (isMarkdownEditor() === false) {
    return;
  }

  let range = toc.getRange(editor);

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

function getTableOfContentsCodeLens() {
  const editor = vscode.window.activeTextEditor;
  return toc.getCodeLens(editor);
}

function isMarkdownEditor() {
  const editor = vscode.window.activeTextEditor;
  return editor && editor.document && editor.document.languageId === "markdown";
}

function getEndOfLine() {
  let eolTypeEnum = vscode.window.activeTextEditor.document.eol;
  let eol = "";

  if (eolTypeEnum === 1) {
    eol = "\n";
  } else if (eolTypeEnum === 2) {
    eol = "\r\n";
  }

  return eol;
}

async function onWillSave(textDocumentWillSaveEvent) {
  const editor = vscode.window.activeTextEditor;
  let config = settings.getWorkspaceConfig();

  if (config.updateOnSave === false) return;

  if (editor.document === textDocumentWillSaveEvent.document) {
    await textDocumentWillSaveEvent.waitUntil(_updateOnSave());
  }
}

async function _updateOnSave() {
  const editor = vscode.window.activeTextEditor;
  let config = settings.getWorkspaceConfig();
  let text = editor.document.getText();
  let tocString = toc.getText(editor);
  let endOfLine = util.getEndOfLine(editor);
  let updated = false;

  if (tocString.length > 0) {
    let updatedToc = toc.create(
      text,
      config.tableOfContentsFromLevel,
      config.tableOfContentsToLevel,
      config.slugifyMode,
      config.tableOfContentsLabel,
      endOfLine
    );
   text = text.replace(tocString, updatedToc);
   updated = true;
  }

  if (hasBookmarks() === true) {
    let lines = text.split(endOfLine);
    let updatedLines = document.addBookmarks(
      lines,
      config.bookmarksLinkImagePath,
      config.bookmarksLinkText,
      config.slugifyMode,
      config.bookmarksFromLevel,
      config.bookmarksToLevel
    );
    text = updatedLines.join(endOfLine);
    updated = true;
  }

  if(updated){
   await _update(text);
  }
}

async function _update(text){
  const editor = vscode.window.activeTextEditor;
  const lineCount = editor.document.lineCount;
  const lastCharPos = editor.document.lineAt(lineCount - 1).text.length;
  const entireDoc = new vscode.Range(0, 0, lineCount, lastCharPos);

  await editor.edit(function (editBuilder) {
    editBuilder.replace(entireDoc, text);
  });
}
