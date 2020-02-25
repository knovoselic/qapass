import { injectable } from "inversify";
import Transformer from "../contracts/abstractions/Transformer";
import ApiKey from "../entity/ApiKey";

@injectable()
export default class ApiKeyListTransformer extends Transformer
{
    public transform(item: ApiKey)
    {
        return {
            id: item.id,
            key: item.key,
            last_usage_at: item.last_usage_at ?
                item.last_usage_at.toLocaleString() :
                null,
        };
    }
}