let settings = require("./settings");

// Converted from `/[^\p{Word}\- ]/u`
// `\p{Word}` => ASCII plus Letter (Ll/Lm/Lo/Lt/Lu), Mark (Mc/Me/Mn), Number (Nd/Nl/No), Connector_Punctuation (Pc)
// eslint-disable-next-line node/no-unsupported-features/es-syntax
const PUNCTUATION_REGEXP = /[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu;

/**
 * Get the End Of Line sequence (LR or CRLF) for the editor provided.
 * @param {import("vscode").TextEditor} editor
 * @returns {string} End of Line sequence
 */
function getEndOfLine(editor) {
  let eolTypeEnum = editor.document.eol;
  let eol = "";

  if (eolTypeEnum === 1) {
    eol = "\n";
  } else if (eolTypeEnum === 2) {
    eol = "\r\n";
  }

  return eol;
}

/**
 * Produces an ID from the text provided that can be used as an URL fragment. Replaces whitespace
 * and non-sluggish characters with a hyphen.
 * @param {string} text - The text to slugify.
 * @param {string} style - The style to use to create slug, different vendors do it differently e.g. github.
 * @returns {string} The slug.
 */
function slugify(text, style) {
  let slug;
  let selectedStyle = style.toLowerCase();

  if (style === undefined) {
    selectedStyle = settings.getWorkspaceConfig().slugifyStyle;
  }

  if (selectedStyle === "gitlab") {
    slug = slugifyGitlabStyle(text);
  } else if (selectedStyle === "github") {
    slug = slugifyGithubStyle(text);
  }
  return slug;
}

/**
 * Produces an ID from the text provided that can be used as an URL fragment. Does it in the same style as GitHub.
 * Based on source code: https://github.com/jch/html-pipeline/blob/master/lib/html/pipeline/toc_filter.rb
 * @param {string} text - The text to slugify
 * @returns {string} The slug.
 */
function slugifyGithubStyle(text) {
  let slug = text.trim().toLowerCase();
  slug = slug.replace(PUNCTUATION_REGEXP, "").replace(/ /g, "-");
  return slug;
}

/**
 * Produces an ID from the text provided that can be used as an URL fragment. Does it in the same style as GitHub.
 * Based on source code: https://gitlab.com/gitlab-org/gitlab/-/blob/6a71a82a1a0fb3dcdc2e471027bd156b15e2be3e/lib/gitlab/utils/markdown.rb
 * @param {string} text - The text to slugify
 * @returns {string} The slug.
 */
function slugifyGitlabStyle(text) {
  let slug = text.trim().toLowerCase();

  slug = slug
    .replace(PUNCTUATION_REGEXP, "")
    .replace(/ /g, "-")
    // Remove any duplicate separators
    .replace(/-{2,}?/g, "-")
    .replace(/^(\d+)$/, "anchor-$1"); // digits-only hrefs conflict with issue refs
  return slug;
}
/**
 * Get the tab sequence (spaces or tab) for the editor provided.
 * @param {import("vscode").TextEditor} editor
 * @returns {string} Tab sequence
 */
function getTab(editor) {
  let tab;
  let { insertSpaces } = editor.options;
  let { tabSize } = editor.options;

  if (insertSpaces) {
    // @ts-ignore
    tab = " ".repeat(tabSize);
  } else {
    tab = "\t";
  }

  return tab;
}

module.exports = {
  slugify,
  getEndOfLine,
  getTab,
};
