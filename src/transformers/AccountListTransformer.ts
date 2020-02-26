import { injectable } from "inversify";
import Transformer from "../contracts/abstractions/Transformer";
import Account from "../entity/Account";

@injectable()
export default class AccountListTransformer extends Transformer
{
    public transform(item: Account)
    {
        return {
            username: item.username,
            password: item.password,
            host: item.host,
            description: item.description,
        };
    }
}