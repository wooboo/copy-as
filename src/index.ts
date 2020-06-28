import minimist from 'minimist';

export function cli(argv:string[]){
    const args = minimist(argv);
    console.log(argv, args);
}
