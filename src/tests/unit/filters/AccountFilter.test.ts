import { Request } from 'express';
import { SelectQueryBuilder } from 'typeorm';
import AccountFilter from '../../../filters/AccountFilter';

describe('AcountFilter.host', () => {
    describe("when req.host is set and value is undefined/false/''", () => {
        it("returns undefined", () => {
            const where = jest.fn();

            const sqb = {
                where: where as Function
            } as SelectQueryBuilder<any>;

            const filter = new AccountFilter;

            const hostSpy = jest.spyOn(filter, 'host');

            let req = {
                query: {
                    host: undefined
                }
            } as unknown as Request

            filter.apply(req, sqb);

            expect(hostSpy).toHaveBeenCalledTimes(1);
            expect(hostSpy).toHaveReturnedWith(undefined);

            req.query.host = 'false';

            filter.apply(req, sqb);

            expect(hostSpy).toHaveBeenCalledTimes(2);
            expect(hostSpy).toHaveReturnedWith(undefined);

            req.query.host = '';

            filter.apply(req, sqb);

            expect(hostSpy).toHaveBeenCalledTimes(3);
            expect(hostSpy).toHaveReturnedWith(undefined);
        });
    });
    describe("when req.host is set and value is non empty string", () => {
        it("calls where method on SelectQueryBuilder", () => {
            const where = jest.fn();

            const sqb = {
                where: where as Function
            } as SelectQueryBuilder<any>;

            const filter = new AccountFilter;

            const host = 'host';

            let req = {
                query: {
                    host: host
                }
            } as unknown as Request

            filter.apply(req, sqb);

            expect(where).toHaveBeenCalledTimes(1);
            expect(where).toHaveBeenCalledWith(
                'host = :host',
                {host: host}
            );
        });
    });
});