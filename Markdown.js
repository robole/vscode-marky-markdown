import { workspace } from "vscode";
const vscode = require("vscode");

// index base configuration for user, default value is "#"
let _base = "#";

function init() {
  // load the configuration
  const configuration = workspace.getConfiguration("markdownHeading");
  const configBase = configuration.get("base");
  if (configBase && configBase.length > 0) {
    this._base = configBase;
  }
}

export function doSomething(lines) {
  init();
  console.log(_base);
  vscode.window.showInformationMessage(lines[2]);
}
