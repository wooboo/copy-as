import preserveCase from "preserve-case";

export default function rename(value: string, rename: {from:string, to:string}[]) {
    let result = value;
    for (let index = 0; index < rename.length; index++) {
        const ren = rename[index];
        result = preserveCase.all(result, ren.from, ren.to);
    }
    return result;
}