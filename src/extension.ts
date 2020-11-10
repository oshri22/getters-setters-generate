import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import {ClassValues} from "./types";
import {parseClass} from "./ParseClass";

function generateGet(data:ClassValues): string{
  return `
${data.valueName} ${data.className}::get${data.valueName}()const{
  return this->${data.valueName};
}`;
}

function generateSet(data:ClassValues): string{
  return `
void ${data.className}::set${data.valueName}(${data.valueType} ${data.valueName}){
  this->${data.valueName} = ${data.valueName};
}`;
} 


function generateText(data : Array<ClassValues>):string {
  let dataToWrite = "";
  data.forEach(val => {
    dataToWrite += generateGet(val);
    dataToWrite += generateSet(val);
  });
  return dataToWrite;
}



export function activate(context: vscode.ExtensionContext) {
  console.log("the extension is online");
  let disposable = vscode.commands.registerCommand(
    "cpp-generate-getters-and-setters.generate-getters-setters",
    () => {
      const dir = vscode.workspace.rootPath;
      if (!dir) {
        return vscode.window.showErrorMessage("No folder open in editor");
      }
    const data:Array<ClassValues> =[];
      const files = fs.readdirSync(dir);

      for (const file of files) {
        if (file.endsWith(".h") || file.endsWith(".hpp")) {
          const fileContent = fs.readFileSync(path.join(dir, file), "utf8");
          parseClass(fileContent.split("\n"));
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
