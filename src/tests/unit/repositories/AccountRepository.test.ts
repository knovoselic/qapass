import { getCustomRepository, Connection } from "typeorm";
import AccountRepository from "../../../repositories/AccountRepository";
import { Container } from "inversify";
import User from "../../../entity/User";

describe('AccountRepository.ownedByUserOrPublic', () => {
    it('returns array of accounts that belong to users or are public', async () => {
        const accountRepo = getCustomRepository(AccountRepository);

        const container: Container = global.container;

        const typeorm = container.get<Connection>('typeorm');

        const userRepo = typeorm.getRepository(User);

        const usr1 = await userRepo.save({
            email: 'test1@test.com',
            password: '123123'
        });

        const usr2 = await userRepo.save({
            email: 'test2@test.com',
            password: '123123'
        });

        const account1 = await accountRepo.save({
            user_id: usr1.id,
        });

        const account2 = await accountRepo.save({
            user_id: usr2.id,
            public: true
        });

        await accountRepo.save({
            user_id: usr2.id,
            public: false
        });

        const r = await accountRepo.ownedByUserOrPublic(usr1.id);

        expect(r.length).toBe(2);
        expect(r[0].id).toBe(account1.id.toString());
        expect(r[1].id).toBe(account2.id.toString());
    });
});