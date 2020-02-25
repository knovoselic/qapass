import BaseRequest from "../contracts/abstractions/Request";
import RequestContract from "../contracts/interfaces/Request";
import { Request } from "express";

class LoginRequest extends BaseRequest
{
    protected rules(req: Request): RequestContract
    {
        return {
            rules: {
                'email': 'required|email',
                'password': 'required|string',
            }
        }
    }
}

export default (new LoginRequest).validate;