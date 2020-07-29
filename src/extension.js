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
    vscode.workspace.onWillSaveTextDocument(editor.onWillSave),
    vscode.languages.registerCodeLensProvider("markdown", {
      provideCodeLenses() {
        //expects iterator of codelenses, so we comply!
        let lenses = [];
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
