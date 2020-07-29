const vscode = require("vscode");
const heading = require("./heading");
const util = require("./util");
const settings = require("./settings");
const markdown = require("./markdown");
const document = require("./document");

const MARKDOWN_LIST_ITEM = "-";
const REGEX_TOC_START = /(.*?)<!--\s*TOC\s*-->/gi;
const TOC_START = `<!-- TOC -->`;
const REGEX_TOC_END = /\s*<!--\s*\/TOC\s*-->/gi;
const TOC_END = `<!-- /TOC -->`;
const TAB = "\t";
const defaultEOL = "\r\n";

module.exports = {
  create,
  getRange,
  getText,
  getCodeLens,
};

/**
 * Get the range of the Table of Contents (TOC). If the editor is not available, it will return undefined.
 * If there is no TOC, it will return an empty range (start === end) for the current cursor position.
 * @param {import("vscode").TextEditor} editor - TextEditor you want to check
 * @returns {vscode.Range} Range of the TOC
 */
function getRange(editor) {
  if (editor === undefined) {
    return undefined;
  }

  let doc = editor.document;
  let start = undefined,
    end = undefined;

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

/**
* Create a Table of Contents based on the inputs.
*  @param {string} text - The text to create the TOC from.
*  @param {number} fromLevel - The beginning of the heading level range which you want to include (most important).
*  @param {number} toLevel - The end of the heading level range which you want to include (least important).
* @param {String} slugifyStyle - An enum value to specify the slug style e.g. "github".
*  @param {String} label - A lable to add to the top of the TOC. This is optional.
*  @param {String} endOfLine - The end of line characters to use
*  @returns {string} Table of Contents
 */
function create(text, fromLevel, toLevel, slugifyStyle, label, endOfLine) {
  let headings = document.getGroupedHeadings(text, fromLevel, toLevel);
  let toc = [];
  toc.push(TOC_START);

  if (label && label.length > 0) {
    toc.push(label);
  }

  for (const currHeading of headings) {
    let level = heading.getLevel(currHeading[0]);
    let headingText = currHeading[3];

    let id = util.slugify(headingText, slugifyStyle);
    let link = markdown.link(headingText, "#" + id);
    let item = "";

    for (let i = fromLevel; i < level; i++) {
      item += TAB;
    }

    item = item + MARKDOWN_LIST_ITEM + " " + link;
    toc.push(item);
  }

  toc.push(TOC_END);

  let tocString = "";

  if (endOfLine && endOfLine.length > 0) {
    tocString = toc.join(endOfLine);
  } else {
    tocString = toc.join(defaultEOL);
  }

  return tocString;
}

/**
 * Check if the Table of Contents is up to date with the contents.
 * @param {import("vscode").TextEditor} editor
 * @returns {boolean} Up to date status
 */
function isUpToDate(editor) {
  let range = getRange(editor);
  if (range.isEmpty) {
    return;
  }

  var currentToc = editor.document.getText(range);

  var text = editor.document.getText();
  let config = settings.getWorkspaceConfig();
  let endOfLine = util.getEndOfLine(editor);
  let toc = create(
    text,
    config.tableOfContentsFromLevel,
    config.tableOfContentsToLevel,
    config.slugifyStyle,
    config.tableOfContentsLabel,
    endOfLine
  );

  return currentToc === toc;
}

/**
 * Get the text of the Table of Contents from the document of the TextEditor provided. It will return an
 * empty string if it does * not exist.
 * @param {import("vscode").TextEditor} editor
 * @returns {string} Table of contents
 */
function getText(editor) {
  let range = getRange(editor);
  if (range === undefined || range.isEmpty) {
    return "";
  }
  return editor.document.getText(range);
}

/**
 * Get the Code Lens for the Table of Contents from the document of the TextEditor provided. The Code Lens displays
 * the status of the TOC (up to date/out of date) and allows the user to run a command to update the TOC by clicking it.
 * @param {import("vscode").TextEditor} editor
 * @returns {vscode.CodeLens} The Code Lens.
 */
function getCodeLens(editor) {
  let range = getRange(editor);
  if (range === undefined || range.isEmpty) {
    return;
  }

  let upToDate = isUpToDate(editor);
  let status = "";
  upToDate ? (status = "up to date :-)") : (status = "out of date :-(");

  let lens = new vscode.CodeLens(range, {
    title: status,
    command: "marky-markdown.addTableOfContents",
  });
  return lens;
}
