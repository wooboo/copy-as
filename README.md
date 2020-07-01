# cpas 
> Use your code as a template

[![GitHub issues](https://img.shields.io/github/issues/wooboo/copy-as)](https://github.com/wooboo/copy-as/issues) [![GitHub stars](https://img.shields.io/github/stars/wooboo/copy-as)](https://github.com/wooboo/copy-as/stargazers) [![NPM](https://img.shields.io/npm/v/@wooboo/cpas.svg)](https://www.npmjs.com/package/@wooboo/cpas)
---

## Intro
If you've created your perfect component structure and you want it to be your template for the rest the `cpas` is for you.
Copies files and directory structure making replacements in file and directory names and in content.

Replacement is case preserving. It tries to preserve existing casing including UPPER and lower cased strings and also PascalCase, camelCase, snake_case and kebab-case 

## Usage
Install globally
```bash
npm install -g @wooboo/cpas
```
Run - full usage
```bash
cpas ./components/my-component ./components --replace "my component/perfect button" --ignore lib --ignore bin --ignore *.log
```

or in your dev dependencies
```bash
npm install @wooboo/cpas --save-dev
```
setup npm script
```json
"scripts": {
  "gen:component": "cpas ./components/my-component --replace 'my component' --ignore lib --ignore bin --ignore *.log",
}
```
```bash
npm run gen:component
```
## Ignoring
Create `.cpasignore` file in your root directory with common files to ignore while processing. 

## CLI reference
```bash
$ cpas [source] [destination] <options>

  [source], -s, --source             source file or directory to copy
  [destination], -d, --destination   destination directory to copy
  -r, --replace                      replace pattern (multiple)
                                     <from>/<to> - replaces 'from' to 'to'
                                     <from> - asks for 'to'
                                     if ommited asks for replacement pattern
  -i, --ignore                       file and directory ignores (multiple)
```