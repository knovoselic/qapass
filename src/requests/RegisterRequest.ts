import BaseRequest from "../contracts/abstractions/Request";
import RequestContract from "../contracts/interfaces/Request";
import { Request } from "express";

class RegisterRequest extends BaseRequest
{
    protected rules(req: Request): RequestContract
    {
        const unique_email = {
            table: 'users',
            column: 'email'
        };

        return {
            rules: {
                'email': 'required|email|unique:'+JSON.stringify(unique_email),
                'password': 'required|string',
            }
        }
    }
}

export default (new RegisterRequest).validate;