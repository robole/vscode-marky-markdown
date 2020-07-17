const vscode = require("vscode");
const heading = require("./heading");
const toc = require("./toc");

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
    ),
    vscode.commands.registerCommand(
      "marky-markdown.addTableOfContents",
      toc.addToActiveEditor
    ),
    vscode.commands.registerCommand(
      "marky-markdown.removeTableOfContents",
      toc.removeFromActiveEditor
    ),
    vscode.workspace.onWillSaveTextDocument(toc.onWillSave),
    vscode.languages.registerCodeLensProvider("markdown", {
      provideCodeLenses(document, token) {
        return toc.getCodeLens();
      },
      resolveCodeLens(codeLens, token) {
        console.log("resolve does something??");
      },
    })
  );
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
