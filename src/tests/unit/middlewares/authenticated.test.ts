import authenticated from '../../../middlewares/authenticated';
import { Request, Response, NextFunction } from 'express';

describe('authenticated', () => {
    describe('when req.user is set', () => {
        it('calls next function', () => {
            const next = jest.fn() as NextFunction;

            const req = {
                user: 1 as Express.User
            } as Request;

            authenticated(req, {} as Response, next);

            expect(next).toHaveBeenCalledTimes(1);
        });
    });
    describe('when req.user is not set', () => {
        it('redirects to login page', () => {
            const redirect = jest.fn();

            const res = {
                redirect: redirect as Function
            } as Response;

            authenticated({} as Request, res, jest.fn() as NextFunction);

            expect(redirect).toHaveBeenCalledTimes(1);
            expect(redirect).toHaveBeenCalledWith('/login');
        });
    });
});