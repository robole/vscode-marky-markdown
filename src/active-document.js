// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const vscode = require("vscode");
const doc = require("./document");
const settings = require("./settings");
const util = require("./util");
const toc = require("./toc");

/**
 * Add bookmark links to the headings based on the range specified in the Configuration.
 *
 */
function addBookmarks() {
  const editor = vscode.window.activeTextEditor;

  if (isMarkdownEditor() === false) {
    return;
  }

  const config = settings.getWorkspaceConfig();
  const lines = getLines();
  const updatedLines = doc.addBookmarks(
    lines,
    config.bookmarksLinkImagePath,
    config.bookmarksLinkText,
    config.slugifyStyle,
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

/**
 * Remove bookmark links from the headings based on the range specified in the Configuration.
 *
 */
function removeBookmarks() {
  const editor = vscode.window.activeTextEditor;

  if (isMarkdownEditor() === false) {
    return;
  }

  const config = settings.getWorkspaceConfig();
  const lines = getLines();
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

/**
 * Scans the contents of the document in the Active Editor to check if it has bookmarks.
 * @returns {boolean}
 */
function hasBookmarks() {
  const editor = vscode.window.activeTextEditor;
  const text = editor.document.getText();
  const config = settings.getWorkspaceConfig();

  return doc.hasBookmarks(
    text,
    config.bookmarksFromLevel,
    config.bookmarksToLevel
  );
}

/**
 * Scans the contents of the document in the Active Editor to check if the headings have section numbers.
 * @returns {boolean}
 */
function hasSectionNumbering() {
  const editor = vscode.window.activeTextEditor;
  const text = editor.document.getText();
  const config = settings.getWorkspaceConfig();

  return doc.hasSectionNumbering(
    text,
    config.numberingFromLevel,
    config.numberingToLevel
  );
}

/**
 * Get an array of the headings from the document in the Active Editor based on the range provided.
 * @param {number} fromLevel - The beginning of the heading level range which you want to include (most important).
 * @param {number} toLevel - The end of the heading level range which you want to include (least important).
 * @returns {Array} Array of headings found.
 */
function getHeadings(fromLevel, toLevel) {
  const editor = vscode.window.activeTextEditor;

  if (isMarkdownEditor() === false) {
    return;
  }

  const text = editor.document.getText();
  const headings = doc.getHeadings(text, fromLevel, toLevel);

  // eslint-disable-next-line consistent-return
  return headings;
}

/**
 * @async
 * Add a Table of Contents to the document in the Active Editor.
 */
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

  const text = editor.document.getText();
  const config = settings.getWorkspaceConfig();
  const endOfLine = util.getEndOfLine(editor);

  const tocString = toc.create(
    text,
    config.tableOfContentsFromLevel,
    config.tableOfContentsToLevel,
    config.slugifyStyle,
    config.tableOfContentsLabel,
    config.tableOfContentsListType,
    util.getTab(editor),
    endOfLine
  );

  if (range.isEmpty) {
    // if the range is empty (start === end),the toc does not exist
    await editor.edit(function (editBuilder) {
      editBuilder.insert(range.start, tocString + endOfLine);
    });
  } else {
    // exists already
    await editor.edit(function (editBuilder) {
      editBuilder.replace(range, tocString);
    });
  }
}

/**
 * @async
 * Updates the Table of Contents in the document in the Active Editor if one exists.
 */
async function updateTableOfContents() {
  const editor = vscode.window.activeTextEditor;

  if (isMarkdownEditor() === false) {
    return;
  }

  const range = toc.getRange(editor);

  // if the range is empty (start === end),the toc does not exist
  if (range === undefined || range.isEmpty) {
    return;
  }

  const text = editor.document.getText();
  const config = settings.getWorkspaceConfig();
  const endOfLine = util.getEndOfLine(editor);

  const tocString = toc.create(
    text,
    config.tableOfContentsFromLevel,
    config.tableOfContentsToLevel,
    config.slugifyStyle,
    config.tableOfContentsLabel,
    config.tableOfContentsListType,
    util.getTab(editor),
    endOfLine
  );

  await editor.edit(function (editBuilder) {
    editBuilder.replace(range, tocString);
  });
}

/**
 * @async
 * Removes the Table of Contents in the document in the Active Editor if one exists.
 */
function removeTableOfContents() {
  const editor = vscode.window.activeTextEditor;

  if (isMarkdownEditor() === false) {
    return;
  }

  const range = toc.getRange(editor);

  if (range === undefined) {
    vscode.window.showErrorMessage("TOC block is not closed.");
  }

  if (range === undefined || range.isEmpty) {
    return;
  }

  editor.edit(function (editBuilder) {
    editBuilder.delete(range);
  });
}

/**
 * Add section numbering to the headings based on the range specified in the Configuration.
 *
 */
function addSectionNumbering() {
  const editor = vscode.window.activeTextEditor;

  if (isMarkdownEditor() === false) {
    return;
  }

  const config = settings.getWorkspaceConfig();
  const lines = getLines();
  const updatedLines = doc.addSectionNumbering(
    lines,
    config.numberingFromLevel,
    config.numberingToLevel
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

/**
 * Remove section numbering from the headings based on the range specified in the Configuration.
 *
 */
function removeSectionNumbering() {
  const editor = vscode.window.activeTextEditor;

  if (isMarkdownEditor() === false) {
    return;
  }

  const config = settings.getWorkspaceConfig();
  const lines = getLines();
  const updatedLines = doc.removeSectionNumbering(
    lines,
    config.numberingFromLevel,
    config.numberingToLevel
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

function getTableOfContentsCodeLens() {
  const editor = vscode.window.activeTextEditor;
  return toc.getCodeLens(editor);
}

function isMarkdownEditor() {
  const editor = vscode.window.activeTextEditor;
  return editor && editor.document && editor.document.languageId === "markdown";
}

/**
 * @async
 * Executed just before the document is saved. It will update the dynamic
 * contents (bookmarks, table of contents) of the document in the Active Editor
 * if the "Update on Save" setting is selected in the Configuration.
 */
async function onWillSave(textDocumentWillSaveEvent) {
  const config = settings.getWorkspaceConfig();

  if (config.updateOnSave === false) return;

  if (
    textDocumentWillSaveEvent.document &&
    textDocumentWillSaveEvent.document.languageId === "markdown"
  ) {
    await textDocumentWillSaveEvent.waitUntil(updateOnSave());
  }
}

/**
 * @async
 * Updates the dynamic contents (bookmarks, table of contents, section numbers) of the document in the Active Editor
 *  if the "Update on Save" setting is selected in the Configuration.
 */
async function updateOnSave() {
  const editor = vscode.window.activeTextEditor;
  const config = settings.getWorkspaceConfig();
  let text = editor.document.getText();
  const endOfLine = util.getEndOfLine(editor);
  let updated = false;

  if (hasBookmarks() === true) {
    const lines = text.split(endOfLine);
    const updatedLines = doc.addBookmarks(
      lines,
      config.bookmarksLinkImagePath,
      config.bookmarksLinkText,
      config.slugifyStyle,
      config.bookmarksFromLevel,
      config.bookmarksToLevel
    );
    text = updatedLines.join(endOfLine);
    updated = true;
  }

  if (hasSectionNumbering() === true) {
    const lines = text.split(endOfLine);
    const updatedLines = doc.addSectionNumbering(
      lines,
      config.numberingFromLevel,
      config.numberingToLevel
    );

    text = updatedLines.join(endOfLine);
    updated = true;
  }

  const tocString = toc.getText(editor);
  if (tocString.length > 0) {
    const updatedToc = toc.create(
      text,
      config.tableOfContentsFromLevel,
      config.tableOfContentsToLevel,
      config.slugifyStyle,
      config.tableOfContentsLabel,
      config.tableOfContentsListType,
      util.getTab(editor),
      endOfLine
    );
    text = text.replace(tocString, updatedToc);
    updated = true;
  }

  if (updated) {
    await replace(text);
  }
}

/**
 * @async
 * Replaces the contents of the entire document in the Active Editor with the text provided.
 * @param {string} text - Replacement text
 */
async function replace(text) {
  const editor = vscode.window.activeTextEditor;
  const { lineCount } = editor.document;
  const lastCharPos = editor.document.lineAt(lineCount - 1).text.length;
  const entireDoc = new vscode.Range(0, 0, lineCount, lastCharPos);

  await editor.edit(function (editBuilder) {
    editBuilder.replace(entireDoc, text);
  });
}

/**
 * Returns the the text of entire document in the Active Editor as an array with an entry for each line.
 *
 */
function getLines() {
  const editor = vscode.window.activeTextEditor;
  const text = editor.document.getText();
  let lines = null;
  const END_OF_LINE_REGEX = /\r?\n/g;

  if (text !== null && text.length !== 0) {
    lines = text.split(END_OF_LINE_REGEX);
  }

  return lines;
}

/**
 * Get the number of words for the document.
 */
function getWordCount() {
  const editor = vscode.window.activeTextEditor;
  return doc.getWordCount(editor.document.getText());
}

/**
 * Get the number of characters including new line characters.
 */
function getCharacterCount() {
  const editor = vscode.window.activeTextEditor;
  return doc.getCharacterCount(editor.document.getText());
}

/**
 * Get the reading time in minutes. It is based on a reading speed of 250 words per minute.
 */
function getReadingTime() {
  const editor = vscode.window.activeTextEditor;
  return doc.getReadingTime(editor.document.getText());
}

/**
 * Get the number of lines.
 */
function getLineCount() {
  return vscode.window.activeTextEditor.document.lineCount;
}

module.exports = {
  addBookmarks,
  removeBookmarks,
  hasBookmarks,
  getHeadings,
  addTableOfContents,
  removeTableOfContents,
  addSectionNumbering,
  removeSectionNumbering,
  getTableOfContentsCodeLens,
  onWillSave,
  getWordCount,
  getCharacterCount,
  getReadingTime,
  getLineCount,
};
