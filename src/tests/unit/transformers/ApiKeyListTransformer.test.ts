import { typeorm } from "../../../helpers";
import User from "../../../entity/User";
import ApiKey from "../../../entity/ApiKey";
import ApiKeyListTransformer from "../../../transformers/ApiKeyListTransformer";
import { runInTransaction } from "typeorm-test-transactions";

describe('ApiKeyListTransformer.transform', () => {
    it("returns transformed ApiKey object", runInTransaction(async () => {
        const conn = typeorm();

        const userRepo = conn.getRepository(User);
        const apiKeyRepo = conn.getRepository(ApiKey);

        const usr = await userRepo.save({
            email: 'test1@test.com',
            password: '123123'
        });

        const apiKey1 = await apiKeyRepo.save({
            user_id: usr.id,
            key: 'key1',
            secret: 'secret1'
        });

        const transformer = new ApiKeyListTransformer;

        expect(transformer.transform(apiKey1)).toMatchObject({
            id: apiKey1.id,
            key: apiKey1.key,
            last_usage_at: null
        });

        const date = new Date;

        const apiKey2 = await apiKeyRepo.save({
            user_id: usr.id,
            key: 'key2',
            secret: 'secret2',
            last_usage_at: date
        });

        expect(transformer.transform(apiKey2)).toMatchObject({
            id: apiKey2.id,
            key: apiKey2.key,
            last_usage_at: date.toLocaleString()
        });
    }));
});