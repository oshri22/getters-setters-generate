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

  data.forEach((val) => {
    if (currClass !== val.className){
      if (constructor.substr(constructor.length-1,1) === ","){
        constructor = constructor.slice(0,constructor.length-1);
      }
      constructor += `)
{
\t${content}
}\n\n`;
      content = "";
      currClass = val.className;
      constructor += `${val.className}::${val.className}(`;
    }
    if(val.valueType.endsWith("*") || val.valueName.startsWith("*"))
    {
      content += `
\tthis->${val.valueName} = new ${val.valueType.replace("*","").replace("&","")}[size${amount >0?amount:0}];
\tif(this->${val.valueName}==nullptr){
\t\tstd::cerr << "could not allocate the memory";
\t\texit(1);
\t}
\n`; 
      constructor += ` int size${amount >0?amount:0},`;
      amount++;
    }
    else if(val.valueName.endsWith("[]")){
      let valueName = val.valueName.replace("[]","");
      content += `
\tthis->${valueName} = new ${val.valueType}[size${amount >0?amount:0}];
\tif(this->${valueName}==nullptr){
\t\tstd::cerr << "could not allocate the memory";
\t\texit(1);
\t}
\n`;
      constructor += ` int size${amount >0?amount:0},`;
      amount ++;
    }
    else if (val.valueType.endsWith("&") || val.valueName.startsWith("&")){
      constructor += ` ${val.valueType} ${val.valueName},`;
      content += `\tthis->${val.valueName} = ${val.valueName};\n`;
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
}\n\n`;

  return constructor;
}

/**
 * @param data the array of variables to use
 * function to generate copy constructor for the class
 * output: the string of the copy constructor  function
*/
function generateCopyConstructor(data: Array<ClassValues>): string {
  let constructor = `${data[0].className}::${data[0].className}(const ${data[0].className} copyFrom){`;
  let content = "";
  let currClass = data[0].className;

  data.forEach((val) => {
    //console.log(`${currClass} ${val.className} ${currClass !== val.className}`);
    if (currClass !== val.className){
      if (constructor.substr(constructor.length-1,1) === ","){
        constructor = constructor.slice(0,constructor.length-1);
      }
      constructor += `
\t${content}
}\n\n`;
      content = "";
      currClass = val.className;
      constructor += `${val.className}::${val.className}(const ${val.className} copyFrom){`;
    }
    if(val.valueType.endsWith("*") || val.valueName.startsWith("*")){
      content += `
\tint length = sizeof(copyFrom.${val.valueName}) / sizeof(${val.valueType.replace("*","")}[0]);
\tthis->${val.valueName} = new int[length];
\tfor(unsigned int i {};i<length;i++){
\t\tthis->${val.valueName}[i] = copyFrom.${val.valueName}[i];
\t}\n`;
      
    }
    else if(val.valueName.endsWith("[]")){
      let valueName = val.valueName.replace("[]","");
      content += `
\tint length = sizeof(copyFrom.${valueName}) / sizeof(${val.valueType.replace("[]","")});
\tthis->${valueName} = new int[length];
\tfor(unsigned int i {};i<length;i++){
\t\tthis->${valueName}[i] = copyFrom.${valueName}[i];
\t}\n`;
    }
    else if (val.valueType.endsWith("&") || val.valueName.startsWith("&")){
      content += `\tthis->${val.valueName} = copyFrom.${val.valueName};\n`;
    }
    else if(["int","float","long","double"].includes(val.valueType) || val.valueType.startsWith("unsigned")){
      content += `\tthis->${val.valueName} = copyFrom.${val.valueName};\n`;
    }
    else if(val.valueType === "string"){
      content += `\tthis->${val.valueName} = copyFrom.${val.valueName};\n`;
    }
    else if(val.valueType === "char"){
      content += `\tthis->${val.valueName} = copyFrom.${val.valueName};\n`;
    }
  });
  /////try to find the content and add the function to pack it
  if (constructor.substr(constructor.length-1,1) === ","){
    constructor = constructor.slice(0,constructor.length-1);
  } 
  constructor += `
\t${content}
}\n\n`;

  return constructor;
}


/**
 * @param data the array of variables to use
 * function to generate copy constructor for the class
 * output: the string of the copy constructor  function
*/
function generateDestructor(data: Array<ClassValues>): string {
  let constructor = `${data[0].className}::~${data[0].className}(){`;
  let content = "";
  let amount = 0;
  let currClass = data[0].className;
  let currClassIndex = 0;

  data.forEach((val) => {
    //console.log(`${currClass} ${val.className} ${currClass !== val.className}`);
    if (currClass !== val.className){
      if (constructor.substr(constructor.length-1,1) === ","){
        constructor = constructor.slice(0,constructor.length-1);
      }
      constructor += `
\t${content}
}\n\n`;
      content = "";
      currClass = val.className;
      constructor += `${val.className}::~${val.className}(){`;
    }
    if(val.valueType.endsWith("*") || val.valueName.startsWith("*")){
      content += `
\tif(this->${val.valueName} != nullptr){
\t\tdelete [] this->${val.valueName};
\t\tthis->${val.valueName} = nullptr;
\t}\n`;
    }
    else if(val.valueName.endsWith("[]")){
      let valueName = val.valueName.replace("[]","");
      content += `
\tif(this->${valueName} != nullptr){
\t\tdelete [] this->${valueName};
\t\tthis->${valueName} = nullptr;
\t}\n`;
    }
  });
  /////try to find the content and add the function to pack it
  if (constructor.substr(constructor.length-1,1) === ","){
    constructor = constructor.slice(0,constructor.length-1);
  } 
  constructor += `
\t${content}
}
\n`;

  return constructor;
}


/**
 * @param data the array of variables to use
 * function to generate copy constructor for the class
 * output: the string of the copy constructor  function
*/
function generateMoveConstructor(data: Array<ClassValues>): string {
  let constructor = `${data[0].className}::${data[0].className}(${data[0].className}&& moveFrom){`;
  let content = "";
  let currClass = data[0].className;

  data.forEach((val) => {
    //console.log(`${currClass} ${val.className} ${currClass !== val.className}`);
    if (currClass !== val.className){
      if (constructor.substr(constructor.length-1,1) === ","){
        constructor = constructor.slice(0,constructor.length-1);
      }
      constructor += `
\t${content}
}\n\n`;
      content = "";
      currClass = val.className;
      constructor += `${val.className}::${val.className}(${val.className}&& moveFrom){`;
    }
    if(val.valueType.endsWith("*") || val.valueName.startsWith("*")){
      content += `
\tif(this->${val.valueName} != nullptr){
\t\tthis->${val.valueName} = moveFrom.${val.valueName};
\t\tmoveFrom.${val.valueName} = nullptr;
\t}\n`;
      
    }
    else if(val.valueName.endsWith("[]")){
      let valueName = val.valueName.replace("[]","");
      content += `
\tif(this->${valueName} != nullptr){
\t\tthis->${valueName} = moveFrom.${valueName};
\t\tmoveFrom.${valueName} = nullptr;
\t}\n`;
    }
    else if (val.valueType.endsWith("&") || val.valueName.startsWith("&")){
      content += `\tthis->${val.valueName} = moveFrom.${val.valueName};\n`;
    }
    else if(["int","float","long","double"].includes(val.valueType) || val.valueType.startsWith("unsigned")){
      content += `\tthis->${val.valueName} = moveFrom.${val.valueName};\n`;
    }
    else if(val.valueType === "string"){
      content += `\tthis->${val.valueName} = moveFrom.${val.valueName};\n`;
    }
    else if(val.valueType === "char"){
      content += `\tthis->${val.valueName} = moveFrom.${val.valueName};\n`;
    }
  });
  /////try to find the content and add the function to pack it
  if (constructor.substr(constructor.length-1,1) === ","){
    constructor = constructor.slice(0,constructor.length-1);
  } 
  constructor += `
\t${content}
}\n\n`;

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
  return !data.valueType.includes("const") ?`
void ${data.className}::set_${data.valueName}(${data.valueType
    .split(" ")
    .join("  ")} ${data.valueName}){
  this->${data.valueName} = ${data.valueName};
}\n` : "";
}

/**
 * the main function of the text generation 
 * input: the variables array to generate data to
 * output: the text of functions of the vars
 */
export default function generateText(data: Array<ClassValues>): string {
  let dataToWrite = "";
  dataToWrite += generateConstructor(data);
  dataToWrite += generateCopyConstructor(data);
  dataToWrite += generateMoveConstructor(data);
  dataToWrite += generateDestructor(data);
  //console.log(dataToWrite);
  data.forEach((val) => {
    dataToWrite += generateGet(val);
    dataToWrite += generateSet(val);
  });
  return dataToWrite;
}
