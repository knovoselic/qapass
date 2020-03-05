import guest from '../../../middlewares/guest';
import { Request, Response, NextFunction } from 'express';

describe('guest', () => {
    describe('when req.user is not set', () => {
        it('calls next function', () => {
            const next = jest.fn() as NextFunction;

            guest({} as Request, {} as Response, next);

            expect(next).toHaveBeenCalledTimes(1);
        });
    });
    describe('when req.user is set', () => {
        it('redirects root page', () => {
            const redirect = jest.fn();

            const res = {
                redirect: redirect as Function
            } as Response;

            const req = {
                user: 1 as Express.User
            } as Request;

            guest(req, res, jest.fn() as NextFunction);

            expect(redirect).toHaveBeenCalledTimes(1);
            expect(redirect).toHaveBeenCalledWith('/');
        });
    });
});