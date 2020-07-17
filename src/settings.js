const vscode = require("vscode");

module.exports = {
  getWorkspaceConfig: getWorkspaceConfig,
};

function getWorkspaceConfig() {
  let config = {};

  const heading = vscode.workspace.getConfiguration("markyMarkdown.heading");
  config.headingLinkText = heading.get("linkText");
  config.headingLinkImagePath = heading.get("linkImagePath");
  config.headingSlugifyMode = heading.get("slugifyMode");
  config.headingUpperLevel = heading.get("upperLevel");

  const toc = vscode.workspace.getConfiguration(
    "markyMarkdown.tableOfContents"
  );
  config.tableOfContentsLabel = toc.get("label");
  config.tableOfContentsUpdateOnSave = toc.get("updateOnSave");
  return config;
}
