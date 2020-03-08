import { typeorm } from "../../../helpers";
import User from "../../../entity/User";
import Account from "../../../entity/Account";
import AccountListTransformer from "../../../transformers/AccountListTransformer";
import { runInTransaction } from "typeorm-test-transactions";

describe('ApiKeyListTransformer.transform', () => {
    it("returns transformed Account object", runInTransaction(async () => {
        const conn = typeorm();

        const userRepo = conn.getRepository(User);
        const accountRepo = conn.getRepository(Account);

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
    }));
});