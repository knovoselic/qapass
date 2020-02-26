import BaseRequest from "../contracts/abstractions/Request";
import RequestContract from "../contracts/interfaces/Request";
import { Request } from "express";

class LoginRequest extends BaseRequest
{
    protected rules(req: Request): RequestContract
    {
        return {
            rules: {
                'email': 'required|email|max:255',
                'password': 'required|string|max:255',
            }
        }
    }
}

export default (new LoginRequest).validate;