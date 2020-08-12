// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const vscode = require("vscode");
const activeDoc = require("./active-document");
const settings = require("./settings");

let statusBarItem = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Left,
  10
);
statusBarItem.command = "marky-markdown.selectStatisticItem";
let selection = 0;
let quickPickItem = [];

/**
 * Update statistic status bar item for the active document. Item selected is based on workspace configuration.
 */
function update() {
  selection = getWorkspaceSelection();

  quickPickItem[0] = {
    selection: 0,
    label: `Reading Time: ${activeDoc.getReadingTime()} mins`,
  };
  quickPickItem[1] = {
    selection: 1,
    label: `Words: ${activeDoc.getWordCount()}`,
  };
  quickPickItem[2] = {
    selection: 2,
    label: `Lines: ${activeDoc.getLineCount()}`,
  };
  quickPickItem[3] = {
    selection: 3,
    label: `Characters: ${activeDoc.getCharacterCount()}`,
  };

  quickPickItem[selection].picked = true;
  statusBarItem.text = quickPickItem[selection].label;
}

/**
 * Show statistic status bar item.
 */
function show() {
  update();
  statusBarItem.show();
}

/**
 * Hide statistic status bar item.
 */
function hide() {
  statusBarItem.hide();
}

/**
 * Show a modal dialog with the statistics for the document.
 *
 */
function showSummaryModal() {
  let text = quickPickItem.join("\n");
  vscode.window.showInformationMessage(text, {
    modal: true,
  });
}

/**
 * Show a quick pick selection for the statistics of the active document. The selection will toggle the text of the status bar item.
 *
 */
function selectItem() {
  let quickPick = vscode.window.showQuickPick(quickPickItem, {
    canPickMany: false,
    placeHolder: "Select a statistic to display",
  });
  quickPick.then(function (fufilled) {
    if (fufilled) {
      selection = fufilled.selection;
      save().then(() => {
        update();
      });
    }
  });
}

/**
 * Save the current selection to the workspace configuration.
 *
 */
async function save() {
  let settingValue = quickPickItem[selection].label.split(":")[0];
  return settings.setStatisticStatusBarItem(settingValue);
}

/**
 * Get the value from workspace configuration and translate to an index.
 */
function getWorkspaceSelection() {
  let value = settings.getWorkspaceConfig().statisticStatusBarItem;
  let index = 0;
  if (value.startsWith("Reading")) {
    index = 0;
  } else if (value.startsWith("Word")) {
    index = 1;
  } else if (value.startsWith("Line")) {
    index = 2;
  } else if (value.startsWith("Character")) {
    index = 3;
  }

  return index;
}

module.exports = {
  update,
  show,
  hide,
  selectItem,
  showSummaryModal,
};
