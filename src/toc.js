const vscode = require("vscode");
const heading = require("./heading");
const util = require("./util");
const settings = require("./settings");
const markdown = require("./markdown");
const document = require("./document");

const MARKDOWN_LIST_ITEM = "-";
const REGEX_TOC_START = /(.*?)<!--\s*TOC\s*-->/gi;
const TOC_START = "<!-- TOC -->";
const REGEX_TOC_END = /\s*<!--\s*\/TOC\s*-->/gi;
const TOC_END = "<!-- /TOC -->";
const TAB = "\t";
const defaultEOL = "\r\n";

module.exports = {
  create,
  getRange,
  getText,
  getCodeLens,
};

/**
 * Get the range of the TOC.
 * If there is no TOC, return the current cursor position.
 * If the editor is not available, return undefined.
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

function create(text, fromLevel, toLevel, slugifyMode, label, EOL) {
  let headings = document.getGroupedHeadings(text, fromLevel, toLevel);
  let toc = [];
  toc.push(TOC_START);

  if (label && label.length > 0) {
    toc.push(label);
  }

  for (const currHeading of headings) {
    let level = heading.getLevel(currHeading[0]);
    let headingText = currHeading[3];

    let id = util.slugify(headingText, slugifyMode);
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

  if (EOL && EOL.length > 0) {
    tocString = toc.join(EOL);
  } else {
    tocString = toc.join(defaultEOL);
  }

  return tocString;
}

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
    config.slugifyMode,
    config.tableOfContentsLabel,
    endOfLine
  );

  return currentToc === toc;
}

function getText(editor){
  let range = getRange(editor);
  if (range === undefined || range.isEmpty) {
    return "";
  }
  return editor.document.getText(range);
}

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
  return [lens];
}
