import { ClassValues } from "./types";

/**
 * @param data the array of variables to use
 * function to generate constructor for the class
 * output: the string of the constructor  function
 */
function generateConstructor(data: Array<ClassValues>): string {
  let constructor = `${data[0].className}::${data[0].className}(`;
  let content = "";
  let amount = 0;
  let currClass = data[0].className;
  let currClassIndex = 0;

  data.forEach((val) => {
    if (currClass !== data[currClassIndex].className){
      constructor += `)
{
\t${content}
}\n\n`;
      content = "";
      currClassIndex++;
      if(data.length !== currClassIndex){
        constructor += `${data[currClassIndex].className}::${data[currClassIndex].className}(`;
      }
    }
    if(val.valueType.endsWith("*") || val.valueType.endsWith("&")){
      content += `this->${val.valueName} = new ${val.valueType.replace("*","").replace("&","")}[size${amount >0?amount:0}];
\tif(this->${val.valueName}==nullptr){
\t\tstd::cerr << "could not allocate the memory";
\t\texit(1);
\t}
\n`; 
      constructor += ` int size${amount >0?amount:0},`;
      amount++;
    }
    else if(val.valueType.endsWith("[]")){
      content += `this->${val.valueName} = new ${val.valueType.replace("[]","")}[size${amount >0?amount:0}];
\tif(this->${val.valueName}==nullptr){
\t\tstd::cerr << "could not allocate the memory";
\t\texit(1);
\t}
\n`;
      constructor += ` int size${amount >0?amount:0},`;
      amount ++;
    }
    else if(["int","float","long","double"].includes(val.valueType) || val.valueType.startsWith("unsigned")){
      content += `\tthis->${val.valueName} = 0;\n`;
    }
    else if(val.valueType === "string"){
      content += `\tthis->${val.valueName} = "";\n`;
    }
    else if(val.valueType === "char"){
      content += `\tthis->${val.valueName} = '';\n`;
    }
  });
  /////try to find the content and add the function to pack it
  if (constructor.substr(constructor.length-1,1) === ","){
    constructor = constructor.slice(0,constructor.length-1);
  } 
  constructor += `)
{
\t${content}
}\n`;

  return constructor;
}

/** 
 * generate get function for variable 
 * input: the variable (check ClassValue for fields)
 * output: the string of the function
*/
function generateGet(data: ClassValues): string {
  return `
${data.valueType} ${data.className}::get_${data.valueName}() const{
  return this->${data.valueName};
}\n`;
}

/** 
 * generate set function for variable 
 * input: the variable (check ClassValue for fields)
 * output: the string of the function
*/
function generateSet(data: ClassValues): string {
  return `
void ${data.className}::set_${data.valueName}(${data.valueType
    .split(" ")
    .join("  ")} ${data.valueName}){
  this->${data.valueName} = ${data.valueName};
}\n`;
}

/**
 * the main function of the text generation 
 * input: the variables array to generate data to
 * output: the text of functions of the vars
 */
export default function generateText(data: Array<ClassValues>): string {
  let dataToWrite = "";
  dataToWrite += generateConstructor(data);
  console.log(dataToWrite);
  data.forEach((val) => {
    dataToWrite += generateGet(val);
    dataToWrite += generateSet(val);
  });
  return dataToWrite;
}
