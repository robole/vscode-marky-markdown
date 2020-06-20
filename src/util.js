let vscode = require("vscode");
let editor = vscode.window.activeTextEditor;

// Converted from `/[^\p{Word}\- ]/u`
// `\p{Word}` => ASCII plus Letter (Ll/Lm/Lo/Lt/Lu), Mark (Mc/Me/Mn), Number (Nd/Nl/No), Connector_Punctuation (Pc)
const PUNCTUATION_REGEXP = /[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu;

module.exports = {
  getSelectionActiveEditor: getSelectionActiveEditor,
  getTextActiveEditor: getTextActiveEditor,
  slugify: slugify,
};

//Returns selection, if seletion is empty, returns the entire document as a selection.
function getSelectionActiveEditor() {
  editor = vscode.window.activeTextEditor;
  let selection = editor.selection;

  if (selection.isEmpty) {
    let lines = editor.document.getText().split("\n");
    return new vscode.Selection(0, 0, lines.length, 0);
  }

  return selection;
}

//Returns the selected text, if there is no selection returns text of entire document.
function getTextActiveEditor() {
  editor = vscode.window.activeTextEditor;

  let selection = editor.selection;
  let text = editor.document.getText(selection);
  let lines = null;

  if (text.length == 0) {
    lines = editor.document.getText().split("\n");
    selection = new vscode.Selection(0, 0, lines.length, 0);
  } else {
    lines = text.split("\n");
  }

  return lines;
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
Based on original code: https://github.com/jch/html-pipeline/blob/master/lib/html/pipeline/toc_filter.rb 
with some input from https://github.com/yzhang-gh/vscode-markdown/blob/master/src/util.ts
*/
function _slugifyGithubStyle(text) {
  let slug = text.trim().toLowerCase();
  slug = slug.replace(PUNCTUATION_REGEXP, "").replace(/ /g, "-");
  return slug;
}

/*
Based on original code: https://gitlab.com/gitlab-org/gitlab/-/blob/6a71a82a1a0fb3dcdc2e471027bd156b15e2be3e/lib/gitlab/utils/markdown.rb
with some input from https://github.com/yzhang-gh/vscode-markdown/blob/master/src/util.ts
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
