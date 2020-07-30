// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const vscode = require("vscode");
const editor = require("./activeeditor");

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "marky-markdown.addBookmarks",
      editor.addBookmarks
    ),
    vscode.commands.registerCommand(
      "marky-markdown.removeBookmarks",
      editor.removeBookmarks
    ),
    vscode.commands.registerCommand(
      "marky-markdown.addTableOfContents",
      editor.addTableOfContents
    ),
    vscode.commands.registerCommand(
      "marky-markdown.removeTableOfContents",
      editor.removeTableOfContents
    ),
    vscode.commands.registerCommand(
      "marky-markdown.addSectionNumbering",
      editor.addSectionNumbering
    ),
    vscode.commands.registerCommand(
      "marky-markdown.removeSectionNumbering",
      editor.removeSectionNumbering
    ),
    vscode.workspace.onWillSaveTextDocument(editor.onWillSave),
    vscode.languages.registerCodeLensProvider("markdown", {
      provideCodeLenses() {
        // expects iterator of codelenses, so we comply!
        const lenses = [];
        lenses.push(editor.getTableOfContentsCodeLens());
        return lenses;
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
