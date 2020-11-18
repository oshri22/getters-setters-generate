import { ClassValues, IndexesRanges } from "./types";


/**
 * function to find the borders of the the private section
 * input: the file content spitted by \n
 * output: an array of the indexes section (array because the file might contain more then 1 class definition)
 */
function findIndexes(context: Array<string>): Array<IndexesRanges> {
  let _private: number = -1;
  const indexes: Array<IndexesRanges> = [];
  let className = "";

  for (const [index, line] of context.entries()) {
    if (line.toLowerCase().startsWith("class")) {
      className = line.split(" ")[1].replace("{", "");
    } else if (line.toLowerCase().startsWith("public") || line.toLowerCase().startsWith("}")) {
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

/**
 * function to generate an object from the type ClassValue for every variable in the class
 * input: the lines of the current file
 * the array of the variable data
 */
export default function parseClass(context: Array<string>): Array<ClassValues> {

  let data: Array<ClassValues> = [];
  let i: number = 0;
  let flag = true;

  const indexes: Array<IndexesRanges> = findIndexes(context);
  indexes.forEach((index) => {
    for (i = index.start; i < index.end; i++) {
      const contextSplit = context[i]
        .split("    ").join("")
        .split(";").join("")
        .split(" ");
      //console.log(contextSplit);
      const valueName = contextSplit[contextSplit.length - 1];
      const valueType = contextSplit
        .slice(0, contextSplit.length - 1)
        .join(" ");

      if (context[i].includes("(")) {
        continue;
      }

      if (context[i].split(" ").join("").startsWith("/*")) {
        flag = false;
        continue;
      } else if (context[i].split(" ").join("").startsWith("*/")) {
        flag = true;
        continue;
      } else if (context[i].split(" ").join("").startsWith("//")) {
        continue;
      }

      if (flag) {
        if (context[i].split(" ").length === 2) {
          data.push({
            className: index.name,
            valueName: valueName,
            valueType: valueType.split(" ").join(""),
          });
        } else if (context[i].split(" ").length >= 2) {
          data.push({
            className: index.name.split(" ").join(""),
            valueName: valueName,
            valueType: valueType.split("   ").join(""),
          });
        }
      }
    }
  });

  return data;
}
