import * as vscode from "vscode";
import main from "./mainEx";

//the vscode pack for the extension
export function activate(context: vscode.ExtensionContext) {
  console.log("the extension is online");
  let disposable = vscode.commands.registerCommand(
    "cpp-generate-getters-and-setters.generate-getters-setters",() => {
      const dir = vscode.workspace.rootPath;

      if (!dir) {
        return vscode.window.showErrorMessage("No folder open in editor");
      }

      const notify = main(dir);
      return vscode.window.showInformationMessage(notify);
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
