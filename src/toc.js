// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const vscode = require("vscode");
const heading = require("./heading");
const util = require("./util");
const settings = require("./settings");
const markdown = require("./markdown");
const document = require("./document");

const REGEX_TOC_START = /(.*?)<!--\s*TOC\s*-->/gi;
const TOC_START = `<!-- TOC -->`;
const REGEX_TOC_END = /\s*<!--\s*\/TOC\s*-->/gi;
const TOC_END = `<!-- /TOC -->`;

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
  let start;
  let end;

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
    return undefined; // TOC end delimiter was deleted
  }

  return new vscode.Range(start, end);
}

/**
 * Create a Table of Contents based on the inputs.
 *  @param {string} text - The text to create the TOC from.
 *  @param {number} fromLevel - The beginning of the heading level range which you want to include (most important).
 *  @param {number} toLevel - The end of the heading level range which you want to include (least important).
 *  @param {String} slugifyStyle - An enum value to specify the slug style e.g. "github".
 *  @param {String} label - A label to add to the top of the TOC.
 *  @param {String} listType - The list type (unordered list, ordered list)
 *  @param {String} tab - What characters represent a tab for indentation.
 *  @param {String} endOfLine - The end of line characters to use to separate each item
 *  @returns {string} Table of Contents
 */
function create(
  text,
  fromLevel,
  toLevel,
  slugifyStyle,
  label,
  listType,
  tab,
  endOfLine
) {
  let headings = document.getGroupedHeadings(text, fromLevel, toLevel);
  let toc = [];
  let listMarkdown = "-";
  toc.push(TOC_START);

  if (label && label.length > 0) {
    toc.push(label);
  }

  if (listType === "ordered list") {
    listMarkdown = "1.";
  }

  headings.forEach(function (currHeading) {
    let level = heading.getLevel(currHeading[0]);
    let sectionNumbering = currHeading[3];
    let headingText = currHeading[5];
    let linkText = headingText;

    if (sectionNumbering !== undefined) {
      linkText = sectionNumbering + headingText;
    }

    let id = util.slugify(linkText, slugifyStyle);
    let link = markdown.link(linkText, `#${id}`);
    let item = "";
    item += tab.repeat(level - fromLevel);
    item = `${item + listMarkdown} ${link}`;
    toc.push(item);
  });

  toc.push(TOC_END);
  let tocString = toc.join(endOfLine);
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
    return false;
  }

  let currentToc = editor.document.getText(range);
  let text = editor.document.getText();
  let config = settings.getWorkspaceConfig();
  let tab = util.getTab(editor);
  let endOfLine = util.getEndOfLine(editor);
  let toc = create(
    text,
    config.tableOfContentsFromLevel,
    config.tableOfContentsToLevel,
    config.slugifyStyle,
    config.tableOfContentsLabel,
    config.tableOfContentsListType,
    tab,
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
    return null;
  }

  let upToDate = isUpToDate(editor);
  let status = "";

  if (upToDate) {
    status = "up to date :-)";
  } else {
    status = "out of date :-(";
  }

  let lens = new vscode.CodeLens(range, {
    title: status,
    command: "marky-markdown.addTableOfContents",
  });
  return lens;
}

module.exports = {
  create,
  getRange,
  getText,
  getCodeLens,
};
