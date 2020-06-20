// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// index base configuration for user, default value is "#"
var _base = "x";

function init() {
  // load the configuration
  const configuration = vscode.workspace.getConfiguration("markdownHeading");
  const configBase = configuration.get("base");
  if (configBase && configBase.length > 0) {
    _base = configBase;
  }
}

//create the fragment link from the text e.g. a heading "## my header" returns "my-heading"
//It does the following:
//It downcases the string
//remove anything that is not a letter, number, space or hyphen
//changes any space to a hyphen.
function createFragmentText(text) {
  var fragment = text.trim().toLowerCase();
  fragment
    .replace(/[^\w\- ]+/g, " ")
    .replace(/\s+/g, "-")
    .replace(/\-+$/, "");
  return fragment;
}

function createMarkdownLink(text) {
  var fragment = createFragmentText(text);
  return "[heading link](#" + fragment + ")";
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "markdown-heading" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "markdown-heading.helloWorld",
    function () {
      var editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No open text editor");
        return; // No open text editor
      }

      var selection = editor.selection;
      var text = editor.document.getText(selection);
      var lines;
      if (text.length == 0) {
        // use all text if no selection
        lines = editor.document.getText().split("\n");
        selection = new vscode.Selection(0, 0, lines.length, 0);
      } else {
        lines = text.split("\n");
      }

      init();
      var re = new RegExp("^(\\s*\\" + _base + "+\\s*)(.+)", "g");
      let match = re.exec(lines[0]);
	  var link = createMarkdownLink(match[2]);
	  vscode.window.showInformationMessage(link);
      vscode.window.showInformationMessage(
        lines[0].replace(re, "$1 " + link + " $2")
      );

      // apply plugin
      //  const markdownIndex = new MarkdownIndex();
      //  markdownIndex.addMarkdownIndex(lines);
      //  editor.edit(function (builder: vscode.TextEditorEdit) {
      // 	 var resultText = lines.join("\n");
      // 	 builder.replace(new vscode.Range(selection.start, selection.end), resultText);
      //  })

      // Display a message box to the user
      //vscode.window.showInformationMessage(lines[0]);
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
