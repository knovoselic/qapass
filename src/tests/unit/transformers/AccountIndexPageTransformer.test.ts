import { Container } from "inversify";
import { Connection } from "typeorm";
import User from "../../../entity/User";
import Account from "../../../entity/Account";
import AccountIndexPageTransformer from "../../../transformers/AccountIndexPageTransformer";

describe('ApiKeyListTransformer.transform', () => {
    it("returns transformed Account object", async () => {
        const container: Container = global.container;

        const typeorm = container.get<Connection>('typeorm');

        const userRepo = typeorm.getRepository(User);
        const accountRepo = typeorm.getRepository(Account);

        const transformer = new AccountIndexPageTransformer;

        const usr = await userRepo.save({
            email: 'test1@test.com',
            password: '123123'
        });

        const a = await accountRepo.save({
            user_id: usr.id,
            public: false
        });

        let account = await accountRepo.findOne(a.id, {relations: ['user']});

        if(!account) throw new Error;

        expect(transformer.transform(account)).toMatchObject({
            id: account.id,
            owner: 'test1@test.com',
            public: 'No',
            username: account.username,
            password: account.password,
            host: account.host,
            description: account.description,
        });

        await accountRepo.update(account, {
            public: true
        });

        account = await accountRepo.findOne(a.id, {relations: ['user']});

        if(!account) throw new Error;

        expect(transformer.transform(account)).toMatchObject({
            id: account.id,
            owner: 'test1@test.com',
            public: 'Yes',
            username: account.username,
            password: account.password,
            host: account.host,
            description: account.description,
        });
    });
});