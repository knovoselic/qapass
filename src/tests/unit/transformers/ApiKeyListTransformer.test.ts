import { Container } from "inversify";
import { Connection } from "typeorm";
import User from "../../../entity/User";
import ApiKey from "../../../entity/ApiKey";
import ApiKeyListTransformer from "../../../transformers/ApiKeyListTransformer";

describe('ApiKeyListTransformer.transform', () => {
    it("returns transformed ApiKey object", async () => {
        const container: Container = global.container;

        const typeorm = container.get<Connection>('typeorm');

        const userRepo = typeorm.getRepository(User);
        const apiKeyRepo = typeorm.getRepository(ApiKey);

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
    });
});