import { Request } from 'express';
import { SelectQueryBuilder } from 'typeorm';
import AccountFilter from '../../../filters/AccountFilter';

describe('Filter.apply', () => {
    describe("when req.query is non empty array", () => {
        it("calls all filter methods matching query parameters", () => {
            const filter = new AccountFilter;

            const hostSpy = jest.spyOn(filter, 'host');

            const sqb = {} as SelectQueryBuilder<any>

            hostSpy.mockReturnValue(sqb);

            const host_query_value = 'host';

            let req = {
                query: {
                    host: host_query_value
                }
            } as unknown as Request

            expect(filter.apply(req, sqb)).toMatchObject(sqb);
            expect(hostSpy).toHaveBeenCalledTimes(1);
            expect(hostSpy).toHaveBeenCalledWith(host_query_value);
        });
    });
});