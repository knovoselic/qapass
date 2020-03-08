import { getCustomRepository } from "typeorm";
import AccountRepository from "../../../repositories/AccountRepository";
import User from "../../../entity/User";
import { typeorm } from "../../../helpers";
import { runInTransaction } from "typeorm-test-transactions";

describe('AccountRepository.ownedByUserOrPublic', () => {
    it('returns array of accounts that belong to users or are public', runInTransaction(async () => {
        const accountRepo = getCustomRepository(AccountRepository);

        const conn = typeorm();

        const userRepo = conn.getRepository(User);

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
    }));
});