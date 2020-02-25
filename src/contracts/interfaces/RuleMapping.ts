export default interface RuleMapping {
    [key: string]: (...args : any[]) => boolean | string | Promise<boolean | string>;
}