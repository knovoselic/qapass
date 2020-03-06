import { injectable } from "inversify";
import Transformer from "../contracts/abstractions/Transformer";
import Account from "../entity/Account";

@injectable()
export default class AccountIndexPageTransformer extends Transformer
{
    public transform(item: Account)
    {
        return {
            id: item.id,
            owner: item.user.email,
            public: item.public ? 'Yes' : 'No',
            username: item.username,
            password: item.password,
            host: item.host,
            description: item.description,
        };
    }
}