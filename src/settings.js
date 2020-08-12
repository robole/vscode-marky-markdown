// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const vscode = require("vscode");

/**
 * Get a config object with the properties related to this extension
 * @returns {object} Custom config object
 */
function getWorkspaceConfig() {
  let config = {};

  const bookmarks = vscode.workspace.getConfiguration(
    "markyMarkdown.bookmarks"
  );
  config.bookmarksLinkText = bookmarks.get("linkText");
  config.bookmarksLinkImagePath = bookmarks.get("linkImagePath");

  let levelRange = bookmarks.get("levelRange");
  let levels = getLevels(levelRange);
  [config.bookmarksFromLevel, config.bookmarksToLevel] = levels;

  const toc = vscode.workspace.getConfiguration(
    "markyMarkdown.tableOfContents"
  );
  let tocLevelRange = toc.get("levelRange");
  let tocLevels = getLevels(tocLevelRange);
  [config.tableOfContentsFromLevel, config.tableOfContentsToLevel] = tocLevels;

  config.tableOfContentsLabel = toc.get("label");
  config.tableOfContentsListType = toc.get("listType");

  const numbering = vscode.workspace.getConfiguration(
    "markyMarkdown.sectionNumbering"
  );
  let sectionLevelRange = numbering.get("levelRange");
  let sectionLevels = getLevels(sectionLevelRange);
  [config.numberingFromLevel, config.numberingToLevel] = sectionLevels;

  const marky = vscode.workspace.getConfiguration("markyMarkdown");
  config.statisticStatusBarItem = marky.get("statisticStatusBarItem");
  config.updateOnSave = marky.get("updateOnSave");
  config.slugifyStyle = marky.get("slugifyStyle");

  return config;
}

/**
 *
 * Set the statistic item selected for the status bar
 */
async function setStatisticStatusBarItem(value) {
  const marky = vscode.workspace.getConfiguration("markyMarkdown");
  return marky.update("statisticStatusBarItem", value);
}

/**
 * Helper function to get the levels from a range which is a setting option in the configuration
 * @param {string} levelRange - Range in the form "1..6"
 * @returns {Array} Array with the fromLevel as the first entry, and toLevel as the second entry
 */
function getLevels(levelRange) {
  let regex = /([1-6]{1})\.\.([1-6]{1})/;
  let result = regex.exec(levelRange);
  let levels = [];

  if (result !== null) {
    levels.push(parseInt(result[1]));
    levels.push(parseInt(result[2]));
  }

  return levels;
}

module.exports = {
  getWorkspaceConfig,
  getLevels,
  setStatisticStatusBarItem,
};
