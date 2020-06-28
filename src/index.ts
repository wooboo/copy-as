import minimist from 'minimist';

export function cli(argv:string[]){
    const args = minimist(argv, {
        string: ["replace", "literal"],
        alias: {"replace":"r", "literal":"l"}
    });
    console.log(argv, args);
}
