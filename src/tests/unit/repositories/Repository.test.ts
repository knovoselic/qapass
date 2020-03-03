import { getCustomRepository } from "typeorm";
import AccountRepository from "../../../repositories/AccountRepository";
import { Request } from 'express';
import Filter from '../../../contracts/abstractions/Filter';

describe('Repository.getSelectQueryBuilder', () => {
    describe('when Repository.sqb was not modified', () => {
        it('returns undefined', () => {
            const accountRepo = getCustomRepository(AccountRepository);

            expect(accountRepo.getSelectQueryBuilder()).toBe(undefined);
        });
    });
});

describe('Repository.filter', () => {
    describe('when called', () => {
        it('modifies Repository.sqb and returns instance of Repository', () => {
            const accountRepo = getCustomRepository(AccountRepository);

            const sqb = accountRepo.createQueryBuilder();

            const apply = jest.fn();

            const filter = {
                apply: apply as Function
            } as Filter;

            const req = {} as Request

            const r = accountRepo.filter(req, filter);

            expect(apply).toHaveBeenCalledTimes(1);
            expect(apply).toHaveBeenLastCalledWith(req, sqb);
            expect(sqb === accountRepo.getSelectQueryBuilder()).toBe(false);
            expect(typeof r === 'object').toBe(true);
        });
    });
});