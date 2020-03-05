export default class Exception extends Error
{
    protected status: number;
    protected errors: any;

    constructor(message: string, status: number = 500, errors: any = null) {
        super();

        this.stack = (new Error).stack;

        this.name = this.constructor.name;

        this.message = message;

        this.errors = errors;

        this.status = status;
    }
}