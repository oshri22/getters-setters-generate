import { ClassValues, IndexesRanges } from "./types";

function findIndexes(context: Array<string>): Array<IndexesRanges> {
  let _private: number = -1;
  const indexes: Array<IndexesRanges> = [];
  let className = "";

  for (const [index, line] of context.entries()) {
    if (line.toLowerCase().startsWith("class")) {
      className = line.split(" ")[1].replace("{", "");
    } else if (line.toLowerCase().startsWith("public")) {
      if (_private !== -1) {
        indexes.push({ name: className, start: ++_private, end: index });
        _private = -1;
      }
    } else if (line.toLowerCase().startsWith("private")) {
      _private = index;
    }
  }
  return indexes;
}

export function parseClass(context: Array<string>) {
  //: Array<ClassValues> {

  let data: Array<ClassValues> = [];
  let i: number = 0;
  let flag = true;

  const indexes: Array<IndexesRanges> = findIndexes(context);
  indexes.forEach((index) => {
    for (i = index.start; i < index.end; i++) {
      const contextSplit = context[i]
        .replace("	", "")
        .replace(";\r", "")
        .split(" ");
      //console.log(contextSplit);
      const valueName = contextSplit[contextSplit.length - 1];
      const valueType = contextSplit
        .slice(0, contextSplit.length - 1)
        .join(" ");

      if (context[i].includes("(")) {
        continue;
      }

      if (context[i].replace(" ", "").startsWith("/*")) {
        flag = false;
        continue;
      } else if (context[i].replace(" ", "").startsWith("*/")) {
        flag = true;
        continue;
      } else if (context[i].replace(" ", "").startsWith("//")) {
        continue;
      }

      if (flag) {
        if (context[i].split(" ").length === 2) {
          data.push({
            className: index.name,
            valueName: valueName,
            valueType: valueType,
          });
        } else if (context[i].split(" ").length >= 2) {
          data.push({
            className: index.name,
            valueName: valueName,
            valueType: valueType,
          });
        }
      }
    }
  });

  return data;
}
