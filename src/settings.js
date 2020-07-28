const vscode = require("vscode");

module.exports = {
  getWorkspaceConfig,
  getLevels,
};

function getWorkspaceConfig() {
  let config = {};

  const bookmarks = vscode.workspace.getConfiguration("markyMarkdown.bookmarks");
  config.bookmarksLinkText = bookmarks.get("linkText");
  config.bookmarksLinkImagePath = bookmarks.get("linkImagePath");

  let levelRange = bookmarks.get("levelRange");
  let levels = getLevels(levelRange);
  config.bookmarksFromLevel = levels[0];
  config.bookmarksToLevel = levels[1];

  const toc = vscode.workspace.getConfiguration(
    "markyMarkdown.tableOfContents"
  );
  let tocLevelRange = toc.get("levelRange");
  let tocLevels = getLevels(tocLevelRange);
  config.tableOfContentsFromLevel = tocLevels[0];
  config.tableOfContentsToLevel = tocLevels[1];

  config.tableOfContentsLabel = toc.get("label");

  config.updateOnSave = vscode.workspace.getConfiguration(
    "markyMarkdown"
  ).get("updateOnSave");
  config.slugifyMode = vscode.workspace.getConfiguration(
    "markyMarkdown"
  ).get("slugifyMode");

  return config;
}

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
