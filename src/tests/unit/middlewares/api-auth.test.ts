import apiAuth from '../../../middlewares/api-auth';
import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import User from '../../../entity/User';
import ApiKey from '../../../entity/ApiKey';
import { runInTransaction } from 'typeorm-test-transactions';
import { typeorm } from '../../../helpers';

describe('api-auth', () => {
    describe('when authorization header is not set, of invalid format or invalid', () => {
        it('returns unauthorized json response', runInTransaction(async () => {
            let req = {
                xhr: true,
                headers: {
                    authorization: undefined
                } as IncomingHttpHeaders
            } as Request;

            const json = jest.fn();

            const status = jest.fn((code: number) => {
                return {
                    json: json as Function,
                } as Response;
            });

            const res = {
                status: status as Function,
            } as Response;

            const next = jest.fn() as NextFunction;

            await apiAuth(req, res, next);

            expect(status).toHaveBeenCalledTimes(1);
            expect(status).toHaveBeenLastCalledWith(401);

            req.headers['authorization'] = 'Bearer asd';

            await apiAuth(req, res, next);

            expect(status).toHaveBeenCalledTimes(2);
            expect(status).toHaveBeenLastCalledWith(401);

            req.headers['authorization'] = 'Bearer asd:asd';

            await apiAuth(req, res, next);

            expect(status).toHaveBeenCalledTimes(3);
            expect(status).toHaveBeenLastCalledWith(401);
        }));
    });
    describe('when authorization header is set, of valid format and valid', () => {
        it('calls next function', runInTransaction(async () => {
            const conn = typeorm();

            const u = await conn.getRepository(User).save({
                email: 'test@test.com',
                password: '123123'
            });

            const apiKey = await conn.getRepository(ApiKey).save({
                user_id: u.id,
                key: 'key',
                secret: 'secret'
            });

            let req = {
                xhr: true,
                headers: {
                    authorization: `Bearer ${apiKey.key}:${apiKey.secret}`
                } as IncomingHttpHeaders
            } as Request;

            const res = {} as Response;

            const next = jest.fn() as NextFunction;

            await apiAuth(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        }));
    });
});