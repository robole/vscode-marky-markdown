const vscode = require("vscode");
const heading = require("./heading");

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "marky-markdown.addHeadingLinks",
      heading.addLinksToActiveEditor
    ),
    vscode.commands.registerCommand(
      "marky-markdown.removeHeadingLinks",
      heading.removeLinksFromActiveEditor
    )
  );
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
