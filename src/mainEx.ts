import * as fs from "fs";
import * as path from "path";
import { ClassValues } from "./types";
import parseClass from "./ParseClass";
import generateText from "./generateData";


/**
 * the main for this project the combine the parser and data generator and then write the data
 * input: the dir to scan for .h files
 */
export default function main(dir:string):string {
  const data: Array<ClassValues> = [];
  const files = fs.readdirSync(dir);
  let notify = "";

  for (const file of files) {
    if (file.endsWith(".h") || file.endsWith(".hpp")) {
      const fileContent = fs
        .readFileSync(path.join(dir, file), "utf8")
        .split("\r")
        .join("");
      const classData = parseClass(fileContent.split("\n"));
      const TextToWrite = `#include "${file}"\n\n\n${generateText(classData)}`;
      //console.log(TextToWrite);
      fs.writeFile(
        path.join(dir, `${file.substr(0, file.lastIndexOf("."))}.cpp`),
        TextToWrite,
        (err) => {
          if (err) {
            notify += `could not creat cpp file for ${file}`;
          } else {
            notify += `cpp file :${file} created successfully`;
          }
        }
      );
    }
  }
  return notify;
}
