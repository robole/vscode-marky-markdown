let vscode = require("vscode");

// Converted from `/[^\p{Word}\- ]/u`
// `\p{Word}` => ASCII plus Letter (Ll/Lm/Lo/Lt/Lu), Mark (Mc/Me/Mn), Number (Nd/Nl/No), Connector_Punctuation (Pc)
const PUNCTUATION_REGEXP = /[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu;

module.exports = {
  getSelectionActiveEditor,
  getLinesOfActiveEditor,
  getTextActiveEditor,
  slugify,
  isMarkdownEditor,
  getEndOfLineActiveEditor,
};

function getEndOfLineActiveEditor() {
  let eolTypeEnum = vscode.window.activeTextEditor.document.eol;
  let eol = "";

  if (eolTypeEnum === 1) {
    eol = "\n";
  } else if (eolTypeEnum === 2) {
    eol = "\r\n";
  }

  return eol;
}

function isMarkdownEditor(editor) {
  return editor && editor.document && editor.document.languageId === "markdown";
}

//Returns selection, if seletion is empty, returns the entire document as a selection.
function getSelectionActiveEditor() {
  let editor = vscode.window.activeTextEditor;
  let selection = editor.selection;

  if (selection.isEmpty) {
    return new vscode.Selection(0, 0, editor.document.lineCount, 0);
  }

  return selection;
}

//Returns the the text of entire document as an array with an entry for each line.
function getLinesOfActiveEditor() {
  let lines = null;
  let text = getTextActiveEditor();
  let endOfLineRegex = /\r?\n/g;

  if (text !== null && text.length !== 0) {
    lines = text.split(endOfLineRegex);
  }

  return lines;
}

//Returns the text of entire document.
function getTextActiveEditor() {
  let editor = vscode.window.activeTextEditor;
  let text = null;

  if (editor && editor.document) {
    text = editor.document.getText();
  }

  return text;
}

//Produces an ID from text that can be used as an URL fragment. Replaces
//whitespace and non-sluggish characters with a hyphen.
function slugify(text, mode) {
  let slug = undefined;
  mode = mode.toLowerCase();

  if (mode === undefined) {
    mode = vscode.workspace
      .getConfiguration("markyMarkdown")
      .get("headingSlugifyMode");
  }

  if (mode === "gitlab") {
    slug = _slugifyGitlabStyle(text);
  } else if (mode === "github") {
    slug = _slugifyGithubStyle(text);
  }
  return slug;
}

/*
Based on source code: https://github.com/jch/html-pipeline/blob/master/lib/html/pipeline/toc_filter.rb
*/
function _slugifyGithubStyle(text) {
  let slug = text.trim().toLowerCase();
  slug = slug.replace(PUNCTUATION_REGEXP, "").replace(/ /g, "-");
  return slug;
}

/*
Based on source code: https://gitlab.com/gitlab-org/gitlab/-/blob/6a71a82a1a0fb3dcdc2e471027bd156b15e2be3e/lib/gitlab/utils/markdown.rb
*/
function _slugifyGitlabStyle(text) {
  let slug = text.trim().toLowerCase();

  slug = slug
    .replace(PUNCTUATION_REGEXP, "")
    .replace(/ /g, "-")
    // Remove any duplicate separators
    .replace(/\-{2,}?/g, "-")
    .replace(/^(\d+)$/, "anchor-$1"); // digits-only hrefs conflict with issue refs
  return slug;
}
