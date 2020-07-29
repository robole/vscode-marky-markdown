let vscode = require("vscode");
let settings= require("./settings");

// Converted from `/[^\p{Word}\- ]/u`
// `\p{Word}` => ASCII plus Letter (Ll/Lm/Lo/Lt/Lu), Mark (Mc/Me/Mn), Number (Nd/Nl/No), Connector_Punctuation (Pc)
const PUNCTUATION_REGEXP = /[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu;

module.exports = {
  slugify,
  getEndOfLine,
};

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
  style = style.toLowerCase();

  if (style === undefined) {
    style = settings.getWorkspaceConfig().slugifyStyle;
  }

  if (style === "gitlab") {
    slug = _slugifyGitlabStyle(text);
  } else if (style === "github") {
    slug = _slugifyGithubStyle(text);
  }
  return slug;
}

/**
 * Produces an ID from the text provided that can be used as an URL fragment. Does it in the same style as GitHub.
 * Based on source code: https://github.com/jch/html-pipeline/blob/master/lib/html/pipeline/toc_filter.rb
 * @param {string} text - The text to slugify
 * @returns {string} The slug.
*/
function _slugifyGithubStyle(text) {
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
