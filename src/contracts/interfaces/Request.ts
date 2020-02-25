import Dictionary from "./Dictionary";

export default interface Request {
    rules: Dictionary,
    messages?: Dictionary
}