// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const vscode = require("vscode");
const activeDoc = require("./active-document");

module.exports = {
  update,
  show,
  hide,
  dispose,
  selectItem,
  showSummaryModal,
};

let documentStat = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Left,
  10
);
let selection = 0;
let status = [];

documentStat.command = "marky-markdown.selectStatisticItem";
documentStat.show();
update();

function update() {
  status[0] = `Words: ${activeDoc.getWordCount()}`;
  status[1] = `Reading Time: ${activeDoc.getReadingTime()} mins`;
  status[2] = `Lines: ${activeDoc.getLineCount()}`;
  status[3] = `Characters: ${activeDoc.getCharacterCount()}`;

  documentStat.text = status[selection];
}

function show() {
  documentStat.show();
}

function hide() {
  documentStat.hide();
}

function dispose() {
  documentStat.dispose();
}

/**
 * Show a modal popup with the statistics for the document (word count, reading time..etc).
 *
 */
function showSummaryModal() {
  let text = status.join("\n");
  vscode.window.showInformationMessage(text, {
    modal: true,
  });
}

/**
 * Show a quick pick selection for the statistics of the active document. The choice will change the text of the status bar item.
 *
 */
function selectItem() {
  let quickPick = vscode.window.showQuickPick(status, {
    canPickMany: false,
  });
  quickPick.then(function (fufilled) {
    if (fufilled) {
      if (fufilled.startsWith("Words")) {
        selection = 0;
      } else if (fufilled.startsWith("Reading")) {
        selection = 1;
      } else if (fufilled.startsWith("Lines")) {
        selection = 2;
      } else if (fufilled.startsWith("Characters")) {
        selection = 3;
      }

      update();
    }
  });
}
