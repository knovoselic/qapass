import { Container } from "inversify";
import { Connection } from "typeorm";
import User from "../../../entity/User";
import Account from "../../../entity/Account";
import AccountListTransformer from "../../../transformers/AccountListTransformer";

describe('ApiKeyListTransformer.transform', () => {
    it("returns transformed Account object", async () => {
        const container: Container = global.container;

        const typeorm = container.get<Connection>('typeorm');

        const userRepo = typeorm.getRepository(User);
        const accountRepo = typeorm.getRepository(Account);

        const usr = await userRepo.save({
            email: 'test1@test.com',
            password: '123123'
        });

        const account = await accountRepo.save({
            user_id: usr.id,
        });

        const transformer = new AccountListTransformer;

        expect(transformer.transform(account)).toMatchObject({
            username: account.username,
            password: account.password,
            host: account.host,
            description: account.description,
        });
    });
});