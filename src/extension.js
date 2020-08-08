// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const vscode = require("vscode");
const activeDoc = require("./active-document");
const statistics = require("./statistics");

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "marky-markdown.addBookmarks",
      activeDoc.addBookmarks
    ),
    vscode.commands.registerCommand(
      "marky-markdown.removeBookmarks",
      activeDoc.removeBookmarks
    ),
    vscode.commands.registerCommand(
      "marky-markdown.addTableOfContents",
      activeDoc.addTableOfContents
    ),
    vscode.commands.registerCommand(
      "marky-markdown.removeTableOfContents",
      activeDoc.removeTableOfContents
    ),
    vscode.commands.registerCommand(
      "marky-markdown.addSectionNumbering",
      activeDoc.addSectionNumbering
    ),
    vscode.commands.registerCommand(
      "marky-markdown.removeSectionNumbering",
      activeDoc.removeSectionNumbering
    ),
    vscode.commands.registerCommand(
      "marky-markdown.selectStatisticItem",
      statistics.selectItem
    ),
    vscode.languages.registerCodeLensProvider("markdown", {
      provideCodeLenses() {
        // expects iterator of codelenses, so we comply!
        const lenses = [];
        lenses.push(activeDoc.getTableOfContentsCodeLens());
        return lenses;
      },
    }),
    vscode.workspace.onWillSaveTextDocument(activeDoc.onWillSave),
    vscode.workspace.onDidChangeTextDocument(function (e) {
      if (e.document.languageId === "markdown") {
        statistics.update();
      }
    }),
    vscode.window.onDidChangeActiveTextEditor(function (e) {
      if (e.document.languageId === "markdown") {
        statistics.update();
        statistics.show();
      } else {
        statistics.hide();
      }
    })
  );
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
