# cpp-generate-getters-and-setters README

## Features
generate getters and setters function for private class vars

## Requirements
the class definition must be written in .h or .hpp file 

## Known Issues

the extension does not generating the setters and getters might 
be because of the following reasons 

1-the class does not have private section
2-might use un supported types (still cant parse const and std types)
3-errors due to spaces (the line should look like "types name;")


## Release Notes
    generate a new file with the getters and setters of the private vars
    
### 1.0.0

Initial release of the extension
generate a new file with the getters and setters of the private vars

### 1.1.0
    now can generate default constructor for the class
    add document for the code 

### 1.2.0
    add copy constructor, move constructor and destructor and improved parsing
    add auto documentation for functions



