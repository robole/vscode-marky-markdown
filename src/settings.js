const vscode = require("vscode");

module.exports = {
  getWorkspaceConfig,
  getLevels,
};

function getWorkspaceConfig() {
  let config = {};

  const heading = vscode.workspace.getConfiguration("markyMarkdown.heading");
  config.headingLinkText = heading.get("linkText");
  config.headingLinkImagePath = heading.get("linkImagePath");
  config.headingSlugifyMode = heading.get("slugifyMode");

  let levelRange = heading.get("levelRange");
  let levels = getLevels(levelRange);
  if (levels.length === 2) {
    config.headingFromLevel = levels[0];
    config.headingToLevel = levels[1];
  }

  const toc = vscode.workspace.getConfiguration(
    "markyMarkdown.tableOfContents"
  );
  config.tableOfContentsLabel = toc.get("label");
  config.tableOfContentsUpdateOnSave = toc.get("updateOnSave");
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
