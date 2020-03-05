import BaseRequest from "../contracts/abstractions/Request";
import RequestContract from "../contracts/interfaces/Request";
import { Request } from "express";

class UpsertAccountRequest extends BaseRequest
{
    protected rules(req: Request): RequestContract
    {

        return {
            rules: {
                'username': 'required|max:255',
                'account_password': 'required|max:255',
                'host': 'required|max:255',
                'description': 'required|max:255',
                'public': 'required|in:0,1',
            }
        }
    }
}

export default new UpsertAccountRequest;